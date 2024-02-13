const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const endpoints = express.Router();
const RecipeInput = require("../src/models/recipeSearch_model.js"); 
const User = require("../src/models/userModel.js");
const json = require("body-parser/lib/types/json");
const bcrypt = require('bcryptjs');
const session = require('express-session');

//Endpoint Setup
endpoints.use(bodyParser.json()); //express app uses the body parser
endpoints.use(cors());

// used to clear current database, can be deleted or commented out at the end of the project if needed
endpoints.get('/clearUserDatabase', async (req, res) => {
  try{
    const cleared = await mongoose.model('User').deleteMany({});
    res.json(cleared);

  } catch(error){
    console.log('Error clearing database: ', error);
    res.status(500).json({error: 'error clearing database'});
  }
});

//TORIE NOTE: I don't think we need this endpoint bc emailjs needs a browser but keeping it for now
//Changing this: response is now the verification code
endpoints.get("/users/getVerificationCode", async (req, res) => { 
  try {
    const verificationCode = generateRandomVerificationCode(); 
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
    
    const verificationUpdate =  { $set: {"verificationCode": verificationCode}};
    const options =  { upsert: true, new: true};

    res.json(verificationCode); //change to hashed code once I know this works
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get user by email (for forgot username/password)
endpoints.get('/users/requestInfoForPasswordReset', async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const forgotUserInfo = {
      username: user.userName,
      fullName: user.fullName,
      email: user.email,
    };

    res.json(forgotUserInfo);
  } 
  catch (error) {
    console.error('Error finding this email: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Change password
endpoints.put("/users/changePassword", async (req, res) => { 
  try {
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(!user.verified){
      return res.status(404).json({ error: 'User not validated' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const passwordUpdate =  { $set: {"password": hashedPassword, "incorrectPasswordAttempts": 0}};
    const options = { upsert: true, new: true};

    const updatedPassword = await User.updateOne(user, passwordUpdate, options);
    res.json(updatedPassword);
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



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


//~~~~~ POST a new user - WORKS!
endpoints.post("/users/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUsernameCheck = await User.findOne({ userName: req.body.userName });
    const existingEmailCheck = await User.findOne({ email: req.body.email });
    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);
    const currentTimestamp = new Date();

    const user = new User({
      id: req.body.id,
      fullName: req.body.fullName,
      userName: req.body.userName,
      password: hashedPassword, 
      email: req.body.email,
      verified: false,
      verificationCode: hashedVerificationCode,
      verificationCodeTimestamp: currentTimestamp,
      incorrectPasswordAttempts: 0,
      incorrectPasswordAttemptTime: currentTimestamp,
      diet: req.body.diet,
      health: req.body.health,
      favorites: [{
        recipeId: req.body.recipeId,
        recipeName: req.body.recipeName,
        recipeIngredients: req.body.recipeIngredients,
        recipeDirections: req.body.recipeDirections,
        recipeImage: req.body.recipeImage,
        recipeUri: req.body.recipeUri
      }]
    });

    if(existingUsernameCheck){
      res.status(444).json({error: 'User already exists'});
    } else if(existingEmailCheck){
      res.status(445).json({error: 'Email already exists'});
    } else{
      const savedUser = await user.save();
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
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const inputtedCode = req.body.verificationCode;

    const validatedVerificationCode = await validateVerificationCode(user, inputtedCode);

    if(validatedVerificationCode){

      if(hasTenMinutesPassed(user.verificationCodeTimestamp)){
        return res.status(437).json({ error: 'Code has expired'});
      }

      const verificationUpdate =  { $set: {"verified": true}};
      const options =  { upsert: true, new: true};
  
      const verifiedUser = await User.updateOne(user, verificationUpdate, options);
      res.json(verifiedUser);

    } else{
      return res.status(401).json({ error: 'Incorrect verification code' });
    }
  } catch (error) {
    console.error('Error fetching unique user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// //Changing this: response is now the verification code
endpoints.put("/users/resendVerificationCode", async (req, res) => { 
  try {
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedVerificationCode = await bcrypt.hash(req.body.verificationCode, 10);
    const currentTimestamp = new Date();

    const verificationUpdate =  { $set: {"verificationCode": hashedVerificationCode, "verificationCodeTimestamp": currentTimestamp}};
    const options =  { upsert: true, new: true};

    const updatedCode = await User.updateOne(user, verificationUpdate, options);
    res.json(updatedCode);
  } catch (error) {
    console.error('Error fetching verification code: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ POST specific user by user - changed from GET so we could have a body
endpoints.post('/users/find-username', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    const inputtedPassword = req.body.password;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else if(user.verified == false){
      return res.status(450).json({error: 'User account is not verified'});
    }
    

    try {
      if((user.incorrectPasswordAttempts == 5) && (!hasTenMinutesPassed(user.incorrectPasswordAttemptTime))){
        return res.status(452).json({ error: '10 minute lockout' });
      } else if(user.incorrectPasswordAttempts >= 10){
          return res.status(453).json({ error: 'Must reset password' });
      }
      const passwordValidated = await validatePassword(user, inputtedPassword);
      if (passwordValidated) {
        console.log("Password is correct!");

        const resetAttempts =  { $set: {"incorrectPasswordAttempts": 0}};
        const options = { upsert: true, new: true};

        const resetIncorrectAttempts = await User.updateOne(user, resetAttempts, options);

        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.username = user.userName;

        // Set the cookie
        res.cookie('sessionId', req.session.id, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        // Return the user object in the response
        return res.json(user);
      } else {
        const updatedAttempts = user.incorrectPasswordAttempts + 1;

        const currentTimestamp = new Date();
        const passwordAttemptsUpdate =  { $set: {"incorrectPasswordAttempts": updatedAttempts, "incorrectPasswordAttemptTime": currentTimestamp}};
        const options =  { upsert: true, new: true};
    
        const updatedUser = await User.updateOne(user, passwordAttemptsUpdate, options);
        console.log(updatedAttempts);

        if((updatedAttempts == 5) && (!hasTenMinutesPassed(user.incorrectPasswordAttemptTime))){
          return res.status(452).json({ error: '10 minute lockout' });
        } else if(updatedAttempts >= 10){
            return res.status(453).json({ error: 'Must reset password' });
        }
        
        return res.status(401).json({ error: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error validating password: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error fetching unique user: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Get user's profile if they're logged in
endpoints.get('/users/profile', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const userId = req.session.userId;
  const username = req.session.username; 
  console.log("Inside /profile endpoint. isLoggedIn = ", isLoggedIn);
  console.log("username = ", username);

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log("user (inside endpoint): ", user);
      res.json({ user });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

});

endpoints.get('/users/findUserData', async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } 
  catch (error) {
    console.error('Error finding this username: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Middleware to check session for endpoints after login/new user
endpoints.use((req, res, next) => {
  if(req.session && req.session.userId)
  {
    next();
  }
  else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
});



//------------------------------------------------------------- ORIGINAL User Endpoints------------------------------------------------------------
//~~~~~ GET all users
endpoints.get('/users', async (req, res) => { //WORKS!
    try{
      const users = await mongoose.model('User').find();
      res.json(users);
    }
    catch(error){
      console.error('Error fetching users: ', error);
      res.status(500).json({ error: 'users - Internal Server Error' });
    }
});

//Find user id by username - WORKS! returns username's id
endpoints.get('/users/findUserId', async (req, res) => {
  try {
    const username = req.query.username; // Access the username from query parameters
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const idNum = user._id;
    res.json(idNum);
  } 
  catch (error) {
    console.error('Error finding this username: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Find user by username - not for login purposes - WORKS!
endpoints.get('/users/finduser/:username', async (req, res) => {
  try {
    const username = req.params.username; // Access the username from query parameters
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } 
  catch (error) {
    console.error('Error finding this username: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//~~~~~ DELETE a user
endpoints.delete("/users/:id", async (req, res) => { //WORKS!
  try {
    const deletedUser = await mongoose.model('User').findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(deletedUser);
  } 
  catch (error) {
    console.error('Error deleting user: ', error);
    res.status(500).json({ error: 'Delete user - Internal Server Error' });
  }
});

//~~~~~ PUT a change in a user's diet array
endpoints.put('/users/diet', async (req, res) => {
  try {
    const username = req.body.username;
    console.log("Username = ", username);
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newDiet = req.body.diet;
    user.diet = newDiet;
    await user.save();

    res.json(user.diet);
  } 
  catch (error) {
    console.error('Error updating diet: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ PUT a change in a user's health array
endpoints.put('/users/health', async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newHealth = req.body.health;
    user.health = newHealth;
    await user.save();
    res.json(user);
  } 
  catch (error) {
    console.error('Error updating health: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ Check if user has already favorited this recipe
endpoints.post('/users/:id/favorites', async (req, res) => { 
  const userId = req.params.id;
  const recipeToAdd = req.body.favorites.recipeName;
  try {
      const user = await mongoose.model('User').findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const index = user.favorites.findIndex(x => x.recipeName == recipeToAdd); 
      if(index != -1){ // found favorite already in list
        return res.json(true)
      }else{
        return res.json(false)  // not favorited yet
      }
  } 
  catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ PUT a change in a user's favorite recipes
endpoints.put('/users/:id/favorites', async (req, res) => { 
  const userId = req.params.id;
  const newFavorites = req.body.favorites; 
  const recipeToAdd = req.body.favorites.recipeName;
  try {
      const user = await mongoose.model('User').findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const index = user.favorites.findIndex(x => x.recipeName == recipeToAdd); 
      console.log("Index: ", index)
      if(index != -1){
        console.log("already added"); // don't add duplicates
      }else{
        user.favorites.push(newFavorites); 
      }
      await user.save();
      res.json(user);
  } 
  catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//~~~~~ Delete a recipe from user's favorites
endpoints.delete('/users/:id/favorites', async (req, res) => { 
  const userId = req.params.id;
  const recipeToRemove = req.body.favorites.recipeName;
  try {
      const user = await mongoose.model('User').findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      // finds index where recipe names match the one to remove
      const index = user.favorites.findIndex(x => x.recipeName == recipeToRemove); 
      if(index == -1){ // no index found
        return res.status(404).json({error: 'favorite not found for user!'});
      }
      const x = user.favorites.splice(index, 1);
      await user.save();
      res.json(user);
  } 
  catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



//---------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------Original Endpoints--------------------------------------------------------
endpoints.get('/ingredients', async (req, res) => {
    try {
      const ingredients = await mongoose.model('Ingredient').find();
      res.json(ingredients);
    } 
    catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'ingredients - Internal Server Error' });
    }
  });
  
  //returns restrictions
  endpoints.get('/restrictions', async (req, res) => {
    try {
      const restrictions = await mongoose.model('Restriction').find();
      res.json(restrictions);
    } 
    catch (error) {
      console.error('Error fetching restrictions:', error);
      res.status(500).json({ error: 'restrictions - Internal Server Error' });
    }
  });
  
  //This is where we want to pass a search so that we can see the options for recipes
  endpoints.get('/search-simply-recipes/:searchQuery', async (req, res) => {
    const searchQuery = encodeURIComponent(req.params.searchQuery);
    console.log("searchQuery = " + searchQuery);
    
    const url = 'https://www.simplyrecipes.com/search?q=' + searchQuery;
    console.log("searching url: " + url);

    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          const html = response.data; //all html from the page
          const $ = cheerio.load(html);
          const searchResultsSection = $('.comp.search-results-list-1.card-list'); //list of search results
          const items = searchResultsSection.find('.comp.card-list__item'); //each item in the list
          const results = []; //json array to store data
  
          //Iterating through the list of search results
          items.each((index, element) => {
            const title = $(element).find('span.card__title').text().trim(); //Name of the recipe
            const link = $(element).find('.comp.card').attr('href'); //Link to recipe page
            results.push({ title, link });
          });
  
          res.json(results); //json array of recipe names and links 
        } else {
          console.error('Request failed with status code', response.status);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ error: 'search - Internal Server Error' });
      });
  });

  endpoints.post("/search-input", async(req, res) => {
    const recipeInput = new RecipeInput({ input: req.body.input });
    const savedRecipeInput = await recipeInput.save();
    res.json(savedRecipeInput);
  });

  endpoints.get("/restriction-input", async (req, res) => {
    try {
      const restrictionInputs = await mongoose.model('RestrictionInput').find();
      res.json(restrictionInputs)
    } 
    catch (error) {
      console.error('Error fetching search input:', error);
      res.status(500).json({ error: 'search input - Internal Server Error' });
    }
  });

  endpoints.post("/restriction-input", async(req, res) => {
    const restrictionInput = new RestrictionInput({ input: req.body.input });
    const savedRestrictionInput = await restrictionInput.save();
    res.json(savedRestrictionInput);
  });
//---------------------------------------------------------------------------------------------------------------------------------------
 
//-------------------------------------------------------------Edamam Endpoints----------------------------------------------------------

  endpoints.get('/edamam', async (req, res) => {
    const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";
    

  });

  endpoints.get('/scrape-recipe', async (req, res) => {
    const recipeLink = req.query.recipeLink; 
    const source = req.query.source;
    
    const data = await determineSite(recipeLink, source);

    console.log("SCRAPED DATA: " + data);
    res.json(data);      
    
});

  //Support methods
  async function determineSite(link, source) {
    console.log("Link in determineSite(): " + link);
    console.log("Source in determineSite() |" + source + "|");

    let data = [];
    let scraper;
    let findScraper;

    try {
      switch(source.toLowerCase().trim()){
        case 'food52': //working
          scraper = '.recipe__list.recipe__list--steps li';
          findScraper = 'span';
          break;
        case 'simply recipes': //working
          scraper = '#mntl-sc-block_3-0';
          findScraper = 'p.mntl-sc-block-html';
          break;
        case 'martha stewart': //working
          scraper = 'div#recipe__steps-content_1-0 p';
          findScraper = '';
          break;
        case 'food network': //working
          scraper = '.o-Method__m-Body ol';
          findScraper = 'li';
          break;
        case 'delish': //working but adding weird stuff
          scraper = 'ul.directions li ol';
          findScraper = 'li';
          break;
        case 'eatingwell': //working
          scraper = 'div#recipe__steps-content_1-0 ol li';
          findScraper = 'p';
          break;

      }

      data = await getRecipeDirectionsFromSource(link, scraper, findScraper);
      console.log("directions: " + data);
      return data;
    } catch (error) {
        console.error("Error in determineSite:", error);
        throw error;
    }
}

async function getRecipeDirectionsFromSource(link, scraper, findScraper){
  console.log(`Made it to get data. Link = ${link}`);

  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const recipeDirections = [];

    $(scraper).each((index, element) => {
      const directionElement = findScraper ? $(element).find(findScraper) : $(element);
      const directionText = directionElement.text().trim().split('\n\n');
      recipeDirections.push(directionText);
    });

    console.log(`Recipe directions: ${recipeDirections}`);
    return recipeDirections;
  } catch (error) {
    console.error(`Error in scraping recipe directions: ${error}`);
    throw error;
  }
}

//Validates password from find-username endpoint
async function validatePassword(user, inputtedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedPassword, user.password, function(err, passwordsMatch) {
      if (err) {
        reject(err);
        return;
      }
      if (passwordsMatch) {
        console.log("PASSWORDS MATCH!");
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

async function validateVerificationCode(user, inputtedVerificationCode) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputtedVerificationCode, user.verificationCode, function(err, codesMatch) {
      if (err) {
        reject(err);
        return;
      }
      if (codesMatch) {
        console.log("VERIFICATION CODES MATCH!");
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function hasTenMinutesPassed(originalTimestamp){
  const currentTimestamp = new Date().toISOString();
  const tenMinutes = 60 * 10 * 1000;
  const elapsedTimeInMilliseconds = (Date.parse(currentTimestamp) - Date.parse(originalTimestamp));
  if(elapsedTimeInMilliseconds > tenMinutes){
    return true;
  } else{
    return false;
  }
}

function generateRandomVerificationCode(){
  return String(Math.floor(100000 + Math.random() * 900000));
}


module.exports = endpoints;
  
