"use strict";

var mongoose = require("mongoose");

var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  id: Number,
  fullName: String,
  userName: String,
  password: String,
  email: String,
  diet: [String],
  health: [String],
  favorites: [{
    recipeId: Number,
    recipeName: String,
    recipeIngredients: [String],
    recipeDirections: [String],
    recipeImage: String,
    recipeUri: String
  }]
});

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);