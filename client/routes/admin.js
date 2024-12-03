var express = require('express');
var router = express.Router();
var path = require('path');
const BASE_DIR_PATH = "public";

router.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/admin.html`));
});

router.get('/reported_content', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/reported_content.html`));
});

module.exports = router;