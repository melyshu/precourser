// PARSING FOR NEW API

/*
Contains functions for parsing the course offerings / course evaluations
webpages given the corresponding Cheerio object.
Exported functions and the pages they parse:

  parseSemesterSearchPage($)
    https://registrar.princeton.edu/course-offerings/search_results.xml?submit=Search&term=????

  parseCourseOfferingsPage($, id)
    https://registrar.princeton.edu/course-offerings/course_details.xml?courseid=??????&term=????

  parseCourseEvaluationsPage($)
    https://reg-captiva.princeton.edu/chart/index.php?terminfo=????&courseinfo=??????

  parseInstructorPage($, id)
    https://registrar.princeton.edu/course-offerings/dirinfo.xml?uid=?????????
*/

/* matching grading with map */
const GRADING_MAP = {
  grading_design_projects: 'Design Project',
  grading_final_exam: 'Final Exam',
  grading_home_final_exam: 'Take Home Final Exam',
  grading_home_mid_exam: 'Take Home Mid term Exam',
  grading_lab_reports: 'Lab Reports',
  grading_mid_exam: 'Mid Term Exam',
  grading_oral_pres: 'Oral Presentation(s)',
  grading_other: 'Other (See Instructor)',
  grading_other_exam: 'Other Exam',
  grading_paper_final_exam: 'Paper in lieu of Final',
  grading_paper_mid_exam: 'Paper in Lieu of Mid Term',
  grading_papers: 'Papers',
  grading_precept_part: 'Class/Precept Participation',
  grading_prob_sets: 'Problem set(s)',
  grading_prog_assign: 'Programming Assignments',
  grading_quizzes: 'Quizzes',
  grading_term_papers: 'Term Paper(s)'
};

/*
Takes a string.
Returns the string without leading and trailing whitespace, and condenses all
other whitespace to have length 1.
Shouldn't throw errors.
*/
const clean = function(string) {
  if (!string) return string;
  return string.trim().replace(/\s+/g, ' ');
};

/*
Takes a string in the format "xx:xx xm" or "x:xx xm".
Returns the number of minutes since midnight corresponding to that time.
No exception handling: will throw errors if parsing fails!
*/
const parseTime = function(string) {
  let minutes = 0;
  const tokens = string.split(' ');
  const numbers = tokens[0].split(':');
  if (tokens[1] === 'pm') minutes += 60 * 12;
  minutes += parseInt(numbers[0], 10) % 12 * 60;
  minutes += parseInt(numbers[1], 10);
  return minutes;
};

/*
Takes a string consisting of any of ['M', 'T', 'W', 'Th', 'F'] with nonzero
whitespace in between.
Returns an ordered array of corresponding indices in [1, 2, 3, 4, 5].
No exception handling: will throw errors if parsing fails!
*/
const parseDays = function(sectionObj) {
  const days = [];

  if (clean(sectionObj.sun) === 'Y') days.push(0);
  if (clean(sectionObj.mon) === 'Y') days.push(1);
  if (clean(sectionObj.tue) === 'Y') days.push(2);
  if (clean(sectionObj.wed) === 'Y') days.push(3);
  if (clean(sectionObj.thu) === 'Y') days.push(4);
  if (clean(sectionObj.fri) === 'Y') days.push(5);
  if (clean(sectionObj.sat) === 'Y') days.push(6);

  return days;
};

/*
Takes:
  $: a Cheerio object for the semester search page
Returns an array of 10-digit course ids corresponding to the courses on the
webpage.
*/
const parseSemesterSearchPage = function($) {
  const courses = {};

  const $table = $('table');
  const $trs = $table.find('tr');
  $trs.each(function() {
    const $tr = $(this);
    if ($tr.attr('align') === 'center') return; // table header

    const $td = $tr.find('td').eq(1);
    const href = $td.find('a').attr('href');

    const systemId = href.substr(-16, 6);
    const term = href.substr(-4, 4);
    const courseId = term + systemId;

    courses[courseId] = 0; // save unique ids
  });

  const courseIds = [];
  for (let courseId in courses) {
    courseIds.push(courseId);
  }

  return courseIds;
};

