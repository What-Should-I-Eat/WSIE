var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const fileType = require('file-type');
var path = require('path');
const BASE_DIR_PATH = "public";

router.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/recipes/recipes.html`));
});

router.get('/recipe_details', (_, res) => {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/recipes/recipe_details.html`));
});

router.get('/get_edamam_image', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const type = await fileType.fromBuffer(buffer);
    const imageType = type ? type.mime : 'application/octet-stream';
    const base64Image = buffer.toString('base64');
    res.json({ base64Image, imageType });
  } catch (error) {
    console.error("Error occurred fetching image", error);
    res.status(500).json({ error: "Error occurred fetching image" });
  }
});

module.exports = router;