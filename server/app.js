const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out
const Restriction = require("./src/models/dietaryRestrictions_model");

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (ingredients and restrictions)
mongoose.connect('mongodb://db:27017/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//test
app.get("/", (req, res) => {
  res.json({ msg: "data goes here" });
});

//returns ingredients
app.get('/api/v1/ingredients', async (req, res) => {
  try {
    const ingredients = await mongoose.model('Ingredient').find();
    res.json(ingredients);
  } 
  catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//returns restrictions
app.get('/api/v1/restrictions', async (req, res) => {
  try {
    const restrictions = await mongoose.model('Restriction').find();
    res.json(restrictions);
  } 
  catch (error) {
    console.error('Error fetching restrictions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Scraper route - this is for a specific recipe. Need to change so this passes a search
app.get('/api/v1/scrape-foodnetwork', async (req, res) => {
  try {
    //the response variable is what needs to be changed - pass something to this
    const response = await axios.get('https://www.foodnetwork.com/recipes/giada-de-laurentiis/chicken-florentine-style-recipe-1942850');

    //getRecipeData() is our generic method. no changes needed for that when passing a different type of recipe
    scrapedData = getRecipeData(response);
    res.json(scrapedData)
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data.' });
  }
});

//DO NOT CHANGE THIS - this is called for the food network route. the food network URI is passed when it's called
function getRecipeData(response){
    const html = response.data;
    const $ = cheerio.load(html);
    const scrapedData = {};
  //All of this scraped data contains /ns and random spaces so we're getting rid of all of them in these
    //Title of the recipe
    scrapedData.title = $('.o-AssetTitle__a-Headline').text().replace(/\n/g, '').trim();

    //Recipe ingredients
    scrapedData.ingredients = [];
    $('.o-Ingredients__a-Ingredient').each((index, element) => {
      const ingredientText = $(element).text();
      const cleanedIngredient = ingredientText.replace(/\n/g, '').trim();
      if (cleanedIngredient !== 'Deselect All') {
        scrapedData.ingredients.push(cleanedIngredient);
      }
    });

    //Recipe directions
    scrapedData.directions = [];
    $('.o-Method__m-Step').each((index, element) => {
      const directionText = $(element).text().trim();
      scrapedData.directions.push(directionText);
    });

    return scrapedData;
}

module.exports = app;
