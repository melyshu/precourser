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

module.exports = router;
