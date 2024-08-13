const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeName: String,
  recipeIngredients: String,
  recipeDirections: String,
  recipeNutrition: String,
  recipeImage: String,
  userCreated: Boolean
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);