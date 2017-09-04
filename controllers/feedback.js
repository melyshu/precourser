const config = require('../config.js');
const express = require('express');
const rp = require('request-promise');

const router = express.Router();

router.get('/:feedback', function(req, res) {
  const feedback = req.params.feedback;

  const options = {
    method: 'POST',
    uri:
      'https://docs.google.com/forms/d/e/1FAIpQLSe8rcxHhUEkKIi5BsCBbwnJTsbQovNoO9A-HCFXTE732ZYG0w/' +
      `formResponse?entry.438515020=${encodeURIComponent(feedback)}`
  };

  rp(options)
    .then(function(body) {
      console.log('Success!');
      console.log(body);
      res.send('yay');
    })
    .catch(function(err) {
      console.error('ERROR');
      console.error(err);
      res.send(err.message);
    });
});

module.exports.router = router;
