"use strict";

var express = require("express");

var axios = require("axios");

var cheerio = require('cheerio');

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var cors = require('cors');

var endpoints = express.Router();

var Ingredient = require("../src/models/ingredients_model"); //Need to keep this even though its greyed out


var Restriction = require("../src/models/dietaryRestrictions_model");

var RecipeInput = require("../src/models/recipeSearch_model.js");

var RestrictionInput = require("../src/models/restrictionInput_model.js");

var User = require("../src/models/userModel.js");

var json = require("body-parser/lib/types/json");

var bcrypt = require('bcrypt');

var session = require('express-session'); //Endpoint Setup


endpoints.use(bodyParser.json()); //express app uses the body parser

endpoints.use(cors()); //Session middleware

endpoints.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
})); //~~~~~ POST a new user - WORKS!

endpoints.post("/users/register", function _callee(req, res) {
  var hashedPassword, user, savedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 3:
          hashedPassword = _context.sent;
          user = new User({
            id: req.body.id,
            fullName: req.body.fullName,
            userName: req.body.userName,
            password: hashedPassword,
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
          _context.next = 7;
          return regeneratorRuntime.awrap(user.save());

        case 7:
          savedUser = _context.sent;
          res.json(savedUser);
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error occurred during user registration:', _context.t0);
          res.status(500).json({
            error: 'An error occurred during user registration'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); //~~~~~ POST specific user by user - changed from GET so we could have a body

endpoints.post('/users/find-username', function _callee2(req, res) {
  var user, inputtedPassword, passwordValidated;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            userName: req.body.userName
          }));

        case 3:
          user = _context2.sent;
          inputtedPassword = req.body.password;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(validatePassword(user, inputtedPassword));

        case 10:
          passwordValidated = _context2.sent;

          if (!passwordValidated) {
            _context2.next = 20;
            break;
          }

          console.log("Password is correct!");
          req.session.isLoggedIn = true;
          req.session.userId = user._id;
          req.session.username = user.userName; // Set the cookie

          res.cookie('sessionId', req.session.id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          }); // Return the user object in the response

          return _context2.abrupt("return", res.json(user));

        case 20:
          return _context2.abrupt("return", res.status(401).json({
            error: 'Incorrect password'
          }));

        case 21:
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](7);
          console.error('Error validating password: ', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 27:
          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t1 = _context2["catch"](0);
          console.error('Error fetching unique user: ', _context2.t1);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29], [7, 23]]);
}); //Get user's profile if they're logged in

endpoints.get('/users/profile', function (req, res) {
  var isLoggedIn = req.session.isLoggedIn;
  var userId = req.session.userId;
  var username = req.session.username;
  console.log("Inside /profile endpoint. isLoggedIn = ", isLoggedIn);
  console.log("username = ", username);
  User.findById(userId).then(function (user) {
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    console.log("user (inside endpoint): ", user);
    res.json({
      user: user
    });
  })["catch"](function (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  });
});
endpoints.get('/users/findUserData', function _callee3(req, res) {
  var username, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          username = req.query.username;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            userName: username
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 7:
          res.json(user);
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error('Error finding this username: ', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); //Middleware to check session for endpoints after login/new user

endpoints.use(function (req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
}); //------------------------------------------------------------- ORIGINAL User Endpoints------------------------------------------------------------
//~~~~~ GET all users

endpoints.get('/users', function _callee4(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('User').find());

        case 3:
          users = _context4.sent;
          res.json(users);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching users: ', _context4.t0);
          res.status(500).json({
            error: 'users - Internal Server Error'
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //Find user id by username - WORKS! returns username's id

endpoints.get('/users/findUserId', function _callee5(req, res) {
  var username, user, idNum;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          username = req.query.username; // Access the username from query parameters

          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            userName: username
          }));

        case 4:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 7:
          idNum = user._id;
          res.json(idNum);
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error('Error finding this username: ', _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); //Find user by username - not for login purposes - WORKS!

endpoints.get('/users/finduser/:username', function _callee6(req, res) {
  var username, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          username = req.params.username; // Access the username from query parameters

          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            userName: username
          }));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 7:
          res.json(user);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error('Error finding this username: ', _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); //~~~~~ DELETE a user

endpoints["delete"]("/users/:id", function _callee7(req, res) {
  var deletedUser;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('User').findByIdAndDelete(req.params.id));

        case 3:
          deletedUser = _context7.sent;

          if (deletedUser) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 6:
          res.json(deletedUser);
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.error('Error deleting user: ', _context7.t0);
          res.status(500).json({
            error: 'Delete user - Internal Server Error'
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); //~~~~~ PUT a change in a user's diet array

endpoints.put('/users/diet', function _callee8(req, res) {
  var username, user, newDiet;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          username = req.body.username;
          console.log("Username = ", username);
          _context8.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            userName: username
          }));

        case 5:
          user = _context8.sent;

          if (user) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 8:
          newDiet = req.body.diet;
          user.diet = newDiet;
          _context8.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          res.json(user.diet);
          _context8.next = 19;
          break;

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);
          console.error('Error updating diet: ', _context8.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); //~~~~~ PUT a change in a user's health array

endpoints.put('/users/health', function _callee9(req, res) {
  var username, user, newHealth;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          username = req.body.username;
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            userName: username
          }));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 7:
          newHealth = req.body.health;
          user.health = newHealth;
          _context9.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.json(user);
          _context9.next = 18;
          break;

        case 14:
          _context9.prev = 14;
          _context9.t0 = _context9["catch"](0);
          console.error('Error updating health: ', _context9.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); //~~~~~ PUT a change in a user's favorite recipes

endpoints.put('/users/:id/favorites', function _callee10(req, res) {
  var userId, newFavorites, user;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          //WORKS!
          userId = req.params.id;
          newFavorites = req.body.favorites; // Array of objects

          _context10.prev = 2;
          _context10.next = 5;
          return regeneratorRuntime.awrap(mongoose.model('User').findById(userId));

        case 5:
          user = _context10.sent;

          if (user) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 8:
          user.favorites.push(newFavorites);
          _context10.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.json(user);
          _context10.next = 18;
          break;

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](2);
          console.error('Error updating favorites: ', _context10.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[2, 14]]);
}); //---------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Original Endpoints--------------------------------------------------------

