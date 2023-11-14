const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const endpoints = express.Router();
const Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out
const Restriction = require("./src/models/dietaryRestrictions_model");
const RecipeInput = require("./src/models/recipeSearch_model.js"); 
const RestrictionInput = require("./src/models/restrictionInput_model.js");
const User = require("./src/models/userModel.js");
const json = require("body-parser/lib/types/json");

//Endpoint Setup
endpoints.use(bodyParser.json()); //express app uses the body parser
endpoints.use(cors());

//-------------------------------------------------------------User Endpoints------------------------------------------------------------

//~~~~~ GET all users
endpoints.get('/users', async (req, res) => { //WORKS!
    try{
      const users = await mongoose.model('User').find();
      res.json(users);
    }
    catch(error){
      console.error('Error fetching users: ', error);
      res.status(500).json({ error: 'users - Internal Server Error' });
    }
});

//~~~~~ POST a new user
endpoints.post("/users", async(req, res) => { //WORKS!
  const user = new User(
    { 
      id: req.body.id,
      fullName: req.body.fullName,
      userName: req.body.username,
      password: req.body.password,
      diet: req.body.diet,
      health: req.body.health,
      favorites: [{
          recipeId: req.body.recipeId,
          recipeName: req.body.recipeName,
          recipeIngredients: req.body.recipeIngredients,
          recipeDirections: req.body.recipeDirections,
          recipeImage: req.body.recipeImage,
          recipeUri: req.body.recipeUri 
      }]
    });
  const savedUser = await user.save();
  res.json(savedUser);
});

//~~~~~ DELETE a user
endpoints.delete("/users/:id", async (req, res) => { //WORKS!
  try {
    const deletedUser = await mongoose.model('User').findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } 
  catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ error: 'Delete user - Internal Server Error' });
  }
});

