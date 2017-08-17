const config = require('../../config.js');
const express = require('express');

const Instructor = require('../../models/Instructor.js');

const router = express.Router();

// search
router.get('/semester/:semester/search/:query', function(req, res) {
  const semester = req.params.semester;
  const query = req.params.query;

  Instructor.search(semester, query).then(function(instructors) {
    if (!instructors) {
      res.sendStatus(404);
      return;
    }

    res.json(instructors);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

// retrieval
router.get('/:id', function(req, res) {
  const id = req.params.id;

  Instructor.findFullById(id).then(function(instructor) {
    if (instructor === null) {
      res.sendStatus(404);
      return;
    }

    res.json(instructor);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
