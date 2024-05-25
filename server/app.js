const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

const endpointsRouter = require('./routes/endpoints');

// Default Endpoint
app.get("/", (_, res) => {
  res.json({ msg: "What Should I Eat? REST API Home Page" });
});

// Server API Endpoints
app.use('/api/v1', endpointsRouter);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error!");
});

module.exports = app;