const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: Number,
    fullName: String,
    username: String,
    password: String,
    email: String,
    verified: Boolean,
    verificationCode: String,
    verificationCodeTimestamp: Date,
    incorrectPasswordAttempts: Number,
    incorrectPasswordAttemptTime: Date,
    diet: [String],
    health: [String],
    favorites: [{
        recipeId: Number,
        recipeName: String,
        recipeIngredients: [String],
        recipeDirections: [String],
        recipeImage: String,
        recipeUri: String,
        recipeSource: String,
        recipeSourceUrl: String,
        recipeServings: Number,
        recipeCalories: Number,
        recipeCaloriesUnits: String,
        recipeCarbs: Number,
        recipeCarbsUnits: String,
        recipeFats: Number,
        recipeFatsUnits: String,
        recipeProtein: Number,
        recipeProteinUnits: String,
        userCreated: Boolean,
        isPublished: Boolean,
        pubRequested: Boolean,
    }],
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);