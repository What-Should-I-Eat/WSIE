"use strict";

var mongoose = require('mongoose');

var recipeInputSchema = new mongoose.Schema({
  input: String
});
var RecipeInput = mongoose.model('RecipeInput', recipeInputSchema);
module.exports = RecipeInput;