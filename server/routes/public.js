const express = require('express');
const publicRouter = express.Router();
const User = require("../src/models/userModel.js");
const Recipe = require("../src/models/recipeModel.js");
const RecipeReview = require("../src/models/recipeReviewsModel.js");
const ContactUs = require("../src/models/contactUsModel.js");
const RecipePubRequest = require("../src/models/recipePubRequestModel.js");
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Success / Error Logs
const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "User not found";

publicRouter.get('/clearDatabase', async (_, res) => {
    try {
        const userDeleted = await User.deleteMany({});
        const recipeDeleted = await Recipe.deleteMany({});
        const contactDeleted = await ContactUs.deleteMany({});
        const recipePubRequestDeleted = await RecipePubRequest.deleteMany({});

        res.json({
            user: userDeleted,
            recipe: recipeDeleted,
            contact: contactDeleted,
            recipePubRequest: recipePubRequestDeleted
        });
    } catch (error) {
        console.log('Error clearing database: ', error);
        res.status(500).json({error: 'error clearing database'});
    }
});

publicRouter.get("/users/getVerificationCode", async (_, res) => {
    try {
        const verificationCode = generateRandomVerificationCode();
        res.json(verificationCode);
    } catch (error) {
        console.error('Error fetching verification code: ', error);
        res.status(500).json({error: INTERNAL_SERVER_ERROR});
    }
});

publicRouter.get('/users/requestInfoForPasswordReset', async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({error: USER_NOT_FOUND_ERROR});
        }

        const forgotUserInfo = {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
        };

        res.json(forgotUserInfo);
    } catch (error) {
        console.error('Error finding this email: ', error);
        return res.status(500).json({error: INTERNAL_SERVER_ERROR});
    }
});

publicRouter.put("/users/changePassword", async (req, res) => {
    try {
        let userToLower = req.body.username.toLowerCase();
        const user = await User.findOne({username: userToLower});

        if (!user) {
            return res.status(404).json({error: USER_NOT_FOUND_ERROR});
        }
        if (!user.verified) {
            return res.status(404).json({error: 'User not validated'});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const passwordUpdate = {$set: {"password": hashedPassword, "incorrectPasswordAttempts": 0}};
        const options = {upsert: true, new: true};

        const updatedPassword = await User.updateOne(user, passwordUpdate, options);
        res.json(updatedPassword);
    } catch (error) {
        console.error('Error changing password: ', error);
        res.status(500).json({error: INTERNAL_SERVER_ERROR});
    }
});

publicRouter.post("/users/getUserEmail", async (req, res) => {
    try {
        let userToLower = req.body.username.toLowerCase();
        const user = await User.findOne({username: userToLower});

        if (!user) {
            return res.status(404).json({error: USER_NOT_FOUND_ERROR});
        }

        res.json(user);
    } catch (error) {
        console.error('Error finding user: ', error);
        res.status(500).json({error: INTERNAL_SERVER_ERROR});
    }
});

publicRouter.get("/recipes", async (_, res) => {
    try {
        const publicRecipes = await Recipe.find({userCreated: true, isPublished: true});
        res.status(200).json(publicRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error occurred getting public user-created recipes"});
    }
});

publicRouter.get('/recipes/get_recipe', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({recipeName: req.query.recipeName});
        if (!recipe) {
            return res.status(404).json({error: `[${req.query.recipeName}] not found`});
        }

        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error trying to get public user recipe'});
    }
});

publicRouter.get("/recipes/get_reviews", async (req, res) => {
    try {
        const recipeId = req.query.recipeId;

        if (!recipeId) {
            return res.status(400).json({error: "Missing recipeId parameter"});
        }

        const rootReviews = await RecipeReview.find({
            reviewedRecipeId: recipeId,
            parentReviewId: null,
            reviewReported: false,
        }).lean();

        const allReplies = await RecipeReview.find({
            reviewedRecipeId: recipeId,
            parentReviewId: {$exists: true, $ne: null},
            reviewReported: false,
        }).lean();
        const repliesMap = {};
        allReplies.forEach((reply) => {
            const parentId = reply.parentReviewId.toString();
            if (!repliesMap[parentId]) {
                repliesMap[parentId] = [];
            }
            repliesMap[parentId].push(reply);
        });

        const structuredReviews = rootReviews.map((review) => ({
            ...review,
            replies: repliesMap[review._id.toString()] || [],
        }));

        res.status(200).json(structuredReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({error: "Internal server error trying to get reviews"});
    }
});

function generateRandomVerificationCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

publicRouter.post('/recipes/:id/like', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({error: 'Recipe not found'});

        const userId = req.body.userId;

        // Initialize arrays if undefined
        recipe.likedBy = recipe.likedBy || [];
        recipe.dislikedBy = recipe.dislikedBy || [];

        if (userId !== 'guest') {
            if (recipe.likedBy.includes(userId)) {
                return res.status(400).json({message: 'You have already liked this recipe.'});
            }

            // If user had disliked previously, remove the dislike
            if (recipe.dislikedBy.includes(userId)) {
                recipe.dislikes -= 1;
                recipe.dislikedBy = recipe.dislikedBy.filter(id => id !== userId);
            }

            recipe.likedBy.push(userId);
        }

        recipe.likes += 1;
        await recipe.save();

        res.json({likes: recipe.likes, dislikes: recipe.dislikes});
    } catch (error) {
        console.error('Error liking recipe:', error);
        res.status(500).json({error: 'Failed to like recipe'});
    }
});

publicRouter.post('/recipes/:id/dislike', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({error: 'Recipe not found'});

        const userId = req.body.userId;

        // Initialize arrays if undefined
        recipe.likedBy = recipe.likedBy || [];
        recipe.dislikedBy = recipe.dislikedBy || [];

        if (userId !== 'guest') {
            if (recipe.dislikedBy.includes(userId)) {
                return res.status(400).json({message: 'You have already disliked this recipe.'});
            }

            // If user had liked previously, remove the like
            if (recipe.likedBy.includes(userId)) {
                recipe.likes -= 1;
                recipe.likedBy = recipe.likedBy.filter(id => id !== userId);
            }

            recipe.dislikedBy.push(userId);
        }

        recipe.dislikes += 1;
        await recipe.save();

        res.json({likes: recipe.likes, dislikes: recipe.dislikes});
    } catch (error) {
        console.error('Error disliking recipe:', error);
        res.status(500).json({error: 'Failed to dislike recipe'});
    }
});

// // --- Favorites Counter Endpoint ---

publicRouter.get('/recipes/favorites-count', async (req, res) => {
    try {
        const {recipeName} = req.query;

        if (!recipeName) {
            return res.status(400).json({error: 'Recipe name is required'});
        }

        const usersWithFavorites = await User.find({favorites: {$exists: true, $ne: []}})
            .populate('favorites', 'name')
            .select('favorites'); // We only need the favorites field

        const allFavorites = usersWithFavorites.flatMap(user =>
            user.favorites.map(recipe => recipe.name)
        );

        const favoritesCount = allFavorites.filter(name => name === recipeName).length;

        res.json({recipeName, favoritesCount});
    } catch (error) {
        console.error("Error counting recipe favorites:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


module.exports = publicRouter;


module.exports = publicRouter;
