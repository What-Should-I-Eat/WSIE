var express = require('express');
var router = express.Router();
var path = require('path');
const BASE_DIR_PATH = "public/new";

router.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/about.html`));
});

module.exports = router;