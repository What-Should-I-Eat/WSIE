const mongoose = require("mongoose");
const getModel = require('./generic_model.js');

const RestrictionSchema = new mongoose.Schema({
    name: String,
    tags: [String]
});
  
module.exports = getModel('Restriction', RestrictionSchema);