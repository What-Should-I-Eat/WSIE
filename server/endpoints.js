const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const endpoints = express.Router();
const Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out
const Restriction = require("./src/models/dietaryRestrictions_model");
const json = require("body-parser/lib/types/json");

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
  //Currently it's hard coded to tomato soup but that will change
  endpoints.get('/scrape-recipe', async (req, res) => {
    try {
      //the response variable is what needs to be changed - pass something to this
      const response = await axios.get('https://www.simplyrecipes.com/recipes/tomato_soup/');
  
      //getRecipeData() is our generic method. no changes needed for that when passing a different type of recipe
      scrapedData = getRecipeData(response);
      res.json(scrapedData)
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'recipe - Internal server error.' });
    }
  });
  
  function getRecipeData(response){
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeData = {};
    //Title of the recipe
    recipeData.title = $('h2.recipe-block__header').text().trim();
  
    //Recipe ingredients
    recipeData.ingredients = [];
    $('ul.structured-ingredients__list li.structured-ingredients__list-item').each((index, element) => {
      const ingredientItem = $(element).find('p').text().trim();
      recipeData.ingredients.push(ingredientItem);
    });
  
  
    //Recipe directions
    recipeData.directions = [];
    $('#mntl-sc-block_3-0-1, #mntl-sc-block_3-0-7, #mntl-sc-block_3-0-13, #mntl-sc-block_3-0-18').each((index, element) => {
      const directionText = $(element).find('p.mntl-sc-block-html').text().trim();
      recipeData.directions.push(directionText);
    });
  
    return recipeData;
  }
  
  
  //DO NOT CHANGE THIS - this is called for the food network route. the food network URI is passed when it's called
  function getRecipeData1(response){
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
  
  module.exports = endpoints;
  