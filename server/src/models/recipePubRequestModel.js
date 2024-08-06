const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeName: String,
  recipeImage: Number,
  recipeIngredients: String,
  recipeDirections: String,
  recipeCalories: Number,
  recipeServings: Number
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);