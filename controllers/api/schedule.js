const config = require('../../config.js');
const express = require('express');

const Schedule = require('../../models/Schedule.js');

const router = express.Router();

// handleChangeSchedule
// GET /api/schedule/:scheduleId
router.get('/:scheduleId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;

  req.object = Schedule.findByUserAndId(userId, scheduleId);
});

// handleCreateSchedule
// POST /api/schedule/:scheduleId/name/:name
router.post('/semester/:semesterId/name/:name', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;
  const name = req.params.name;

  req.object = Schedule.createByUserSemesterAndName(userId, semesterId, name);
});

// handleRenameSchedule
// PUT /api/schedule/:scheduleId/name/:name
router.put('/:scheduleId/name/:name', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const name = req.params.name;

  req.object = Schedule.renameByUserAndId(userId, scheduleId, name);
});

// handleDeleteSchedule
// DELETE /api/schedule/:scheduleId
router.delete('/:scheduleId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;

  req.object = Schedule.deleteByUserAndId(userId, scheduleId);
});

// handleAddCourseToSchedule
// PUT /api/schedule/:scheduleId/course/:courseId
router.put('/:scheduleId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const courseId = req.params.courseId;

  req.object = Schedule.addCourseByUserAndId(userId, scheduleId, courseId);
});

// handleRemoveCourseFromSchedule
// DELETE /api/schedule/:scheduleId/course/:courseId
router.delete('/:scheduleId/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const courseId = req.params.courseId;

  req.object = Schedule.removeCourseByUserAndId(userId, scheduleId, courseId);
});

// handleAddSectionToSchedule
// PUT /api/schedule/:scheduleId/section/:sectionId
router.put('/:scheduleId/section/:sectionId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const sectionId = req.params.sectionId;

  req.object = Schedule.addSectionByUserAndId(userId, scheduleId, sectionId);
});

// handleRemoveSectionFromSchedule
// DELETE /api/schedule/:scheduleId/section/:sectionId
router.delete('/:scheduleId/section/:sectionId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const sectionId = req.params.sectionId;

  req.object = Schedule.removeSectionByUserAndId(userId, scheduleId, sectionId);
});

// handleChangeCourseColorInSchedule
// PUT /api/schedule/:scheduleId/course/:courseId/color/:colorId
router.put('/:scheduleId/course/:courseId/color/:colorId', function(req, res) {
  const userId = req.session.netid;
  const scheduleId = req.params.scheduleId;
  const courseId = req.params.courseId;
  const colorId = req.params.colorId;

  req.object = Schedule.changeCourseColor(
    userId,
    scheduleId,
    courseId,
    colorId
  );
});

module.exports = router;
