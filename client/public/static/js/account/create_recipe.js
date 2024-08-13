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
    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/create_recipe`;
    console.log(`Sending request to: ${url}`);

    try {
      const response = await fetch(url, {
        method: POST_ACTION,
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData.message || SUCCESSFULLY_CREATED_RECIPE);
        utils.setStorage("createRecipeMessage", responseData.message || SUCCESSFULLY_CREATED_RECIPE);
        window.location = MY_RECIPES_ROUTE;
      } else {
        throw new Error(responseData.error || UNABLE_TO_CREATE_RECIPE_ERROR);
      }
    } catch (error) {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    }
  });
});
