const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeId: String,
  userEmail: String
  // TODO: Add the username of who created
  // TODO: Add the status of the request
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);