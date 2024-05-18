var express = require('express');
var router = express.Router();
var path = require('path');
const BASE_DIR_PATH = "public/new";

router.get('/my_dietary', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/account/my_dietary.html`));
});

router.get('/my_recipes', (_, res) => {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/account/my_recipes.html`));
});

router.get('/profile', (_, res) => {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/account/profile.html`));
});

module.exports = router;