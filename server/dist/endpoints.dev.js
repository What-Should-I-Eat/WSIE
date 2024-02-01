"use strict";

var express = require("express");

var axios = require("axios");

var cheerio = require('cheerio');

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var cors = require('cors');

var endpoints = express.Router();

var Ingredient = require("./src/models/ingredients_model"); //Need to keep this even though its greyed out


var Restriction = require("./src/models/dietaryRestrictions_model");

var RecipeInput = require("./src/models/recipeSearch_model.js");

var RestrictionInput = require("./src/models/restrictionInput_model.js");

var User = require("./src/models/userModel.js");

var json = require("body-parser/lib/types/json"); //Endpoint Setup


endpoints.use(bodyParser.json()); //express app uses the body parser

endpoints.use(cors()); //-------------------------------------------------------------User Endpoints------------------------------------------------------------
//~~~~~ GET all users

endpoints.get('/users', function _callee(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('User').find());

        case 3:
          users = _context.sent;
          res.json(users);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching users: ', _context.t0);
          res.status(500).json({
            error: 'users - Internal Server Error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //~~~~~ GET specific user by id

endpoints.get('/users/:id', function _callee2(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('User').findById(req.params.id));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 8:
          res.json(user.userName, user.password);

        case 9:
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching unique user: ', _context2.t0);
          res.status(500).json({
            error: 'users - Internal Server Error'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); //~~~~~ POST a new user

endpoints.post("/users/register", function _callee3(req, res) {
  var user, savedUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //WORKS!
          user = new User({
            id: req.body.id,
            fullName: req.body.fullName,
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
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
          _context3.next = 3;
          return regeneratorRuntime.awrap(user.save());

        case 3:
          savedUser = _context3.sent;
          res.json(savedUser);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //~~~~~ DELETE a user

endpoints["delete"]("/users/:id", function _callee4(req, res) {
  var deletedUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('User').findByIdAndDelete(req.params.id));

        case 3:
          deletedUser = _context4.sent;

          if (deletedUser) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 6:
          res.json(deletedUser);
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting user: ', _context4.t0);
          res.status(500).json({
            error: 'Delete user - Internal Server Error'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); //~~~~~ PUT a change in a user's diet array

endpoints.put('/users/:id/diet', function _callee5(req, res) {
  var userId, newDiet, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          //WORKS!
          userId = req.params.id;
          newDiet = req.body.diet; //Array of diet items

          console.log('User ID = ', userId);
          console.log('New diet = ', newDiet);
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(mongoose.model('User').findById(userId));

        case 7:
          user = _context5.sent;

          if (user) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 10:
          user.diet = newDiet;
          _context5.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          res.json(user);
          _context5.next = 20;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](4);
          console.error('Error updating diet: ', _context5.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 16]]);
}); //~~~~~ PUT a change in a user's health array

endpoints.put('/users/:id/health', function _callee6(req, res) {
  var userId, newHealth, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          //WORKS!
          userId = req.params.id;
          newHealth = req.body.health; //Array of health items

          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(mongoose.model('User').findById(userId));

        case 5:
          user = _context6.sent;

          if (user) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 8:
          user.health = newHealth;
          _context6.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.json(user);
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](2);
          console.error('Error updating health: ', _context6.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 14]]);
}); //~~~~~ PUT a change in a user's favorite recipes

endpoints.put('/users/:id/favorites', function _callee7(req, res) {
  var userId, newFavorites, user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          //WORKS!
          userId = req.params.id;
          newFavorites = req.body.favorites; // Array of objects

          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(mongoose.model('User').findById(userId));

        case 5:
          user = _context7.sent;

          if (user) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 8:
          user.favorites = newFavorites;
          _context7.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.json(user);
          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](2);
          console.error('Error updating favorites: ', _context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 14]]);
}); //---------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Original Endpoints--------------------------------------------------------

endpoints.get('/ingredients', function _callee8(req, res) {
  var ingredients;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Ingredient').find());

        case 3:
          ingredients = _context8.sent;
          res.json(ingredients);
          _context8.next = 11;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching ingredients:', _context8.t0);
          res.status(500).json({
            error: 'ingredients - Internal Server Error'
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //returns restrictions

endpoints.get('/restrictions', function _callee9(req, res) {
  var restrictions;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Restriction').find());

        case 3:
          restrictions = _context9.sent;
          res.json(restrictions);
          _context9.next = 11;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error('Error fetching restrictions:', _context9.t0);
          res.status(500).json({
            error: 'restrictions - Internal Server Error'
          });

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //This is where we want to pass a search so that we can see the options for recipes

endpoints.get('/search-simply-recipes/:searchQuery', function _callee10(req, res) {
  var searchQuery, url;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
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
          return _context10.stop();
      }
    }
  });
});
endpoints.post("/search-input", function _callee11(req, res) {
  var recipeInput, savedRecipeInput;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          recipeInput = new RecipeInput({
            input: req.body.input
          });
          _context11.next = 3;
          return regeneratorRuntime.awrap(recipeInput.save());

        case 3:
          savedRecipeInput = _context11.sent;
          res.json(savedRecipeInput);

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
});
endpoints.get("/restriction-input", function _callee12(req, res) {
  var restrictionInputs;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('RestrictionInput').find());

        case 3:
          restrictionInputs = _context12.sent;
          res.json(restrictionInputs);
          _context12.next = 11;
          break;

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          console.error('Error fetching search input:', _context12.t0);
          res.status(500).json({
            error: 'search input - Internal Server Error'
          });

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
endpoints.post("/restriction-input", function _callee13(req, res) {
  var restrictionInput, savedRestrictionInput;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          restrictionInput = new RestrictionInput({
            input: req.body.input
          });
          _context13.next = 3;
          return regeneratorRuntime.awrap(restrictionInput.save());

        case 3:
          savedRestrictionInput = _context13.sent;
          res.json(savedRestrictionInput);

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
}); //---------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Edamam Endpoints----------------------------------------------------------

endpoints.get('/edamam', function _callee14(req, res) {
  var edamamLink;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

        case 1:
        case "end":
          return _context14.stop();
      }
    }
  });
});
endpoints.get('/scrape-recipe', function _callee15(req, res) {
  var recipeLink, source, data;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          recipeLink = req.query.recipeLink;
          source = req.query.source;
          _context15.next = 4;
          return regeneratorRuntime.awrap(determineSite(recipeLink, source));

        case 4:
          data = _context15.sent;
          console.log("SCRAPED DATA: " + data);
          res.json(data);

        case 7:
        case "end":
          return _context15.stop();
      }
    }
  });
}); //Support methods

