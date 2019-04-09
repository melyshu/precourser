// UPDATED FOR NEW API 2019-04-09

require('../config.js');
const scraper = require('./new/scraper.js');

const Semester = require('../models/Semester.js');
const Instructor = require('../models/Instructor.js');

// runs at about 4 / min or 1 / 15000 ms
const SEMESTER_INTERVAL = 2000;
const SEMESTER_THREADS = 20;

// runs at about 173 / min or 1 / 346 ms
const COURSE_DETAIL_INTERVAL = 50;
const COURSE_DETAIL_THREADS = 15;

// runs at about 948 / min or 1 / 63 ms
const COURSE_UPDATE_INTERVAL = 30;
const COURSE_UPDATE_THREADS = 30;

// runs at about 948 / min or 1 / 63 ms
const INSTRUCTOR_UPDATE_INTERVAL = 20;
const INSTRUCTOR_UPDATE_THREADS = 30;

const DELAY_FACTOR = 2;

scraper
  .scrapeAll(
    scraper.scrapeSemester,
    ['1202'],
    'semester',
    SEMESTER_INTERVAL,
    SEMESTER_THREADS
  )
  .then(() =>
    Semester.findById('1202').lean().then(function(semester) {
      return scraper.scrapeAll(
        scraper.scrapeCourseDetail,
        semester.courses,
        'courseDetail',
        COURSE_DETAIL_INTERVAL * DELAY_FACTOR,
        COURSE_DETAIL_THREADS
      );
    })
  )
  .then(() =>
    Semester.findById('1202').lean().then(function(semester) {
      return scraper.scrapeAll(
        scraper.scrapeCourseUpdate,
        semester.courses,
        'courseUpdate',
        COURSE_UPDATE_INTERVAL * DELAY_FACTOR,
        COURSE_UPDATE_THREADS
      );
    })
  )
  .then(() =>
    Instructor.find()
      .lean()
      .distinct('_id')
      .then(instructorIds =>
        scraper.scrapeAll(
          scraper.scrapeInstructorUpdate,
          instructorIds,
          'instructorUpdate',
          INSTRUCTOR_UPDATE_INTERVAL,
          INSTRUCTOR_UPDATE_THREADS
        )
      )
  );
