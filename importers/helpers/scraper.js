/*
Contains functions for scraping and storing / updating documents in the database.
Exported functions:

  ------

  scrapeSemester(semesterId)
    imports the semester detail from ./hardcode/SEMESTERS.js
    scrapes the list of courses for that semester into the database

  scrapeDepartments()
    imports the departments from ./hardcode/SEMESTERS.js

  scrapeCourseDetail(courseId)
    scrapes the course offering data into the database

  scrapeCourseDetail(courseId)
    REQUIRES THE COURSE DETAIL TO BE IN THE DATABASE ALREADY
    scrapes the course evaluation data into the database
    relies on the course detail for document validation

  scrapeInstructor(instructorId)
    REQUIRES ALL COURSE DETAILS TO BE IN THE DATABASE ALREADY
    scrapes the instructor page data into the database
    relies on course details for some instructor names

  scrapeCourseUpdate(courseId)
    REQUIRES ALL COURSE DETAILS AND EVALUATIONS TO BE IN THE DATABASE ALREADY
    assigns [new, recent, rating] based on what is in the database already
    copies over evaluations from most recent and relevant semester if this
      semester doesn't have any

  scrapeInstructorUpdate(instructorId)
    REQUIRES ALL COURSE UPDATES TO BE IN THE DATABASE already
    assigns history to each instructor based on what is in the database already

  ------

  scrapeAll(f, ids, interval, description)
    schedules f to be called on ids, each separated by interval milliseconds
    helps to run one of the above functions for a list

*/

require('../../config.js');
const Promise = require('bluebird');
const rp = require('request-promise');
const cheerio = require('cheerio');
const logger = require('winston');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const parser = require('./parser.js');

const Semester = require('../../models/Semester.js');
const Department = require('../../models/Department.js');
const Course = require('../../models/Course.js');
const Section = require('../../models/Section.js');
const Instructor = require('../../models/Instructor.js');

/*
Takes a 4-digit id of the relevant semester.

Scrapes the course ids in that semester from the corresponding webpage and then
stores the Semester objects in the database (possibly inserting a objects if it
doesn't already exist).

Returns a Promise (with the saved object). An error is thrown if the semester
has not been hardcoded into ./hardcode/SEMESTERS.js.
*/
const scrapeSemester = function(semesterId) {
  return rp({
    uri:
      'https://registrar.princeton.edu/course-offerings/search_results.xml?submit=Search&term=' +
      semesterId,
    transform: cheerio.load
  })
    .then(function($) {
      return parser.parseSemesterSearchPage($);
    })
    .then(function(courseIds) {
      const SEMESTERS = require('./hardcode/SEMESTERS.js');
      const semester = SEMESTERS.find(semester => semester._id === semesterId);

      if (!semester) {
        // didn't find it hardcoded ... go and hardcode!
        logger.log(
          'error',
          'Could not find semester %s in importers/helpers/hardcode/SEMESTERS.js',
          semesterId
        );
        throw new Error(
          'Could not find semester %s in importers/helpers/hardcode/SEMESTERS.js'
        );
      }

      semester.courses = courseIds;
      semester.lastModified = new Date();

      return Semester.findByIdAndUpdate(semester._id, semester, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
    });
};

/*
Stores (or updates) the departments in ./hardcode/DEPARTMENTS.js into the
database.

Returns a Promise (with the saved objects).
*/
const scrapeDepartments = function() {
  logger.log('warn', 'scrapeDepartments: starting');

  const DEPARTMENTS = require('./hardcode/DEPARTMENTS.js');

  const saves = [];
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    const department = DEPARTMENTS[i];

    department.lastModified = new Date();

    saves.push(
      Department.findByIdAndUpdate(department._id, department, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      })
    );
  }

  return Promise.all(saves).then(function() {
    logger.log('warn', 'scrapeDepartments: done!');
  });
};

