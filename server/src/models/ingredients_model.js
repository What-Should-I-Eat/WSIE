const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    _id: Number,
    name: String,
    tags: [
      {
        restrictions: [String],
        attributes: [String],
        alternatives: [String],
      },
    ],
  });
  
module.exports = mongoose.model('Ingredient', IngredientSchema);