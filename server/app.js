const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const endpoints = require('./routes/endpoints');
const session = require('express-session');
const passport = require('./routes/passport');

//app.use('/', indexRouter);
//app.use('/', passport);
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection (ingredients and restrictions)
mongoose.connect('mongodb://db:27017/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//test
app.get("/", (req, res) => {
  res.json({ msg: "data goes here" });
});

app.use('/api/v1', endpoints);

module.exports = app;