const config = require('../config.js');
const express = require('express');

const Course = require.main.require('./models/Course.js');

const router = express.Router();

router.get('/:semester/:query', function(req, res) {
  if (req.params.query === undefined || req.params.semester === undefined) {
    console.log('hello')
    res.sendStatus(400);
    return;
  }

  const query = req.params.query;
  const semester = req.params.semester;

  Course.search(semester, query).then(function(courses) {
    if (!courses) {
      res.sendStatus(404);
      return;
    }

    res.json(courses);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
