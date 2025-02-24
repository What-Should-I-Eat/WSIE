const express = require('express');
const privateRouter = express.Router();
const User = require("../src/models/userModel.js");
const Recipe = require("../src/models/recipeModel.js");
const RecipePubRequest = require("../src/models/recipePubRequestModel.js");
const RecipeReview = require("../src/models/recipeReviewsModel.js");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
const fileType = require('file-type');

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "User not found";

const SUCCESSFULLY_FAVORITE_RECIPE = "Successfully favorited recipe";
const UNABLE_TO_FAVORITE_UNEXPECTED_ERROR = "Error occurred trying to favorite recipe";
const SUCCESSFULLY_UNFAVORITE_RECIPE = "Successfully un-favorited recipe";
const UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR = "Error occurred trying to un-favorite recipe";
const SUCCESSFULLY_CREATED_RECIPE = "Successfully created recipe";
const UNABLE_TO_CREATE_RECIPE_ERROR = "Error occurred trying to create recipe";
const SUCCESSFULLY_UPDATED_RECIPE = "Successfully updated recipe";
const UNABLE_TO_UPDATE_RECIPE_ERROR = "Error occurred trying to update recipe";
const SUCCESSFULLY_DELETED_RECIPE = "Successfully deleted recipe";
const UNABLE_TO_DELETE_RECIPE_ERROR = "Error occurred deleting user created recipe";
const RECIPE_PUBLISHED_APPROVE = "Recipe Has Been Approved";
const RECIPE_PUBLISHED_DENY = "Recipe Has Been Denied";
const RECIPE_REPORTED = "Recipe Has Been Reported";
const REVIEW_REPORTED = "Review Has Been Reported";
const REVIEW_UN_REPORTED = "Review Has Been Republished";
const REVIEW_DELETED = "Review Has Been Deleted";
const RECIPE_PUBLISHED_USER_REMOVAL = "Recipe Has Been Removed";
const SUCCESSFULLY_DELETED_RECIPE_REQUEST = "Successfully deleted recipe request";
const UNABLE_TO_DELETE_RECIPE_REQUEST_ERROR = "Error occurred deleting recipe publish request";
const UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR = "Error occurred trying to update publish status";
const UNABLE_TO_REPORT_RECIPE_ERROR = "Error occurred trying to report recipe";
const UNABLE_TO_REPORT_REVIEW_ERROR = "Error occurred trying to report review";
const SUCCESSFULLY_UPDATED_ADMIN_STATE = "Successfully updated user admin capabilities";
const UNABLE_TO_UPDATE_REVIEW_STATUS_ERROR = "Error occurred trying to update review status";

privateRouter.post("/users/register", async (req, res) => {
  try {
    const userToLower = req.body.username.toLowerCase();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUsernameCheck = await User.findOne({ username: userToLower });
    const existingEmailCheck = await User.findOne({ email: req.body.email });
    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);

    if (existingUsernameCheck) {
      return res.status(444).json({ error: 'User already exists' });
    }
    if (existingEmailCheck) {
      return res.status(445).json({ error: 'Email already exists' });
    }

    const user = new User({
      ...req.body,
      username: userToLower,
      password: hashedPassword,
      verificationCode: hashedVerificationCode,
      verificationCodeTimestamp: new Date(),
      verified: false,
      incorrectPasswordAttempts: 0,
      incorrectPasswordAttemptTime: new Date()
    });

    const savedUser = await user.save();
    console.log(`Successfully created User: [${req.body.fullName}] with Username: [${userToLower}]`);
    res.json(savedUser);
  } catch (error) {
    console.error('Error occurred during user registration:', error);
    res.status(500).json({ error: 'An error occurred during user registration' });
  }
});

