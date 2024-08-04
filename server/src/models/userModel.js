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
        // TODO: Add units
        recipeCalories: Number,
        recipeSource: String,
        recipeSourceUrl: String,
        userCreated: Boolean,
        userRecipeImage: {
            recipeImageData: Buffer,
            recipeImageType: String
        },
        recipeServings: Number,
        // TODO: Add units
        recipeCarbs: Number,
        // TODO: Add units
        recipeFats: Number,
        // TODO: Add units
        recipeProtein: Number,
    }],
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);