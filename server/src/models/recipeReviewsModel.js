const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeReviewSchema = new Schema({
  reviewedRecipeId: String,
  reviewerUsername: String,
  writtenReview: String
});

module.exports = mongoose.model('RecipeReview', recipeReviewSchema);