/*
Takes a 10-digit id of the relevant course.

Scrapes the course offering data from the corresponding webpage and then stores
the Course and Section objects in their database collections (possibly inserting
new objects if they don't already exist).

Returns a Promise (with the saved objects). The Promise is resolved in the case
that the course is not real.
*/
const scrapeCourseDetail = function(courseId) {
  const semesterId = courseId.substring(0, 4);
  const systemId = courseId.substring(4);

  /*
  Fetch webpage and parse
  */
  logger.log('debug', 'scrapeCourseDetail: %s starting request', courseId);
  return rp({
    uri:
      'https://registrar.princeton.edu/course-offerings/course_details.xml?courseid=' +
      systemId +
      '&term=' +
      semesterId,
    transform: cheerio.load
  })
    .then(function($) {
      logger.log('debug', 'scrapeCourseDetail: %s starting parsing', courseId);
      return parser.parseCourseOfferingsPage($, courseId);
    })
    .then(function(object) {
      logger.log('debug', 'scrapeCourseDetail: %s final processing', courseId);
      // object is undefined if course is not real
      if (!object) {
        logger.log(
          'debug',
          'scrapeCourseDetail: course %s is not real',
          courseId
        );
        return Promise.resolve('unreal');
      }

      // save course and sections
      const saves = [];

      const course = object.course;
      course.lastModified = new Date();
      saves.push(
        Course.findByIdAndUpdate(course._id, course, {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        })
      );

      const sections = object.sections;
      for (let i in sections) {
        const section = sections[i];
        section.lastModified = new Date();
        saves.push(
          Section.findByIdAndUpdate(section._id, section, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          })
        );
      }

      return Promise.all(saves);
    });
};

/*
Takes a 10-digit id of the relevant course.

Scrapes the course evaluation data from the corresponding webpage and updates
the evaluation data in the corresponding Course object in the database.

Returns a Promise (resolved to the saved course). The Promise is resolved to
undefined in the case that no evaluations are received from the webpage.

NOTE: The course detail of the corresponding course must already be in the
database by running scrapeCourseDetail on the relevant id.

NOTE: For semesters where the evaluations are not yet out (usually the current
semester) the webpage will display the most recent evaluations available. This
is now detected by this script, so running this script on a course in such
a semester will import empty evaluation data.
*/
const scrapeCourseEvaluation = function(courseId) {
  const semesterId = courseId.substring(0, 4);
  const systemId = courseId.substring(4);

  /*
  Fetch webpage and parse
  */
  return rp({
    uri:
      'https://reg-captiva.princeton.edu/chart/index.php?terminfo=' +
      semesterId +
      '&courseinfo=' +
      systemId,
    headers: {
      Cookie: `PHPSESSID=${cookie};`,
      'User-Agent': 'precourser (http://precourser.io)'
    },
    transform: cheerio.load
  })
    .then(function($) {
      return parser.parseCourseEvaluationsPage($, courseId);
    })
    .then(function(evaluations) {
      // don't bother if no evaluations
      if (!evaluations) {
        logger.log(
          'debug',
          'scrapeCourseDetail: course %s does not have evaluations',
          courseId
        );
        return Promise.resolve();
      }

      // update evaluations field
      evaluations.semester = semesterId;
      const course = {
        lastModified: new Date(),
        evaluations: evaluations
      };

      return Course.findByIdAndUpdate(courseId, course, {
        new: true,
        upsert: false,
        runValidators: true
      });
    });
};

