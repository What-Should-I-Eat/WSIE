"use strict";

var express = require("express");

var mongoose = require("mongoose");

var app = express();

var session = require('express-session');

var bodyParser = require("body-parser");

var cors = require('cors');

var endpoints = require('./routes/endpoints'); //app.use('/', indexRouter);
//app.use('/', passport);


app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
})); // MongoDB connection (ingredients and restrictions)

mongoose.connect('mongodb://db:27017/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //test

app.get("/", function (req, res) {
  res.json({
    msg: "data goes here"
  });
});
app.use('/api/v1', endpoints);
module.exports = app;