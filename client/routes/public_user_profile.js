var express = require('express');
var router = express.Router();
var path = require('path');
const BASE_DIR_PATH = "public";

router.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/public_user_profile.html`));
});

module.exports = router;
