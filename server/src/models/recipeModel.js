const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  recipeId: Number,
  recipeName: String,
  recipeIngredients: [String],
  recipeDirections: [String],
  recipeImage: String,
  recipeUri: String,
  recipeSource: String,
  recipeSourceUrl: String,
  recipeServings: { type: Number, default: 0 },
  recipeCalories: { type: Number, default: 0 },
  recipeCaloriesUnits: String,
  recipeCarbs: { type: Number, default: 0 },
  recipeCarbsUnits: String,
  recipeFats: { type: Number, default: 0 },
  recipeFatsUnits: String,
  recipeProtein: { type: Number, default: 0 },
  recipeProteinUnits: String,
  userCreated: { type: Boolean, default: false },
  usernameCreator: { type: String, default: "" },
  isPublished: { type: Boolean, default: false },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
