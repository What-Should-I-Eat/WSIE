const express = require('express');
const passport = require('passport');
const User = require('../models/user'); 

const router = express.Router();

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/register', async (req, res) => {
    try {
      const user = new User({
        id: req.body.id,
        fullName: req.body.fullName,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
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
      const savedUser = await user.save();
      res.json(savedUser);
      setTimeout(() => {
        res.send('<script>window.location.href = "/login";</script>');
      }, 3000); //3 seconds
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ error: 'An error occurred while saving user' });
    }
  });
  

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
