const config = require('../../config.js');
const express = require('express');

const Semester = require.main.require('./models/Semester.js');
const Schedule = require.main.require('./models/Schedule.js');

const router = express.Router();

router.get('/', function(req, res) {
  const userId = req.session.netid;

  Semester.findFull()
    .then(function(semesters) {
      const semesterId = semesters[0]._id || null;

      return Schedule.findByUserAndSemester(userId, semesterId).then(function(
        object
      ) {
        object.semesters = semesters;
        object.selectedSemester = semesterId;
        return object;
      });
    })
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
