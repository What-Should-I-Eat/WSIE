const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require('cors');
const endpoints = require('./routes/endpoints');
//app.use('/', indexRouter);
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
}));

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