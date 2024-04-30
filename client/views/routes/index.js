var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/login', function (req, res, next) {
  // Render login.pug
  res.render('login', { title: 'Login' });
});

// Route to serve login.html from the public directory
router.get('/login-html', function (req, res, next) {
  // TODO: Uncomment 'public/new' for new client
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
  // res.sendFile(path.join(__dirname, 'public/new', 'index.html'));
});

module.exports = router;