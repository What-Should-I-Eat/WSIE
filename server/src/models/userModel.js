const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    id: Number,
    fullName: String,
    userName: String,
    password: String,
    diet: [String],
    health: [String],
    favorites: [{
        recipeId: Number,
        recipeName: String,
        recipeIngredients: [String],
        recipeDirections: [String],
        recipeImage: String,
        recipeUri: String
    }],
});
  
module.exports = mongoose.model('User', UserSchema);