endpoints.get('/ingredients', function _callee11(req, res) {
  var ingredients;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Ingredient').find());

        case 3:
          ingredients = _context11.sent;
          res.json(ingredients);
          _context11.next = 11;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.error('Error fetching ingredients:', _context11.t0);
          res.status(500).json({
            error: 'ingredients - Internal Server Error'
          });

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //returns restrictions

endpoints.get('/restrictions', function _callee12(req, res) {
  var restrictions;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('Restriction').find());

        case 3:
          restrictions = _context12.sent;
          res.json(restrictions);
          _context12.next = 11;
          break;

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12["catch"](0);
          console.error('Error fetching restrictions:', _context12.t0);
          res.status(500).json({
            error: 'restrictions - Internal Server Error'
          });

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); //This is where we want to pass a search so that we can see the options for recipes

endpoints.get('/search-simply-recipes/:searchQuery', function _callee13(req, res) {
  var searchQuery, url;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
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
          return _context13.stop();
      }
    }
  });
});
endpoints.post("/search-input", function _callee14(req, res) {
  var recipeInput, savedRecipeInput;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          recipeInput = new RecipeInput({
            input: req.body.input
          });
          _context14.next = 3;
          return regeneratorRuntime.awrap(recipeInput.save());

        case 3:
          savedRecipeInput = _context14.sent;
          res.json(savedRecipeInput);

        case 5:
        case "end":
          return _context14.stop();
      }
    }
  });
});
endpoints.get("/restriction-input", function _callee15(req, res) {
  var restrictionInputs;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(mongoose.model('RestrictionInput').find());

        case 3:
          restrictionInputs = _context15.sent;
          res.json(restrictionInputs);
          _context15.next = 11;
          break;

        case 7:
          _context15.prev = 7;
          _context15.t0 = _context15["catch"](0);
          console.error('Error fetching search input:', _context15.t0);
          res.status(500).json({
            error: 'search input - Internal Server Error'
          });

        case 11:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
endpoints.post("/restriction-input", function _callee16(req, res) {
  var restrictionInput, savedRestrictionInput;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          restrictionInput = new RestrictionInput({
            input: req.body.input
          });
          _context16.next = 3;
          return regeneratorRuntime.awrap(restrictionInput.save());

        case 3:
          savedRestrictionInput = _context16.sent;
          res.json(savedRestrictionInput);

        case 5:
        case "end":
          return _context16.stop();
      }
    }
  });
}); //---------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------Edamam Endpoints----------------------------------------------------------

