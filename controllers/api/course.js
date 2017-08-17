const config = require('../../config.js');
const express = require('express');

const Course = require('../../models/Course.js');

const router = express.Router();

// search
router.get('/semester/:semester/search/:query', function(req, res) {
  const semester = req.params.semester;
  const query = req.params.query;

  Course.search(semester, query)
    .then(function(courses) {
      if (!courses) {
        res.sendStatus(404);
        return;
      }

      res.json(courses);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

// retrieval
router.get('/:id', function(req, res) {
  const id = req.params.id;

  Course.findFullById(id)
    .then(function(course) {
      if (course === null) {
        res.sendStatus(404);
        return;
      }

      res.json(course);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
