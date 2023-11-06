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

 
//EDAMAM from here on down

  endpoints.get('/scrape-recipe', async (req, res) => {
    const recipeLink = req.query.recipeLink; 
    const source = req.query.source;
    
    const data = await determineSite(recipeLink, source, req.query);

    console.log("SCRAPED DATA: " + data);
    res.json(data);      
    
});

  
  //Support methods

  //Make this a switch after it works
  async function determineSite(link, source, request) {
    console.log("Link in determineSite(): " + link);
    console.log("Source in determineSite() |" + source + "|");

    let data = [];

    try {

      switch(source.toLowerCase().trim())
      {
        case 'food52':
          data = await getFood52Data(link);
          break;
        case 'simply recipes':
          data = await getSimplyRecipesData(link);
          break;
      }

      console.log("directions: " + data);
      return data;

        // data = await getFood52Data(link);
        // console.log("directions: " + data);
        // return data;
    } catch (error) {
        console.error("Error in determineSite:", error);
        throw error;
    }

    
}

  async function getFood52Data(link) {
    console.log('Made it to get data in food52. Link = ', link);
    try {
      // Fetch the HTML content from the provided URL
      const response = await axios.get(link);
      const html = response.data;

      const $ = cheerio.load(html);
      const recipeDirections = [];

      //CHANGE THIS
      $('.recipe__list.recipe__list--steps li').each((index, element) => {
          const directionText = $(element).find('span').text().trim().split('\n\n');
          recipeDirections.push(directionText);
      });

      console.log("recipe directions in getfooddata: " + recipeDirections);
      return recipeDirections;
    } catch (error) {
        console.error("Error in getFood52Data:", error);
        throw error; 
    }
}

async function getSimplyRecipesData(link){
  console.log('Made it to get data in simply recipes. Link = ', link);
    try {
      // Fetch the HTML content from the provided URL
      const response = await axios.get(link);
      const html = response.data;

      const $ = cheerio.load(html);
      const recipeDirections = [];

      //CHANGE THIS
      $('#mntl-sc-block_3-0').each((index, element) => {
        const directionText = $(element).find('p.mntl-sc-block-html').text().trim().split('\n\n');
        recipeDirections.push(directionText);
      });

      console.log("recipe directions in getfooddata: " + recipeDirections);
      return recipeDirections;
    } catch (error) {
        console.error("Error in getFood52Data:", error);
        throw error; 
    }
}


  async function getSimplyRecipesData1(response){
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeData = {};

    //Title of the recipe
    recipeData.title = $('h2.recipe-block__header').text().trim();

    //String arrays in JSON data
    recipeData.ingredientList = []; //actual ingredients list
    recipeData.directions = [];
    recipeData.ingredientNames = []; //names of individual ingredients
  
    //Recipe ingredients and individual ingredient items
    $('ul.structured-ingredients__list li.structured-ingredients__list-item').each((index, element) => {
      const fullIngredient = $(element).find('p').text().trim();
      const ingredientItem = $(element).find('p [data-ingredient-name]').text().trim();
      recipeData.ingredientList.push(fullIngredient);
      recipeData.ingredientNames.push(ingredientItem);
    });
  
    //Recipe directions
    $('#mntl-sc-block_3-0').each((index, element) => {
      const directionText = $(element).find('p.mntl-sc-block-html').text().trim().split('\n\n');
      recipeData.directions = recipeData.directions.concat(directionText);
    });

    //Some recipes have different html for the ingredients. This scrapes in that case
    if(recipeData.ingredientList.length === 0 || recipeData.ingredientNames.length === 0)
    {
      console.log("Scraping html the other way");
      $('#ingredient-list_1-0 li.simple-list__item.js-checkbox-trigger.ingredient.text-passage').each((index, element) => {
        const fullIngredient = $(element).text().trim();

        if (!fullIngredient.startsWith("For the")) {
          recipeData.ingredientList.push(fullIngredient);
          const parts = fullIngredient.split(' ');
          const ingredientName = parts.slice(1).join(' '); // Select all parts except the first one
          recipeData.ingredientNames.push(ingredientName);
        }
      });


    }
    return recipeData;
  }

  function getBBCData(response){
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeData = {};

    //Title of the recipe
    //recipeData.title = $('h2.recipe-block__header').text().trim();
    recipeData.directions = [];

    $('.recipe__method-steps p').each((index, element) => {
      const directionText = $(element).find('p').text().trim().split('\n\n');
      recipeData.directions = recipeData.directions.concat(directionText);
    });

    return recipeData;
  }


  
  
  module.exports = endpoints;
  