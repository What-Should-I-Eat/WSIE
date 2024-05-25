var express = require('express');
var router = express.Router();

router.get('/signout', function (req, res) {
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(function (cookie) {
      var parts = cookie.split('=');
      res.cookie(parts[0].trim(), '', { expires: new Date(0) });
    });
  }

  res.json({ success: true });
});

module.exports = router;