/*
Takes:
  $: a Cheerio object for the registrar's webpage
  id: 10-digit id of the corresponding course
Returns an object with the format
{
  course: Course
  sections: [Section0, Section1, ... ]
}
which contains Course and Section objects constructed from the data extracted
from the webpage. Note that the Course object is incomplete (it lacks evaluation
data).
Returns undefined if the course is not a real course (i.e. it does not have at
least one section, or it does not have a department / catalogNumber).
*/

/* new one that simply parses the json */
const parseCourseOfferingsPage = function(courseObj, courseId) {
  /*
  id fields
  */
  const course = {
    _id: courseId,
    semester: courseId.substring(0, 4),
    systemId: courseId.substring(4)
  };

  /*
  sections field first (to detect if this is a real course)
  */
  const sections = [];

  if (!courseObj.course_sections || !courseObj.course_sections.course_section) {
    return undefined;
  }

  courseObj.course_sections.course_section.forEach(sectionObj => {
    // a section may have multiple rows corresponding to multiple meetings
    // see if the core section data has been extracted already
    const name = clean(sectionObj.section);
    let section = sections.find(sect => sect.name === name);

    // need to extract core section data
    if (section === undefined) {
      section = {};
      section.semester = course.semester;
      section.course = course._id;
      section.classNumber = clean(sectionObj.class_number);
      section.name = clean(sectionObj.section);
      section._id = section.course + section.name;

      section.seatsTaken = parseInt(clean(sectionObj.enrl_tot), 10);
      section.seatsTotal = parseInt(clean(sectionObj.enrl_cap), 10);

      const status = clean(sectionObj.calculated_status);
      section.status = status === '' ? 'Open' : status;

      section.meetings = [];

      sections.push(section);
    }

    // meeting data
    const meeting = {};
    try {
      const startTime = parseTime(clean(sectionObj.start_time));
      const endTime = parseTime(clean(sectionObj.end_time));
      const days = parseDays(sectionObj);
      meeting.startTime = startTime;
      meeting.endTime = endTime;
      meeting.days = days;
    } catch (e) {
      // no time data
    }

    try {
      const building = clean(sectionObj.building_name);
      const buildingNumber = clean(sectionObj.building_code);
      const room = clean(sectionObj.room);
      if (building === '' || buildingNumber === '' || room === '')
        throw new Error();
      meeting.building = building;
      meeting.buildingNumber = buildingNumber;
      meeting.room = room;
    } catch (e) {
      // no location data
    }

    section.meetings.push(meeting);
  });

  // if no sections, is not a real course, so return undefined!
  if (sections.length === 0) {
    return undefined;
  }

  // fill with Section ids
  course.sections = [];
  for (let i in sections) {
    const section = sections[i];
    course.sections.push(section._id);
  }

  // calculate level of enrollment, class types and status for course
  const seatsTakenByType = {};
  const seatsTotalByType = {};
  const statusByType = {};
  const classTypes = {};
  for (let i in sections) {
    const section = sections[i];

    const type = section.name[0];

    // filter away empty, canceled sections
    if (
      section.status === 'Canceled' &&
      !section.seatsTaken &&
      !section.seatsTotal
    ) {
      continue;
    }

    if (section.seatsTaken !== undefined) {
      if (!seatsTakenByType[type]) seatsTakenByType[type] = 0;
      seatsTakenByType[type] += section.seatsTaken;
    }
    if (section.seatsTotal !== undefined) {
      if (!seatsTotalByType[type]) seatsTotalByType[type] = 0;
      seatsTotalByType[type] += section.seatsTotal;
    }
    if (!statusByType[type])
      statusByType[type] = { Open: 0, Closed: 0, Canceled: 0 };
    statusByType[type][section.status]++;
    classTypes[type] = 0;
  }

  // take the maximum seatsTaken
  let seatsTaken = -1;
  for (let type in seatsTakenByType)
    seatsTaken = Math.max(seatsTaken, seatsTakenByType[type]);
  if (seatsTaken > -1) course.seatsTaken = seatsTaken;

  // take the minimum seatsTotal
  let seatsTotal = Infinity;
  for (let type in seatsTotalByType)
    seatsTotal = Math.min(seatsTotal, seatsTotalByType[type]);
  if (seatsTotal < Infinity) course.seatsTotal = seatsTotal;

  // calculate best case status
  course.status = 'Canceled';
  for (let type in statusByType) {
    const statuses = statusByType[type];

    course.status = 'Open';

    if (statuses.Open === 0) {
      course.status = 'Closed';
      break;
    }
  }

  // take unique class types
  course.classTypes = [];
  for (let type in classTypes) {
    course.classTypes.push(type);
  }

  /*
  listing fields
  */
  course.department = clean(courseObj.subject);
  course.catalogNumber = clean(courseObj.catnum);

  course.crossListings = clean(courseObj.crosslistings)
    .split(' / ')
    .splice(1)
    .map(listing => clean(listing).split(' '))
    .map(tokens => ({
      department: clean(tokens[0]),
      catalogNumber: clean(tokens[1])
    }));

  // if no course code, is not a real course, so return undefined!
  if (!course.department || !course.catalogNumber) return undefined;

  /*
  distribution field
  */
  if (clean(courseObj.distribution_area_short)) {
    course.distribution = clean(courseObj.distribution_area_short);
  }

  /*
  pdf/audit fields
  */
  course.rawAttributes = clean(courseObj.grading_basis);

  course.pdf = {
    FUL: 'PDF',
    GRD: 'NPDF',
    NPD: 'NPDF',
    PDF: 'PDFO'
  }[clean(courseObj.grading_basis)];
  if (!course.pdf) course.pdf = 'XPDF';

  course.audit = {
    FUL: 'AUDIT',
    GRD: 'NAUDIT',
    NAU: 'NAUDIT',
    AUD: 'AUDIT'
  }[clean(courseObj.grading_basis)];
  if (!course.audit) course.audit = 'XAUDIT';

  /*
  title fields
  */
  course.title = clean(courseObj.long_title);

  if (clean(courseObj.add_consent) === 'D')
    course.banner =
      'ENROLLMENT BY APPLICATION OR INTERVIEW. DEPARTMENTAL PERMISSION REQUIRED.';

  course.description = clean(courseObj.description);

  /*
  instructors field
  */

  if (
    courseObj.course_instructors &&
    courseObj.course_instructors.course_instructor
  ) {
    course.instructors = courseObj.course_instructors.course_instructor.map(
      instructor => clean(instructor.netid)
    );
    course._instructorNames = courseObj.course_instructors.course_instructor.map(
      instructor => clean(instructor.name)
    );
  }

  /*
  all other fields under headings
  */
  course.grading = [];

  for (const key in GRADING_MAP) {
    const component = GRADING_MAP[key];
    const percent = parseInt(clean(courseObj[key]), 10);

    if (percent) {
      course.grading.push({
        component: component,
        percent: percent
      });
    }
  }

  course.readings = [];
  for (let i = 1; i < 7; i++) {
    const author = clean(courseObj[`reading_list_author_${i}`]);
    const title = clean(courseObj[`reading_list_title_${i}`]);

    if (author && title) {
      course.readings.push({
        title: title,
        author: author
      });
    }
  }

  if (
    courseObj.seat_reservations &&
    courseObj.seat_reservations.seat_reservation
  ) {
    course.reservedSeats = courseObj.seat_reservations.seat_reservation.map(
      reservation =>
        `${clean(reservation.description)} ${clean(
          reservation.enrl_cap
        )} (${clean(reservation.class_section)})`
    );
  }

  if (clean(courseObj.reading_writing_assignment))
    course.assignments = clean(courseObj.reading_writing_assignment);

  if (clean(courseObj.other_requirements))
    course.otherRequirements = clean(courseObj.other_requirements);

  if (clean(courseObj.other_information))
    course.otherInformation = clean(courseObj.other_information);

  if (clean(courseObj.other_restrictions))
    course.prerequisites = clean(courseObj.other_restrictions);

  if (
    courseObj.course_equivalents &&
    courseObj.course_equivalents.course_equivalent
  ) {
    course.equivalentCourses = `${course.department} ${course.catalogNumber}`;

    courseObj.course_equivalents.course_equivalent.forEach(c => {
      course.equivalentCourses += `,${c.subject} ${c.catnum}`;
    });

    course.equivalentCourses +=
      ' are considered equivalent courses and cannot be taken multiple times for credit.';
  }

  if (clean(courseObj.web_address))
    course.website = clean(courseObj.web_address);

  return {
    course: course,
    sections: sections
  };
};

