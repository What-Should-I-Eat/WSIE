"use strict";

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var User = require('../src/models/userModel'); // Adjust with your user model


passport.use(new LocalStrategy(function _callee(username, password, done) {
  var user;
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

          if (!(!user || !user.validPassword(password))) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'Invalid username or password'
          }));

        case 6:
          return _context.abrupt("return", done(null, user));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(_context.t0));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
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