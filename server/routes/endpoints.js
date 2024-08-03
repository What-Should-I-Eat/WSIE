const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const bodyParser = require("body-parser");
const cors = require('cors');
const endpoints = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require("mongoose");
const User = require("../src/models/userModel.js");
const ContactUs = require("../src/models/contactUsModel.js");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});
const fileType = require('file-type');

endpoints.use(bodyParser.json());
endpoints.use(cors());

// Success / Error Logs
const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "User not found";

endpoints.get('/clearUserDatabase', async (_, res) => {
  try {
    const cleared = await mongoose.model('User').deleteMany({});
    res.json(cleared);

  } catch (error) {
    console.log('Error clearing database: ', error);
    res.status(500).json({ error: 'error clearing database' });
  }
});

endpoints.get("/users/getVerificationCode", async (_, res) => {
  try {
    const verificationCode = generateRandomVerificationCode();
    res.json(verificationCode);
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.get('/users/requestInfoForPasswordReset', async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const forgotUserInfo = {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    };

    res.json(forgotUserInfo);
  }
  catch (error) {
    console.error('Error finding this email: ', error);
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.put("/users/changePassword", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    if (!user.verified) {
      return res.status(404).json({ error: 'User not validated' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const passwordUpdate = { $set: { "password": hashedPassword, "incorrectPasswordAttempts": 0 } };
    const options = { upsert: true, new: true };

    const updatedPassword = await User.updateOne(user, passwordUpdate, options);
    res.json(updatedPassword);
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.post("/users/getUserEmail", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    res.json(user);
  } catch (error) {
    console.error('Error finding user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.post("/users/getUserFavorites", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    console.log(user.favorites);
    res.json(user.favorites);
  } catch (error) {
    console.error('Error finding user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

///////////////////////
// START: Contact Us //
///////////////////////
endpoints.post('/contact/create_message', async (req, res) => {
  try {
    const contactUs = new ContactUs({
      id: req.body.id,
      full_name: req.body.fullName,
      email: req.body.email,
      message: req.body.message
    });

    const savedMessage = await contactUs.save();
    if (savedMessage) {
      res.status(200).json({ success: "Successfully sent contact us message" });
    } else {
      res.status(500).json({ error: "Error occurred sending contact us message" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred sending contact us message" });
  }
});

endpoints.get('/contact/get_messages', async (_, res) => {
  try {
    const messages = await mongoose.model("ContactUs").find({});
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred getting contact us message" });
  }
});
/////////////////////
// END: Contact Us //
/////////////////////


//////////////////////////////////////
// START: Recipe Scraping Endpoints //
//////////////////////////////////////
endpoints.get('/scrape-recipe', async (req, res) => {
  const recipeLink = req.query.recipeLink;
  const source = req.query.source;
  const recipeName = req.query.recipeName;

  try {
    const data = await getRecipeDirectionsFromSource(recipeLink, recipeName);
    console.log("SCRAPED DATA: " + data);
    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to scrape data, please check the provided URL and source.' });
  }
});

async function getRecipeDirectionsFromSource(link, recipeName) {
  console.log(`Made it to get data. Link = ${link}`);
  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const directionsScrape = '*:not(script,style,noscript,figcaption)';
    const recipeDirections = [];
    var startScrapingDirections = false;
    var firstElementRead = false;
    var stopScraping = false;
    var classNameOfElement = '';
    var firstInstructionElement = '';
    const keyTerms = ['recipe from', 'you rate', 'originally posted at'];

    $(directionsScrape).each((index, element) => {
      if (!stopScraping) {
        var htmlObjectContents = ($(element).contents().filter(function () {
          return this.type === 'text';
        }).text().trim());
        if (htmlObjectContents.length === 0 || htmlObjectContents.length === undefined) {
        } else {
          if (startScrapingDirections) {
            classNameOfElement = $(element).get(0).tagName;
            var elementResult = classNameOfElement.localeCompare(firstInstructionElement);
            htmlObjectContentsLower = htmlObjectContents.toLowerCase();
            var resultReview = htmlObjectContentsLower.indexOf("reviews");
            var commentsReview = htmlObjectContentsLower.indexOf("comments");
            if ((firstElementRead && (elementResult != 0) && (htmlObjectContents.length > 40)) || (resultReview >= 0) || (commentsReview >= 0)) {
              stopScraping = true;
            } else {
              /*at this point string length of 30 is an arbitrary number that is used to disregard image captions or other random strings between steps
              unfortunately this can also cause issues with some other recipes that have really long subtitles for each step*/
              console.log("contents: " + htmlObjectContentsLower);
              if (htmlObjectContents.length > 40 && !(keyTerms.some(term => htmlObjectContentsLower.includes(term)))) {
                if (!firstElementRead) {
                  firstElementRead = true;
                  firstInstructionElement = classNameOfElement;
                }
                recipeDirections.push(htmlObjectContents);
              }
            }
          }

          if (!startScrapingDirections) {
            htmlObjectContentsLower = htmlObjectContents.toLowerCase()
            var result = htmlObjectContentsLower.localeCompare("directions");
            if (result === 0) {
              console.log('found directions and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("instructions");
            if (result === 0) {
              console.log('found instructions and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("method");
            if (result === 0) {
              console.log('found method and will start scraping');
              startScrapingDirections = true;
            }
            result = htmlObjectContentsLower.localeCompare("preparation");
            if (result === 0) {
              console.log('found method and will start scraping');
              startScrapingDirections = true;
            }
            /*result = htmlObjectContents.localeCompare(recipeName);
            if(result === 0){
              console.log('found directions and will start scraping');
              startScrapingDirections = true;
              console.log(htmlObjectContents);
            }*/
          }
        }
      }
    });

    // Leave commented out so it doesn't flood the logs
    // console.log(`Recipe directions: ${recipeDirections}`);
    return recipeDirections;
  } catch (error) {
    console.error(`Error in scraping recipe directions: ${error}`);
    throw error;
  }
}
//////////////////////////////////////
// END: Recipe Scraping Endpoints //
//////////////////////////////////////

//____________________________________________MIDDLEWARE____________________________________________________________
//Everything after this point requires authentication_______________________________________________________________

//Session middleware
endpoints.use(session({
  secret: "myveryfirstemailwasblueblankeyiscute@yahoo.com",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

endpoints.post("/users/register", async (req, res) => {
  try {
    const userToLower = req.body.username.toLowerCase();
    const fullName = req.body.fullName;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUsernameCheck = await User.findOne({ username: userToLower });
    const existingEmailCheck = await User.findOne({ email: req.body.email });
    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);
    const currentTimestamp = new Date();

    const user = new User({
      id: req.body.id,
      fullName: fullName,
      username: userToLower,
      password: hashedPassword,
      email: req.body.email,
      verified: false,
      verificationCode: hashedVerificationCode,
      verificationCodeTimestamp: currentTimestamp,
      incorrectPasswordAttempts: 0,
      incorrectPasswordAttemptTime: currentTimestamp,
      diet: req.body.diet,
      health: req.body.health,
      favorites: req.body.favorites
    });

    if (existingUsernameCheck) {
      res.status(444).json({ error: 'User already exists' });
    } else if (existingEmailCheck) {
      res.status(445).json({ error: 'Email already exists' });
    } else {
      const savedUser = await user.save();
      console.log(`Successfully created User: [${fullName}] with Username: [${userToLower}]`);
      res.json(savedUser);
    }
  }
  catch (error) {
    console.error('Error occurred during user registration:', error);
    res.status(500).json({ error: 'An error occurred during user registration' });
  }
});

endpoints.put("/users/verify", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const inputtedCode = req.body.verificationCode;
    const validatedVerificationCode = await validateVerificationCode(user, inputtedCode);

    if (validatedVerificationCode) {
      if (hasTenMinutesPassed(user.verificationCodeTimestamp)) {
        return res.status(437).json({ error: 'Code has expired' });
      }

      const verificationUpdate = { $set: { "verified": true } };
      const options = { upsert: true, new: true };

      const verifiedUser = await User.updateOne(user, verificationUpdate, options);
      res.json(verifiedUser);
    } else {
      return res.status(401).json({ error: 'Incorrect verification code' });
    }
  } catch (error) {
    console.error('Error fetching unique user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.put("/users/resendVerificationCode", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);
    const currentTimestamp = new Date();

    const verificationUpdate = { $set: { "verificationCode": hashedVerificationCode, "verificationCodeTimestamp": currentTimestamp } };
    const options = { upsert: true, new: true };

    const updatedCode = await User.updateOne(user, verificationUpdate, options);
    res.json(updatedCode);
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.post('/users/find-username', async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });
    const inputtedPassword = req.body.password;

    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    } else if (user.verified == false) {
      return res.status(450).json({ error: 'User account is not verified' });
    }

    try {
      if ((user.incorrectPasswordAttempts == 5) && (!hasTenMinutesPassed(user.incorrectPasswordAttemptTime))) {
        return res.status(452).json({ error: '10 minute lockout' });
      } else if (user.incorrectPasswordAttempts >= 10) {
        return res.status(453).json({ error: 'Must reset password' });
      }
      const passwordValidated = await validatePassword(user, inputtedPassword);
      if (passwordValidated) {
        const resetAttempts = { $set: { "incorrectPasswordAttempts": 0 } };
        const options = { upsert: true, new: true };

        const _ = await User.updateOne(user, resetAttempts, options);

        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.username = user.username;

        // Set the cookie
        res.cookie('sessionId', req.session.id, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie('username', req.session.username, {
          // httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        // Return the user object in the response
        return res.json(user);
      } else {
        const updatedAttempts = user.incorrectPasswordAttempts + 1;

        const currentTimestamp = new Date();
        const passwordAttemptsUpdate = { $set: { "incorrectPasswordAttempts": updatedAttempts, "incorrectPasswordAttemptTime": currentTimestamp } };
        const options = { upsert: true, new: true };

        const _ = await User.updateOne(user, passwordAttemptsUpdate, options);
        console.log(updatedAttempts);

        if ((updatedAttempts == 5) && (!hasTenMinutesPassed(user.incorrectPasswordAttemptTime))) {
          return res.status(452).json({ error: '10 minute lockout' });
        } else if (updatedAttempts >= 10) {
          return res.status(453).json({ error: 'Must reset password' });
        }

        return res.status(401).json({ error: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error validating password: ', error);
      return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
  } catch (error) {
    console.error('Error fetching unique user: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.get('/users/profile', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const userId = req.session.userId;
  const username = req.session.username;

  User.findById(userId)
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

endpoints.get('/users/findUserData', async (req, res) => {
  try {
    const username = req.query.username.toLowerCase();
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    res.json(user);
  }
  catch (error) {
    console.error('Error finding this username: ', error);
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

//Middleware to check session for endpoints after login/new user
endpoints.use((req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  }
  else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
});

endpoints.get('/users', async (_, res) => {
  try {
    const users = await mongoose.model('User').find();
    res.json(users);
  }
  catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'users - Internal Server Error' });
  }
});

endpoints.get('/users/findUserId', async (req, res) => {
  try {
    const username = req.query.username.toLowerCase(); // Access the username from query parameters
    // const username_cookie = req.headers.getSetCookie();
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const idNum = user._id;
    res.json(idNum);
  }
  catch (error) {
    console.error('Error finding this username: ', error);
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.put('/users/diet', async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const newDiet = req.body.diet;
    user.diet = newDiet;
    await user.save();

    console.log(`Updated diet for user: [${username}]`);
    res.json(user.diet);
  }
  catch (error) {
    console.error('Error updating diet: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.put('/users/health', async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const newHealth = req.body.health;
    user.health = newHealth;
    await user.save();

    console.log(`Updated health for user: [${username}]`);
    res.json(user);
  }
  catch (error) {
    console.error('Error updating health: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.post('/users/:id/favorites', async (req, res) => {
  const userId = req.params.id;
  const recipeToAdd = req.body.favorites.recipeName;

  try {
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const index = user.favorites.findIndex(x => x.recipeName == recipeToAdd);
    if (index != -1) { // found favorite already in list
      return res.json(true)
    } else {
      return res.json(false)  // not favorited yet
    }
  }
  catch (error) {
    return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.put('/users/:id/favorites', async (req, res) => {
  const userId = req.params.id;
  const newFavorites = req.body.favorites;
  const recipeToAdd = req.body.favorites.recipeName;
  try {
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    const index = user.favorites.findIndex(x => x.recipeName == recipeToAdd);
    console.log("Index: ", index)
    if (index != -1) {
      console.log(`User already has [${recipeToAdd}] favorited!`);
    } else {
      user.favorites.push(newFavorites);
    }

    await user.save();
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

//~~~~~ Delete a recipe from user's favorites
endpoints.delete('/users/:id/favorites', async (req, res) => {
  const userId = req.params.id;
  const recipeToRemove = req.body.favorites.recipeName;
  try {
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }
    // finds index where recipe names match the one to remove
    const index = user.favorites.findIndex(x => x.recipeName == recipeToRemove);
    if (index == -1) { // no index found
      return res.status(404).json({ error: 'favorite not found for user!' });
    }
    const _ = user.favorites.splice(index, 1);
    await user.save();
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

/////////////////////////////////////////////////////////
// START: Updating User Profile from 'My Profile' View //
/////////////////////////////////////////////////////////
endpoints.put("/users/profile/update_details", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const fullName = req.body.firstName + " " + req.body.lastName;

    const fieldToUpdate = { $set: { "fullName": fullName } };
    const options = { upsert: true, new: true };

    const updatedFullName = await User.updateOne(user, fieldToUpdate, options);

    if (updatedFullName) {
      return res.status(200).json(updatedFullName);
    } else {
      return res.status(400).json({ error: "Error occurred trying to update user details" });
    }
  } catch (error) {
    console.error("Error occurred trying to update user details", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user details" });
  }
});

endpoints.put("/users/profile/update_email", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const email = req.body.email;

    const fieldToUpdate = { $set: { "email": email } };
    const options = { upsert: true, new: true };

    const updatedEmail = await User.updateOne(user, fieldToUpdate, options);

    if (updatedEmail) {
      return res.status(200).json(updatedEmail);
    } else {
      return res.status(400).json({ error: "Error occurred trying to update user email" });
    }
  } catch (error) {
    console.error("Error occurred trying to update user email", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user email" });
  }
});

endpoints.put("/users/profile/update_password", async (req, res) => {
  try {
    let userToLower = req.body.username.toLowerCase();
    const user = await User.findOne({ username: userToLower });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verified) {
      return res.status(404).json({ error: "User not validated" });
    }

    const originalPassword = req.body.originalPassword;
    const newPassword = req.body.newPassword;

    // If existing and entered existing do not match, return invalid
    let arePasswordsEqual = await validatePassword(user, originalPassword);
    if (!arePasswordsEqual) {
      console.log("Existing and user provided password DO NOT MATCH");
      return res.status(400).json({ error: "Original password entered does not match existing. Failed to update user password" });
    }

    // If existing and new password match, return invalid
    arePasswordsEqual = await validatePassword(user, newPassword);
    if (arePasswordsEqual) {
      console.log("Existing and new user provided password MATCH");
      return res.status(400).json({ error: "Passwords are identical - nothing to update" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const fieldToUpdate = { $set: { "password": hashedPassword, "incorrectPasswordAttempts": 0 } };
    const options = { upsert: true, new: true };

    const updatedPassword = await User.updateOne(user, fieldToUpdate, options);

    if (updatedPassword) {
      return res.status(200).json(updatedPassword);
    } else {
      return res.status(500).json({ error: "Error occurred trying to update user password" });
    }
  } catch (error) {
    console.error("Error occurred trying to update user password", error);
    res.status(500).json({ error: "Internal server error occurred trying to update user password" });
  }
});
///////////////////////////////////////////////////////
// END: Updating User Profile from 'My Profile' View //
///////////////////////////////////////////////////////

/////////////////////////
// START: User Recipes //
/////////////////////////
endpoints.post('/users/:id/recipe/create_recipe', upload.single('userRecipeImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const recipeToAdd = req.body.recipeName;
    const index = user.favorites.findIndex(x => x.recipeName === recipeToAdd);
    if (index !== -1) {
      console.error(`[${recipeToAdd}] is already added.. skipping`);
      return res.status(409).json({ error: "Recipe already created" });
    }

    let newRecipe = {
      ...req.body
    };

    let imageType = null;
    let imageData = null;
    if (req.file && req.file.buffer) {
      const type = await fileType.fromBuffer(req.file.buffer);
      imageType = type ? type.mime : 'application/octet-stream';

      imageData = Buffer.from(req.file.buffer);
      newRecipe = {
        ...req.body,
        userRecipeImage: {
          recipeImageData: imageData,
          recipeImageType: imageType
        }
      };
    }

    user.favorites.push(newRecipe);
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});

endpoints.get('/users/:id/recipe/get_recipe', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const recipeName = req.query.recipeName;
    const matchingRecipe = user.favorites.find(recipe => recipe.userCreated && recipe.recipeName === recipeName);

    if (!matchingRecipe) {
      return res.status(404).json({ error: `[${recipeName} not found]` });
    }

    res.json(matchingRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error trying to get user recipe' });
  }
});

endpoints.delete('/users/:id/recipe/delete_recipe', async (req, res) => {
  try {
    const userId = req.params.id;
    const recipeName = req.body.favorites.recipeName;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND_ERROR });
    }

    const result = await User.updateOne(
      { _id: userId },
      { $pull: { favorites: { recipeName: recipeName, userCreated: true } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: `No matching recipe found for: [${recipeName}]` });
    }

    res.status(200).json({ message: 'Successfully deleted recipe' });
  } catch (error) {
    console.error('Error deleting recipe: ', error);
    res.status(500).json({ error: INTERNAL_SERVER_ERROR });
  }
});
///////////////////////
// END: User Recipes //
///////////////////////

//Validates password from find-username endpoint
async function validatePassword(user, inputtedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedPassword, user.password, function (err, passwordsMatch) {
      if (err) {
        reject(err);
        return;
      }
      if (passwordsMatch) {
        console.log("Passwords MATCH");
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function validateVerificationCode(user, inputtedVerificationCode) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedVerificationCode, user.verificationCode, function (err, codesMatch) {
      if (err) {
        reject(err);
        return;
      }
      if (codesMatch) {
        console.log("Verification Codes MATCH");
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function hasTenMinutesPassed(originalTimestamp) {
  const currentTimestamp = new Date().toISOString();
  const tenMinutes = 60 * 10 * 1000;
  const elapsedTimeInMilliseconds = (Date.parse(currentTimestamp) - Date.parse(originalTimestamp));
  if (elapsedTimeInMilliseconds > tenMinutes) {
    return true;
  } else {
    return false;
  }
}

function generateRandomVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = endpoints;