/*
Takes:
  $: a Cheerio object for the course evaluation page
Returns an evaluations object (to be used within the course.evaluations field)
with evaluation data extracted from the webpage.
*/
const parseCourseEvaluationsPage = function($, courseId) {
  const evaluations = {
    numeric: [],
    written: []
  };

  // check semester from instructor
  const semesterId = courseId.substr(0, 4);
  let isSemesterCorrect = true;
  $('a').each(function() {
    const $a = $(this);
    const href = $a.attr('href');

    if (href.substr(0, 10) !== 'instructor') return;

    const instructorSemesterId = href.substr(34, 4);
    isSemesterCorrect &= semesterId === instructorSemesterId;
  });
  if (!isSemesterCorrect) return evaluations;

  // numeric evaluations
  const b64 = $('#chart_settings').attr('value');
  if (b64) {
    const chart = JSON.parse(Buffer.from(b64, 'base64').toString());
    const fields = chart.PlotArea.XAxis.Items;
    const scores = chart.PlotArea.ListOfSeries[0].Items;
    for (let i in fields) {
      evaluations.numeric.push({
        field: fields[i].Text,
        score: parseFloat(scores[i].YValue)
      });
    }
  }

  // written evaluations
  const $rows = $('tr.two');
  if ($rows) {
    $rows.each(function() {
      evaluations.written.push(clean($(this).find('td').text()));
    });
  }

  return evaluations;
};

