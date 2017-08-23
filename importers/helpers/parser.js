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

/*
Takes a string.
Returns the string without leading and trailing whitespace, and condenses all
other whitespace to have length 1.
Shouldn't throw errors.
*/
const clean = function(string) {
  return string.trim().replace(/\s+/g, ' ');
};

/*
Takes a Cheerio object $br corresponding to a <br/> tag.
Returns the text starting from the next DOM node until just before the next
<br/> tag. If the next DOM node is not a text node then returns ''.
Shouldn't throw errors.
*/
const getTextAfterBr = function($br) {
  let text = '';
  let node = $br[0].nextSibling;

  // doesn't run if $br has no next sibling
  // otherwise node is defined
  while (node) {
    let nextNode = null;

    // handles only element and text nodes
    if (node.nodeType === 1) {
      // element node
      if (node.tagName === 'br') break; // hit next <br> tag
      if (node.firstChild) nextNode = node.firstChild;
    } else if (node.nodeType === 3) {
      // text node
      text += node.nodeValue;
    }

    // find next node (may need to traverse up the DOM tree)
    let currentNode = node;
    while (!nextNode) {
      nextNode = currentNode.nextSibling;
      currentNode = currentNode.parentNode;
    }
    node = nextNode;
  }

  return clean(text);
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
const parseDays = function(string) {
  const DAYS = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
  const days = clean(string).split(' ');
  const array = [];
  for (let i in days) {
    const day = days[i];
    const index = DAYS.indexOf(day);
    if (index < 0) throw new Error();
    array.push(index);
  }

  return array.sort();
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

    const courseId = href.substr(-16, 6);
    const term = href.substr(-4, 4);
    const id = term + courseId;

    courses[id] = 0; // save unique ids
  });

  const ids = [];
  for (let id in courses) {
    ids.push(id);
  }

  return ids;
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
const parseCourseOfferingsPage = function($, id) {
  /*
  id fields
  */
  const course = {
    _id: id,
    semester: id.substring(0, 4),
    courseId: id.substring(4)
  };

  const $content = $('#timetable');

  /*
  sections field first (to detect if this is a real course)
  */
  const sections = [];
  const $table = $content.find('table');
  const $trs = $table.find('tr');
  $trs.each(function() {
    const $tr = $(this);
    if ($tr.attr('align') === 'center') return; // table header
    const $tds = $tr.find('td');

    // a section may have multiple rows corresponding to multiple meetings
    // see if the core section data has been extracted already
    const name = clean($tds.eq(1).text());
    let section = sections.find(sect => sect.name === name);

    // need to extract core section data
    if (section === undefined) {
      section = {};
      section.semester = course.semester;
      section.course = course._id;
      section.classNumber = clean($tds.eq(0).text());
      section.name = clean($tds.eq(1).text());
      section._id = section.course + section.name;

      const $seats = $tds.eq(5).find('strong');
      const taken = $seats.eq(0)[0].nextSibling;
      if (taken && taken.nodeType === 3)
        section.seatsTaken = parseInt(clean(taken.nodeValue), 10);
      const total = $seats.eq(1)[0].nextSibling;
      if (total && total.nodeType === 3)
        section.seatsTotal = parseInt(clean(total.nodeValue), 10);

      const status = clean($tds.eq(6).text());
      section.status = status === '' ? 'Open' : status;

      section.meetings = [];

      sections.push(section);
    }

    // meeting data
    const meeting = {};
    const times = $tds.eq(2).text().split('-');
    try {
      const startTime = parseTime(clean(times[0]));
      const endTime = parseTime(clean(times[1]));
      const days = parseDays($tds.eq(3).text());
      meeting.startTime = startTime;
      meeting.endTime = endTime;
      meeting.days = days;
    } catch (e) {
      // no time data
    }
    const $room = $tds.eq(4);
    const $building = $room.find('a');
    try {
      const building = clean($building.text());
      const buildingLink = $building.attr('href');
      const buildingNumber = buildingLink.substring(35);
      const room = clean($building[0].nextSibling.nodeValue);
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

  // calculate level of enrollment for course and class types
  const seatsTakenByType = {};
  const seatsTotalByType = {};
  const classTypes = {};
  for (let i in sections) {
    const section = sections[i];
    const type = section.name[0];
    if (section.seatsTaken !== undefined) {
      if (!seatsTakenByType[type]) seatsTakenByType[type] = 0;
      seatsTakenByType[type] += section.seatsTaken;
    }
    if (section.seatsTotal !== undefined) {
      if (!seatsTotalByType[type]) seatsTotalByType[type] = 0;
      seatsTotalByType[type] += section.seatsTotal;
    }
    classTypes[type] = 0;
  }

  // take the maximum seatsTaken
  let seatsTaken = -1;
  for (let i in seatsTakenByType)
    seatsTaken = Math.max(seatsTaken, seatsTakenByType[i]);
  if (seatsTaken > -1) course.seatsTaken = seatsTaken;

  // take the minimum seatsTotal
  let seatsTotal = Infinity;
  for (let i in seatsTotalByType)
    seatsTotal = Math.min(seatsTotal, seatsTotalByType[i]);
  if (seatsTotal < Infinity) course.seatsTotal = seatsTotal;

  // take unique class types
  course.classTypes = [];
  for (let type in classTypes) {
    course.classTypes.push(type);
  }

  /*
  listing fields
  */
  const $listings = $content.find('strong').first().next();
  const listings = $listings.text().split('\n');
  course.crossListings = [];
  for (let i in listings) {
    const listing = clean(listings[i]);
    if (listing === '') continue;

    const tokens = listing.split(' ');
    if (tokens[0] === '*') {
      course.department = tokens[1];
      course.catalogNumber = tokens[2];
    } else if (tokens[0] !== '/') {
      course.department = tokens[0];
      course.catalogNumber = tokens[1];
    } else {
      course.crossListings.push({
        department: tokens[1],
        catalogNumber: tokens[2]
      });
    }
  }

  // if no course code, is not a real course, so return undefined!
  if (!course.department || !course.catalogNumber) return undefined;

  /*
  distribution field
  */
  const distribution = $listings[0].nextSibling.nodeValue;
  if (distribution) {
    const cleanDist = clean(distribution);
    course.distribution = cleanDist.substring(1, cleanDist.length - 1);
  }

  /*
  pdf/audit fields
  */
  const attributes = clean($content.find('em').first().text());
  course.rawAttributes = attributes;
  if (attributes.includes('No Pass/D/Fail')) {
    course.pdf = 'NPDF';
  } else if (attributes.includes('npdf')) {
    course.pdf = 'NPDF';
  } else if (attributes.includes('P/D/F Only')) {
    course.pdf = 'PDFO';
  } else if (attributes.includes('P/D/F')) {
    course.pdf = 'PDF';
  } else {
    // no pdf data
  }
  if (attributes.includes('No Audit')) {
    course.audit = 'NAUDIT';
  } else if (attributes.includes('na')) {
    course.audit = 'NAUDIT';
  } else if (attributes.includes('Audit')) {
    course.audit = 'AUDIT';
  } else {
    // no audit data
  }

  /*
  title fields
  */
  const $title = $content.find('h2');
  course.title = clean($title.text());

  const banner = clean($title.next().next().text());
  if (banner) course.banner = banner;

  const $description = $content.find('#descr');
  course.description = clean($description.text());

  /*
  instructors field
  */
  const $instructors = $title.next().find('a');
  course.instructors = [];
  course._instructorNames = []; // for ease of instructor scraping
  $instructors.each(function() {
    const $instructor = $(this);
    course._instructorNames.push(clean($instructor.text()));

    const path = $instructor.attr('href');
    const uid = path.substring(path.length - 9, path.length);
    course.instructors.push(uid);
  });

  /*
  all other fields under headings
  */
  course.grading = [];
  course.readings = [];
  course.reservedSeats = [];
  const $possibleHeadings = $content.find('strong, b');
  $possibleHeadings.each(function() {
    const $possibleHeading = $(this);

    if ($possibleHeading.text().includes('Sample reading list:')) {
      let $author = $possibleHeading.next().next();
      let $title = $author.next();
      let $br = $title.next();

      while (true) {
        if ($author.prop('tagName') !== 'STRONG') return;
        if ($title.prop('tagName') !== 'EM') return;
        if ($br.prop('tagName') !== 'BR') return;

        course.readings.push({
          title: clean($title.text()),
          author: clean($author.text())
        });

        $author = $br.next();
        $title = $author.next();
        $br = $title.next();
      }
    }

    if ($possibleHeading.text().includes('Reading/Writing assignments:')) {
      course.assignments = getTextAfterBr($possibleHeading.next());
      return;
    }

    if ($possibleHeading.text().includes('Requirements/Grading:')) {
      let $br = $possibleHeading.next();

      while (true) {
        if ($br.prop('tagName') !== 'BR') return;

        const text = getTextAfterBr($br);
        if (!text) return;
        const grading = text.split('-');
        if (grading.length === 2) {
          course.grading.push({
            component: clean(grading[0]),
            percent: parseInt(clean(grading[1]), 10)
          });
        }

        $br = $br.next();
      }
    }

    if ($possibleHeading.text().includes('Other Requirements:')) {
      course.otherRequirements = getTextAfterBr($possibleHeading.next());
      return;
    }

    if ($possibleHeading.text().includes('Other information:')) {
      course.otherInformation = getTextAfterBr($possibleHeading.next());
      return;
    }

    if ($possibleHeading.text().includes('Prerequisites and Restrictions:')) {
      course.prerequisites = getTextAfterBr($possibleHeading.next());
      return;
    }

    if ($possibleHeading.text().includes('Equivalent Courses:')) {
      course.equivalentCourses = getTextAfterBr($possibleHeading.next());
      return;
    }

    if ($possibleHeading.text().includes('Website:')) {
      const website = $possibleHeading.next().attr('href');
      if (website) course.website = clean(website);
      return;
    }

    if ($possibleHeading.text().includes('Reserved Seats:')) {
      let $br = $possibleHeading.next();

      while (true) {
        if ($br.prop('tagName') !== 'BR') return;

        const text = getTextAfterBr($br);
        if (!text) return;

        course.reservedSeats.push(text);

        $br = $br.next();
      }
    }
  });

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
const parseCourseEvaluationsPage = function($) {
  const evaluations = {
    numeric: [],
    written: []
  };

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
const parseInstructorPage = function($, id) {
  const instructor = {
    _id: id
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
