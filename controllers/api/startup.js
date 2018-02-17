const config = require('../../config.js');
const express = require('express');
const Promise = require('bluebird');

const Semester = require('../../models/Semester.js');
const Department = require('../../models/Department.js');
const User = require('../../models/User.js');
const Schedule = require('../../models/Schedule.js');

const router = express.Router();

// componentDidMount
// GET /api/startup
router.get('/', function(req, res) {
  const userId = req.session.netid;

  const semesterPromise = Semester.findFull();
  const userPromise = User.findFullById(userId);

  req.object = Promise.join(semesterPromise, userPromise, function(
    semesterObject,
    userObject
  ) {
    if (!semesterObject || !semesterObject.semesters.length || !userObject)
      return null;

    const semesterId = semesterObject.semesters[0]._id;

    const departmentPromise = Department.findFull();
    const schedulePromise = Schedule.findByUserAndSemester(userId, semesterId);

    return Promise.join(departmentPromise, schedulePromise, function(
      departmentObject,
      scheduleObject
    ) {
      if (!departmentObject || !scheduleObject) return null;

      return {
        departments: departmentObject.departments,
        semesters: semesterObject.semesters,
        selectedSemester: semesterId,
        user: userObject.user,
        schedules: scheduleObject.schedules,
        selectedSchedule: scheduleObject.selectedSchedule,
        loading: false
      };
    });
  });
});

module.exports = router;
