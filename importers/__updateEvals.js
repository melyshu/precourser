
// TEMPORARY FILE USED TO SCRAPE MANUALLY 2018-04-06

require('../config.js');
const logger = require('./log/logger.js');
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const scraper = require('./helpers/scraper.js');

const Semester = require('../models/Semester.js');
const Course = require('../models/Course.js');
const Instructor = require('../models/Instructor.js');

// VARIABLES THAT NEED TO BE KEPT UP TO DATE
const CURRENT_SEMESTER = '1184';
const LAST_SEMESTER_WITH_EVALUATIONS = '1182';
// prettier-ignore
const SEMESTERS = [ // see ./hardcode/SEMESTERS.js for more details
  '1192',
  '1184', '1182',
  '1174', '1172',
  '1164', '1162',
  '1154', '1152',
  '1144', '1142',
  '1134', '1132',
  '1124', '1122',
  '1114', '1112',
  '1104', '1102'
];

// scraper fine-tuning
// interval: minimum delay between requests in milliseconds
// threads: maximum requests running at the same time

// runs at about 4 / min or 1 / 15000 ms
const SEMESTER_INTERVAL = 2000;
const SEMESTER_THREADS = 20;

// runs at about 173 / min or 1 / 346 ms
const COURSE_DETAIL_INTERVAL = 300;
const COURSE_DETAIL_THREADS = 15;

// runs at about 193 / min or 1 / 310 ms
const COURSE_EVALUATION_INTERVAL = 300;
const COURSE_EVALUATION_THREADS = 15;

// runs at about 197 / min or 1 / 305 ms
const INSTRUCTOR_INTERVAL = 300;
const INSTRUCTOR_THREADS = 8;

// runs at about 948 / min or 1 / 63 ms
const COURSE_UPDATE_INTERVAL = 50;
const COURSE_UPDATE_THREADS = 30;

// runs at about 948 / min or 1 / 63 ms
const INSTRUCTOR_UPDATE_INTERVAL = 50;
const INSTRUCTOR_UPDATE_THREADS = 30;
/*
scraper.scrapeAll(
  scraper.scrapeCourseEvaluation,
  ['1182002051'],
  'courseEvaluation',
  COURSE_EVALUATION_INTERVAL,
  COURSE_EVALUATION_THREADS
);*/

//* DEPARTMENTS
scraper.scrapeDepartments();
//*/

/* FALL17 EVALS
Course.find({ semester: LAST_SEMESTER_WITH_EVALUATIONS })
  .lean()
  .distinct('_id')
  .then(function(courseIds) {
    // scrape course evaluations
    return scraper.scrapeAll(
      scraper.scrapeCourseEvaluation,
      courseIds,
      'courseEvaluation',
      COURSE_EVALUATION_INTERVAL,
      COURSE_EVALUATION_THREADS
    );
  }); //*/

/* FALL 18 COURSELIST
scraper.scrapeAll(
  scraper.scrapeSemester,
  ['1192'],
  'semester',
  SEMESTER_INTERVAL,
  SEMESTER_THREADS
); //*/

/* FALL19 COURSES
Semester.findById('1192').lean().then(function(semester) {
  return scraper.scrapeAll(
    scraper.scrapeCourseDetail,
    semester.courses,
    'courseDetail',
    COURSE_DETAIL_INTERVAL,
    COURSE_DETAIL_THREADS
  );
}); //*/

/* INSTRUCTORS
Course.find().lean().distinct('instructors').then(function(instructorIds) {
  // scrape instructors
  return scraper.scrapeAll(
    scraper.scrapeInstructor,
    instructorIds,
    'instructor',
    INSTRUCTOR_INTERVAL,
    INSTRUCTOR_THREADS
  );
}); //*/

/* COURSEUPDATE
Course.find().lean().distinct('_id').then(function(courseIds) {
  // update course ratings
  return scraper.scrapeAll(
    scraper.scrapeCourseUpdate,
    courseIds,
    'courseUpdate',
    COURSE_UPDATE_INTERVAL,
    COURSE_UPDATE_THREADS
  );
}); //*/

/* INSTRUCTOR UPDATE
Instructor.find().lean().distinct('_id').then(function(instructorIds) {
  // update course ratings
  return scraper.scrapeAll(
    scraper.scrapeInstructorUpdate,
    instructorIds,
    'instructorUpdate',
    INSTRUCTOR_UPDATE_INTERVAL,
    INSTRUCTOR_UPDATE_THREADS
  );
}); //*/
