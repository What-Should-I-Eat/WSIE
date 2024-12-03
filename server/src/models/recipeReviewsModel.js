const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeReviewSchema = new Schema({
  reviewedRecipeId: String,
  reviewerUsername: String,
  writtenReview: String,
  reviewReported: {type: Boolean, default: false}
});

module.exports = mongoose.model('RecipeReview', recipeReviewSchema);