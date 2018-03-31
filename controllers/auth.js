const config = require('../config.js');
const express = require('express');
const CASAuthentication = require('cas');

const casUrl = 'https://fed.princeton.edu/cas/';
const cas = new CASAuthentication({
  base_url: casUrl,
  service: config.host + '/auth/verify'
});

const PUBLIC_PATHS = /\/client\/.*|\/auth\/login|\/auth\/verify|\/home|\/ical\/.*/;

const router = express.Router();

// redirection to Princeton CAS
router.get('/login', function(req, res) {
  res.redirect(casUrl + 'login?service=' + config.host + '/auth/verify');
});

// handle response from Princeton CAS
// automatically redirect to app page
router.get('/verify', function(req, res) {
  // already has a CAS session
  if (req.session.netid) {
    res.redirect('/');
    return;
  }

  // must have ticket from CAS or else return to home
  const ticket = req.query.ticket;
  if (ticket === undefined) {
    res.redirect('/home');
    return;
  }

  // check that ticket is valid
  cas.validate(ticket, function(err, status, netid) {
    if (err || !status || !netid) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // save session
    // https://stackoverflow.com/questions/5883821/node-js-express-session-problem
    req.session.netid = netid;
    req.session.save(function(err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }

      // redirect
      res.redirect('/');
    });
  });
});

// logout from Princeton CAS
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect(casUrl + 'logout?url=' + config.host + '/home');
});

// middleware to enforce authentication
const enforceAuth = function(req, res, next) {
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_USER) {
    req.session.netid = process.env.DEV_USER;
  }

  // if authorized continue with request
  if (req.session.netid) {
    next();
    return;
  }

  // otherwise, make sure it is one of the public paths
  if (PUBLIC_PATHS.test(req.path)) {
    next();
    return;
  }

  // redirect to home for other requests
  res.redirect('/home');
};

module.exports.router = router;
module.exports.enforceAuth = enforceAuth;
