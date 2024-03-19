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
          ingredientData = [];
          restrictionData = [];
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