"use strict";

var express = require('express');

var auth = express.Router;
auth.get('/login', function (req, res, next) {
  res.render('login');
});
module.exports = auth;