privateRouter.put("/users/verify", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const isCodeValid = await validateVerificationCode(user, req.body.verificationCode);
    if (!isCodeValid) {
      return res.status(401).json({ error: 'Incorrect verification code' });
    }
    if (hasTenMinutesPassed(user.verificationCodeTimestamp)) {
      return res.status(437).json({ error: 'Code has expired' });
    }
    const verifiedUser = await User.updateOne(user, { $set: { verified: true } }, { upsert: true, new: true });
 
    // Create session and set cookies
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    req.session.username = user.username;
     
    res.cookie('sessionId', req.session.id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie('username', req.session.username, { maxAge: 24 * 60 * 60 * 1000 });
     
    
    res.json(verifiedUser);
  } catch (error) {
    console.error('Error fetching unique user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.put("/users/resendVerificationCode", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);
    const updatedCode = await User.updateOne(
      user,
      { $set: { verificationCode: hashedVerificationCode, verificationCodeTimestamp: new Date() } },
      { upsert: true, new: true }
    );
    res.json(updatedCode);
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.post('/users/find-username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    if (!user.verified) {
      return res.status(450).json({ error: 'User account is not verified' });
    }

    if ((user.incorrectPasswordAttempts === 5 && !hasTenMinutesPassed(user.incorrectPasswordAttemptTime)) || user.incorrectPasswordAttempts >= 10) {
      return res.status(user.incorrectPasswordAttempts >= 10 ? 453 : 452).json({ error: user.incorrectPasswordAttempts >= 10 ? 'Must reset password' : '10 minute lockout' });
    }

    const passwordValidated = await validatePassword(user, req.body.password);
    if (passwordValidated) {
      await User.updateOne(user, { $set: { incorrectPasswordAttempts: 0 } }, { upsert: true, new: true });

      req.session.isLoggedIn = true;
      req.session.userId = user._id;
      req.session.username = user.username;

      res.cookie('sessionId', req.session.id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.cookie('username', req.session.username, { maxAge: 24 * 60 * 60 * 1000 });

      console.log(`[${user.username}] successfully signed in.`);
      res.json(user);
    } else {
      const updatedAttempts = user.incorrectPasswordAttempts + 1;
      await User.updateOne(user, { $set: { incorrectPasswordAttempts: updatedAttempts, incorrectPasswordAttemptTime: new Date() } }, { upsert: true, new: true });

      console.log(updatedAttempts);
      return res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error validating password: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.get('/users/profile', (req, res) => {
  User.findById(req.session.userId)
    .populate('favorites')
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
      }
      res.json({ user });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    });
});

privateRouter.get("/check-auth", (req, res) => {
  if (req.session && req.session.isLoggedIn) {
      return res.json({ isLoggedIn: true, username: req.session.username });
  } else {
      return res.json({ isLoggedIn: false });
  }
});


privateRouter.get('/users/findUserData', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username.toLowerCase() }).populate('favorites');
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    res.json(user);
  } catch (error) {
    console.error('Error finding this username: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.post('/users/updateBio', async (req, res) => {
  try {
    const { username, bio } = req.body;

    if (!username || !bio) {
      return res.status(400).json({ error: "Username and bio are required" });
    }

    if (bio.length > 500) {
      return res.status(400).json({ error: "Bio exceeds character limit of 500" });
    }

    const user = await User.findOneAndUpdate(
      { username: username.toLowerCase() },
      { $set: { bio } },  
      { new: true, upsert: true }  
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, bio: user.bio });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

privateRouter.post('/users/updateProfileImage', async (req, res) => {
  try {
    const { username, profileImage } = req.body;

    if (!username || !profileImage) {
      return res.status(400).json({ error: "Username and profile image are required" });
    }

    const user = await User.findOneAndUpdate(
      { username: username.toLowerCase() },
      { $set: { profileImage } },  
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, profileImage: user.profileImage });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// NOTE: Endpoints about this line are not necessarily 'private' in the sense you need //
// a session and a session userId. It is more so that this file in general stores      //
// session initialization data while public does note                                  //
/////////////////////////////////////////////////////////////////////////////////////////
privateRouter.use((req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

privateRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('favorites');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

privateRouter.get('/users/findUserId', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    res.json(user._id);
  } catch (error) {
    console.error('Error finding this username: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.put('/users/diet', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    user.diet = req.body.diet;
    await user.save();

    console.log(`Updated diet for user: [${req.body.username.toLowerCase()}]`);
    res.json(user.diet);
  } catch (error) {
    console.error('Error updating diet: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.put('/users/health', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    user.health = req.body.health;
    await user.save();

    console.log(`Updated health for user: [${req.body.username.toLowerCase()}]`);
    res.json(user);
  } catch (error) {
    console.error('Error updating health: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.post('/users/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const recipe = await Recipe.findOne({ recipeName: req.body.favorites.recipeName });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const alreadyFavorited = user.favorites.includes(recipe._id);
    res.json(alreadyFavorited);
  } catch (error) {
    console.error("Error occurred checking if recipe is a favorite", error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.put('/users/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    let recipe = await Recipe.findOne({ recipeName: req.body.favorites.recipeName });
    if (!recipe) {
      recipe = await new Recipe(req.body.favorites).save();
    }

    if (user.favorites.includes(recipe._id)) {
      return res.status(409).json({ error: "Recipe already in favorites" });
    }

    user.favorites.push(recipe._id);
    await user.save();

    res.status(200).json({ message: SUCCESSFULLY_FAVORITE_RECIPE, user });
  } catch (error) {
    console.error(UNABLE_TO_FAVORITE_UNEXPECTED_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_FAVORITE_UNEXPECTED_ERROR });
  }
});

privateRouter.delete('/users/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const recipe = await Recipe.findOne({ recipeName: req.body.favorites.recipeName });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    user.favorites.pull(recipe._id);
    await user.save();

    const isRecipeFavoritedByOthers = await User.exists({ favorites: recipe._id });
    if (!isRecipeFavoritedByOthers) {
      await recipe.deleteOne();
    }

    res.status(200).json({ message: SUCCESSFULLY_UNFAVORITE_RECIPE, user });
  } catch (error) {
    console.error(UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR });
  }
});

privateRouter.put('/users/:id/change_admin_state', async (req, res) => {
  try {
    const modification = req.body.isAdmin;
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    await User.updateOne(user, { $set: { isAdmin: modification } });
    res.status(200).json({ message: SUCCESSFULLY_UPDATED_ADMIN_STATE });
  } catch (error) {
    console.error('Error updating user admin status: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

privateRouter.put("/users/profile/update_details", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const updatedFullName = await User.updateOne(user, { $set: { fullName: `${req.body.firstName} ${req.body.lastName}` } }, { upsert: true, new: true });
    if (!updatedFullName) {
      return res.status(400).json({ error: "Error occurred trying to update user details" });
    }

    res.status(200).json(updatedFullName);
  } catch (error) {
    console.error("Error occurred trying to update user details", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user details" });
  }
});

privateRouter.put("/users/profile/update_email", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const updatedEmail = await User.updateOne(user, { $set: { email: req.body.email } }, { upsert: true, new: true });
    if (!updatedEmail) {
      return res.status(400).json({ error: "Error occurred trying to update user email" });
    }

    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error("Error occurred trying to update user email", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user email" });
  }
});

privateRouter.put("/users/profile/update_password", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const passwordValidated = await validatePassword(user, req.body.originalPassword);
    if (!passwordValidated) {
      return res.status(400).json({ error: "Original password entered does not match existing. Failed to update user password" });
    }

    if (await validatePassword(user, req.body.newPassword)) {
      return res.status(400).json({ error: "Passwords are identical - nothing to update" });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    const updatedPassword = await User.updateOne(user, { $set: { password: hashedPassword, incorrectPasswordAttempts: 0 } }, { upsert: true, new: true });
    if (!updatedPassword) {
      return res.status(500).json({ error: "Error occurred trying to update user password" });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    console.error("Error occurred trying to update user password", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user password" });
  }
});

privateRouter.post('/users/:id/recipe/create_recipe', upload.single('userRecipeImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const existingRecipe = await Recipe.findOne({ recipeName: req.body.recipeName, usernameCreator: user.username });
    if (existingRecipe) {
      return res.status(409).json({ error: "Recipe already exists" });
    }

    let newRecipeData = {
      ...req.body,
      recipeServings: req.body.recipeServings || 1,
      recipeCalories: req.body.recipeCalories || 0,
      recipeCarbs: req.body.recipeCarbs || 0,
      recipeFats: req.body.recipeFats || 0,
      recipeProtein: req.body.recipeProtein || 0,
      userCreated: true,
      usernameCreator: user.username,
      isPublished: false,
      pubRequested: false,
      reported: false
    };

    if (req.file && req.file.buffer) {
      const type = await fileType.fromBuffer(req.file.buffer);
      const imageType = type ? type.mime : 'application/octet-stream';
      const base64Image = req.file.buffer.toString('base64');
      newRecipeData.recipeImage = `data:${imageType};base64,${base64Image}`;
    }

    const newRecipe = await new Recipe(newRecipeData).save();
    user.favorites.push(newRecipe._id);
    await user.save();

    res.status(200).json({ message: SUCCESSFULLY_CREATED_RECIPE, user });
  } catch (error) {
    console.error(UNABLE_TO_CREATE_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_CREATE_RECIPE_ERROR });
  }
});

privateRouter.get('/users/:id/recipe/get_recipe', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const matchingRecipe = user.favorites.find(recipe => recipe.recipeName === req.query.recipeName && recipe.usernameCreator === user.username);
    if (!matchingRecipe) {
      return res.status(404).json({ error: `[${req.query.recipeName}] not found` });
    }

    res.json(matchingRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error trying to get user recipe' });
  }
});

privateRouter.delete('/users/:id/recipe/delete_recipe', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const recipe = await Recipe.findOne({ recipeName: req.body.favorites.recipeName, usernameCreator: user.username });
    if (!recipe) {
      return res.status(404).json({ error: `[${req.body.favorites.recipeName}] not found` });
    }

    user.favorites.pull(recipe._id);
    await user.save();

    const isRecipeFavoritedByOthers = await User.exists({ favorites: recipe._id });
    if (!isRecipeFavoritedByOthers) {
      await recipe.deleteOne();
    }

    res.status(200).json({ message: SUCCESSFULLY_DELETED_RECIPE });
  } catch (error) {
    console.error(UNABLE_TO_DELETE_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_DELETE_RECIPE_ERROR });
  }
});

privateRouter.put('/users/:id/recipe/update_recipe', upload.single('userRecipeImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    let recipeObjectId = new mongoose.Types.ObjectId(req.body.recipeObjectId);

    let recipe = await Recipe.findOne({ _id: recipeObjectId, usernameCreator: user.username });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    let updatedRecipeData = {
      ...req.body,
      recipeServings: req.body.recipeServings || 1,
      recipeCalories: req.body.recipeCalories || 0,
      recipeCarbs: req.body.recipeCarbs || 0,
      recipeFats: req.body.recipeFats || 0,
      recipeProtein: req.body.recipeProtein || 0,
      isPublished: false,
      pubRequested: false,
      reported: false
    };

    if (req.file && req.file.buffer) {
      const type = await fileType.fromBuffer(req.file.buffer);
      const imageType = type ? type.mime : 'application/octet-stream';
      const base64Image = req.file.buffer.toString('base64');
      updatedRecipeData.recipeImage = `data:${imageType};base64,${base64Image}`;
    }

    Object.assign(recipe, updatedRecipeData);
    await recipe.save();

    res.status(200).json({ message: SUCCESSFULLY_UPDATED_RECIPE, recipe });
  } catch (error) {
    console.error(UNABLE_TO_UPDATE_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UPDATE_RECIPE_ERROR });
  }
});

