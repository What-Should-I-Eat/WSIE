const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeName: String,
  recipeIngredients: String,
  recipeDirections: String,
  //recipeImage: Number,
  recipeCalories: Number,
  //recipeServings: Number,
  userCreated: Boolean,
  isPublished: Boolean
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);