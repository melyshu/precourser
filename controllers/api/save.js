const config = require('../../config.js');
const express = require('express');

const Course = require('../../models/Course.js');
const User = require('../../models/User.js');

const router = express.Router();

router.get('/course/semester/:semester', function(req, res) {
  const netid = req.session.netid;
  const semester = req.params.semester;

  User.findSavedCoursesBySemester(netid, semester).then(function(courses) {
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

// should be put
router.get('/course/:course/put', function(req, res) {
  const netid = req.session.netid;
  const course = req.params.course;

  User.saveCourse(netid, course).then(function(course) {
    if (course === null) {
      res.sendStatus(404);
      return;
    }

    res.json(course);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

// should be delete
router.get('/course/:course/delete', function(req, res) {
  const netid = req.session.netid;
  const course = req.params.course;

  User.unsaveCourse(netid, course).then(function(course) {
    if (course === null) {
      res.sendStatus(404);
      return;
    }

    res.json(course);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/instructor/semester/:semester', function(req, res) {
  const netid = req.session.netid;
  const semester = req.params.semester;

  User.findSavedInstructorsBySemester(netid, semester).then(function(instructors) {
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

// should be put
router.get('/instructor/:instructor/put', function(req, res) {
  const netid = req.session.netid;
  const instructor = req.params.instructor;

  User.saveInstructor(netid, instructor).then(function(instructor) {
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

// should be delete
router.get('/instructor/:instructor/delete', function(req, res) {
  const netid = req.session.netid;
  const instructor = req.params.instructor;

  User.unsaveInstructor(netid, instructor).then(function(instructor) {
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
