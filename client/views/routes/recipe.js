var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/recipe', function(req, res, next) {

    res.render('recipe', { title: 'Recipe Title', recipe: {} });
    // try {
    //     // Retrieve the recipeData query parameter
    //     const recipeDataParam = req.query.recipeData;

    //     // Check if the parameter is present
    //     if (!recipeDataParam) {
    //         return res.status(400).send('Missing recipeData parameter');
    //     }

    //     // Decode the parameter (it's URL-encoded JSON)
    //     const recipeData = JSON.parse(decodeURIComponent(recipeDataParam));

    //     // Render the 'recipe' view and pass the recipe data to it
    //     res.render('recipe', { title: recipeData.title, recipe: recipeData });
    // } catch (err) {
    //     // Handle any potential errors (e.g., invalid JSON)
    //     console.error(err);
    //     res.status(500).send('Internal Server Error');
    // }
});

module.exports = router;