endpoints.get('/edamam', function _callee17(req, res) {
  var edamamLink;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

        case 1:
        case "end":
          return _context17.stop();
      }
    }
  });
});
endpoints.get('/scrape-recipe', function _callee18(req, res) {
  var recipeLink, source, data;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          recipeLink = req.query.recipeLink;
          source = req.query.source;
          _context18.next = 4;
          return regeneratorRuntime.awrap(determineSite(recipeLink, source));

        case 4:
          data = _context18.sent;
          console.log("SCRAPED DATA: " + data);
          res.json(data);

        case 7:
        case "end":
          return _context18.stop();
      }
    }
  });
}); //Support methods

function determineSite(link, source) {
  var data, scraper, findScraper;
  return regeneratorRuntime.async(function determineSite$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          console.log("Link in determineSite(): " + link);
          console.log("Source in determineSite() |" + source + "|");
          data = [];
          _context19.prev = 3;
          _context19.t0 = source.toLowerCase().trim();
          _context19.next = _context19.t0 === 'food52' ? 7 : _context19.t0 === 'simply recipes' ? 10 : _context19.t0 === 'bbc good food' ? 13 : _context19.t0 === 'martha stewart' ? 16 : _context19.t0 === 'food network' ? 19 : _context19.t0 === 'delish' ? 22 : _context19.t0 === 'eatingwell' ? 25 : 28;
          break;

        case 7:
          //working
          scraper = '.recipe__list.recipe__list--steps li';
          findScraper = 'span';
          return _context19.abrupt("break", 28);

        case 10:
          //working
          scraper = '#mntl-sc-block_3-0';
          findScraper = 'p.mntl-sc-block-html';
          return _context19.abrupt("break", 28);

        case 13:
          //working
          scraper = '.grouped-list li';
          findScraper = 'p';
          return _context19.abrupt("break", 28);

        case 16:
          //working
          scraper = 'div#recipe__steps-content_1-0 p';
          findScraper = '';
          return _context19.abrupt("break", 28);

        case 19:
          //working
          scraper = '.o-Method__m-Body ol';
          findScraper = 'li';
          return _context19.abrupt("break", 28);

        case 22:
          //working but adding weird stuff
          scraper = 'ul.directions li ol';
          findScraper = 'li';
          return _context19.abrupt("break", 28);

        case 25:
          //working
          scraper = 'div#recipe__steps-content_1-0 ol li';
          findScraper = 'p';
          return _context19.abrupt("break", 28);

        case 28:
          _context19.next = 30;
          return regeneratorRuntime.awrap(getRecipeDirectionsFromSource(link, scraper, findScraper));

        case 30:
          data = _context19.sent;
          console.log("directions: " + data);
          return _context19.abrupt("return", data);

        case 35:
          _context19.prev = 35;
          _context19.t1 = _context19["catch"](3);
          console.error("Error in determineSite:", _context19.t1);
          throw _context19.t1;

        case 39:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[3, 35]]);
}

function getRecipeDirectionsFromSource(link, scraper, findScraper) {
  var response, html, $, recipeDirections;
  return regeneratorRuntime.async(function getRecipeDirectionsFromSource$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          console.log("Made it to get data. Link = ".concat(link));
          _context20.prev = 1;
          _context20.next = 4;
          return regeneratorRuntime.awrap(axios.get(link));

        case 4:
          response = _context20.sent;
          html = response.data;
          $ = cheerio.load(html);
          recipeDirections = [];
          $(scraper).each(function (index, element) {
            var directionElement = findScraper ? $(element).find(findScraper) : $(element);
            var directionText = directionElement.text().trim().split('\n\n');
            recipeDirections.push(directionText);
          });
          console.log("Recipe directions: ".concat(recipeDirections));
          return _context20.abrupt("return", recipeDirections);

        case 13:
          _context20.prev = 13;
          _context20.t0 = _context20["catch"](1);
          console.error("Error in scraping recipe directions: ".concat(_context20.t0));
          throw _context20.t0;

        case 17:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[1, 13]]);
} //Validates password from find-username endpoint


function validatePassword(user, inputtedPassword) {
  return regeneratorRuntime.async(function validatePassword$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          return _context21.abrupt("return", new Promise(function (resolve, reject) {
            bcrypt.compare(inputtedPassword, user.password, function (err, passwordsMatch) {
              if (err) {
                reject(err);
                return;
              }

              if (passwordsMatch) {
                console.log("PASSWORDS MATCH!");
                resolve(true);
              } else {
                resolve(false);
              }
            });
          }));

        case 1:
        case "end":
          return _context21.stop();
      }
    }
  });
}

module.exports = endpoints;