/*
Takes a 9-digit id of the relevant instructor.

Scrapes the instructor data from the corresponding webpage and then stores
the Instructor objects in the database (possibly inserting a new objects if it
doesn't already exist).

Returns a Promise (with the saved objects). The Promise is resolved in the case
that the instructor is not real (does not have enough information).
*/
const scrapeInstructor = function(instructorId) {
  const courseData = Course.find({
    instructors: instructorId
  })
    .sort({ _id: -1 })
    .limit(1)
    .lean()
    .then(function(courses) {
      if (!courses || !courses.length) {
        logger.log(
          'debug',
          'scrapeInstructor: instructor %s is not in any courses',
          instructorId
        );
        return;
      }

      const recentCourse = courses[0];
      const index = recentCourse.instructors.indexOf(instructorId);
      return recentCourse._instructorNames[index];
    });

  const webpageData = rp({
    uri:
      'https://registrar.princeton.edu/course-offerings/dirinfo.xml?uid=' +
      instructorId,
    transform: cheerio.load
  }).then(function($) {
    return parser.parseInstructorPage($, instructorId);
  });

  return Promise.join(courseData, webpageData, function(
    courseFullName,
    instructor
  ) {
    // deal with when there is not enough info from scraped page
    // if name is lowercase then it is probably the netid being displayed
    // on the webpage...
    if (
      !instructor ||
      (instructor.fullName === instructor.fullName.toLowerCase() &&
        !/\s/g.test(instructor.fullName))
    ) {
      // construct from course page info
      if (courseFullName && courseFullName !== courseFullName.toLowerCase()) {
        // if instructor exists but name is lowercase...
        if (instructor) {
          // move netid to email field
          instructor._id = instructorId;
          instructor.email = instructor.fullName + '@princeton.edu';
          instructor.fullName = courseFullName;
          logger.log(
            'debug',
            'scrapeInstructor: The instructor %s had their name switched to email',
            instructorId
          );
        } else {
          // instructor does not exist from scraped page... so only have their name
          instructor = {
            _id: instructorId,
            fullName: courseFullName
          };
        }
        logger.log(
          'debug',
          'scrapeInstructor: The instructor %s had their name saved from the course page.',
          instructorId
        );
      } else {
        // truly not enough information
        logger.log(
          'debug',
          'scrapeInstructor: The instructor %s did not have enough information to be saved.',
          instructorId
        );
        return Promise.resolve('unreal');
      }
    }

    // store
    instructor.lastModified = new Date();

    return Instructor.findByIdAndUpdate(instructor._id, instructor, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
  });
};

/*
Takes a 10-digit id of the relevant course.

Technically does no scraping. The name is for uniformity.

Finds all courses with the same courseId in the database and assigns to the
original course object the following fields:
  course.new
  course.recent
and tries to assign to the original course object as best as possible the
following fields:
  course.rating.score
  course.rating.semester
  course.rating.description
In addition, copies the most recent and relevant evaluation data if it does not
exist for this semester of the course. Tries to assign to the fields, if
necessary:
  course.evaluations.semester
  course.evaluations.numeric
  course.evaluations.written

Returns a Promise (resolved to the saved course).

NOTE: All courses must be in the database before running this.
*/
const scrapeCourseUpdate = function(courseId) {
  // Returns an object with score and description most relevant to the given course
  // Returns undefined if the course has no numeric evaluations, or if the
  // evaluations are from another semester
  const getCourseRating = function(course) {
    // order of importance: the first one found will be extracted
    const ORDER = [
      'Overall Quality of the Course',
      'Quality of Course',
      'Feedback for other students',
      'Recommend to Other Students',
      'Quality of Experience',
      'Lectures',
      'Quality of Lectures',
      'Seminars',
      'Quality of Seminars',
      'Classes',
      'Quality of Classes',
      'Papers, Reports, Problem Sets, Examinations',
      'Quality of Written Assignments'
    ];

    // return undefined if no numeric evaluations or evaluations from past semester
    const numeric = course.evaluations.numeric;
    if (!numeric || !numeric.length) return undefined;
    if (
      course.evaluations.semester &&
      course.evaluations.semester !== course.semester
    )
      return undefined;

    // find first match
    for (let i = 0; i < ORDER.length; i++) {
      const field = ORDER[i];
      for (let j = 0; j < numeric.length; j++) {
        const evaluation = numeric[j];
        if (evaluation.field === field) {
          return {
            score: evaluation.score,
            description: field,
            semester: course.semester
          };
        }
      }
    }

    // if no match then just return first one
    const evaluation = numeric[0];
    return {
      score: evaluation.score,
      description: evaluation.field,
      semester: course.semester
    };
  };

  // Returns whether there exists an intersection between arrays a and b
  const existsIntersection = function(a, b) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i] === b[j]) return true;
      }
    }
    return false;
  };

  // Begin the actual work... finding a suitable rating for this course!
  return Course.findById(courseId)
    .then(function(course) {
      const thisInstructors = course.instructors;
      const thisId = course._id;
      const evaluations = course.evaluations || {
        numeric: [],
        written: []
      };

      const courseUpdate = { evaluations: evaluations };

      // find all semesters of this course
      return Course.find({
        systemId: course.systemId
      })
        .sort({
          _id: -1
        })
        .lean()
        .then(function(courses) {
          // try to assign rating data based on past semesters

          const length = courses.length;
          let recentRating; // holds the most recent applicable rating
          let recentEvaluations; // holds the evaluations of the above rating

          // iterate through courses from recent to past
          for (let i = 0; i < length; i++) {
            const thatCourse = courses[i];
            const thatId = thatCourse._id;

            // ignore courses in the future
            if (thatId > thisId) continue;

            // upon hitting the same course, update new and recent and possibly rating
            if (thatId === thisId) {
              courseUpdate.recent = i === 0;
              courseUpdate.new = i === length - 1;

              // we're done if rating exists!
              const rating = getCourseRating(thatCourse);
              if (rating) {
                courseUpdate.rating = rating;
                return courseUpdate;
              }

              // keep looping if no rating
              continue;
            }

            // handle past courses: first check for rating
            const rating = getCourseRating(thatCourse);
            if (!rating) continue;

            // save for most recent rating
            if (!recentRating) {
              recentRating = rating;
              recentEvaluations = thatCourse.evaluations;
            }

            // done if instructors intersect!
            const thatInstructors = thatCourse.instructors;
            if (existsIntersection(thisInstructors, thatInstructors)) {
              courseUpdate.rating = rating;
              courseUpdate.rating.description =
                rating.description +
                ' from the last time an instructor taught the course';
              courseUpdate.evaluations = thatCourse.evaluations;
              return courseUpdate;
            }
          }

          // if rating not assigned but a recent one exists we go for it!
          if (!courseUpdate.rating && recentRating) {
            courseUpdate.rating = recentRating;
            courseUpdate.rating.description =
              recentRating.description +
              ' from the last time the course was taught';
            courseUpdate.evaluations = recentEvaluations;
            return courseUpdate;
          }

          // otherwise... bad luck, just return the new / recent information
          return courseUpdate;
        });
    })
    .then(function(courseUpdate) {
      courseUpdate.lastModified = new Date();

      // put update through to database
      return Course.findByIdAndUpdate(courseId, courseUpdate, {
        new: true,
        upsert: false,
        runValidators: true
      });
    });
};

