function Recipes() {
  const container = $('.recipes-container');
  const addedRecipesSet = new Set();

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

      // if (isValidSource(source, sourceUrl)) {
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
      // }
    });
  };

  this.load = () => {
    const recipesData = utils.getFromStorage("recipes");

    if (recipesData) {
      const recipes = JSON.parse(recipesData);
      this.renderRecipes(recipes);
    } else {
      container.append(this.getNoRecipesFound());
    }

    const recipeQuery = utils.getFromStorage("recipesQuery");
    if (recipeQuery) {
      console.log(`Queried recipes with URL: ${recipeQuery}`);
    }
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

// NOTE: Need to use these functions because the server tries to scrape the site for the instructions
function isValidSource(source, sourceURL) {
  const viableSources = ['Martha Stewart', 'Food Network', 'Simply Recipes', 'Delish', 'EatingWell'];
  return source === 'BBC Good Food' ? isValidUrl(sourceURL) : viableSources.includes(source);
}

function isValidUrl(sourceUrl) {
  const penultimateChar = sourceUrl.charAt(sourceUrl.length - 2);
  console.log("penultimate char: ", penultimateChar);
  return !(penultimateChar >= '0' && penultimateChar <= '9');
}
