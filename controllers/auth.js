const config = require('../config.js');
const express = require('express');
const CASAuthentication = require('cas');
const User = require('../models/User.js');

const casUrl = 'https://fed.princeton.edu/cas/';
const cas = new CASAuthentication({
  base_url: casUrl,
  service: config.host + '/auth/verify'
});

exports.router = express.Router();

// redirection to Princeton CAS
exports.router.get('/login', function(req, res) {
  // store any redirection in session
  if (typeof(req.query.redirect) === 'string') {
    req.session.redirect = req.query.redirect
  }

  res.redirect(casUrl + 'login?service=' + config.host + req.baseUrl + '/verify');
});

// handle response from Princeton CAS
exports.router.get('/verify', function(req, res) {
  const redirection = req.session.redirect || '/';

  // already has a CAS session
  if (req.session.netid) {
    res.redirect(redirection);
    return;
  }

  // must have ticket from CAS or else return
  const ticket = req.query.ticket;
  if (ticket === undefined) {
    res.redirect(config.host);
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
    req.session.netid = netid;

    // create new user if it doesn't exist
    User.createIfNonexistent(netid).then(function() { // if successful, redirect
      res.redirect(redirection);
    }).catch(function(err) { // error somewhere
      console.error(err);
      res.sendStatus(500);
    });
  });
});

// logout from Princeton CAS
exports.router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect(casUrl + 'logout?url=' + config.host);
});

// check if user is authenticated
exports.userHasAuth = function(req) {
  return req.session.netid;
}

// middleware to enforce authentication
exports.enforceAuth = function(req, res, next) {
  if (req.session.netid) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// middleware to get details of user
exports.loadUser = function(req, res, next) {
  if (!req.session.netid) {
    next();
    return;
  }

  User.findById(req.session.netid).then(function(user) {
    res.locals.user = user;
  }).catch(function(err) {
    console.error(err);
  }).then(function() {
    next();
  });
}
