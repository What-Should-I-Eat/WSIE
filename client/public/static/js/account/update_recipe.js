$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const userRecipeName = params.get('userRecipeName');

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

    let details = "";
    let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/get_recipe?recipeName=${userRecipeName}`;
    console.log(`Querying Server at: ${url}`);

    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      details = await response.json();
    } else {
      console.error(`Error occurred getting user recipe for ${userRecipeName}`);
    }

    let changesFound = compareUpdates(details);
    if(changesFound != 0){
      const formData = new FormData(this);
      formData.append('favoriteId',details._id);
      url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/update_recipe`;
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
          throw new Error(UNABLE_TO_UPDATE_RECIPE_UNEXPECTED_ERROR);
        }
      }).catch(error => {
        console.log(error);
        utils.showAjaxAlert("Error", error.message);
      });
    }else{
      utils.showAjaxAlert("Warning", "No changes to the recipe were made.");
    }
  });


  function compareUpdates(recipeDetails) {
    let changesFound = 0;
    changesFound = recipeDetails.recipeName.localeCompare(document.getElementById('recipeName').value);
    const origIngredientsString = recipeDetails.recipeIngredients[0].replace(/(?:\r\n|\r|\n)/g, '');
    const newIngredientsString = document.getElementById('recipeIngredients').value.replace(/(?:\r\n|\r|\n)/g, '');
    changesFound += Math.abs(origIngredientsString.localeCompare(newIngredientsString));
    const origDirectionsString = recipeDetails.recipeDirections[0].replace(/(?:\r\n|\r|\n)/g, '');
    const newDirectionsString = document.getElementById('recipeDirections').value.replace(/(?:\r\n|\r|\n)/g, '');
    changesFound += Math.abs(origDirectionsString.localeCompare(newDirectionsString));
    changesFound += (recipeDetails.recipeServings == document.getElementById('recipeServings').value) ? 0 : 1;
    changesFound += (recipeDetails.recipeCalories == document.getElementById('recipeCalories').value) ? 0 : 1;
    changesFound += (recipeDetails.recipeCarbs == document.getElementById('recipeCarbs').value) ? 0 : 1;
    changesFound += (recipeDetails.recipeFats == document.getElementById('recipeFats').value) ? 0 : 1;
    changesFound += (recipeDetails.recipeProtein == document.getElementById('recipeProtein').value) ? 0 : 1;
    changesFound += document.getElementById('userRecipeImage').value;
    return changesFound;
  }

});

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
    document.getElementById('currentImage').src = await utils.getUserRecipeImage(recipe);
    document.getElementById('currentImage').alt = `Image of ${recipe.recipeName}`;
  };
}