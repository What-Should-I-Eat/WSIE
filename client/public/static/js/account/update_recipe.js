$(document).ready(function () {
  $("#updateRecipeForm").on("submit", async function (event) {
    event.preventDefault();
    const username = utils.getUserNameFromCookie();
    const userId = await utils.getUserIdFromUsername(username);
    let formRecipeName = document.getElementById('recipeName');
    
    let urlAction = "";
    let request = {};
    let successMessage = "";
    let errorMessage = "";

    urlAction = DELETE_ACTION;
    request = {
      recipeName: formRecipeName.value
    }
    successMessage = SUCCESSFULLY_DELETED_RECIPE;
    errorMessage = UNABLE_TO_DELETE_RECIPE_ERROR;
    
    let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/delete_recipe`;
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
    }).then(data => {
      if (data.message === successMessage) {
        console.log(successMessage);
        utils.setStorage("deleteRecipeMessage", successMessage);
      }
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });

    if (!username) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      return;
    }

    if (!userId) {
      console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
      return;
    }

    const formData = new FormData(this);
    formData.append('userCreated', true);
    console.log("FORM DATA: " + formData);

    url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/update_recipe`;
    console.log(`Sending request to: ${url}`);

    fetch(url, {
      method: POST_ACTION,
      body: formData,
    }).then(response => {
      if (response.ok) {
        console.log(SUCCESSFULLY_UPDATED_RECIPE);
        utils.setStorage("createRecipeMessage", SUCCESSFULLY_UPDATED_RECIPE);
        window.location = MY_RECIPES_ROUTE;
      } else {
        throw new Error(UNABLE_TO_UPDATE_RECIPE_UNEXPECTED_ERROR);
      }
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
});

function UserRecipeDetailsView() {

  this.loadUserRecipe = async (userRecipeName) => {
    try {
      console.log("Loading view from user created recipe");

      const userRecipeDetails = await this.getUserRecipe(userRecipeName);
      console.log(userRecipeDetails);
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

  this.buildUserView = async (recipe) => {
    let formRecipeName = document.getElementById('recipeName');
    formRecipeName.value = recipe.recipeName;
    let formRecipeIngredients = document.getElementById('recipeIngredients');
    formRecipeIngredients.value = recipe.recipeIngredients;
    let formRecipeDirections = document.getElementById('recipeDirections');
    formRecipeDirections.value = recipe.recipeDirections;
    let formRecipeServings = document.getElementById('recipeServings');
    formRecipeServings.value = recipe.recipeServings;
    let formRecipeCalories = document.getElementById('recipeCalories');
    formRecipeCalories.value = recipe.recipeCalories;
    let formRecipeCarbs = document.getElementById('recipeCarbs');
    formRecipeCarbs.value = recipe.recipeCarbs;
    let formRecipeFats = document.getElementById('recipeFats');
    formRecipeFats.value = recipe.recipeFats;
    let formRecipeProtein = document.getElementById('recipeProtein');
    formRecipeProtein.value = recipe.recipeProtein;
    let formRecipeImage = document.getElementById('userRecipeImage');
    formRecipeImage.value = recipe.userRecipeImage;
  };
}