// Main script running the server!

// opbeat performance tracking
const opbeat =
  process.env.NODE_ENV === 'production'
    ? require('opbeat').start({
        appId: '001906db99',
        organizationId: 'af6e6dcefd2748bebdabf76661867211',
        secretToken: 'c913876fc23972481c0d507c231527142e6ac929'
      })
    : null;

console.log('Launching...');

const config = require('./config.js');

const path = require('path');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const auth = require('./controllers/auth.js');
const api = require('./controllers/api.js');
const ical = require('./controllers/ical.js');

console.log('Dependencies loaded...');

mongoose.Promise = Promise;
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

/*
if (
  process.env.NODE_ENV === 'production' &&
  config.host !== 'http://localhost:4000'
) {
  // force https
  // https://jaketrent.com/post/https-redirect-node-heroku/
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}*/

// sets session for netids
app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // a day
    name: 'myapp.sid',
    resave: false,
    saveUninitialized: true,
    secret: 'baabaasheep',
    store: store
  })
);

// handles authentication issues
app.use(auth.enforceAuth);

app.use('/auth', auth.router);
app.use('/api', api.router);
app.use('/ical', ical.router);

// production uses static assets from react build
if (process.env.NODE_ENV === 'production') {
  app.use('/client', express.static(path.join(__dirname, 'client', 'build')));

  app.get(['/', '/home', '/course'], function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // otherwise use crude pages

  // landing page
  app.get('/home', function(req, res) {
    res.send(`
    <html>
      <body>
        <h1>Hello!</h1>
        <a href="/auth/login">Leggo</a>
      </body>
    </html>
  `);
  });

  app.get('/', function(req, res) {
    const netid = req.session.netid;

    res.send(`
    <html>
      <body>
        <h1>Ahoy there!</h1>
        <p>Your netid is ${netid}</p>
        <a href="/auth/logout">Click here to logout</a>
      </body>
    </html>
  `);
  });
}

// catch all
// https://stackoverflow.com/questions/19313016/catch-all-route-except-for-login
app.all('*', function(req, res) {
  res.redirect('/home');
});

// Add the Opbeat middleware after your regular middleware
if (process.env.NODE_ENV === 'production') {
  app.use(opbeat.middleware.express());
}

app.listen(config.port, () => {
  console.log(`precourser listening at ${config.host} on port ${config.port}!`);
});
