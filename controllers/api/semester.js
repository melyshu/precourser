const config = require('../../config.js');
const express = require('express');

const Semester = require('../../models/Semester.js');

const router = express.Router();

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
