const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipePubRequestSchema = new Schema({
  recipeId: String,
  userEmail: String,
  usernameCreator:{type: String,default:"Anonymous"}
  // TODO: Add the status of the request
});

module.exports = mongoose.model('RecipePubRequest', recipePubRequestSchema);