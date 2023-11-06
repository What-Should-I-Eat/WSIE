"use strict";

var mongoose = require('mongoose');

var Ingredient = require('./src/models/ingredients_model.js');

var Restriction = require('./src/models/dietaryRestrictions_model.js');

var mongoUrl = 'mongodb://db/WSIE'; // Matches the service name in docker-compose.yml
// Function to insert JSON data into the database

function insertData() {
  var ingredientData, restrictionData;
  return regeneratorRuntime.async(function insertData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 3:
          ingredientData = [{
            "name": "milk",
            "tags": [{
              "restrictions": ["a-milk", "low sugar"],
              "alternatives": ["coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "coconut milk",
            "tags": [{
              "restrictions": ["a-treenut", "low calorie"],
              "alternatives": ["milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "almond milk",
            "tags": [{
              "restrictions": ["a-treenut", "high calorie", "a-almond"],
              "alternatives": ["milk", "coconut milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "oat milk",
            "tags": [{
              "restrictions": ["a-oat", "high calorie"],
              "alternatives": ["milk", "coconut milk", "almond milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "soy milk",
            "tags": [{
              "restrictions": ["a-soy", "low sugar"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "rice milk",
            "tags": [{
              "restrictions": ["low sugar", "high carb"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "cashew milk",
            "tags": [{
              "restrictions": ["a-treenut", "a-cashew"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "pea milk"]
            }]
          }, {
            "name": "pea milk",
            "tags": [{
              "restrictions": ["a-legume", "a-pea", "high calcium"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk"]
            }]
          }, {
            "name": "greek yogurt",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["coconut cream", "silken tofu"]
            }]
          }, {
            "name": "yogurt",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["coconut cream", "silken tofu"]
            }]
          }, {
            "name": "beer",
            "tags": [{
              "restrictions": ["a-wheat"],
              "alternatives": ["chicken broth"]
            }]
          }, {
            "name": "bread crumbs",
            "tags": [{
              "restrictions": ["a-wheat"],
              "alternatives": ["ground oats"]
            }]
          }, {
            "name": "butter",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["margarine", "shortening"]
            }]
          }, {
            "name": "buttermilk",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["lemon juice and unsweetened dairy-free milk beverage"]
            }]
          }, {
            "name": "chocolate",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["unsweetened cocoa with shortening"]
            }]
          }, {
            "name": "cottage cheese",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["dairy free cottage cheese"]
            }]
          }, {
            "name": "cream",
            "tags": [{
              "restrictions": ["a-milk"],
              "alternatives": ["coconut cream"]
            }]
          }, {
            "name": "egg",
            "tags": [{
              "restrictions": ["a-egg"],
              "alternatives": ["pureed silken tofu"]
            }]
          }, {
            "name": "cashews",
            "tags": [{
              "restrictions": ["a-treenut"],
              "alternatives": ["silken tofu"]
            }]
          }, {
            "name": "almonds",
            "tags": [{
              "restrictions": ["a-treenut"],
              "alternatives": ["pumpkin seeds"]
            }]
          }, {
            "name": "hazlenut",
            "tags": [{
              "restrictions": ["a-treenut"],
              "alternatives": ["pumpkin seeds"]
            }]
          }, {
            "name": "pistachio",
            "tags": [{
              "restrictions": ["a-treenut"],
              "alternatives": ["pumpkin seeds"]
            }]
          }, {
            "name": "peanut butter",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["cookie butter", "sunflower seed butter", "tahini"]
            }]
          }, {
            "name": "peanuts",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["sunflower seeds", "chickpeas"]
            }]
          }, {
            "name": "peanut oil",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["vegetable oil"]
            }]
          }, {
            "name": "peanut chip",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["chocolate chips"]
            }]
          }, {
            "name": "peanut flour",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["flour"]
            }]
          }, {
            "name": "peanut sauce",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["tahini"]
            }]
          }, {
            "name": "szechuan sauce",
            "tags": [{
              "restrictions": ["a-peanut"],
              "alternatives": ["sriracha sauce with 1 tbsp sugar"]
            }]
          }];
          restrictionData = [{
            "name": "a-peanut",
            "tags": ["peanuts", "peanut butter", "peanut oil", "peanut chip", "peanut flour", "peanut meal", "peanut sauce", "szechuan sauce"]
          }, {
            "name": "a-milk",
            "tags": ["milk", "yogurt", "greek yogurt", "cheese", "cream", "buttercream", "butter", "whey", "buttermilk", "chocolate", "cottage cheese"]
          }, {
            "name": "a-eggs",
            "tags": ["egg"]
          }, {
            "name": "a-fish",
            "tags": ["fish", "cod", "salmon", "tuna", "trout", "mahi", "sardines", "bass", "sea bass", "pollock", "char", "tilapia", "snapper", "anchovies", "haddock", "flounder", "catfish", "halibut", "swordfish", "branzino"]
          }, {
            "name": "a-shellfish",
            "tags": ["shrimp", "prawn", "crab", "lobster", "clam", "mussels", "oyster", "scallop", "octopus", "squid", "abalone", "snail", "escargot"]
          }, {
            "name": "a-treenut",
            "tags": ["almond", "Brazil nut", "cashew", "hazelnut", "pistachio", "pecan", "walnut", "macadamia", "pine nut"]
          }, {
            "name": "a-wheat",
            "tags": ["wheat", "wheat flour", "bread crumbs", "bulgur", "couscous", "farina", "pasta", "semolina", "wheat bran", "wheat protein", "wheat flour", "whole wheat", "glucose syrup", "tortilla", "dough", "soy sauce", "cereal"]
          }, {
            "name": "a-soy",
            "tags": ["soy", "edamame", "soybean", "soymilk", "miso", "natto", "soy sauce", "tamari", "tempeh", "teriyaki", "tofu"]
          }];
          _context.next = 7;
          return regeneratorRuntime.awrap(Ingredient.insertMany(ingredientData));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Restriction.insertMany(restrictionData));

        case 9:
          console.log('Data inserted successfully.');
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error inserting data:', _context.t0);

        case 15:
          _context.prev = 15;
          mongoose.connection.close();
          return _context.finish(15);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12, 15, 18]]);
}

insertData();