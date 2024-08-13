$(document).ready(function () {
  $("#createRecipeForm").on("submit", async function (event) {
    event.preventDefault();

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_CREATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_CREATE_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_CREATE_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_CREATE_USER_NOT_LOGGED_IN);
      return;
    }

    const formData = new FormData(this);
    var seconds = new Date() / 1000;
    let hexUserName = 0;
    for(i = 0; i < username.length; i ++){
      hexUserName = hexUserName + username.charCodeAt(i).toString(16);
    }
    recipeId = hexUserName & seconds;
    formData.append('userCreated', true);
    formData.append('recipeId', recipeId);

    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/create_recipe`;
    console.log(`Sending request to: ${url}`);

    fetch(url, {
      method: POST_ACTION,
      body: formData,
    }).then(response => {
      if (response.ok) {
        console.log(SUCCESSFULLY_CREATED_RECIPE);
        utils.setStorage("createRecipeMessage", SUCCESSFULLY_CREATED_RECIPE);
        window.location = MY_RECIPES_ROUTE;
      } else {
        throw new Error(UNABLE_TO_CREATE_RECIPE_UNEXPECTED_ERROR);
      }
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
});
