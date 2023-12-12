"use strict";

var edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

var edamam = function () {
  var searchRecipe = function searchRecipe(event) {
    event.preventDefault();
    var username = getUsername();
    getUserData(username).then(function _callee(userData) {
      var healthString, dietString, selectedRecipeDetails, recipeListDiv, recipeList, searchParam, fullLink;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(userData);
              console.log('Health of user: ', userData.health);
              console.log('Diet of user: ', userData.diet); //get strings for health and diet to append to fullLink

              healthString = getHealthString(userData.health);
              console.log("HEALTH STRING: ", healthString);
              dietString = getDietString(userData.diet);
              console.log("DIET STRING: ", dietString); //Hide recipe on new search (if it exists)

              selectedRecipeDetails = document.getElementById('selected-recipe-details');
              selectedRecipeDetails.style.display = 'none'; //Show the search results

              recipeListDiv = document.getElementById('recipe-list');
              recipeListDiv.style.display = 'block';
              recipeList = document.getElementById('recipeList');
              recipeList.innerHTML = '';
              searchParam = document.getElementById('search-input').value; //Call restricitons file to get array HERE

              fullLink = edamamLink + searchParam + dietString + healthString;
              console.log(fullLink);

              try {
                fetch(fullLink, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }).then(function (resp) {
                  return resp.json();
                }).then(function (results) {
                  results.hits.forEach(function (data) {
                    var source = data.recipe.source;
                    var viableSource = sourceIsViable(source);

                    if (viableSource) {
                      console.log(source, " - ", data.recipe.label);
                      var recipeName = document.createElement('li'); //Image

                      if (data.recipe.images && data.recipe.images.LARGE && data.recipe.images.LARGE.url) {
                        var imageElement = document.createElement('img');
                        imageElement.src = data.recipe.images.LARGE.url;
                        imageElement.alt = data.recipe.label;
                        imageElement.style.display = 'block';
                        imageElement.style.margin = '0 auto';
                        recipeName.appendChild(imageElement);
                      }

                      var link = document.createElement('a');
                      link.textContent = data.recipe.label;
                      recipeName.appendChild(link);
                      recipeList.appendChild(recipeName);

                      link.onclick = function () {
                        return showRecipe(data, data.recipe.source);
                      };
                    }
                  });
                });
              } catch (e) {
                console.log(e);
              }

            case 17:
            case "end":
              return _context.stop();
          }
        }
      });
    })["catch"](function (error) {
      console.error('Error fetching user data:', error);
    });
    return false;
  };

  function getHealthString(healthArray) {
    if (!healthArray.length) {
      return "";
    }

    var healthString = "";
    healthArray.forEach(function (healthItem) {
      healthString += "&health=" + "".concat(healthItem);
    });
    return healthString;
  }

  function getDietString(dietArray) {
    if (!dietArray.length) {
      return "";
    }

    var dietString = "";
    dietArray.forEach(function (dietItem) {
      dietString += "&diet=" + "".concat(dietItem, ",");
    });
    return dietString;
  }

  function sourceIsViable(source) {
    switch (source) {
      case 'Food52':
        return true;

      case 'Martha Stewart':
        return true;

      case 'BBC Good Food':
        return true;

      case 'Food Network':
        return true;

      case 'Simply Recipes':
        return true;

      case 'Delish':
        return true;

      case 'EatingWell':
        return true;

      default:
        return false;
    }
  }

  function showRecipe(json, source) {
    console.log('recipe: ', json);
    var ingredients = setupRecipe(json); //Recipe name and ingredients 

    var directionsList = document.getElementById('directions-list'); // List of directions

    directionsList.innerHTML = '';
    var link = json.recipe.url; // Create the URL with the recipeLink and source parameters

    var recipeSiteEndpoint = "http://".concat(host, "/api/v1/scrape-recipe/?recipeLink=").concat(link, "&source=").concat(source);

    try {
      fetch(recipeSiteEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (resp) {
        return resp.json();
      }).then(function (results) {
        console.log("results: ", results);
        directionsList.innerHTML = '<ul>' + results.map(function (item) {
          return "<li>".concat(item[0], "</li>");
        }).join('') + '</ul>';
        var recipeTitleHeader = document.getElementById('recipe-name');
        var heartButton = getHeartIcon(recipeTitleHeader);
        recipeTitleHeader.appendChild(heartButton); //CHANGE THIS: What to do when heart icon is clicked - put to favorites

        heartButton.addEventListener('click', function () {
          var heartIcon = this.querySelector('img');

          if (heartIcon.style.filter === 'sepia(100%)') {
            heartIcon.style.filter = 'none';
            putToFavorites(json, ingredients, results);
          } else {
            heartIcon.style.filter = 'sepia(100%)';
          }

          console.log('Heart button clicked!');
        });
      });
    } catch (e) {
      console.log(e);
    }

    return false;
  }

  function setupRecipe(json) {
    // Hide search results
    var recipeList = document.getElementById('recipe-list');
    recipeList.style.display = 'none'; // Show recipe

    var selectedRecipeDetails = document.getElementById('selected-recipe-details');
    selectedRecipeDetails.style.display = 'block';
    var recipeTitleHeader = document.getElementById('recipe-name'); // Title of the recipe

    var ingredientsHeader = document.getElementById('ingredients'); // Name: ingredients

    var ingredientList = document.getElementById('ingredient-list'); // List of ingredients

    var directionsHeader = document.getElementById('directions'); // Name: directions

    var recipeImageContainer = document.getElementById('recipe-image'); // Container for the recipe image

    recipeTitleHeader.innerHTML = '';
    ingredientsHeader.innerHTML = '';
    ingredientList.innerHTML = '';
    directionsHeader.innerHTML = '';
    recipeImageContainer.innerHTML = '';
    var ingredients = [];
    json.recipe.ingredientLines.forEach(function (ingredient) {
      ingredients.push(ingredient);
    });
    recipeTitleHeader.innerHTML = json.recipe.label;

    if (json.recipe.image) {
      var recipeImage = document.createElement('img');
      recipeImage.src = json.recipe.image;
      recipeImage.alt = json.recipe.label;
      recipeImage.style.maxWidth = '100%';
      recipeImageContainer.appendChild(recipeImage);
    } // Display ingredients and directions


    ingredientsHeader.innerHTML = 'Ingredients';
    ingredientList.innerHTML = "<ul>".concat(ingredients.map(function (item) {
      return "<li>".concat(item, "</li>");
    }).join(''), "</ul>");
    directionsHeader.innerHTML = 'Directions';
    return ingredients;
  }

  function putToFavorites(json, ingredients, directions) {
    var newFavoritedRecipe, username, userId, response, updatedUser;
    return regeneratorRuntime.async(function putToFavorites$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            newFavoritedRecipe = {
              recipeName: json.recipe.label,
              recipeIngredients: ingredients,
              recipeDirections: directions[0],
              //need index 0 because it puts it into a subarray 
              recipeUri: json.recipe.uri,
              recipeImage: json.recipe.images.LARGE.url
            };
            console.log("favoritedRecipe: ", newFavoritedRecipe);
            _context2.prev = 2;
            _context2.next = 5;
            return regeneratorRuntime.awrap(getUsername());

          case 5:
            username = _context2.sent;
            _context2.next = 8;
            return regeneratorRuntime.awrap(getUserId(username));

          case 8:
            userId = _context2.sent;
            _context2.next = 11;
            return regeneratorRuntime.awrap(fetch("http://".concat(host, "/api/v1/users/").concat(userId, "/favorites"), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                favorites: newFavoritedRecipe
              })
            }));

          case 11:
            response = _context2.sent;

            if (response.ok) {
              _context2.next = 14;
              break;
            }

            throw new Error('There was a problem!!!');

          case 14:
            _context2.next = 16;
            return regeneratorRuntime.awrap(response.json());

          case 16:
            updatedUser = _context2.sent;
            console.log('Updated user favorites:', updatedUser);
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](2);
            console.error('There was a problem with the fetch operation:', _context2.t0);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[2, 20]]);
  }

  function getHeartIcon() {
    var heartButton = document.createElement('button');
    var heartIcon = document.createElement('img');
    heartButton.classList.add('heart-button');
    heartButton.type = 'button';
    heartIcon.src = './assets/heart.png';
    heartIcon.alt = 'Heart Icon';
    heartIcon.style.width = "".concat(10, "vw");
    heartIcon.style.marginLeft = "".concat(3, "vw");
    heartButton.style.background = 'none';
    heartIcon.style.filter = 'sepia(100%)';
    heartIcon.classList.add('original-color');
    heartButton.appendChild(heartIcon);
    return heartButton;
  }

  return {
    searchRecipe: searchRecipe
  };
}();