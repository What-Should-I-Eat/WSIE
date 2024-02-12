"use strict";

var express = require('express');

var passport = require('passport');

var User = require('../models/user');

var router = express.Router();
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));
router.post('/register', function _callee(req, res) {
  var user, savedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user = new User({
            id: req.body.id,
            fullName: req.body.fullName,
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            diet: req.body.diet,
            health: req.body.health,
            favorites: [{
              recipeId: req.body.recipeId,
              recipeName: req.body.recipeName,
              recipeIngredients: req.body.recipeIngredients,
              recipeDirections: req.body.recipeDirections,
              recipeImage: req.body.recipeImage,
              recipeUri: req.body.recipeUri
            }]
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(user.save());

        case 4:
          savedUser = _context.sent;
          res.json(savedUser);
          setTimeout(function () {
            res.send('<script>window.location.href = "/login";</script>');
          }, 3000); //3 seconds

          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error saving user:', _context.t0);
          res.status(500).json({
            error: 'An error occurred while saving user'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;