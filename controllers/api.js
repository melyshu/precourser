const config = require('../config.js');
const express = require('express');

const router = express.Router();
const auth = require('./auth.js');

// require authentication
// router.use(auth.enforceAuth);
router.use(function(req, res, next) {
  req.session.netid = 'mshu'; // for testing
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
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(418);
  }
});

router.use('/startup', require('./api/startup.js'));
router.use('/semester', require('./api/semester.js'));
router.use('/course', require('./api/course.js'));
router.use('/instructor', require('./api/instructor.js'));
router.use('/save', require('./api/save.js'));
router.use('/schedule', require('./api/schedule.js'));

module.exports.router = router;
