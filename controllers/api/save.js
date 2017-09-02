const config = require('../../config.js');
const express = require('express');

const User = require('../../models/User.js');

const router = express.Router();

// handleSaveCourse
// PUT /api/save/course/:courseId
router.put('/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const courseId = req.params.courseId;

  req.object = User.saveCourseById(userId, courseId);
});

// handleUnsaveCourse
// DELETE /api/save/course/:courseId
router.delete('/course/:courseId', function(req, res) {
  const userId = req.session.netid;
  const courseId = req.params.courseId;

  req.object = User.unsaveCourseById(userId, courseId);
});

module.exports = router;
