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

  req.object = Semester.findFull().then(function(semesterObject) {
    if (!semesterObject || semesterObject.semesters.length === 0) return null;
    const semesterId = semesterObject.semesters[0]._id;

    const departmentPromise = Department.findFull();
    const schedulePromise = Schedule.findByUserAndSemester(userId, semesterId);
    const userPromise = User.findFullById(userId);

    return Promise.join(
      departmentPromise,
      schedulePromise,
      userPromise,
      function(departmentObject, scheduleObject, userObject) {
        if (!departmentObject || !scheduleObject || !userObject) return null;

        return {
          departments: departmentObject.departments,
          semesters: semesterObject.semesters,
          selectedSemester: semesterId,
          user: userObject.user,
          schedules: scheduleObject.schedules,
          selectedSchedule: scheduleObject.selectedSchedule,
          loading: false
        };
      }
    );
  });
});

module.exports = router;
