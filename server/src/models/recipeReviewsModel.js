const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeReviewSchema = new Schema({
  reviewedRecipeId: {type : String, required :true},
  reviewerUsername: {type : String, required :true},
  writtenReview: {type : String, required :true, trim : true},
  reviewReported: { type: Boolean, default: false },
  parentReviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeReview', default: null } 
},{timestamps:true});

module.exports = mongoose.model('RecipeReview', recipeReviewSchema);