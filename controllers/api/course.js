const config = require('../../config.js');
const express = require('express');

const Course = require('../../models/Course.js');

const router = express.Router();

// search
router.get('/semester/:semesterId/search/:query', function(req, res) {
  const semesterId = req.params.semesterId;
  const query = req.params.query;

  req.object = Course.search(semesterId, query).then(function(courses) {
    if (!courses) return null;
    return { searchedCourses: courses };
  });
});

// retrieval
router.get('/:courseId', function(req, res) {
  const courseId = req.params.courseId;

  req.object = Course.findFullById(courseId);
});

module.exports = router;
