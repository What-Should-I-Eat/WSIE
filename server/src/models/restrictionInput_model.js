const mongoose = require('mongoose');

const restrictionInputSchema = new mongoose.Schema({
  input: String,
});

const RestrictionInput = mongoose.model('RestrictionInput', restrictionInputSchema);
module.exports = RestrictionInput;