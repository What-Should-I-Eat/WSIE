const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const endpoints = express.Router();
const Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out
const Restriction = require("./src/models/dietaryRestrictions_model");
const RecipeInput = require("./src/models/recipeSearch_model.js"); 
const RestrictionInput = require("./src/models/restrictionInput_model.js");
const json = require("body-parser/lib/types/json");

//ALL ENDPOINTS
//returns ingredients
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
  
  
  //This scrapes a recipe called tomato soup
  //What we want is 1) the user to first search a recipe (above)
  //2) whatever they click on above is passed here and returned
  endpoints.get('/scrape-recipe', async (req, res) => {
    const link = req.query.recipeLink; //This DOES NOT WORK

    axios.get(link)
    .then((response) => {
      if (response.status === 200) {
        scrapedData = getRecipeData(response);
        res.json(scrapedData)
      
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
  

  endpoints.get('/search-input', async (req, res) => {
    try {
      const searchInputs = await mongoose.model('RecipeInput').find();
      res.json(searchInputs)
    } 
    catch (error) {
      console.error('Error fetching search input:', error);
      res.status(500).json({ error: 'search input - Internal Server Error' });
    }
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





  //Support methods
  function getRecipeData(response){
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeData = {};

    //Title of the recipe
    recipeData.title = $('h2.recipe-block__header').text().trim();

    //String arrays in JSON data
    recipeData.ingredientList = []; //actual ingredients list
    recipeData.directions = [];
    recipeData.ingredientNames = []; //names of individual ingredients
  
    //Recipe ingredients
    $('ul.structured-ingredients__list li.structured-ingredients__list-item').each((index, element) => {
      const ingredientItem = $(element).find('p').text().trim();
      recipeData.ingredientList.push(ingredientItem);
    });
  
  
    //Recipe directions
    $('#mntl-sc-block_3-0').each((index, element) => {
      const directionText = $(element).find('p.mntl-sc-block-html').text().trim().split('\n\n');
      recipeData.directions = recipeData.directions.concat(directionText);
    });

    //Individual ingredient names
    $('ul.structured-ingredients__list li.structured-ingredients__list-item').each((index, element) => {
      const ingredientItem = $(element).find('p [data-ingredient-name]').text().trim();
      recipeData.ingredientNames.push(ingredientItem);
    });
  
    return recipeData;
  }


  
  
  module.exports = endpoints;
  