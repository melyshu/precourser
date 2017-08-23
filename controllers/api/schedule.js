const config = require('../../config.js');
const express = require('express');

const Schedule = require('../../models/Schedule.js');

const router = express.Router();

// create new schedule given semester and name
router.post('/semester/:semesterId/name/:name', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;
  const name = req.params.name;

  req.object = Schedule.createByUserSemesterAndName(userId, semesterId, name);
});

// get all schedules by semester
router.get('/semester/:semesterId', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;

  req.object = Schedule.findByUserAndSemester(userId, semesterId);
});

// rename schedule given id and name
router.put('/:scheduleId/name/:name', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const name = req.params.name;

  req.object = Schedule.renameByUserAndId(userId, scheduleId, name);
});

// get schedule by id
router.get('/:scheduleId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;

  req.object = Schedule.findByUserAndId(userId, scheduleId);
});

// delete schedule by id
router.delete('/:scheduleId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;

  req.object = Schedule.deleteByUserAndId(userId, scheduleId);
});

// add course to schedule by ids
router.put('/:scheduleId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const courseId = req.params.courseId;

  req.object = Schedule.addCourseByUserAndId(userId, scheduleId, courseId);
});

// remove course from schedule by ids
router.delete('/:scheduleId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const courseId = req.params.courseId;

  req.object = Schedule.removeCourseByUserAndId(userId, scheduleId, courseId);
});

// add section to schedule by ids
router.put('/:scheduleId/section/:sectionId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const sectionId = req.params.sectionId;

  req.object = Schedule.addSectionByUserAndId(userId, scheduleId, sectionId);
});

// remove section from schedule by ids
router.delete('/:scheduleId/section/:sectionId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const sectionId = req.params.sectionId;

  req.object = Schedule.removeSectionByUserAndId(userId, scheduleId, sectionId);
});

module.exports = router;
