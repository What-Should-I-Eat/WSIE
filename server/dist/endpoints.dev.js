"use strict";

var express = require("express");

var axios = require("axios");

var cheerio = require('cheerio');

var mongoose = require("mongoose");

var endpoints = express.Router();

var Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out


var Restriction = require("./src/models/dietaryRestrictions_model");

var RecipeInput = require("./src/models/recipeSearch_model.js");

var RestrictionInput = require("./src/models/restrictionInput_model.js");

var json = require("body-parser/lib/types/json"); //ALL ENDPOINTS
//returns ingredients


endpoints.get('/ingredients', function _callee(req, res) {
  var ingredients;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Ingredient').find());

        case 3:
          ingredients = _context.sent;
          res.json(ingredients);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching ingredients:', _context.t0);
          res.status(500).json({
            error: 'ingredients - Internal Server Error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //returns restrictions

endpoints.get('/restrictions', function _callee2(req, res) {
  var restrictions;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Restriction').find());

        case 3:
          restrictions = _context2.sent;
          res.json(restrictions);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching restrictions:', _context2.t0);
          res.status(500).json({
            error: 'restrictions - Internal Server Error'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //This is where we want to pass a search so that we can see the options for recipes

endpoints.get('/search-simply-recipes/:searchQuery', function _callee3(req, res) {
  var searchQuery, url;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          searchQuery = encodeURIComponent(req.params.searchQuery);
          console.log("searchQuery = " + searchQuery);
          url = 'https://www.simplyrecipes.com/search?q=' + searchQuery;
          console.log("searching url: " + url);
          axios.get(url).then(function (response) {
            if (response.status === 200) {
              var html = response.data; //all html from the page

              var $ = cheerio.load(html);
              var searchResultsSection = $('.comp.search-results-list-1.card-list'); //list of search results

              var items = searchResultsSection.find('.comp.card-list__item'); //each item in the list

              var results = []; //json array to store data
              //Iterating through the list of search results

              items.each(function (index, element) {
                var title = $(element).find('span.card__title').text().trim(); //Name of the recipe

                var link = $(element).find('.comp.card').attr('href'); //Link to recipe page

                results.push({
                  title: title,
                  link: link
                });
              });
              res.json(results); //json array of recipe names and links 
            } else {
              console.error('Request failed with status code', response.status);
              res.status(500).json({
                error: 'Internal Server Error'
              });
            }
          })["catch"](function (error) {
            console.error('Error:', error);
            res.status(500).json({
              error: 'search - Internal Server Error'
            });
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //This scrapes a recipe called tomato soup
//What we want is 1) the user to first search a recipe (above)
//2) whatever they click on above is passed here and returned

endpoints.get('/scrape-recipe', function _callee4(req, res) {
  var link;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          link = req.query.recipeLink; //This DOES NOT WORK

          axios.get(link).then(function (response) {
            if (response.status === 200) {
              scrapedData = getRecipeData(response);
              res.json(scrapedData);
            } else {
              console.error('Request failed with status code', response.status);
              res.status(500).json({
                error: 'Internal Server Error'
              });
            }
          })["catch"](function (error) {
            console.error('Error:', error);
            res.status(500).json({
              error: 'search - Internal Server Error'
            });
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
endpoints.get('/search-input', function _callee5(req, res) {
  var searchInputs;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('RecipeInput').find());

        case 3:
          searchInputs = _context5.sent;
          res.json(searchInputs);
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error('Error fetching search input:', _context5.t0);
          res.status(500).json({
            error: 'search input - Internal Server Error'
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
endpoints.post("/search-input", function _callee6(req, res) {
  var recipeInput, savedRecipeInput;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          recipeInput = new RecipeInput({
            input: req.body.input
          });
          _context6.next = 3;
          return regeneratorRuntime.awrap(recipeInput.save());

        case 3:
          savedRecipeInput = _context6.sent;
          res.json(savedRecipeInput);

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
});
endpoints.get("/restriction-input", function _callee7(req, res) {
  var restrictionInputs;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('RestrictionInput').find());

        case 3:
          restrictionInputs = _context7.sent;
          res.json(restrictionInputs);
          _context7.next = 11;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.error('Error fetching search input:', _context7.t0);
          res.status(500).json({
            error: 'search input - Internal Server Error'
          });

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
endpoints.post("/restriction-input", function _callee8(req, res) {
  var restrictionInput, savedRestrictionInput;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          restrictionInput = new RestrictionInput({
            input: req.body.input
          });
          _context8.next = 3;
          return regeneratorRuntime.awrap(restrictionInput.save());

        case 3:
          savedRestrictionInput = _context8.sent;
          res.json(savedRestrictionInput);

        case 5:
        case "end":
          return _context8.stop();
      }
    }
  });
}); //Support methods

function getRecipeData(response) {
  var html = response.data;
  var $ = cheerio.load(html);
  var recipeData = {}; //Title of the recipe

  recipeData.title = $('h2.recipe-block__header').text().trim(); //String arrays in JSON data

  recipeData.ingredientList = []; //actual ingredients list

  recipeData.directions = [];
  recipeData.ingredientNames = []; //names of individual ingredients
  //Recipe ingredients

  $('ul.structured-ingredients__list li.structured-ingredients__list-item').each(function (index, element) {
    var ingredientItem = $(element).find('p').text().trim();
    recipeData.ingredientList.push(ingredientItem);
  }); //Recipe directions

  $('#mntl-sc-block_3-0').each(function (index, element) {
    var directionText = $(element).find('p.mntl-sc-block-html').text().trim().split('\n\n');
    recipeData.directions = recipeData.directions.concat(directionText);
  }); //Individual ingredient names

  $('ul.structured-ingredients__list li.structured-ingredients__list-item').each(function (index, element) {
    var ingredientItem = $(element).find('p [data-ingredient-name]').text().trim();
    recipeData.ingredientNames.push(ingredientItem);
  });
  return recipeData;
}

module.exports = endpoints;