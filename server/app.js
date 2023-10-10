const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const Ingredient = require("./src/models/ingredients_model");
const Restriction = require("./src/models/dietaryRestrictions_model");
//const jwt = require('jsonwebtoken');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://db:27017/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



app.get("/", (req, res) => {
  res.json({ msg: "data goes here" });
});

//Ingredients route
app.get('/api/v1/ingredients', async (req, res) => {
  try {
    const ingredients = await mongoose.model('Ingredient').find();
    res.json(ingredients);
  } 
  catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Restrictions route
app.get('/api/v1/restrictions', async (req, res) => {
  try {
    const restrictions = await mongoose.model('Restriction').find();
    res.json(restrictions);
  } 
  catch (error) {
    console.error('Error fetching restrictions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
