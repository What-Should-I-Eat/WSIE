const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RecipeSchema = new Schema({
    id: Number,
    name: String,
    ingredients: String,
    steps: String,
    photo: Buffer,
});

module.exports = mongoose.model('Recipe', RecipeSchema);