function MyRecipesView() {
  const container = $('.my-recipes-container');

  this.load = async () => {
    try {
      const username = utils.getUserNameFromCookie();

      if (!username) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        return;
      }

      const userData = await utils.getUserFromUsername(username);

      if (!userData) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        return;
      }

      this.renderMyRecipes(userData);
    } catch (error) {
      console.error(INTERNAL_SERVER_ERROR_OCCURRED);
      utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
    }
  };

  this.renderMyRecipes = (userData) => {
    container.empty();

    const favoriteRecipes = userData.favorites;

    if (!favoriteRecipes || favoriteRecipes.length === 0) {
      container.append(this.getNoSavedRecipes());
      return;
    }

    console.log(`About to iterate through: ${favoriteRecipes.length} favorite recipes`);
    favoriteRecipes.forEach(recipe => {
      if (isValidRecipe(recipe)) {
        const source = recipe.recipeSource;
        const sourceUrl = recipe.recipeSourceUrl;

        const recipeSource = encodeURIComponent(source);
        const recipeSourceUrl = encodeURIComponent(sourceUrl);
        const recipeName = recipe.recipeName;
        const recipeCalories = Math.round(recipe.recipeCalories);
        const recipeUri = encodeURIComponent(recipe.recipeUri);
        const recipeImage = hasValidImage(recipe) ? recipe.recipeImage : NO_IMAGE_AVAILABLE;

        const recipeHtml = `
          <div class="box">
              <a onclick="window.location.href='/recipes/recipe_details?source=${recipeSource}&sourceUrl=${recipeSourceUrl}&uri=${recipeUri}'">
                  <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
              </a>
              <h2>${recipeName}</h2>
              <p>Calories: ${recipeCalories}</p>
          </div>`;

        console.debug(`Adding [${recipeName}] from source: [${source}], sourceUrl: [${sourceUrl}]`);
        container.append(recipeHtml);
      }
    });
  };

  this.getNoSavedRecipes = () => {
    return `
        <div>
            <h2>${NO_SAVED_RECIPES}</h2>
        </div>`;
  }
}

function hasFavoriteRecipes(userData) {
  return userData.favorites && userData.favorites.length > 0;
}

/**
 * Checks to see if the recipe has the minimal amount of data that will be used to create 
 * the view for the user and allow the user to redirect to the recipe details
 * 
 * @param {object} recipe 
 * @returns true if meets minimum requirements, false otherwise
 */
function isValidRecipe(recipe) {
  return recipe && recipe.recipeName && recipe.recipeUri
    && recipe.recipeCalories && recipe.recipeSource && recipe.recipeSourceUrl;
}

function hasValidImage(recipe) {
  return recipe.recipeImage && recipe.recipeImage !== "";
}
