const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

var edamam = (() => {
  function getUserNameFromCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; username=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  var searchRecipe = (event) => {
    event.preventDefault();

    const username = getUserNameFromCookie();
    const userData = getUserId(username);
    getUserData(username)
      .then(async (userData) => {
        console.log(userData);

        console.log('Health of user: ', userData.health);
        console.log('Diet of user: ', userData.diet);
        //get strings for health and diet to append to fullLink
        var healthString = getHealthString(userData.health);
        console.log("HEALTH STRING: ", healthString);

        var dietString = getDietString(userData.diet);
        console.log("DIET STRING: ", dietString);

        //Hide recipe on new search (if it exists)
        const selectedRecipeDetails = document.getElementById('selected-recipe-details');
        selectedRecipeDetails.style.display = 'none';

        //Show the search results
        const recipeListDiv = document.getElementById('recipe-list');
        recipeListDiv.style.display = 'block';
        const recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        // Get the no-recipe element
        const noRecipeElement = document.getElementById('no-recipe-found');

        const searchParam = document.getElementById('search-input').value;

        //Call restricitons file to get array HERE
        const fullLink = edamamLink + searchParam + dietString + healthString;
        console.log(fullLink);

        try {
          fetch(fullLink, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then(resp => resp.json())
            .then(results => {
              if (results.count == 0) {
                console.log("No results found!");
                noRecipeElement.style.display = 'block';
              }
              else {
                noRecipeElement.style.display = 'none';
                results.hits.forEach(data => {
                  const source = data.recipe.source;
                  const sourceURL = data.recipe.url;
                  const viableSource = sourceIsViable(source, sourceURL);
                  if (viableSource) {
                    console.log(source, " - ", data.recipe.label);
                    const recipeName = document.createElement('li');

                    //Image
                    if (data.recipe.images && data.recipe.images.LARGE && data.recipe.images.LARGE.url) {
                      const imageElement = document.createElement('img');
                      imageElement.src = data.recipe.images.LARGE.url;
                      imageElement.alt = data.recipe.label;
                      imageElement.style.display = 'block';
                      imageElement.style.margin = '0 auto';
                      recipeName.appendChild(imageElement);
                    }

                    const link = document.createElement('a');
                    link.textContent = data.recipe.label;
                    recipeName.appendChild(link);
                    recipeList.appendChild(recipeName);
                    link.onclick = () => showRecipe(data, data.recipe.source);
                  }
                });
              }
            });
        } catch (e) {
          console.log(e);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    return false;
  }

  //These are for the diet and health parameters passed to edamam api call
  function getHealthString(healthArray) {
    if (!healthArray.length) {
      return "";
    }
    const healthString = healthArray.map(healthItem => `&health=${healthItem}`).join('');
    return healthString;
  }

  function getDietString(dietArray) {
    if (!dietArray.length) {
      return "";
    }
    const dietString = dietArray.map(dietItem => `&diet=${dietItem}`).join('');
    return dietString;
  }


  function sourceIsViable(source, sourceURL) {
    switch (source) {
      case 'BBC Good Food':
        if (sourceURLIsViable(sourceURL)) {
          return true;
        }
        return false;
      case 'Martha Stewart':
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

  //this is to see if bbc good food link actually works
  function sourceURLIsViable(sourceURL) {
    const penultimateChar = sourceURL.charAt(sourceURL.length - 2);
    console.log("penultimate char: ", penultimateChar);
    if (penultimateChar >= '0' && penultimateChar <= '9') {
      return false;
    }
    else { return true; }
  }

  async function showRecipe(json, source) {
    try {
      const ingredients = setupRecipe(json); // Recipe name and ingredients 
      const directionsList = document.getElementById('directions-list'); // List of directions
      directionsList.innerHTML = '';
      const link = json.recipe.url;
      console.log("full json: ", json);
      const lowerCaseSource = source.toLowerCase().trim();
      console.log("lowercasesource: ", lowerCaseSource);
      // Create the URL with the recipeLink and source parameters
      const recipeSiteEndpoint = `${host}/api/v1/scrape-recipe/?recipeLink=${link}&source=${lowerCaseSource}`;
      console.log("recipe endpoint: ", recipeSiteEndpoint);

      const resp = await fetch(recipeSiteEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error('Failed to fetch recipe directions');
      }

      const results = await resp.json();
      directionsList.innerHTML = '<ul>' + results.map(item => `<li>${item[0]}</li>`).join('') + '</ul>';

      const heartIconDiv = document.getElementById('heart-container');
      // Heart icon
      const heartIcon = document.createElement('img');
      const heartButton = getHeartIcon(heartIcon);

      // Tooltip for heart icon
      const existingToolTip = document.getElementById('tooltiptextID');
      if (existingToolTip) {
        existingToolTip.remove();
      }

      const toolTipText = document.createElement('span');
      toolTipText.className = "tooltiptext";
      toolTipText.id = "tooltiptextID";

      const isAlreadyLiked = await isFavorited(json);
      if (isAlreadyLiked) {
        heartIcon.style.filter = 'none'; // red
        toolTipText.innerHTML = "Remove From Favorites";
      } else {
        heartIcon.style.filter = 'sepia(100%)'; // grey
        toolTipText.innerHTML = "Add to Favorites";
      }
      heartIconDiv.appendChild(heartButton);
      heartIconDiv.appendChild(toolTipText);

      // When heart button is clicked, toggle
      heartButton.addEventListener('click', async function () {
        const heartIcon = this.querySelector('img');
        if (heartIcon.style.filter === 'sepia(100%)') {
          heartIcon.style.filter = 'none';
          await putToFavorites(json, ingredients, results);
          toolTipText.innerHTML = "Remove From Favorites";
        } else {
          heartIcon.style.filter = 'sepia(100%)';
          await deleteInFavorites(json, ingredients, results);
          toolTipText.innerHTML = "Add to Favorites";
        }
      });
    } catch (error) {
      console.error('Error fetching and processing recipe:', error);
    }
    return false;
  }

  function setupRecipe(json) {
    // Hide search results
    const recipeList = document.getElementById('recipe-list');
    recipeList.style.display = 'none';

    // Show recipe
    const selectedRecipeDetails = document.getElementById('selected-recipe-details');
    selectedRecipeDetails.style.display = 'block';

    const recipeTitleHeader = document.getElementById('recipe-name'); // Title of the recipe
    const ingredientsHeader = document.getElementById('ingredients'); // Name: ingredients
    const ingredientList = document.getElementById('ingredient-list'); // List of ingredients
    const directionsHeader = document.getElementById('directions'); // Name: directions
    const recipeImageContainer = document.getElementById('recipe-image'); // Container for the recipe image

    recipeTitleHeader.innerHTML = '';
    ingredientsHeader.innerHTML = '';
    ingredientList.innerHTML = '';
    directionsHeader.innerHTML = '';
    recipeImageContainer.innerHTML = '';

    const ingredients = [];
    json.recipe.ingredientLines.forEach(ingredient => {
      ingredients.push(ingredient);
    });

    recipeTitleHeader.innerHTML = json.recipe.label;

    if (json.recipe.image) {
      const recipeImage = document.createElement('img');
      recipeImage.src = json.recipe.image;
      recipeImage.alt = json.recipe.label;
      recipeImage.style.maxWidth = '100%';
      recipeImageContainer.appendChild(recipeImage);
    }

    // Display ingredients and directions
    ingredientsHeader.innerHTML = 'Ingredients';
    ingredientList.innerHTML = `<ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>`;
    directionsHeader.innerHTML = 'Directions';

    return ingredients;
  }
  async function putToFavorites(json, ingredients, directions) {
    const newFavoritedRecipe = {
      recipeName: json.recipe.label,
      recipeIngredients: ingredients,
      recipeDirections: Array.isArray(directions) ? directions.join(", ") : "", //Directions array to string
      recipeUri: json.recipe.uri,
      recipeImage: (typeof json.recipe.images.REGULAR.url === 'undefined') ? "" : json.recipe.images.REGULAR.url,
      recipeCalories: json.recipe.calories,
      recipeSource: json.recipe.source,
      recipeSourceUrl: json.recipe.url
    };
    console.log("adding to favorites: ", newFavoritedRecipe.recipeName);
    try {
      const username = await getUserNameFromCookie();
      const userId = await getUserId(username);
      const response = await fetch(`${host}/api/v1/users/${userId}/favorites`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites: newFavoritedRecipe })
      });
      if (!response.ok) {
        throw new Error('There was a problem adding a new recipe to Favorites!');
      }
      const updatedUser = await response.json();
      console.log('Updated user favorites:', updatedUser);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function deleteInFavorites(json) {
    const recipeToDelete = {
      recipeName: json.recipe.label
    };
    try {
      const username = await getUserNameFromCookie();
      const userId = await getUserId(username);
      const response = await fetch(`${host}/api/v1/users/${userId}/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites: recipeToDelete })
      });
      if (!response.ok) {
        throw new Error('There was a problem deleting a recipie from favorites!');
      }
      const updatedUser = await response.json();
      console.log('Updated user favorites:', updatedUser);
    } catch (error) {
      console.error('There was a problem with the delete operation:', error);
    }
  }

  async function isFavorited(json) {
    const recipeToGet = {
      recipeName: json.recipe.label,
    };
    try {
      const username = await getUserNameFromCookie();
      const userId = await getUserId(username);
      const response = await fetch(`${host}/api/v1/users/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites: recipeToGet })
      });
      if (!response.ok) {
        throw new Error('There was a problem checking if recipe is favorited!');
      }
      const isFavorited = await response.json();
      return isFavorited;
    } catch (error) {
      console.error('There was a problem with the isFavorited operation:', error);
    }
  }

  function getHeartIcon(heartIcon) {
    const existingHeartButton = document.querySelector('.heart-button');
    if (existingHeartButton) {
      return existingHeartButton;
    }

    const heartButton = document.createElement('button');
    heartButton.classList.add('heart-button');
    heartButton.type = 'button';
    heartIcon.src = './assets/heart.png';
    heartIcon.alt = 'Heart Icon';
    heartIcon.style.width = `${6.5}vw`;
    heartIcon.style.marginLeft = `${3}vw`;
    heartButton.style.background = 'none';
    heartIcon.style.filter = 'sepia(100%)';
    heartIcon.classList.add('original-color');
    heartButton.appendChild(heartIcon);
    console.log("Adding heart button!!!!!!!!!!!!!!!!!!!");
    return heartButton;
  }

  return {
    searchRecipe,
    getDietString,
    getHealthString,
    sourceIsViable,
    putToFavorites,
    getHeartIcon,
    isFavorited,
    setupRecipe,
    showRecipe,
    putToFavorites,
    deleteInFavorites,
    isFavorited,
    getUserNameFromCookie
  }
})();

if (typeof module === 'object') {
  module.exports = edamam;
}