const config = require('../../config.js');
const express = require('express');
const Promise = require('bluebird');

const Schedule = require('../../models/Schedule.js');
const Course = require('../../models/Course.js');

const router = express.Router();

// handleChangeSemester
// GET /api/semester/:semesterId[?courseSearch=query (optional)]
router.get('/:semesterId', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;
  const query = req.query.courseSearch;

  if (!query) {
    req.object = Schedule.findByUserAndSemester(userId, semesterId);
  } else {
    const schedulePromise = Schedule.findByUserAndSemester(userId, semesterId);
    const coursePromise = Course.searchBySemesterAndQuery(semesterId, query);

    req.object = Promise.join(schedulePromise, coursePromise, function(
      scheduleObject,
      courseObject
    ) {
      if (!scheduleObject || !courseObject) return null;

      return {
        selectedSemester: semesterId,
        schedules: scheduleObject.schedules,
        selectedSchedule: scheduleObject.selectedSchedule,
        searchedCourses: courseObject.searchedCourses
      };
    });
  }
});

module.exports = router;
