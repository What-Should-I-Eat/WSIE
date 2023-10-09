const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const Ingredient = require("./src/models/ingredients_model");
//const jwt = require('jsonwebtoken');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://db/ingredients', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes
app.get("/", (req, res) => {
  res.json({ msg: "ingredients" });
});

// Returns the array of films (GET)
app.get("/api/v1/ingredients", async (req, res) => {
  const ingredients = await Ingredient.find({});
  res.json(ingredients);
});


// PUT a new rating - this is based on film id
// app.put("/api/v1/films", async (req, res) => {
//   const filmID = req.body.filmID;
//   const newRating = req.body.rating;

//   try {
//     await Film.findOneAndUpdate(
//       { _id: filmID },
//       { rating: newRating },
//       { new: true }
//     );

//     res.status(200).json({ message: 'Rating updated successfully' });
//   } catch (e) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers['authorization'];
//   if (typeof bearerHeader !== 'undefined') {
//     const bearerToken = bearerHeader.split(' ')[1];
//     jwt.verify(bearerToken, 'secretkey', (err, authData) => {
//       if (err) {
//         res.sendStatus(403);
//       } else {
//         next();
//       }
//     });
//   } else {
//     res.sendStatus(403);
//   }
// }

module.exports = app;
