// Main script running the server!

console.log("Launching...");

const config = require("./config.js");

const Promise = require("bluebird");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const auth = require("./controllers/auth.js");
const api = require("./controllers/api.js");

console.log("Dependencies loaded...");

mongoose.Promise = Promise;
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // a day
    name: "myapp.sid",
    resave: false,
    saveUninitialized: true,
    secret: "baabaasheep",
    store: store
  })
);

app.use(auth.loadUser);

app.use("/auth", auth.router);
app.use("/api", api.router);

app.get("/", function(req, res) {
  res.send(`
    <html>
      <body>
        <h1>Hello!</h1>
        <a href="/app">Leggo</a>
      </body>
    </html>
  `);
});

app.get("/app", function(req, res) {
  if (!auth.userHasAuth(req)) {
    res.redirect("/auth/login?redirect=" + req.originalUrl);
    return;
  }

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

app.listen(config.port, () => {
  console.log(`testserver listening on port ${config.port}!`);
});