/*
Takes a 9-digit id of the relevant instructor.

Technically does no scraping. The name is for uniformity.

Assigns the following fields to the instructor:
  history.courses
  history.ratedCourses
and attempts to assign the following fields:
  history.rating
  history.firstSemester

Returns a Promise (resolved to the saved instructor).

NOTE: All courses must be in the database and updated before running this.
*/
const scrapeInstructorUpdate = function(instructorId) {
  return Course.find({ instructors: instructorId })
    .lean()
    .then(function(courses) {
      const instructor = { _id: instructorId };

      if (!courses || !courses.length) {
        logger.log(
          'debug',
          'scrapeInstructorUpdate: instructor %s is not in any courses',
          instructorId
        );
        return Promise.resolve('unreal');
      }

      // aggregate history
      let count = 0;
      let sum = 0;
      let firstSemester = '';
      const length = courses.length;
      for (let i = 0; i < length; i++) {
        const course = courses[i];
        if (
          course.rating &&
          course.rating.score &&
          course.rating.semester &&
          course.rating.semester === course.semester
        ) {
          sum += course.rating.score;
          count += 1;
        }

        if (!firstSemester || course.semester < firstSemester) {
          firstSemester = course.semester;
        }
      }

      // assign history
      const history = {
        courses: length,
        ratedCourses: count
      };
      if (firstSemester) history.firstSemester = firstSemester;
      if (count) history.rating = sum / count;
      instructor.history = history;

      // store
      instructor.lastModified = new Date();

      return Instructor.findByIdAndUpdate(instructor._id, instructor, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
    });
};

/*
Takes:
  f: a function taking no inputs that returns a Promise
    e.g. scrapeCourseDetail.bind(null, id) / scrapeSemester.bind(null, id)
  id: relevant id
    e.g. 10-digit course id / 4-digit semester id
  n: the number of attempts to resolve the promise

Attempts to call f a maximum of n times, with increasing (and random) time gaps
between each attempt.

Returns a Promise.

INITIAL_DELAY: duration of time (in ms) to wait after first failure
MULTIPLIER: factor the delay increases by after each failure
*/
const scrapeNAttempts = function(f, id, n) {
  const INITIAL_DELAY = 1000;
  const MULTIPLIER = 2;

  // Returns a number uniformly at random between min and max
  const randomBetween = function(min, max) {
    return min + (max - min) * Math.random();
  };

  // Returns a Promise catch handler that delays by about the specified ms
  const rejectDelay = function(delay) {
    return function(reason) {
      return new Promise(function(resolve, reject) {
        logger.log(
          'info',
          'scrapeNAttempts: %s requires another attempt: ',
          id,
          reason
        );
        setTimeout(
          reject.bind(null, reason),
          randomBetween(INITIAL_DELAY, delay)
        );
      });
    };
  };

  // chain n attempts up in a Promise
  let p = Promise.reject();
  let delay = INITIAL_DELAY;
  for (let i = 1; i < n; i++) {
    p = p
      .catch(function() {
        return f();
      })
      .catch(rejectDelay(delay));

    delay *= MULTIPLIER;
  }

  return p.catch(function() {
    return f();
  });
};

/*
Takes:
  f: a function taking one input (an id) that returns a Promise
    e.g. scrapeCourseDetail / scrapeSemester
  ids: an array of ids to call f on
    e.g. an array of 10-digit course id / 4-digit semester id
  description: a string just for logging purposes
  interval (optional): minimum delay (milliseconds) between each call
  threads (optional): maximum number of requests going on in parallel

Attempts to call f on each id through scrapeNAttempts. Maintains an upper limit
on parallel processing and a lower limit on the delay between requests.

Keeps a log of progress as requests are sent or processed.

Returns an empty Promise.

ATTEMPTS: number of times to call f on each id before giving up
INTERVAL: milliseconds between each request to scrapeNAttempts
THREADS: the number of requests to be handling in parallel
*/
const scrapeAll = function(f, ids, description, interval, threads) {
  const ATTEMPTS = 7;
  const INTERVAL = interval || 300;
  const THREADS = threads || 15;

  // progress information
  const requests = []; // threads (promise chains) go into here
  const idsLeft = ids.slice(); // ids will be popped from here
  const count = ids.length;
  let sent = 0;
  let processed = 0;
  const unreal = []; // ids where something was wrong with the data
  const unsuccessful = []; // ids where something was wrong with the script
  let lastRequest = new Date(); // time last request was released
  let queue = []; // ids taken

  // set up threads
  for (let i = 0; i < THREADS; i++) {
    requests.push(Promise.resolve());
  }

  logger.log(
    'warn',
    'scrapeAll: %s: Beginning to process %d requests',
    description,
    count
  );
  logger.log(
    'warn',
    'sent / processed / unsuccessful / unreal / total / queue length'
  );

  // chain request promises - 10% more for some breathing space
  for (let i = 0; i < count * 1.1; i++) {
    // eslint-disable-next-line no-loop-func
    requests[i % THREADS] = requests[i % THREADS].then(function() {
      // get the next id
      const id = idsLeft.pop();

      // no more if undefined
      if (id === undefined) return;

      // put id into queue
      queue.push(id);

      // send scraping attempt
      return new Promise(function(resolve, reject) {
        // this promise waits until it is time to release the request
        // (i.e. until at least INTERVAL ms has past since the last request)

        // keep checking until id is at front of queue
        const repeat = setInterval(function() {
          // when id is at front of queue...
          if (queue[0] === id) {
            // stop checking
            clearInterval(repeat);

            // calculate how long to wait until it should be released
            let timeToWait = lastRequest - new Date() + INTERVAL;
            if (timeToWait < 0) timeToWait = 0;

            // wait for release
            setTimeout(function() {
              // update queue and release!
              lastRequest = new Date();
              queue.shift();
              sent++;
              logger.log(
                'info',
                'scrapeAll: %s: %d* %d  %d %d %d %s',
                description,
                sent,
                processed,
                unsuccessful.length,
                unreal.length,
                count,
                '*'.repeat(queue.length)
              );
              logger.log(
                'debug',
                'scrapeAll: %s released as number %d',
                id,
                sent
              );
              resolve();
            }, timeToWait);
          }
        }, INTERVAL);
      })
        .then(function() {
          // now that waiting is over, scrape!
          return scrapeNAttempts(f.bind(null, id), id, ATTEMPTS);
        })
        .then(function(result) {
          logger.log('debug', 'scrapeAll: %s returned successfully', id);
          // detect if real or not
          if (result === 'unreal') {
            unreal.push(id);
            logger.log('warn', 'scrapeAll: %s: %s was unreal', description, id);
          }
        })
        .catch(function(err) {
          logger.log('debug', 'scrapeAll: %s returned unsuccessfully', id);
          // uh oh... take some logs
          unsuccessful.push(id);
          logger.log(
            'error',
            'scrapeAll: %s: %s was unsuccessful',
            description,
            id,
            err
          );
          return Promise.resolve(); // resolve anyway
        })
        .finally(function() {
          logger.log('debug', 'scrapeAll: %s finished processing', id);
          // finished processing!
          processed++;
          logger.log(
            'info',
            'scrapeAll: %s: %d  %d* %d %d %d %s',
            description,
            sent,
            processed,
            unsuccessful.length,
            unreal.length,
            count,
            '*'.repeat(queue.length)
          );
        });
    });
  }

  // finish up
  return Promise.all(requests).then(function() {
    logger.log(
      'warn',
      'scrapeAll: %s: Finished processing %d requests',
      description,
      count
    );
    logger.log(
      'warn',
      'scrapeAll: %s: %d requests sent, %d processed, %d unsuccessful, %d unreal, out of %d',
      description,
      sent,
      processed,
      unsuccessful.length,
      unreal.length,
      count
    );
    logger.log(
      'warn',
      'scrapeAll: %s: The unreal ids are:',
      description,
      unreal
    );
    logger.log(
      'error',
      'scrapeAll: %s: The unsuccessful ids are:',
      description,
      unsuccessful
    );
  });
};

module.exports.scrapeSemester = scrapeSemester;
module.exports.scrapeDepartments = scrapeDepartments;
module.exports.scrapeCourseDetail = scrapeCourseDetail;
module.exports.scrapeCourseEvaluation = scrapeCourseEvaluation;
module.exports.scrapeInstructor = scrapeInstructor;
module.exports.scrapeCourseUpdate = scrapeCourseUpdate;
module.exports.scrapeInstructorUpdate = scrapeInstructorUpdate;
module.exports.scrapeAll = scrapeAll;
