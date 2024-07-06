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
    favoriteRecipes.forEach(async recipe => {
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
              <a href="/recipes/recipe_details?source=${recipeSource}&sourceUrl=${recipeSourceUrl}&uri=${recipeUri}">
                  <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
              </a>
              <h2>${recipeName}</h2>
              <p>Calories: ${recipeCalories}</p>
          </div>`;

        console.debug(`Adding [${recipeName}] from source: [${source}], sourceUrl: [${sourceUrl}]`);
        container.append(recipeHtml);
      } else if (recipe.userCreated) {
        const recipeName = recipe.recipeName;
        const recipeCalories = Math.round(recipe.recipeCalories);
        const recipeImage = await utils.getUserRecipeImage(recipe);

        const recipeHtml = `
          <div class="box">
              <a href="/recipes/recipe_details?userRecipeName=${encodeURIComponent(recipeName)}">
                <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
              </a>
              <h3>${recipeName}</h3>
              <p>Calories: ${recipeCalories}</p>
          </div>`;

        console.debug(`Adding user created recipe: [${recipeName}]`);
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

/**
 * Checks if a recipe is valid by ensuring all necessary fields are present.
 * @param {Object} recipe - A recipe object.
 * @returns {boolean} - True if the recipe is valid, false otherwise.
 */
function isValidRecipe(recipe) {
  return recipe && recipe.recipeName && recipe.recipeUri && recipe.recipeCalories && recipe.recipeSource && recipe.recipeSourceUrl;
}

/**
 * Checks if a recipe has a valid non-empty image URL.
 * @param {Object} recipe - A recipe object.
 * @returns {boolean} - True if the image is valid, false otherwise.
 */
function hasValidImage(recipe) {
  return recipe.recipeImage && recipe.recipeImage !== "";
}
