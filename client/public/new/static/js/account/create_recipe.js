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
    formData.append('userCreated', true);

    const url = `${USER_FAVORITE_RECIPE}/${userId}/create_recipes`;
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
