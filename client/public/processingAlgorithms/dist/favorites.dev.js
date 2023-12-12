"use strict";

document.addEventListener('DOMContentLoaded', function _callee() {
  var username;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = getUsername('name');
          fetch("http://".concat(host, "/api/v1/users/findUser/").concat(username), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            if (!response.ok) {
              throw new Error('Cannot find user');
            }

            return response.json();
          }).then(function (user) {
            console.log('User found: ', user);
            var favoritesContainer = document.getElementById('favorites-container');
            user.favorites.forEach(function (recipe) {
              console.log(recipe);

              if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
                //get rid of undefined
                var recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe-item');
                recipeElement.innerHTML = "\n                <h3>".concat(recipe.recipeName, "</h3>\n                <img src=\"").concat(recipe.recipeImage, "\" alt=\"").concat(recipe.recipeName, "\">\n                <ul>\n                    ").concat(recipe.recipeIngredients.map(function (ingredient) {
                  return "<li>".concat(ingredient, "</li>");
                }).join(''), "\n                </ul>\n            ");
                favoritesContainer.appendChild(recipeElement);
                var line = document.createElement('hr');
                favoritesContainer.appendChild(line);
              }
            });
          })["catch"](function (error) {
            console.error('Fetch error: ', error);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});