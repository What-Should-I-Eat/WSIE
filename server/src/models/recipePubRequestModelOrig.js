const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeName: String,
  recipeIngredients: String,
  recipeDirections: String,
  recipeNutrition: String,
  recipeImage: String,
  userCreated: Boolean
  // TODO: Add the username of who created
  // TODO: Add the status of the request
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);