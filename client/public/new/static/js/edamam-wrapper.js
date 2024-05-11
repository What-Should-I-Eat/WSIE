$(document).ready(function () {
  const searchForm = $('#searchRecipesForm');
  const searchInput = $('#search_recipes');

  searchForm.on('submit', async function (event) {
    event.preventDefault();

    const searchData = searchInput.val();

    let apiUrl = EDAMAM_API_URL + searchData;

    const username = utils.getUserNameFromCookie();

    if (username) {
      try {
        const userData = await utils.getUserFromUsername(username);
        console.log("Adding user diet and health restrictions to Edamam query");
        const userDietString = getUserDietString(userData.diet);
        const userHealthString = getUserHealthString(userData.health);
        apiUrl += userDietString + userHealthString;
      } catch (error) {
        console.error(ERROR_UNABLE_TO_GET_USER, error);
        utils.showAjaxAlert("Error", ERROR_UNABLE_TO_GET_USER);
        return;
      }
    }

    console.log(`Querying Edamam using: ${apiUrl}`);

    fetch(apiUrl, {
      method: GET_ACTION,
      headers: {
        'Accept': DEFAULT_DATA_TYPE,
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(FAILED_TO_QUERY_EDAMAM);
      }
      return response.json();
    }).then(results => {
      utils.setStorage("recipes", JSON.stringify(results));
      utils.setStorage("recipesQuery", apiUrl);

      // Only redirect if on index.html
      if (window.location.href.includes(RECIPES_DIRECT)) {
        window.location.reload();
      } else {
        window.location.href = RECIPES_DIRECT;
      }
    }).catch(error => {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
});

function getUserDietString(dietArray) {
  return dietArray.length ? dietArray.map(dietItem => `&diet=${dietItem}`).join('') : "";
}

function getUserHealthString(healthArray) {
  return healthArray.length ? healthArray.map(healthItem => `&health=${healthItem}`).join('') : "";
}
