"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session"); // Moved session require here

var indexRouter = require('./routes/index');

var app = express(); // Initialize Express app

// Set up session middleware before routes
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS in production
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login Page'
  });
});

// Route to serve login.html
app.get('/login-html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Your verify-account route
app.put("/verify-account", async function (req, res) {
  const { username, verificationCode } = req.body;

  if (!username || !verificationCode) {
    return res.status(400).json({ error: "Username and verification code are required." });
  }

  try {
    // Replace this with your actual verification logic
    const isValid = await verifyAccount(username, verificationCode); // Ensure this function is defined

    if (!isValid) {
      return res.status(401).json({ error: "Invalid verification code." });
    }

    // Auto-login logic (set session)
    req.session.user = { username }; // Session middleware must be initialized before this route

    return res.status(200).json({
      message: "Account verified and logged in successfully."
    });
  } catch (error) {
    console.error("Error during account verification:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;