const config = require('../../config.js');
const express = require('express');

const Course = require('../../models/Course.js');

const router = express.Router();

// handleChangeCourseSearch
// GET /api/course/semester/:semesterId/search/:query
router.get('/semester/:semesterId/search/:query', function(req, res) {
  const semesterId = req.params.semesterId;
  const query = req.params.query;

  req.object = Course.searchBySemesterAndQuery(semesterId, query);
});

// handleSelectCourse
// GET /api/course/:courseId
router.get('/:courseId', function(req, res) {
  const courseId = req.params.courseId;

  req.object = Course.findFullById(courseId);
});

module.exports = router;
