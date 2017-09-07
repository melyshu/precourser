/*
Contains functions for large-scale database manipulation.

Exported functions:

  buildDatabase()
    builds (or updates) the whole database from the ground up.
    should be used for infrequent, large updates, especially:
      new semester of course offerings released
      new semester of course evaluations released

  updateDatabase()
    updates the course details and instructor details for the current semester.
    should be used for regular updates.

NOTE: THE FOLLOWING GLOBAL VARIABLES NEED TO BE KEPT UP TO DATE:
  CURRENT_SEMESTER
  LAST_SEMESTER_WITH_EVALUATIONS
  SEMESTERS
EACH TIME ONE OF THESE CHANGES A CALL TO buildDatabase() IS PROBABLY REQUIRED.

*/

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
const CURRENT_SEMESTER = '1182';
const LAST_SEMESTER_WITH_EVALUATIONS = '1174';
// prettier-ignore
const SEMESTERS = [ // see ./hardcode/SEMESTERS.js for more details
          '1182',
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

/*
MAIN IMPORTING SCRIPT THAT DOES EVERYTHING
  imports departments
  gets course ids in all semesters specified by SEMESTERS
  scrapes course details for all course ids
  scrapes course evaluations for all course ids (up to LAST_SEMESTER_WITH_EVALUATIONS)
  scrapes instructors for all instructors in courses
  updates course ratings and new/recent indicators in all courses

Warning: this is a very time consuming function!

This function should also be called when a new semester of course offerings is
out or a new semester of course evaluations is out (just to keep the database
in check). The function will insert / update as required so it can be called
as many times as necessary.

Logs progress information throughout and timing information at the end.

Example timing:
  Departments took 0 mins
  Semester took 4 mins
  CourseDetail took 115 mins
  CourseEvaluation took 97 mins
  Instructor took 16 mins
  CourseUpdate took 21 mins
  ---------------------
  buildDatabase took 253 mins

2017-08-19T07:43:05.209Z - warn: Departments took 0 mins
2017-08-19T07:43:05.210Z - warn: Semester took 4 mins
2017-08-19T07:43:05.211Z - warn: CourseDetail took 119 mins
2017-08-19T07:43:05.212Z - warn: CourseEvaluation took 99 mins
2017-08-19T07:43:05.212Z - warn: Instructor took 16 mins
2017-08-19T07:43:05.213Z - warn: CourseUpdate took 26 mins
2017-08-19T07:43:05.214Z - warn: ---------------------
2017-08-19T07:43:05.223Z - warn: buildDatabase took 265 mins
*/
const buildDatabase = function() {
  let startDepartments = new Date();
  let startSemester;
  let startCourseDetail;
  let startCourseEvaluation;
  let startInstructor;
  let startCourseUpdate;
  let finish;
  return Promise.resolve()
    .then(
      // import departments
      scraper.scrapeDepartments
    )
    .then(function() {
      // find all course ids by semester
      startSemester = new Date();
      return scraper.scrapeAll(
        scraper.scrapeSemester,
        SEMESTERS,
        'semester',
        SEMESTER_INTERVAL,
        SEMESTER_THREADS
      );
    })
    .then(function() {
      startCourseDetail = new Date();
      return Semester.find().lean().then(function(semesters) {
        let courseIds = [];
        for (let i = 0; i < semesters.length; i++) {
          const semester = semesters[i];
          courseIds = courseIds.concat(semester.courses);
        }
        return courseIds;
      });
    })
    .then(function(courseIds) {
      // scrape course details
      return scraper.scrapeAll(
        scraper.scrapeCourseDetail,
        courseIds,
        'courseDetail',
        COURSE_DETAIL_INTERVAL,
        COURSE_DETAIL_THREADS
      );
    })
    .then(function() {
      startCourseEvaluation = new Date();
      return Course.find({
        semester: { $lte: LAST_SEMESTER_WITH_EVALUATIONS }
      })
        .lean()
        .distinct('_id');
    })
    .then(function(courseIds) {
      // scrape course evaluations
      return scraper.scrapeAll(
        scraper.scrapeCourseEvaluation,
        courseIds,
        'courseEvaluation',
        COURSE_EVALUATION_INTERVAL,
        COURSE_EVALUATION_THREADS
      );
    })
    .then(function() {
      startInstructor = new Date();
      return Course.find().lean().distinct('instructors');
    })
    .then(function(instructorIds) {
      // scrape instructors
      return scraper.scrapeAll(
        scraper.scrapeInstructor,
        instructorIds,
        'instructor',
        INSTRUCTOR_INTERVAL,
        INSTRUCTOR_THREADS
      );
    })
    .then(function() {
      startCourseUpdate = new Date();
      return Course.find().lean().distinct('_id');
    })
    .then(function(courseIds) {
      // update course ratings
      return scraper.scrapeAll(
        scraper.scrapeCourseUpdate,
        courseIds,
        'courseUpdate',
        COURSE_UPDATE_INTERVAL,
        COURSE_UPDATE_THREADS
      );
    })
    .then(function() {
      finish = new Date();

      const formatDelta = function(delta) {
        return Math.round(delta / 1000 / 60) + ' mins';
      };

      logger.log(
        'warn',
        'Departments took %s',
        formatDelta(startSemester - startDepartments)
      );
      logger.log(
        'warn',
        'Semester took %s',
        formatDelta(startCourseDetail - startSemester)
      );
      logger.log(
        'warn',
        'CourseDetail took %s',
        formatDelta(startCourseEvaluation - startCourseDetail)
      );
      logger.log(
        'warn',
        'CourseEvaluation took %s',
        formatDelta(startInstructor - startCourseEvaluation)
      );
      logger.log(
        'warn',
        'Instructor took %s',
        formatDelta(startCourseUpdate - startInstructor)
      );
      logger.log(
        'warn',
        'CourseUpdate took %s',
        formatDelta(finish - startCourseUpdate)
      );
      logger.log('warn', '--------------------- ');
      logger.log(
        'warn',
        'buildDatabase took %s',
        formatDelta(finish - startDepartments)
      );
    });
};

/*
MAIN UPDATING FUNCTION FOR REGULAR USE
  gets course ids in CURRENT_SEMESTER
  scrapes course details for all course ids
  scrapes any new instructors
  updates course ratings and new/recent indicators in any new courses

This function should be called just to keep the database more or less up-to-date
with the registrar.

Logs progress information throughout and timing information at the end.

Example timing:
  Departments took 0 mins
  Semester took 2 mins
  CourseDetail took 8 mins
  Instructor took 0 mins
  CourseUpdate took 0 mins
  ---------------------
  updateDatabase took 10 mins
*/
const updateDatabase = function() {
  let startDepartments = new Date();
  let startSemester;
  let startCourseDetail;
  let startInstructor;
  let startCourseUpdate;
  let finish;
  return Promise.resolve()
    .then(
      // import departments
      scraper.scrapeDepartments
    )
    .then(function() {
      // find all course ids in semester
      startSemester = new Date();
      return scraper.scrapeAll(
        scraper.scrapeSemester,
        [CURRENT_SEMESTER],
        'semester',
        SEMESTER_INTERVAL,
        SEMESTER_THREADS
      );
    })
    .then(function() {
      startCourseDetail = new Date();
      return Semester.findById(CURRENT_SEMESTER)
        .lean()
        .then(function(semester) {
          return semester.courses;
        });
    })
    .then(function(courseIds) {
      // scrape course details
      return scraper.scrapeAll(
        scraper.scrapeCourseDetail,
        courseIds,
        'courseDetail',
        COURSE_DETAIL_INTERVAL,
        COURSE_DETAIL_THREADS
      );
    })
    .then(function() {
      startInstructor = new Date();
      return Course.find().lean().distinct('instructors');
    })
    .then(function(courseInstructorIds) {
      return Instructor.find()
        .lean()
        .distinct('_id')
        .then(function(instructorIds) {
          const newIds = [];
          for (let i = 0; i < courseInstructorIds; i++) {
            const id = courseInstructorIds[i];
            if (instructorIds.indexOf(id) < 0) newIds.push(id);
          }
          return newIds;
        });
    })
    .then(function(newInstructorIds) {
      // scrape any new instructors
      return scraper.scrapeAll(
        scraper.scrapeInstructor,
        newInstructorIds,
        'instructor',
        INSTRUCTOR_INTERVAL,
        INSTRUCTOR_THREADS
      );
    })
    .then(function() {
      startCourseUpdate = new Date();
      return Course.find({ new: { $exists: false } }).lean().distinct('_id');
    })
    .then(function(courseIds) {
      // update course ratings as necessary
      return scraper.scrapeAll(
        scraper.scrapeCourseUpdate,
        courseIds,
        'courseUpdate',
        COURSE_UPDATE_INTERVAL,
        COURSE_UPDATE_THREADS
      );
    })
    .then(function() {
      finish = new Date();

      const formatDelta = function(delta) {
        return Math.round(delta / 1000 / 60) + ' mins';
      };

      logger.log(
        'warn',
        'Departments took %s',
        formatDelta(startSemester - startDepartments)
      );
      logger.log(
        'warn',
        'Semester took %s',
        formatDelta(startCourseDetail - startSemester)
      );
      logger.log(
        'warn',
        'CourseDetail took %s',
        formatDelta(startInstructor - startCourseDetail)
      );
      logger.log(
        'warn',
        'Instructor took %s',
        formatDelta(startCourseUpdate - startInstructor)
      );
      logger.log(
        'warn',
        'CourseUpdate took %s',
        formatDelta(finish - startCourseUpdate)
      );
      logger.log('warn', '--------------------- ');
      logger.log(
        'warn',
        'updateDatabase took %s',
        formatDelta(finish - startDepartments)
      );
    });
};

module.exports.buildDatabase = buildDatabase;
module.exports.updateDatabase = updateDatabase;
