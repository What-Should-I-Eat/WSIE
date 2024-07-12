const recipesView = new RecipesView();

function RecipesView() {
  const addedRecipesSet = new Set();
  this.initialPageFromTo = "1-20";
  this.currentPageFromTo = this.initialPageFromTo;
  this.historyMap = new Map();
  this.nextPageUrl = null;
  this.initialPageUrl = null;

  this.load = async (searchParam, apiUrl = null, pageUrl = null) => {
    const container = $('.recipes-container');
    const pagination = $("#paginationList");

    try {
      const url = await this.getApiUrl(searchParam, apiUrl, pageUrl);
      const recipes = await this.getRecipes(url);

      if (hasRecipeHits(recipes)) {
        console.log(`Fetched Recipe Results: [${recipes.from}-${recipes.to}]`);
        this.renderRecipes(recipes, container);
        this.updatePagination(recipes, url, `${recipes.from}-${recipes.to}`);
        pagination.show();
      } else {
        console.warn(NO_RECIPES_FOUND);
        container.append(this.getNoRecipesFound());
        pagination.empty().hide();
      }
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
      container.append(this.getNoRecipesFound());
      pagination.empty().hide();
    }
  };

  this.getApiUrl = async (searchParam, apiUrl, pageUrl) => {
    if (pageUrl) return pageUrl;

    let baseUrl = apiUrl || this.initialPageUrl;

    if (!baseUrl) {
      const searchParamQuery = searchParam ?
        // Query search with filtered cuisine and dish types
        `${EDAMAM_API_URL}${searchParam}${getCuisineType()}${getDishType()}` :
        // Empty search, with filtered cuisine, meal types, and dish types
        `${EDAMAM_API_EMPTY_SEARCH_URL}${getCuisineType()}${getCurrentTimeMealType()}${getDishType()}`;

      baseUrl = searchParamQuery;

      const username = utils.getUserNameFromCookie();
      if (username) {
        try {
          const userData = await utils.getUserFromUsername(username);
          console.log("Adding user diet and health restrictions to Edamam query");
          const userDietString = getUserDietString(userData.diet);
          const userHealthString = getUserHealthString(userData.health);
          baseUrl += userDietString + userHealthString;
        } catch (error) {
          console.error(ERROR_UNABLE_TO_GET_USER, error);
          utils.showAjaxAlert("Error", ERROR_UNABLE_TO_GET_USER);
          return;
        }
      }

      this.initialPageUrl = baseUrl;
    }

    return baseUrl;
  };

  this.getRecipes = async (url) => {
    console.debug(`Querying Edamam using: ${url}`);

    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Accept': DEFAULT_DATA_TYPE,
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(EDAMAM_QUERY_ERROR);
    }
  };

  this.renderRecipes = (recipes, container) => {
    container.empty();
    addedRecipesSet.clear();

    recipes.hits.forEach(data => {
      const recipe = data.recipe;
      const identifier = `${recipe.label}-${recipe.source}`;

      if (!addedRecipesSet.has(identifier)) {
        addedRecipesSet.add(identifier);
        const recipeImage = hasValidImage(recipe) ? recipe.images.REGULAR.url : NO_IMAGE_AVAILABLE;

        const recipeHtml = `
            <div class="box">
                <a href="/recipes/recipe_details?source=${encodeURIComponent(recipe.source)}&sourceUrl=${encodeURIComponent(recipe.url)}&uri=${encodeURIComponent(recipe.uri)}">
                    <img src="${recipeImage}" alt="${recipe.label}" title="View more about ${recipe.label}">
                </a>
                <h4>${recipe.label}</h4>
                <p><a href="${recipe.url}" target="_blank">${recipe.source}</a></p>
            </div>`;

        console.debug(`Adding [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
        container.append(recipeHtml);
      } else {
        console.debug(`Skipping duplicate recipe: [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
      }
    });
  };

  this.updatePagination = (recipes, currentUrl, fromTo) => {
    const $pagination = $("#paginationList").empty();

    const addPageLink = (label, pageUrl, isDisabled = false) => {
      const $pageItem = $('<li class="page-item"></li>');
      const $pageLink = $(`<a class="page-link" href="#">${label}</a>`);
      if (isDisabled) {
        $pageItem.addClass("disabled");
        $pageLink.attr("tabindex", "-1").attr("aria-disabled", "true");
      } else {
        $pageLink.on("click", (e) => {
          e.preventDefault();
          this.load(null, null, pageUrl);
          utils.scrollToTop();
        });
      }
      $pageItem.append($pageLink);
      return $pageItem;
    };

    // Store the current URL in the history map if not already present
    if (!this.historyMap.has(fromTo)) {
      this.historyMap.set(fromTo, currentUrl);
    }

    // Previous Page
    const isInitialPage = fromTo === this.initialPageFromTo;
    const previousPageFromTo = this.getPreviousPageFromTo(fromTo);
    const previousPageUrl = this.historyMap.get(previousPageFromTo);
    $pagination.append(addPageLink('Previous', previousPageUrl, isInitialPage));

    // Next Page
    if (recipes._links && recipes._links.next && recipes._links.next.href) {
      const nextFromTo = `${recipes.to + 1}-${recipes.to + 20}`;
      if (!this.historyMap.has(nextFromTo)) {
        this.historyMap.set(nextFromTo, recipes._links.next.href);
      }
      this.nextPageUrl = recipes._links.next.href;
      $pagination.append(addPageLink('Next', this.nextPageUrl, false));
    }
  };

  this.getPreviousPageFromTo = (fromTo) => {
    const [from, to] = fromTo.split('-').map(Number);
    return `${from - 20}-${to - 20}`;
  };

  this.getNoRecipesFound = () => {
    return `
        <div>
            <h2>${NO_RECIPES_FOUND}</h2>
        </div>`;
  };
}

function hasRecipeHits(recipes) {
  return recipes && recipes.hits && recipes.hits.length > 0;
}

function hasValidImage(recipe) {
  return recipe.images && ((recipe.images.LARGE && recipe.images.LARGE.url) ||
    (recipe.images.REGULAR && recipe.images.REGULAR.url));
}

function getUserDietString(dietArray) {
  console.debug(`User Dietary Restrictions: [${dietArray}]`);
  return dietArray.length ? dietArray.map(dietItem => `&diet=${dietItem}`).join('') : "";
}

function getUserHealthString(healthArray) {
  console.debug(`User Health Restrictions: [${healthArray}]`);
  return healthArray.length ? healthArray.map(healthItem => `&health=${healthItem}`).join('') : "";
}

function getCurrentTimeMealType() {
  const hours = new Date().getHours();

  if (hours < 5 || hours > 21) {
    return "&mealType=snack";
  } else if (hours <= 10) {
    return "&mealType=breakfast";
  } else if (hours <= 15) {
    return "&mealType=lunch";
  } else {
    return "&mealType=dinner";
  }
}

function getDishType() {
  return edmamamDishTypes.map(dishType => `&dishType=${encodeURIComponent(dishType)}`).join('');
}

function getCuisineType() {
  return edamamCuisineTypes.map(cuisineType => `&cuisineType=${encodeURIComponent(cuisineType)}`).join('');
}

// This array was generated from this site: https://developer.edamam.com/edamam-docs-recipe-api
// 07/04/2024: A lot of the what I (Rob) would consider condiments, desserts, etc.
// are marked as starters. So, this API is not that reliable..
const edmamamDishTypes = [
  // "alcohol cocktail",
  // "biscuits and cookies",
  "bread",
  "cereals",
  // "condiments and sauces",
  // "desserts",
  // "drinks",
  "egg",
  // "ice cream and custard",
  "main course",
  "pancake",
  "pasta",
  // "pastry",
  // "pies and tarts",
  "pizza",
  "preps",
  "preserve",
  "salad",
  "sandwiches",
  "seafood",
  // "side dish",
  "soup",
  "special occasions",
  // "starter",
  // "sweets"
];

// This array was generated from this site: https://developer.edamam.com/edamam-docs-recipe-api
// 07/04/2024: Leave as American until we can have our own filter/sort on the HTML
const edamamCuisineTypes = [
  "american",
  "asian",
  "british",
  "caribbean",
  "central europe",
  "chinese",
  "eastern europe",
  "french",
  "greek",
  "indian",
  "italian",
  "japanese",
  "korean",
  "kosher",
  "mediterranean",
  "mexican",
  "middle eastern",
  "nordic",
  "south american",
  "south east asian",
  "world"
];
