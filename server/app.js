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
mongoose.connect('mongodb://db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




// Define routes
app.get("/", (req, res) => {
  res.json({ msg: "ingredients" });
});

// Returns the array of ingredients (GET)
app.get("/api/v1/ingredients", async (req, res) => {
  const ingredients = await Ingredient.find({});
  res.json(ingredients);
});

//Returns the array of dietary restrictions
app.get("/api/v1/restrictions", async (req, res) => {
  const restrictions = await Restriction.find({});
  res.json(restrictions);
});



module.exports = app;
