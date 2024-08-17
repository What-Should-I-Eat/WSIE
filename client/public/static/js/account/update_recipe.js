function UserRecipeDetailsView() {

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

  this.getUserRecipe = async (recipeName) => {
    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
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

  this.buildUserView = async (recipe) => {
    let formRecipeObjectId = document.getElementById('recipeObjectId');
    formRecipeObjectId.value = recipe._id;

    let formRecipeName = document.getElementById('recipeName');
    formRecipeName.value = recipe.recipeName;
    formRecipeName.setAttribute('data-initial-value', recipe.recipeName);

    let formRecipeIngredients = document.getElementById('recipeIngredients');
    formRecipeIngredients.value = recipe.recipeIngredients;
    formRecipeIngredients.setAttribute('data-initial-value', recipe.recipeIngredients);

    let formRecipeDirections = document.getElementById('recipeDirections');
    formRecipeDirections.value = recipe.recipeDirections;
    formRecipeDirections.setAttribute('data-initial-value', recipe.recipeDirections);

    let formRecipeServings = document.getElementById('recipeServings');
    formRecipeServings.value = recipe.recipeServings;
    formRecipeServings.setAttribute('data-initial-value', recipe.recipeServings);

    let formRecipeCalories = document.getElementById('recipeCalories');
    formRecipeCalories.value = recipe.recipeCalories;
    formRecipeCalories.setAttribute('data-initial-value', recipe.recipeCalories);

    let formRecipeCarbs = document.getElementById('recipeCarbs');
    formRecipeCarbs.value = recipe.recipeCarbs;
    formRecipeCarbs.setAttribute('data-initial-value', recipe.recipeCarbs);

    let formRecipeFats = document.getElementById('recipeFats');
    formRecipeFats.value = recipe.recipeFats;
    formRecipeFats.setAttribute('data-initial-value', recipe.recipeFats);

    let formRecipeProtein = document.getElementById('recipeProtein');
    formRecipeProtein.value = recipe.recipeProtein;
    formRecipeProtein.setAttribute('data-initial-value', recipe.recipeProtein);

    document.getElementById('currentImage').src = await utils.getUserRecipeImage(recipe);
    document.getElementById('currentImage').alt = `Image of ${recipe.recipeName}`;
  };

  $("#updateRecipeForm").on("submit", async function (event) {
    event.preventDefault();

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      return;
    }

    if (!formHasChanges(this)) {
      console.warn(NO_USER_RECIPE_CHANGES_DETECTED);
      utils.showAjaxAlert("Warning", NO_USER_RECIPE_CHANGES_DETECTED);
      return;
    }

    const formData = new FormData(this);
    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/update_recipe`;
    console.log(`Sending request to: ${url}`);
    fetch(url, {
      method: PUT_ACTION,
      body: formData,
    }).then(async response => {
      if (response.ok) {
        console.log(SUCCESSFULLY_UPDATED_RECIPE);
        utils.setStorage("createRecipeMessage", SUCCESSFULLY_UPDATED_RECIPE);
        window.location = MY_RECIPES_ROUTE;
      } else {
        throw new Error(UNABLE_TO_UPDATE_RECIPE_ERROR);
      }
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
}

/**
 * Checks to see if any of the input fields have changed
 * 
 * @param {formObject} form 
 * @returns true if the form has changes, false otherwise
 */
function formHasChanges(form) {
  let hasChanges = false;
  const inputs = form.querySelectorAll('input');

  inputs.forEach(input => {
    // Skip input if it has an id of 'recipeObjectId'
    if (input.id === 'recipeObjectId') {
      return;
    }

    if (input.type !== 'submit' && !input.readOnly) {
      const initialValue = input.getAttribute('data-initial-value');
      if (input.value !== initialValue) {
        hasChanges = true;
      }
    }
  });

  if (!isImageSelected()) {
    hasChanges = false;
  }

  return hasChanges;
}

function isImageSelected() {
  const fileInput = document.getElementById('userRecipeImage');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
      return true;
    }
  }

  return false;
}