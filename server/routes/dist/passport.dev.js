"use strict";

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');

var User = require('../src/models/userModel');

passport.use(new LocalStrategy(function _callee(username, password, done) {
  var user, validPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 3:
          user = _context.sent;

          if (user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'Username not found.'
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 8:
          validPassword = _context.sent;

          if (validPassword) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'Incorrect password.'
          }));

        case 11:
          return _context.abrupt("return", done(null, user));

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(_context.t0));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function _callee2(id, done) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(id));

        case 3:
          user = _context2.sent;
          done(null, user);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          done(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = passport;