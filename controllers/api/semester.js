const config = require('../../config.js');
const express = require('express');
const Promise = require('bluebird');

const Semester = require('../../models/Semester.js');
const Schedule = require('../../models/Schedule.js');
const User = require('../../models/User.js');

const router = express.Router();

// change semester
router.get('/:semesterId', function(req, res) {
  const userId = req.session.netid;
  const semesterId = req.params.semesterId;

  const schedulePromise = Schedule.findByUserAndSemester(userId, semesterId);
  const userPromise = User.findFullBySemester(userId, semesterId);

  req.object = Promise.join(schedulePromise, userPromise, function(
    scheduleObject,
    userObject
  ) {
    if (!scheduleObject || !userObject) return null;

    return {
      selectedSemester: semesterId,
      selectedSchedule: scheduleObject.selectedSchedule,
      schedules: scheduleObject.schedules,
      user: userObject.user
    };
  });
});

// search
router.get('/all', function(req, res) {
  Semester.find()
    .lean()
    .then(function(semesters) {
      if (!semesters) {
        res.sendStatus(404);
        return;
      }

      res.json(semesters);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
