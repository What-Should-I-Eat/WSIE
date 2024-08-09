function RecipeDetailsView() {
  this.load = async (source, sourceUrl, recipeUri) => {
    if (hasAllData(source, sourceUrl, recipeUri)) {
      console.log("Loading view from Edamam recipe");

      try {
        const recipeDetails = await this.getRecipeDetails(recipeUri);
        const recipe = recipeDetails.hits[0].recipe;
        const recipeName = recipe.label;
        const recipeInstructions = await this.getRecipeInstructions(source, sourceUrl, recipe.label);

        if (isValidResult(recipeDetails)) {
          this.buildView(recipeDetails, recipeInstructions);
        } else {
          console.error('Invalid data to build view', {
            details: recipeDetails,
            instructions: recipeInstructions
          });
          utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        }
      } catch (error) {
        console.error('Error loading recipe details and instructions:', error);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
      }
    } else {
      console.error(`Missing Source: ${source}, Source URL: ${sourceUrl}, and/or Recipe Uri: ${recipeUri}`);
      utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
    }
  }

  this.loadUserRecipe = async (userRecipeName) => {
    try {
      console.log("Loading view from user created recipe");

      const userRecipeDetails = await this.getUserRecipe(userRecipeName);
      if (userRecipeDetails) {
        this.buildUserView(userRecipeDetails);
      } else {
        console.error("Invalid user recipe data to build view");
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
      }
    } catch (error) {
      console.error("Error loading user recipe details", error);
      utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
    }
  }

  this.getRecipeDetails = async (recipeUri) => {
    const uri = encodeURIComponent(recipeUri);
    const apiUrl = `${EDAMAM_RECIPE_URI_URL}=${uri}`;
    console.log("Querying Edamam at:", apiUrl);

    const response = await fetch(apiUrl, {
      method: GET_ACTION,
      headers: {
        'Accept': DEFAULT_DATA_TYPE,
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const recipeDetails = await response.json();
      return recipeDetails;
    } else {
      console.error("Error occurred getting recipe details");
      return undefined;
    }
  }

  this.getRecipeInstructions = async (source, sourceUrl, recipeName) => {
    const sourceTrimmed = source.toLowerCase().trim();
    const apiUrl = `${RECIPE_SCRAPE_URL}/?recipeLink=${sourceUrl}&source=${sourceTrimmed}&recipeName=${recipeName}`;

    console.log("Querying Server for:", apiUrl);

    const response = await fetch(apiUrl, {
      method: GET_ACTION,
      headers: {
        'Accept': DEFAULT_DATA_TYPE,
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const details = await response.json();
      return details;
    } else {
      console.error("Error occurred getting recipe instructions");
      return undefined;
    }
  }

  this.getUserRecipe = async (recipeName) => {
    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      return;
    }

    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/get_recipe?recipeName=${recipeName}`;
    console.log(`Querying Server at: ${url}`);

    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const details = await response.json();
      return details;
    } else {
      console.error(`Error occurred getting user recipe for ${recipeName}`);
      return undefined;
    }
  }

  this.buildView = async (recipeDetails, recipeInstructions) => {
    // We checked we had a result upstream
    const recipe = recipeDetails.hits[0].recipe;
    const form = document.getElementById('recipeForm');

    // Hidden Recipe URI
    let hiddenUriInput = document.getElementById('recipe-uri');
    if (!hiddenUriInput) {
      hiddenUriInput = document.createElement('input');
      hiddenUriInput.type = 'hidden';
      hiddenUriInput.id = 'recipe-uri';
      form.appendChild(hiddenUriInput);
    }
    hiddenUriInput.value = recipe.uri;

    // Hidden Recipe Source
    let hiddenRecipeSourceInput = document.getElementById('recipe-source');
    if (!hiddenRecipeSourceInput) {
      hiddenRecipeSourceInput = document.createElement('input');
      hiddenRecipeSourceInput.type = 'hidden';
      hiddenRecipeSourceInput.id = 'recipe-source';
      form.appendChild(hiddenRecipeSourceInput);
    }
    hiddenRecipeSourceInput.value = recipe.source;

    // Hidden Recipe Source URL
    let hiddenRecipeSourceUrlInput = document.getElementById('recipe-source-url');
    if (!hiddenRecipeSourceUrlInput) {
      hiddenRecipeSourceUrlInput = document.createElement('input');
      hiddenRecipeSourceUrlInput.type = 'hidden';
      hiddenRecipeSourceUrlInput.id = 'recipe-source-url';
      form.appendChild(hiddenRecipeSourceUrlInput);
    }
    hiddenRecipeSourceUrlInput.value = recipe.url;

    // Check if the recipe is a favorite
    const username = utils.getUserNameFromCookie();
    const isFavorite = await checkIfFavorite(username, recipe.label);
    const addToFavoritesBtn = document.getElementById('addToFavorites');
    addToFavoritesBtn.textContent = isFavorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES;

    // Update header name
    document.getElementById('recipe-name').textContent = recipe.label;

    // Update image
    let imageSrc = NO_IMAGE_AVAILABLE;
    if (hasValidImage(recipe)) {
      // Use the LARGE as default in recipe details
      if (recipe.images.LARGE && recipe.images.LARGE.url) {
        imageSrc = await utils.getEdamamRecipeImage(recipe.images.LARGE.url);
      } else {
        imageSrc = await utils.getEdamamRecipeImage(recipe.images.REGULAR.url);
      }
    }

    document.getElementById('recipe-image').src = imageSrc;
    document.getElementById('recipe-image').alt = `Image of ${recipe.label}`;

    // Update ingredients list
    const ingredientsList = document.querySelector('.recipe-info ul');
    ingredientsList.innerHTML = '';
    recipe.ingredientLines.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      ingredientsList.appendChild(listItem);
    });

    // Update preparation
    const preparationContainer = document.querySelectorAll('.recipe-info')[1];
    const preparationList = preparationContainer.querySelector('ul');
    preparationList.innerHTML = '';
    if (recipeInstructions && recipeInstructions.length > 0) {
      recipeInstructions.forEach(step => {
        const listItem = document.createElement('li');
        listItem.textContent = step;
        preparationList.appendChild(listItem);
      });
    } else {
      console.log(`No scraped instructions for: [${recipe.label}]`);
      const noInstructionsText = document.createElement('p');
      noInstructionsText.innerHTML = `No instructions were able to be migrated.`;
      preparationContainer.appendChild(noInstructionsText);
    }
    const source = recipe.source;
    const url = recipe.url;

    const urlLinkToInstructionsText = document.createElement('p');
    urlLinkToInstructionsText.innerHTML = `View full instructions and more at <a href="${url}" target="_blank">${source}</a>`;
    preparationContainer.appendChild(urlLinkToInstructionsText);

    // Update nutritional facts
    const nutritionalFactsList = document.querySelectorAll('.recipe-info')[2].querySelector('ul');
    nutritionalFactsList.innerHTML = '';
    nutritionalFactsList.innerHTML += `<li>Servings: ${Math.round(recipe.yield)}</li>`;
    nutritionalFactsList.innerHTML += `<li>Calories: ${Math.round(recipe.totalNutrients.ENERC_KCAL.quantity)} ${recipe.totalNutrients.ENERC_KCAL.unit}</li>`;
    nutritionalFactsList.innerHTML += `<li>Fats: ${Math.round(recipe.totalNutrients.FAT.quantity)} ${recipe.totalNutrients.FAT.unit}</li>`;
    nutritionalFactsList.innerHTML += `<li>Carbohydrates: ${Math.round(recipe.totalNutrients.CHOCDF.quantity)} ${recipe.totalNutrients.CHOCDF.unit}</li>`;
    nutritionalFactsList.innerHTML += `<li>Protein: ${Math.round(recipe.totalNutrients.PROCNT.quantity)} ${recipe.totalNutrients.PROCNT.unit}</li>`;

    // Update dietary labels
    const dietaryContainer = document.querySelectorAll('.recipe-info')[3];
    const dietaryLabelsList = dietaryContainer.querySelector('ul');
    dietaryLabelsList.innerHTML = '';
    if (recipe.dietLabels && recipe.dietLabels.length > 0) {
      recipe.dietLabels.forEach(label => {
        const listItem = document.createElement('li');
        listItem.textContent = label;
        dietaryLabelsList.appendChild(listItem);
      });
    } else {
      const noDietaryText = document.createElement('p');
      noDietaryText.innerHTML = `No dietary labels.`;
      dietaryContainer.appendChild(noDietaryText);
    }
  }

  this.buildUserView = async (recipe) => {
    // Leave this here so its compatible and we can share functionality
    const form = document.getElementById('recipeForm');

    // Hidden Recipe URI
    let hiddenUriInput = document.getElementById('recipe-uri');
    if (!hiddenUriInput) {
      hiddenUriInput = document.createElement('input');
      hiddenUriInput.type = 'hidden';
      hiddenUriInput.id = 'recipe-uri';
      form.appendChild(hiddenUriInput);
    }
    hiddenUriInput.value = "";

    // Hidden Recipe Source
    let hiddenRecipeSourceInput = document.getElementById('recipe-source');
    if (!hiddenRecipeSourceInput) {
      hiddenRecipeSourceInput = document.createElement('input');
      hiddenRecipeSourceInput.type = 'hidden';
      hiddenRecipeSourceInput.id = 'recipe-source';
      form.appendChild(hiddenRecipeSourceInput);
    }
    hiddenRecipeSourceInput.value = "";

    // Hidden Recipe Source URL
    let hiddenRecipeSourceUrlInput = document.getElementById('recipe-source-url');
    if (!hiddenRecipeSourceUrlInput) {
      hiddenRecipeSourceUrlInput = document.createElement('input');
      hiddenRecipeSourceUrlInput.type = 'hidden';
      hiddenRecipeSourceUrlInput.id = 'recipe-source-url';
      form.appendChild(hiddenRecipeSourceUrlInput);
    }
    hiddenRecipeSourceUrlInput.value = "";

    // Hidden Recipe Source URL
    let hiddenRecipeServingsInput = document.getElementById('recipe-servings');
    if (!hiddenRecipeServingsInput) {
      hiddenRecipeServingsInput = document.createElement('input');
      hiddenRecipeServingsInput.type = 'hidden';
      hiddenRecipeServingsInput.id = 'recipe-servings';
      form.appendChild(hiddenRecipeServingsInput);
    }
    hiddenRecipeServingsInput.value = recipe.yield;

    // Check if the recipe is a favorite
    const addToFavoritesBtn = document.getElementById('addToFavorites');
    addToFavoritesBtn.textContent = DELETE_RECIPE;

    // Update header name and image
    document.getElementById('recipe-name').textContent = recipe.recipeName;
    document.getElementById('recipe-image').src = await utils.getUserRecipeImage(recipe);
    document.getElementById('recipe-image').alt = `Image of ${recipe.recipeName}`;

    // Update ingredients list
    const ingredientsList = document.querySelector('.recipe-info ul');
    ingredientsList.innerHTML = '';
    if (recipe.recipeIngredients) {
      var ingredientsString = recipe.recipeIngredients[0].split(/\r\n/);
      ingredientsString.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        ingredientsList.appendChild(listItem);
      });
    }

    // Update preparation
    const preparationContainer = document.querySelectorAll('.recipe-info')[1];
    const preparationList = preparationContainer.querySelector('ul');
    preparationList.innerHTML = '';
    if (recipe.recipeDirections) {
      var directionsString = recipe.recipeDirections[0].split(/\r\n/);
      directionsString.forEach(step => {
        const listItem = document.createElement('li');
        listItem.textContent = step;
        preparationList.appendChild(listItem);
      });
    } else {
      console.log(`No user instructions for: [${recipe.label}]`);
      const noInstructionsText = document.createElement('p');
      noInstructionsText.innerHTML = `No user instructions available.`;
      preparationContainer.appendChild(noInstructionsText);
    }

    // Update nutritional facts
    const nutritionalFactsList = document.querySelectorAll('.recipe-info')[2].querySelector('ul');
    nutritionalFactsList.innerHTML = '';
    nutritionalFactsList.innerHTML += `<li>Servings: ${Math.round(recipe.recipeServings)}</li>`;
    nutritionalFactsList.innerHTML += `<li>Calories: ${Math.round(recipe.recipeCalories)} ${recipe.recipeCaloriesUnits}</li>`;
    nutritionalFactsList.innerHTML += `<li>Fats: ${Math.round(recipe.recipeFats)} ${recipe.recipeFatsUnits}</li>`;
    nutritionalFactsList.innerHTML += `<li>Carbohydrates: ${Math.round(recipe.recipeCarbs)} ${recipe.recipeCarbsUnits}</li>`;
    nutritionalFactsList.innerHTML += `<li>Protein: ${Math.round(recipe.recipeProtein)} ${recipe.recipeProteinUnits}</li>`;

    // Update dietary labels
    const dietaryContainer = document.querySelectorAll('.recipe-info')[3];
    const dietaryLabelsList = dietaryContainer.querySelector('ul');
    dietaryLabelsList.innerHTML = '';
    const noDietaryText = document.createElement('p');
    noDietaryText.innerHTML = `No user dietary labels.`;
    dietaryContainer.appendChild(noDietaryText);

    const button = document.createElement("button");
    const recipeName = recipe.recipeName;
    button.textContent = "Update Recipe";
    button.classList.add("updateRecipeButton"); // Add a class for styling
    button.addEventListener("click", function () {
      document.location.href = "/account/update_recipe?userRecipeName=" + recipeName;
    });
    var container = document.getElementById("updateRecipeContainer");
    container.appendChild(button);
  };

  // Handles favorite/unfavorite logic
  $("#recipeForm").on("submit", async function (event) {
    event.preventDefault();
    const form = $(this);

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
      return;
    }

    const recipeName = document.getElementById('recipe-name').textContent;
    const recipeImage = document.getElementById('recipe-image').src;
    const recipeIngredients = Array.from(document.getElementById('ingredients-list').children).map(li => li.textContent);
    const recipeDirections = Array.from(document.getElementById('preparation-list').children).map(li => li.textContent);
    const recipeUri = document.getElementById('recipe-uri').value;
    const recipeSource = document.getElementById('recipe-source').value;
    const recipeSourceUrl = document.getElementById('recipe-source-url').value;

    const nutritionalFactsList = document.querySelectorAll('.recipe-info')[2].querySelector('ul');
    const listItems = nutritionalFactsList.querySelectorAll('li');

    const servingsValue = listItems[0].textContent.split(': ')[1];
    const [caloriesValue, caloriesUnit] = listItems[1].textContent.split(' ').slice(1);
    const [fatValue, fatUnit] = listItems[2].textContent.split(' ').slice(1);
    const [carbsValue, carbsUnit] = listItems[3].textContent.split(' ').slice(1);
    const [proteinValue, proteinUnit] = listItems[4].textContent.split(' ').slice(1);

    const buttonText = form.find("#addToFavorites").text();

    let urlAction = "";
    let request = {};
    let newButtonText = "";
    let successMessage = "";
    let errorMessage = "";

    // Add to favorites
    if (buttonText.includes("Add")) {
      urlAction = PUT_ACTION;
      request = {
        recipeName: recipeName,
        recipeIngredients: recipeIngredients,
        recipeDirections: recipeDirections,
        recipeImage: recipeImage,
        recipeUri: recipeUri,
        recipeSource: recipeSource,
        recipeSourceUrl: recipeSourceUrl,
        recipeServings: servingsValue,
        recipeCalories: caloriesValue,
        recipeCaloriesUnits: caloriesUnit,
        recipeCarbs: carbsValue,
        recipeCarbsUnits: carbsUnit,
        recipeFats: fatValue,
        recipeFatsUnits: fatUnit,
        recipeProtein: proteinValue,
        recipeProteinUnits: proteinUnit,
        userCreated: false
      };
      newButtonText = REMOVE_FROM_FAVORITES;
      successMessage = SUCCESSFULLY_FAVORITE_RECIPE;
      errorMessage = UNABLE_TO_FAVORITE_UNEXPECTED_ERROR;
    }
    // Remove from favorites
    else if (buttonText.includes("Remove")) {
      urlAction = DELETE_ACTION;
      request = {
        recipeName: document.getElementById('recipe-name').textContent
      }
      newButtonText = ADD_TO_FAVORITES;
      successMessage = SUCCESSFULLY_UNFAVORITE_RECIPE;
      errorMessage = UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR;
    }
    // Delete recipe
    else {
      urlAction = DELETE_ACTION;
      request = {
        recipeName: document.getElementById('recipe-name').textContent
      }
      newButtonText = "";
      successMessage = SUCCESSFULLY_DELETED_RECIPE;
      errorMessage = UNABLE_TO_DELETE_RECIPE_ERROR;
    }

    let url = "";
    if (buttonText.includes("Add") || buttonText.includes("Remove")) {
      url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;
    } else {
      url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/delete_recipe`;
    }

    console.log(`Sending [${urlAction}] request to: ${url}`)

    fetch(url, {
      method: urlAction,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify({ favorites: request })
    }).then(response => {
      if (!response.ok) {
        throw new Error(errorMessage);
      }

      return response.json();
    }).then(data => {
      if (data.message === successMessage) {
        console.log(successMessage);
        utils.setStorage("deleteRecipeMessage", successMessage);
        window.location = MY_RECIPES_ROUTE;
      } else {
        console.log(successMessage);
        form.find("#addToFavorites").text(newButtonText);
        utils.showAjaxAlert("Success", successMessage);
      }
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
}

function hasAllData(source, sourceUrl, recipeUri) {
  return source && sourceUrl && recipeUri
}

function isValidResult(recipeDetails) {
  return recipeDetails && recipeDetails.count == 1;
}

function hasValidImage(recipe) {
  return recipe.images && ((recipe.images.LARGE && recipe.images.LARGE.url) ||
    (recipe.images.REGULAR && recipe.images.REGULAR.url));
}

async function checkIfFavorite(username, recipeName) {
  if (username == null || username == undefined) {
    console.debug("User not logged in. Not checking if recipe is a favorite");
    return false;
  }

  const userId = await utils.getUserIdFromUsername(username);

  const request = {
    recipeName: recipeName
  };

  const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;
  console.log(`Checking if recipe is a favorite at: ${url} with body: ${JSON.stringify(request, null, 2)}`)

  try {
    const response = await fetch(url, {
      method: POST_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify({ favorites: request })
    });

    if (!response.ok) {
      throw new Error(ERROR_OCCURRED_CHECKING_IF_RECIPE_FAVORITE);
    }

    const isFavorite = await response.json();
    console.log(`Recipe: [${recipeName}] is ${isFavorite ? "a favorite" : "not a favorite"}`);
    return isFavorite
  } catch (error) {
    console.error(error);
  }
}