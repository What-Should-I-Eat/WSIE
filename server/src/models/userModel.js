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
        recipeCalories: Number,
        recipeSource: String,
        recipeSourceUrl: String,
        // Below this line is specific to the user create recipe
        userCreated: Boolean,
        userRecipeImage: {
            recipeImageData: Buffer,
            recipeImageType: String
        },
        recipeCarbs: Number,
        recipeFats: Number,
        recipeProtein: Number,
    }],
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);