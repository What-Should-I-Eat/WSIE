var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const fileType = require('file-type');
var path = require('path');
const Recipe = require('../models/Recipe'); // Assuming you have a Recipe model for MongoDB
const BASE_DIR_PATH = "public";

router.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/recipes/recipes.html`));
});
 
router.get('/recipe_details', (_, res) => {
  res.sendFile(path.join(__dirname, `../${BASE_DIR_PATH}/recipes/recipe_details.html`));
});

// Route to get paginated recipes
router.get('/api/recipes', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  try {
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ],
      published: true // Only fetch published recipes
    };

    const totalRecipes = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.json({ totalRecipes, recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch images
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