var express = require('express');
var router = express.Router();
var path = require('path');
const BASE_DIR_PATH = "public/new";

router.get('/signout', function (req, res) {
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(function (cookie) {
      var parts = cookie.split('=');
      res.cookie(parts[0].trim(), '', { expires: new Date(0) });
    });
  }

  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/index.html`));
});

module.exports = router;
