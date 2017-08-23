const config = require('../../config.js');
const express = require('express');
const Promise = require('bluebird');

const User = require('../../models/User.js');
const Semester = require('../../models/Semester.js');
const Schedule = require('../../models/Schedule.js');

const router = express.Router();

router.get('/', function(req, res) {
  const userId = req.session.netid;

  req.object = Semester.findFull().then(function(semesterObject) {
    if (!semesterObject || semesterObject.semesters.length === 0) return null;
    const semesterId = semesterObject.semesters[0]._id;

    const schedulePromise = Schedule.findByUserAndSemester(userId, semesterId);
    const userPromise = User.findFullBySemester(userId, semesterId);

    return Promise.join(schedulePromise, userPromise, function(
      scheduleObject,
      userObject
    ) {
      if (!scheduleObject || !userObject) return null;

      return {
        selectedSemester: semesterId,
        semesters: semesterObject.semesters,
        selectedSchedule: scheduleObject.selectedSchedule,
        schedules: scheduleObject.schedules,
        user: userObject.user
      };
    });
  });
});

module.exports = router;
