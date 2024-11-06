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
    isAdmin: Boolean,
    diet: [String],
    health: [String],
    // Reference by Id
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
