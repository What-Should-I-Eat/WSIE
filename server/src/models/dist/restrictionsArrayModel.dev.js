"use strict";

var mongoose = require('mongoose');

var restrictionsArrayModel = new mongoose.Schema({
  input: String
});
var RecipeInput = mongoose.model('RecipeInput', recipeInputSchema);
module.exports = RecipeInput;