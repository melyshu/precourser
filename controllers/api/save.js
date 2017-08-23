const config = require('../../config.js');
const express = require('express');

const Course = require('../../models/Course.js');
const User = require('../../models/User.js');

const router = express.Router();

router.get('/course/semester/:semester', function(req, res) {
  const netid = req.session.netid;
  const semester = req.params.semester;

  req.object = User.findSavedCoursesBySemester(netid, semester);
});

router.put('/semester/:semesterId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;
  const courseId = req.params.courseId;

  req.object = User.saveCourseBySemester(userId, courseId, semesterId);
});

router.delete('/semester/:semesterId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;
  const courseId = req.params.courseId;

  req.object = User.unsaveCourseBySemester(userId, courseId, semesterId);
});

/*
// save course by id
router.put('/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const courseId = req.params.courseId;

  req.object = User.saveCourse(userId, courseId);
});

// unsave course by id
router.delete('/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const courseId = req.params.courseId;

  req.object = User.unsaveCourse(userId, courseId);
});

router.get('/instructor/semester/:semester', function(req, res) {
  const netid = req.session.netid;
  const semester = req.params.semester;

  req.object = User.findSavedInstructorsBySemester(netid, semester);
});

// should be put
router.get('/instructor/:instructor/put', function(req, res) {
  const netid = req.session.netid;
  const instructor = req.params.instructor;

  req.object = User.saveInstructor(netid, instructor);
});

// should be delete
router.get('/instructor/:instructor/delete', function(req, res) {
  const netid = req.session.netid;
  const instructor = req.params.instructor;

  req.object = User.unsaveInstructor(netid, instructor);
});
*/



module.exports = router;
