const mongoose = require("mongoose");
const getModel = require("./generic_model.js");

const IngredientSchema = new mongoose.Schema({
    name: String,
    tags: [
      {
        restrictions: [String],
        attributes: [String],
        alternatives: [String],
      },
    ],
  });
  
module.exports = getModel('Ingredient', IngredientSchema);