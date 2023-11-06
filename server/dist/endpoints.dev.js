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
});
endpoints.post("/search-input", function _callee4(req, res) {
  var recipeInput, savedRecipeInput;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          recipeInput = new RecipeInput({
            input: req.body.input
          });
          _context4.next = 3;
          return regeneratorRuntime.awrap(recipeInput.save());

        case 3:
          savedRecipeInput = _context4.sent;
          res.json(savedRecipeInput);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
endpoints.get("/restriction-input", function _callee5(req, res) {
  var restrictionInputs;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('RestrictionInput').find());

        case 3:
          restrictionInputs = _context5.sent;
          res.json(restrictionInputs);
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
endpoints.post("/restriction-input", function _callee6(req, res) {
  var restrictionInput, savedRestrictionInput;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          restrictionInput = new RestrictionInput({
            input: req.body.input
          });
          _context6.next = 3;
          return regeneratorRuntime.awrap(restrictionInput.save());

        case 3:
          savedRestrictionInput = _context6.sent;
          res.json(savedRestrictionInput);

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
}); //EDAMAM from here on down

endpoints.get('/scrape-recipe', function _callee7(req, res) {
  var recipeLink, source, data;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          recipeLink = req.query.recipeLink;
          source = req.query.source;
          _context7.next = 4;
          return regeneratorRuntime.awrap(determineSite(recipeLink, source, req.query));

        case 4:
          data = _context7.sent;
          console.log("SCRAPED DATA: " + data);
          res.json(data);

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}); //Support methods
//Make this a switch after it works

function determineSite(link, source, request) {
  var data;
  return regeneratorRuntime.async(function determineSite$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("Link in determineSite(): " + link);
          console.log("Source in determineSite() |" + source + "|");
          data = [];
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(getFood52Data(link));

        case 6:
          data = _context8.sent;
          console.log("directions: " + data);
          return _context8.abrupt("return", data);

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](3);
          console.error("Error in determineSite:", _context8.t0);
          throw _context8.t0;

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 11]]);
}

function getFood52Data(link) {
  var response, html, $, recipeDirections;
  return regeneratorRuntime.async(function getFood52Data$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log('Made it to get data. Link = ', link);
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(axios.get(link));

        case 4:
          response = _context9.sent;
          html = response.data;
          $ = cheerio.load(html);
          recipeDirections = []; //CHANGE THIS

          $('.recipe__list.recipe__list--steps li').each(function (index, element) {
            var directionText = $(element).find('span').text().trim().split('\n\n');
            recipeDirections.push(directionText);
          })["catch"](error);
          console.log("recipe directions in getfooddata: " + recipeDirections);
          return _context9.abrupt("return", recipeDirections);

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](1);
          console.error("Error in getFood52Data:", _context9.t0);
          throw _context9.t0;

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

function getSimplyRecipesData(response) {
  var html = response.data;
  var $ = cheerio.load(html);
  var recipeData = {}; //Title of the recipe

  recipeData.title = $('h2.recipe-block__header').text().trim(); //String arrays in JSON data

  recipeData.ingredientList = []; //actual ingredients list

  recipeData.directions = [];
  recipeData.ingredientNames = []; //names of individual ingredients
  //Recipe ingredients and individual ingredient items

  $('ul.structured-ingredients__list li.structured-ingredients__list-item').each(function (index, element) {
    var fullIngredient = $(element).find('p').text().trim();
    var ingredientItem = $(element).find('p [data-ingredient-name]').text().trim();
    recipeData.ingredientList.push(fullIngredient);
    recipeData.ingredientNames.push(ingredientItem);
  }); //Recipe directions

  $('#mntl-sc-block_3-0').each(function (index, element) {
    var directionText = $(element).find('p.mntl-sc-block-html').text().trim().split('\n\n');
    recipeData.directions = recipeData.directions.concat(directionText);
  }); //Some recipes have different html for the ingredients. This scrapes in that case

  if (recipeData.ingredientList.length === 0 || recipeData.ingredientNames.length === 0) {
    console.log("Scraping html the other way");
    $('#ingredient-list_1-0 li.simple-list__item.js-checkbox-trigger.ingredient.text-passage').each(function (index, element) {
      var fullIngredient = $(element).text().trim();

      if (!fullIngredient.startsWith("For the")) {
        recipeData.ingredientList.push(fullIngredient);
        var parts = fullIngredient.split(' ');
        var ingredientName = parts.slice(1).join(' '); // Select all parts except the first one

        recipeData.ingredientNames.push(ingredientName);
      }
    });
  }

  return recipeData;
}

function getBBCData(response) {
  var html = response.data;
  var $ = cheerio.load(html);
  var recipeData = {}; //Title of the recipe
  //recipeData.title = $('h2.recipe-block__header').text().trim();

  recipeData.directions = [];
  $('.recipe__method-steps p').each(function (index, element) {
    var directionText = $(element).find('p').text().trim().split('\n\n');
    recipeData.directions = recipeData.directions.concat(directionText);
  });
  return recipeData;
}

module.exports = endpoints;