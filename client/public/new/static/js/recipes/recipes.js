function RecipesView() {
  const container = $('.recipes-container');
  const addedRecipesSet = new Set();

  this.load = async (searchParam) => {
    try {
      const recipes = await this.getRecipes(searchParam);

      if (recipes) {
        this.renderRecipes(recipes);
      } else {
        container.append(this.getNoRecipesFound());
      }
    } catch (error) {
      console.error(EDAMAM_QUERY_ERROR);
      // utils.showAjaxAlert("Error", EDAMAM_QUERY_ERROR);
      container.append(this.getNoRecipesFound());
    }
  };

  this.getRecipes = async (searchParam) => {
    let searchParamQuery = searchParam || "";

    let apiUrl = "";
    if (searchParamQuery) {
      console.log(`Received search parameter: [${searchParamQuery}]`);
      apiUrl = EDAMAM_API_URL + searchParamQuery;
    } else {
      const mealType = getCurrentTimeMealType();
      console.log(`Received empty search parameter. Querying for: ${mealType}`);
      apiUrl = EDAMAM_API_EMPTY_SEARCH_URL + mealType;
    }

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

    const response = await fetch(apiUrl, {
      method: GET_ACTION,
      headers: {
        'Accept': DEFAULT_DATA_TYPE,
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const recipes = await response.json();
      return recipes;
    } else {
      console.error(EDAMAM_QUERY_ERROR);
      throw new Error(EDAMAM_QUERY_ERROR);
    }
  }

  this.renderRecipes = (recipes) => {
    container.empty();

    const recipeResults = recipes.hits;

    if (!recipeResults || recipeResults.length === 0) {
      container.append(this.getNoRecipesFound());
      return;
    }

    console.log(`About to iterate through: ${recipeResults.length} recipes`);
    recipeResults.forEach(data => {
      const recipe = data.recipe;
      const source = recipe.source;
      const sourceUrl = recipe.url;

      const recipeSource = encodeURIComponent(source);
      const recipeSourceUrl = encodeURIComponent(sourceUrl);
      const recipeName = recipe.label;
      const recipeCalories = Math.round(recipe.calories);
      const recipeUri = encodeURIComponent(recipe.uri);
      // Store with name, source, and source url
      const identifier = `${recipeName}-${source}-${sourceUrl}`;

      if (!addedRecipesSet.has(identifier)) {
        addedRecipesSet.add(identifier);
        const recipeImage = hasValidImage(recipe) ? recipe.images.LARGE.url : NO_IMAGE_AVAILABLE;

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
      } else {
        console.debug(`Skipping duplicate recipe: [${recipeName}] from source: [${source}], sourceUrl: [${sourceUrl}]`);
      }
    });
  };

  this.getNoRecipesFound = () => {
    return `
        <div>
            <h2>${NO_RECIPES_FOUND}</h2>
        </div>`;
  }
}

function hasValidImage(recipe) {
  return recipe.images && recipe.images.LARGE && recipe.images.LARGE.url;
}

function getUserDietString(dietArray) {
  return dietArray.length ? dietArray.map(dietItem => `&diet=${dietItem}`).join('') : "";
}

function getUserHealthString(healthArray) {
  return healthArray.length ? healthArray.map(healthItem => `&health=${healthItem}`).join('') : "";
}

function getCurrentTimeMealType() {
  const hours = new Date().getHours();

  if (hours < 5 || hours > 21) {
    return "mealType=Snack";
  } else if (hours <= 10) {
    return "mealType=Breakfast";
  } else if (hours <= 15) {
    return "mealType=Lunch";
  } else {
    return "mealType=Dinner";
  }
}
