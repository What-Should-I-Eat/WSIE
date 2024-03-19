const mongoose = require('mongoose');

const recipeInputSchema = new mongoose.Schema({
  input: String,
});

const RecipeInput = mongoose.model('RecipeInput', recipeInputSchema);
module.exports = RecipeInput;