function determineSite(link, source) {
  var data, scraper, findScraper;
  return regeneratorRuntime.async(function determineSite$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          console.log("Link in determineSite(): " + link);
          console.log("Source in determineSite() |" + source + "|");
          data = [];
          _context16.prev = 3;
          _context16.t0 = source.toLowerCase().trim();
          _context16.next = _context16.t0 === 'food52' ? 7 : _context16.t0 === 'simply recipes' ? 10 : _context16.t0 === 'bbc good food' ? 13 : _context16.t0 === 'martha stewart' ? 16 : _context16.t0 === 'food network' ? 19 : _context16.t0 === 'delish' ? 22 : _context16.t0 === 'eatingwell' ? 25 : 28;
          break;

        case 7:
          //working
          scraper = '.recipe__list.recipe__list--steps li';
          findScraper = 'span';
          return _context16.abrupt("break", 28);

        case 10:
          //working
          scraper = '#mntl-sc-block_3-0';
          findScraper = 'p.mntl-sc-block-html';
          return _context16.abrupt("break", 28);

        case 13:
          //working
          scraper = '.grouped-list li';
          findScraper = 'p';
          return _context16.abrupt("break", 28);

        case 16:
          //working
          scraper = 'div#recipe__steps-content_1-0 p';
          findScraper = '';
          return _context16.abrupt("break", 28);

        case 19:
          //working
          scraper = '.o-Method__m-Body ol';
          findScraper = 'li';
          return _context16.abrupt("break", 28);

        case 22:
          //working but adding weird stuff
          scraper = 'ul.directions li ol';
          findScraper = 'li';
          return _context16.abrupt("break", 28);

        case 25:
          //working
          scraper = 'div#recipe__steps-content_1-0 ol li';
          findScraper = 'p';
          return _context16.abrupt("break", 28);

        case 28:
          _context16.next = 30;
          return regeneratorRuntime.awrap(getRecipeDirectionsFromSource(link, scraper, findScraper));

        case 30:
          data = _context16.sent;
          console.log("directions: " + data);
          return _context16.abrupt("return", data);

        case 35:
          _context16.prev = 35;
          _context16.t1 = _context16["catch"](3);
          console.error("Error in determineSite:", _context16.t1);
          throw _context16.t1;

        case 39:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[3, 35]]);
}

function getRecipeDirectionsFromSource(link, scraper, findScraper) {
  var response, html, $, recipeDirections;
  return regeneratorRuntime.async(function getRecipeDirectionsFromSource$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          console.log("Made it to get data. Link = ".concat(link));
          _context17.prev = 1;
          _context17.next = 4;
          return regeneratorRuntime.awrap(axios.get(link));

        case 4:
          response = _context17.sent;
          html = response.data;
          $ = cheerio.load(html);
          recipeDirections = [];
          $(scraper).each(function (index, element) {
            var directionElement = findScraper ? $(element).find(findScraper) : $(element);
            var directionText = directionElement.text().trim().split('\n\n');
            recipeDirections.push(directionText);
          });
          console.log("Recipe directions: ".concat(recipeDirections));
          return _context17.abrupt("return", recipeDirections);

        case 13:
          _context17.prev = 13;
          _context17.t0 = _context17["catch"](1);
          console.error("Error in scraping recipe directions: ".concat(_context17.t0));
          throw _context17.t0;

        case 17:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

module.exports = endpoints;