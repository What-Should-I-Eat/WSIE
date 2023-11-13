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

endpoints.get('/edamam', function _callee7(req, res) {
  var edamamLink;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
});
endpoints.get('/scrape-recipe', function _callee8(req, res) {
  var recipeLink, source, data;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          recipeLink = req.query.recipeLink;
          source = req.query.source;
          _context8.next = 4;
          return regeneratorRuntime.awrap(determineSite(recipeLink, source));

        case 4:
          data = _context8.sent;
          console.log("SCRAPED DATA: " + data);
          res.json(data);

        case 7:
        case "end":
          return _context8.stop();
      }
    }
  });
}); //Support methods

function determineSite(link, source) {
  var data, scraper, findScraper;
  return regeneratorRuntime.async(function determineSite$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Link in determineSite(): " + link);
          console.log("Source in determineSite() |" + source + "|");
          data = [];
          _context9.prev = 3;
          _context9.t0 = source.toLowerCase().trim();
          _context9.next = _context9.t0 === 'food52' ? 7 : _context9.t0 === 'simply recipes' ? 10 : _context9.t0 === 'bbc good food' ? 13 : _context9.t0 === 'martha stewart' ? 16 : _context9.t0 === 'food network' ? 19 : _context9.t0 === 'delish' ? 22 : _context9.t0 === 'eatingwell' ? 25 : 28;
          break;

        case 7:
          //working
          scraper = '.recipe__list.recipe__list--steps li';
          findScraper = 'span';
          return _context9.abrupt("break", 28);

        case 10:
          //working
          scraper = '#mntl-sc-block_3-0';
          findScraper = 'p.mntl-sc-block-html';
          return _context9.abrupt("break", 28);

        case 13:
          //working
          scraper = '.grouped-list li';
          findScraper = 'p';
          return _context9.abrupt("break", 28);

        case 16:
          //working
          scraper = 'div#recipe__steps-content_1-0 p';
          findScraper = '';
          return _context9.abrupt("break", 28);

        case 19:
          //working
          scraper = '.o-Method__m-Body ol';
          findScraper = 'li';
          return _context9.abrupt("break", 28);

        case 22:
          //working but adding weird stuff
          scraper = 'ul.directions li ol';
          findScraper = 'li';
          return _context9.abrupt("break", 28);

        case 25:
          //working
          scraper = 'div#recipe__steps-content_1-0 ol li';
          findScraper = 'p';
          return _context9.abrupt("break", 28);

        case 28:
          _context9.next = 30;
          return regeneratorRuntime.awrap(getRecipeDirectionsFromSource(link, scraper, findScraper));

        case 30:
          data = _context9.sent;
          console.log("directions: " + data);
          return _context9.abrupt("return", data);

        case 35:
          _context9.prev = 35;
          _context9.t1 = _context9["catch"](3);
          console.error("Error in determineSite:", _context9.t1);
          throw _context9.t1;

        case 39:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[3, 35]]);
}

function getRecipeDirectionsFromSource(link, scraper, findScraper) {
  var response, html, $, recipeDirections;
  return regeneratorRuntime.async(function getRecipeDirectionsFromSource$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log("Made it to get data. Link = ".concat(link));
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(axios.get(link));

        case 4:
          response = _context10.sent;
          html = response.data;
          $ = cheerio.load(html);
          recipeDirections = [];
          $(scraper).each(function (index, element) {
            var directionElement = findScraper ? $(element).find(findScraper) : $(element);
            var directionText = directionElement.text().trim().split('\n\n');
            recipeDirections.push(directionText);
          });
          console.log("Recipe directions: ".concat(recipeDirections));
          return _context10.abrupt("return", recipeDirections);

        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](1);
          console.error("Error in scraping recipe directions: ".concat(_context10.t0));
          throw _context10.t0;

        case 17:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

module.exports = endpoints;