/*
Takes:
  $: a Cheerio object for the instructor's page
  id: 9-digit id of the corresponding instructor
Returns an Instructor object constructed from the information on the webpage.
Returns undefined if there is not sufficient information (i.e. no name or the
error 'No directory information available').
*/
const parseInstructorPage = function($, instructorId) {
  const instructor = {
    _id: instructorId
  };

  const fullName = clean($('h2').text());
  if (!fullName) return undefined;
  instructor.fullName = fullName;

  const position = clean($('h3').text());
  if (position === 'No directory information available') return undefined;
  if (position) instructor.position = position;

  const $possibleHeadings = $('strong');
  $possibleHeadings.each(function() {
    const $possibleHeading = $(this);

    if ($possibleHeading.text().includes('Phone:')) {
      const phoneNode = $possibleHeading[0].nextSibling.nodeValue;
      if (!phoneNode) return;
      const phone = clean(phoneNode);
      if (phone) instructor.phone = phone;
      return;
    }

    if ($possibleHeading.text().includes('Email:')) {
      const $email = $possibleHeading.next();
      const email = clean($email.text().toLowerCase());
      if (email) instructor.email = email;
      return;
    }

    if ($possibleHeading.text().includes('Office:')) {
      const officeNode = $possibleHeading[0].nextSibling.nodeValue;
      if (!officeNode) return;
      const office = clean(officeNode);
      if (office) instructor.office = office;
      return;
    }
  });

  return instructor;
};

module.exports.parseSemesterSearchPage = parseSemesterSearchPage;
module.exports.parseCourseOfferingsPage = parseCourseOfferingsPage;
module.exports.parseCourseEvaluationsPage = parseCourseEvaluationsPage;
module.exports.parseInstructorPage = parseInstructorPage;
