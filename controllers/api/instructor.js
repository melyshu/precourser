const config = require('../../config.js');
const express = require('express');

const Instructor = require('../../models/Instructor.js');

const router = express.Router();

// search
router.get('/semester/:semester/search/:query', function(req, res) {
  const semester = req.params.semester;
  const query = req.params.query;

  req.object = Instructor.search(semester, query);
});

// retrieval
router.get('/:id', function(req, res) {
  const id = req.params.id;

  req.object = Instructor.findFullById(id);
});

module.exports = router;