privateRouter.post('/users/:id/recipe/request_publish', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const recipe = await Recipe.findOne({ recipeName: req.body.favorites.recipeName, usernameCreator: user.username });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const publishRequest = new RecipePubRequest({
      recipeId: recipe._id,
      userEmail: user.email
    });

    const savedRequest = await publishRequest.save();
    if (savedRequest) {
      recipe.pubRequested = true;
      const updatedRecipe = await recipe.save();

      if (updatedRecipe) {
        res.status(200).json({ success: "Successfully sent a request to publish the recipe. If accepted, your recipe will be published." });
      } else {
        return res.status(500).json({ error: "Error occurred trying to update pub request" });
      }
    } else {
      res.status(500).json({ error: "Error occurred sending publish request message." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred sending publish request message." });
  }
});

privateRouter.get('/recipes/get_requested_recipe', async (req, res) => {
  try {
    let recipeObjectId = new mongoose.Types.ObjectId(req.query.recipeId);

    let recipe = await Recipe.findOne({ _id: recipeObjectId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error trying to get recipe' });
  }
});

privateRouter.put('/recipes/publish_review', async (req, res) => {
  try {
    let recipeObjectId = new mongoose.Types.ObjectId(req.query.recipeId);

    let recipe = await Recipe.findOne({ _id: recipeObjectId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updatedIsPub = await Recipe.updateOne(recipe, { $set: { isPublished: req.body.favorites.isPublished, pubRequested: req.body.favorites.pubRequested, reported: false} }, { upsert: true, new: true });
    
    if (!updatedIsPub) {
      return res.status(400).json({ error: "Error occurred trying to update publish status" });
    }

    if(req.body.favorites.isPublished){
      res.status(200).json({ message: RECIPE_PUBLISHED_APPROVE, recipe });
    }else{
      res.status(200).json({ message: RECIPE_PUBLISHED_DENY, recipe });
    }
  } catch (error) {
    console.error(UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR });
  }
});

privateRouter.put('/recipes/remove_publish', async (req, res) => {
  try {
    let recipeObjectId = new mongoose.Types.ObjectId(req.query.recipeId);

    let recipe = await Recipe.findOne({ _id: recipeObjectId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updatedIsPub = await Recipe.updateOne(recipe, { $set: { isPublished: req.body.favorites.isPublished, pubRequested: req.body.favorites.pubRequested} }, { upsert: true, new: true });
    
    if (!updatedIsPub) {
      return res.status(400).json({ error: "Error occurred trying to update publish status" });
    }

    res.status(200).json({ message: RECIPE_PUBLISHED_USER_REMOVAL, recipe });

  } catch (error) {
    console.error(UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UPDATE_PUBLISH_RECIPE_ERROR });
  }
});

privateRouter.get('/recipes/get_pub_request', async (req, res) => {
  try {
    let recipeObjectId = req.query.recipeId;

    let recipePub = await RecipePubRequest.findOne({ recipeId: recipeObjectId });
    if (!recipePub) {
      return res.status(404).json({ error: 'Recipe publish request not found' });
    }

    res.json(recipePub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error trying to get recipe' });
  }
});

privateRouter.get('/recipes/publish_requests', async (_, res) => {
  try {
    const publishRequests = await RecipePubRequest.find({});
    res.status(200).json(publishRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred getting publish recipe requests" });
  }
});

privateRouter.delete('/recipes/delete_request', async (req, res) => {
  try {
    let recipeObjectId = req.query.recipeId;

    let recipePub = await RecipePubRequest.findOne({ recipeId: recipeObjectId });
    if (!recipePub) {
      return res.status(404).json({ error: 'Recipe publish request not found' });
    }

    await recipePub.deleteOne();
    res.status(200).json({ message: SUCCESSFULLY_DELETED_RECIPE_REQUEST });
  } catch (error) {
    console.error(UNABLE_TO_DELETE_RECIPE_REQUEST_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_DELETE_RECIPE_REQUEST_ERROR });
  }
});

privateRouter.post('/users/:id/recipe/post_review', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const userReview = new RecipeReview({
      reviewedRecipeId: req.body.reviews.reviewedRecipeId,
      reviewerUsername: user.username,
      writtenReview: req.body.reviews.writtenReview
    });
    const savedReview = await userReview.save();
    console.log("saving");
    if (savedReview) {
      res.status(200).json({ success: "Posted your review!" });
    } else {
      res.status(500).json({ error: "Error occurred posting your review!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred sending post review message." });
  }
});

privateRouter.get('/recipes/reported_content', async (_, res) => {
  try {
    const reportedRecipes = await Recipe.find({ reported: true});
    res.status(200).json(reportedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred getting reported recipes" });
  }
});

privateRouter.put('/recipes/report_recipe', async (req, res) => {
  try {
    let recipeObjectId = new mongoose.Types.ObjectId(req.query.recipeId);

    let recipe = await Recipe.findOne({ _id: recipeObjectId });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updated = await Recipe.updateOne(recipe, { $set: { isPublished: false, pubRequested: false, reported: true} }, { upsert: true, new: true });
    if (!updated) {
      return res.status(400).json({ error: "Error occurred trying to report recipe" });
    }


    res.status(200).json({ message: RECIPE_REPORTED, recipe });
  } catch (error) {
    console.error(UNABLE_TO_REPORT_RECIPE_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_REPORT_RECIPE_ERROR });
  }

});

privateRouter.put('/recipes/report_review', async (req, res) => {
  try {
    let reviewObjectId = new mongoose.Types.ObjectId(req.query.reviewId);

    let recipeReview = await RecipeReview.findOne({ _id: reviewObjectId});
    if (!recipeReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await RecipeReview.updateOne(recipeReview, { $set: { reviewReported: true } }, { upsert: true, new: true });
    if (!updated) {
      return res.status(400).json({ error: "Error occurred trying to report review" });
    }

    res.status(200).json({ message: REVIEW_REPORTED, recipeReview });
  } catch (error) {
    console.error(UNABLE_TO_REPORT_REVIEW_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_REPORT_REVIEW_ERROR });
  }
});

privateRouter.put('/recipes/approve_reported_review', async (req, res) => {
  try {
    let reviewObjectId = new mongoose.Types.ObjectId(req.query.reviewId);

    let recipeReview = await RecipeReview.findOne({ _id: reviewObjectId});
    if (!recipeReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await RecipeReview.updateOne(recipeReview, { $set: { reviewReported: false } }, { upsert: true, new: true });
    if (!updated) {
      return res.status(400).json({ error: "Error occurred trying to report review" });
    }

    res.status(200).json({ message: REVIEW_UN_REPORTED, recipeReview });
  } catch (error) {
    console.error(UNABLE_TO_UPDATE_REVIEW_STATUS_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UPDATE_REVIEW_STATUS_ERROR });
  }
});

privateRouter.put('/recipes/deny_reported_review', async (req, res) => {
  try {
    let reviewObjectId = new mongoose.Types.ObjectId(req.query.reviewId);

    let recipeReview = await RecipeReview.findOne({ _id: reviewObjectId});
    if (!recipeReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await recipeReview.deleteOne();

    res.status(200).json({ message: REVIEW_DELETED, recipeReview });
  } catch (error) {
    console.error(UNABLE_TO_UPDATE_REVIEW_STATUS_ERROR, error);
    res.status(500).json({ error: UNABLE_TO_UPDATE_REVIEW_STATUS_ERROR });
  }
});

privateRouter.get('/recipes/get_reported_reviews', async (_, res) => {
  try {
    let reportedReviews = await RecipeReview.find({ reviewReported: true });
    if (!reportedReviews) {
      return res.status(404).json({ error: 'No reviews found' });
    }

    res.json(reportedReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error trying to get reviews' });
  }
});

async function validatePassword(user, inputtedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedPassword, user.password, (err, passwordsMatch) => {
      if (err) return reject(err);
      resolve(passwordsMatch);
    });
  });
}

async function validateVerificationCode(user, inputtedVerificationCode) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedVerificationCode, user.verificationCode, (err, codesMatch) => {
      if (err) return reject(err);
      resolve(codesMatch);
    });
  });
}

function hasTenMinutesPassed(originalTimestamp) {
  const elapsedTimeInMilliseconds = new Date().getTime() - new Date(originalTimestamp).getTime();
  return elapsedTimeInMilliseconds > 600000;
}

module.exports = privateRouter;
