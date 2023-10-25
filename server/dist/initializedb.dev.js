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
              "restrictions": ["dairy free", "low sugar", "allergy dairy"],
              "attributes": ["high calorie", "high protein", "gluten free"],
              "alternatives": ["coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "coconut milk",
            "tags": [{
              "restrictions": ["allergy tree nut", "low calorie", "allergy coconut"],
              "attributes": ["high calorie", "high fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "almond milk",
            "tags": [{
              "restrictions": ["allergy tree nut", "high calorie", "allergy almond"],
              "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "coconut milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "oat milk",
            "tags": [{
              "restrictions": ["allergy oat", "high calorie"],
              "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "coconut milk", "almond milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "soy milk",
            "tags": [{
              "restrictions": ["allergy soy", "low sugar"],
              "attributes": ["low calorie", "high fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "rice milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "rice milk",
            "tags": [{
              "restrictions": ["allergy rice", "low sugar", "high carb"],
              "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "cashew milk", "pea milk"]
            }]
          }, {
            "name": "cashew milk",
            "tags": [{
              "restrictions": ["allergy tree nut", "allergy cashew"],
              "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "pea milk"]
            }]
          }, {
            "name": "pea milk",
            "tags": [{
              "restrictions": ["allergy legume", "allergy pea", "high calcium"],
              "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free", "high protein"],
              "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk"]
            }]
          }, {
            "name": "greek yogurt",
            "tags": [{
              "restrictions": ["a-milk", "lactose-intolerance"],
              "attributes": [],
              "alternatives": ["coconut cream", "silken tofu"]
            }]
          }, {
            "name": "yogurt",
            "tags": [{
              "restrictions": ["a-milk", "lactose-intolerance"],
              "attributes": [],
              "alternatives": ["coconut cream", "silken tofu"]
            }]
          }];
          restrictionData = [{
            "name": "a-peanut",
            "tags": ["peanut", "peanut butter", "peanut oil", "peanut chip", "peanut flour", "peanut meal", "peanut sauce", "szechuan sauce"]
          }, {
            "name": "a-milk",
            "tags": ["milk", "yogurt", "greek yogurt", "cheese", "cream", "buttercream", "butter", "whey"]
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
          }, {
            "name": "lactose-intolerance",
            "tags": ["milk", "yogurt", "greek yogurt", "cheese", "cream", "buttercream", "butter", "whey"]
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