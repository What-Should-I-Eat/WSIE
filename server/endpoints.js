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
  