//~~~~~ PUT a change in a user's diet array
endpoints.put('/users/:id/diet', async (req, res) => { //WORKS!
  const userId = req.params.id;
  const newDiet = req.body.diet; //Array of diet items

  console.log('User ID = ', userId);
  console.log('New diet = ', newDiet);

  try {
      const user = await mongoose.model('User').findById(userId); //check if user actually exists (by _id)
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      user.diet = newDiet;
      await user.save();
      res.json(user);
  } 
  catch (error) {
      console.error('Error updating diet: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ PUT a change in a user's health array
endpoints.put('/users/:id/health', async (req, res) => { //WORKS!
  const userId = req.params.id;
  const newHealth = req.body.health; //Array of health items

  try {
      const user = await mongoose.model('User').findById(userId); //check if user exists
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      user.health = newHealth;
      await user.save();
      res.json(user);
  } 
  catch (error) {
      console.error('Error updating health: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});




//---------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------Original Endpoints--------------------------------------------------------
endpoints.get('/ingredients', async (req, res) => {
    try {
      const ingredients = await mongoose.model('Ingredient').find();
      res.json(ingredients);
    } 
    catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'ingredients - Internal Server Error' });
    }
  });
  
  //returns restrictions
  endpoints.get('/restrictions', async (req, res) => {
    try {
      const restrictions = await mongoose.model('Restriction').find();
      res.json(restrictions);
    } 
    catch (error) {
      console.error('Error fetching restrictions:', error);
      res.status(500).json({ error: 'restrictions - Internal Server Error' });
    }
  });
  
  //This is where we want to pass a search so that we can see the options for recipes
  endpoints.get('/search-simply-recipes/:searchQuery', async (req, res) => {
    const searchQuery = encodeURIComponent(req.params.searchQuery);
    console.log("searchQuery = " + searchQuery);
    
    const url = 'https://www.simplyrecipes.com/search?q=' + searchQuery;
    console.log("searching url: " + url);

    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          const html = response.data; //all html from the page
          const $ = cheerio.load(html);
          const searchResultsSection = $('.comp.search-results-list-1.card-list'); //list of search results
          const items = searchResultsSection.find('.comp.card-list__item'); //each item in the list
          const results = []; //json array to store data
  
          //Iterating through the list of search results
          items.each((index, element) => {
            const title = $(element).find('span.card__title').text().trim(); //Name of the recipe
            const link = $(element).find('.comp.card').attr('href'); //Link to recipe page
            results.push({ title, link });
          });
  
          res.json(results); //json array of recipe names and links 
        } else {
          console.error('Request failed with status code', response.status);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'search - Internal Server Error' });
      });
  });

  endpoints.post("/search-input", async(req, res) => {
    const recipeInput = new RecipeInput({ input: req.body.input });
    const savedRecipeInput = await recipeInput.save();
    res.json(savedRecipeInput);
  });

  endpoints.get("/restriction-input", async (req, res) => {
    try {
      const restrictionInputs = await mongoose.model('RestrictionInput').find();
      res.json(restrictionInputs)
    } 
    catch (error) {
      console.error('Error fetching search input:', error);
      res.status(500).json({ error: 'search input - Internal Server Error' });
    }
  });

  endpoints.post("/restriction-input", async(req, res) => {
    const restrictionInput = new RestrictionInput({ input: req.body.input });
    const savedRestrictionInput = await restrictionInput.save();
    res.json(savedRestrictionInput);
  });
//---------------------------------------------------------------------------------------------------------------------------------------
 
//-------------------------------------------------------------Edamam Endpoints----------------------------------------------------------

  endpoints.get('/edamam', async (req, res) => {
    const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";
    

  });

  endpoints.get('/scrape-recipe', async (req, res) => {
    const recipeLink = req.query.recipeLink; 
    const source = req.query.source;
    
    const data = await determineSite(recipeLink, source);

    console.log("SCRAPED DATA: " + data);
    res.json(data);      
    
});

  //Support methods
  async function determineSite(link, source) {
    console.log("Link in determineSite(): " + link);
    console.log("Source in determineSite() |" + source + "|");

    let data = [];
    let scraper;
    let findScraper;

    try {
      switch(source.toLowerCase().trim()){
        case 'food52': //working
          scraper = '.recipe__list.recipe__list--steps li';
          findScraper = 'span';
          break;
        case 'simply recipes': //working
          scraper = '#mntl-sc-block_3-0';
          findScraper = 'p.mntl-sc-block-html';
          break;
        case 'bbc good food': //working
          scraper = '.grouped-list li';
          findScraper = 'p';
          break;
        case 'martha stewart': //working
          scraper = 'div#recipe__steps-content_1-0 p';
          findScraper = '';
          break;
        case 'food network': //working
          scraper = '.o-Method__m-Body ol';
          findScraper = 'li';
          break;
        case 'delish': //working but adding weird stuff
          scraper = 'ul.directions li ol';
          findScraper = 'li';
          break;
        case 'eatingwell': //working
          scraper = 'div#recipe__steps-content_1-0 ol li';
          findScraper = 'p';
          break;

      }

      data = await getRecipeDirectionsFromSource(link, scraper, findScraper);
      console.log("directions: " + data);
      return data;
    } catch (error) {
        console.error("Error in determineSite:", error);
        throw error;
    }
}

async function getRecipeDirectionsFromSource(link, scraper, findScraper){
  console.log(`Made it to get data. Link = ${link}`);

  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeDirections = [];

    $(scraper).each((index, element) => {
      const directionElement = findScraper ? $(element).find(findScraper) : $(element);
      const directionText = directionElement.text().trim().split('\n\n');
      recipeDirections.push(directionText);
    });

    console.log(`Recipe directions: ${recipeDirections}`);
    return recipeDirections;
  } catch (error) {
    console.error(`Error in scraping recipe directions: ${error}`);
    throw error;
  }
}

module.exports = endpoints;
  