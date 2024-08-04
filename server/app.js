const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require('cors');

const contactUsRouter = require('./routes/contact');
const scrapeRouter = require('./routes/scrape');
const publicRouter = require('./routes/public');
const privateRouter = require('./routes/private');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Public Session
app.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

// Default Endpoint
app.get("/", (_, res) => {
  res.json({ msg: "What Should I Eat? REST API Home Page" });
});

// Server API Public Endpoints
app.use('/api/v1', publicRouter);
app.use('/api/v1', scrapeRouter);
app.use('/api/v1/contact', contactUsRouter);

// Private Session
app.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

// Server API Private Endpoints
app.use('/api/v1', privateRouter);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error!");
});

module.exports = app;
