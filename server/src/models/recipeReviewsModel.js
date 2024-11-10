const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeReviewSchema = new Schema({
  recipeId: String,
  reviewerUSername: String,
  writtenReview: String
});

module.exports = mongoose.model('RecipeReview', recipeReviewSchema);