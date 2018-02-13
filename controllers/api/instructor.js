const config = require('../../config.js');
const express = require('express');

const Instructor = require('../../models/Instructor.js');

const router = express.Router();

// handleChangeInstructorSearch
// GET /api/instructor/search/:query
router.get('/search/:query', function(req, res) {
  const query = req.params.query;

  req.object = Instructor.searchByQuery(query);
});

// handleLoadInstructor
// GET /api/instructor/:instructorId
router.get('/:instructorId', function(req, res) {
  const instructorId = req.params.instructorId;

  req.object = Instructor.findFullById(instructorId);
});

module.exports = router;
