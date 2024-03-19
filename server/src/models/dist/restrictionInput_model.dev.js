"use strict";

var mongoose = require('mongoose');

var restrictionInputSchema = new mongoose.Schema({
  input: String
});
var RestrictionInput = mongoose.model('RestrictionInput', restrictionInputSchema);
module.exports = RestrictionInput;