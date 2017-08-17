const config = require('../../config.js');
const express = require('express');

const Course = require.main.require('./models/Course.js');
const Schedule = require.main.require('./models/Schedule.js');

const router = express.Router();

router.post('/semester/:semester/name/:name', function(req, res) {
  const netid = req.session.netid;
  const semester = req.params.semester;
  const name = req.params.name;

  Schedule.createByUserSemesterAndName(netid, semester, name)
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

router.put('/:id/name/:name', function(req, res) {
  const netid = req.session.netid;
  const id = req.params.id;
  const name = req.params.name;

  Schedule.renameByUserAndId(netid, id, name)
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get('/semester/:semester', function(req, res) {
  const user = req.session.netid;
  const semester = req.params.semester;

  Schedule.findByUserAndSemester(user, semester)
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

router.delete('/:schedule', function(req, res) {
  const userId = req.session.netid;
  const id = req.params.schedule;

  Schedule.removeByUserAndId(userId, id)
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get('/:schedule', function(req, res) {
  const userId = req.session.netid;
  const id = req.params.schedule;

  Schedule.findByUserAndId(userId, id)
    .then(function(object) {
      if (!object) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

//should be put
router.put('/:schedule/course/:course', function(req, res) {
  const userId = req.session.netid;
  const id = req.params.schedule;
  const courseId = req.params.course;

  Schedule.addCourseByUserAndId(userId, id, courseId)
    .then(function(object) {
      if (object === null) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

// should be delete
router.delete('/:schedule/course/:course', function(req, res) {
  const userId = req.session.netid;
  const id = req.params.schedule;
  const courseId = req.params.course;

  Schedule.removeCourseByUserAndId(userId, id, courseId)
    .then(function(object) {
      if (object === null) {
        res.sendStatus(404);
        return;
      }

      res.json(object);
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
