var express = require('express');
var router = express.Router();
var path = require('path');

// router.get('/', function (_, res) {
//     res.sendFile(path.join(__dirname, '../public/new/recipes/recipes.html'));
// });

router.get('/recipe_details', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/new/recipes/recipe_details.html'));
});

module.exports = router;