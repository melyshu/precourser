const config = require('../config.js');
const express = require('express');

const router = express.Router();

// pre-process api responses from req.object
router.use(function(req, res, next) {
  next();

  if (req.object) {
    req.object
      .then(function(object) {
        if (!object) {
          res.sendStatus(404);
          return;
        }

        res.json(object);
      })
      .catch(function(err) {
        console.error(err);
      });
  } else {
    res.sendStatus(418);
  }
});

router.use('/startup', require('./api/startup.js'));
router.use('/semester', require('./api/semester.js'));
router.use('/schedule', require('./api/schedule.js'));
router.use('/course', require('./api/course.js'));
router.use('/save', require('./api/save.js'));
router.use('/instructor', require('./api/instructor.js'));

module.exports.router = router;
