const recipesView = new RecipesView();

function RecipesView() {
  const addedRecipesSet = new Set();
  this.initialPageFromTo = "1-20";
  this.currentPageFromTo = this.initialPageFromTo;
  this.historyMap = new Map();
  this.nextPageUrl = null;
  this.initialPageUrl = null;

  this.load = async (searchParam, apiUrl = null, pageUrl = null, mealTypes = [], dishTypes = [], cuisineTypes = []) => {
    const container = $('.recipes-container');
    const pagination = $("#paginationList");

    try {
      const url = await this.getApiUrl(searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes);
      const recipes = await this.getRecipes(url);

      if (hasRecipeHits(recipes)) {
        console.log(`Fetched Recipe Results: [${recipes.from}-${recipes.to}]`);
        this.renderRecipes(recipes, container);
        this.updatePagination(recipes, url, `${recipes.from}-${recipes.to}`, mealTypes, dishTypes, cuisineTypes);
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

  this.buildBaseUrl = (searchParam, mealTypes, dishTypes, cuisineTypes) => {
    const userSelectedMealTypes = mealTypes
      .filter(mealType => mealType)
      .map(mealType => `&mealType=${encodeURIComponent(mealType.toLowerCase())}`)
      .join('');

    const userSelectedDishTypes = dishTypes
      .filter(dishType => dishType)
      .map(dishType => `&dishType=${encodeURIComponent(dishType.toLowerCase())}`)
      .join('');

    const userSelectedCuisineTypes = cuisineTypes
      .filter(cuisineType => cuisineType)
      .map(cuisineType => `&cuisineType=${encodeURIComponent(cuisineType.toLowerCase())}`)
      .join('');

    console.debug(`searchParam: ${searchParam}`);

    let baseUrl = searchParam ? `${EDAMAM_API_URL}${searchParam}` : EDAMAM_API_EMPTY_SEARCH_URL;

    if (userSelectedMealTypes) {
      console.debug(`Added [userSelectedMealTypes] to query: ${userSelectedMealTypes}`);
      baseUrl += userSelectedMealTypes;
    }

    if (userSelectedDishTypes) {
      console.debug(`Added [userSelectedDishTypes] to query: ${userSelectedDishTypes}`);
      baseUrl += userSelectedDishTypes;
    }

    if (userSelectedCuisineTypes) {
      console.debug(`Added [userSelectedCuisineTypes] to query: ${userSelectedCuisineTypes}`);
      baseUrl += userSelectedCuisineTypes;
    }

    // If the user did not provide a search parameter or filters, show the user meals based on the current time
    if (!searchParam && !userSelectedMealTypes && !userSelectedDishTypes && !userSelectedCuisineTypes) {
      baseUrl += `${getCurrentTimeMealType()}`;
    }

    return baseUrl;
  };

  this.getApiUrl = async (searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes) => {
    if (pageUrl) return pageUrl;

    let baseUrl = apiUrl || this.initialPageUrl;

    if (!baseUrl) {
      baseUrl = this.buildBaseUrl(searchParam, mealTypes, dishTypes, cuisineTypes);

      const username = utils.getUserNameFromCookie();
      if (username) {
        try {
          const userData = await utils.getUserFromUsername(username);
          const userDietString = getUserDietString(userData.diet);
          const userHealthString = getUserHealthString(userData.health);

          if (userDietString) {
            console.debug(`Added [userDietString] to query: ${userDietString}`);
            baseUrl += userDietString
          }

          if (userHealthString) {
            console.debug(`Added [userHealthString] to query: ${userHealthString}`);
            baseUrl += userHealthString
          }
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
          </div>`;

        console.debug(`Adding [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
        container.append(recipeHtml);
      } else {
        console.debug(`Skipping duplicate recipe: [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
      }
    });
  };

  this.updatePagination = (recipes, currentUrl, fromTo, mealTypes, dishTypes, cuisineTypes) => {
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
          this.load(null, null, pageUrl, mealTypes, dishTypes, cuisineTypes);
          utils.scrollToTop();
        });
      }
      $pageItem.append($pageLink);
      return $pageItem;
    };

    if (!this.historyMap.has(fromTo)) {
      this.historyMap.set(fromTo, currentUrl);
    }

    const isInitialPage = fromTo === this.initialPageFromTo;
    const previousPageFromTo = this.getPreviousPageFromTo(fromTo);
    const previousPageUrl = this.historyMap.get(previousPageFromTo);
    $pagination.append(addPageLink('Previous', previousPageUrl, isInitialPage));

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

function getDefaultDishTypes() {
  return defaultDishTypes.map(dishType => `&dishType=${encodeURIComponent(dishType)}`).join('');
}

const defaultDishTypes = [
  "bread",
  "cereals",
  "egg",
  "main course",
  "pancake",
  "pasta",
  "pizza",
  "preps",
  "preserve",
  "salad",
  "sandwiches",
  "seafood",
  "soup",
  "special occasions"
];

function getDefaultCuisineTypes() {
  return defaultCuisineTypes.map(cuisineType => `&cuisineType=${encodeURIComponent(cuisineType)}`).join('');
}

const defaultCuisineTypes = [
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

const mealTypeSelections = [];
const dishTypeSelections = [];
const cuisineTypeSelections = [];

function clearAllSelections() {
  document.querySelectorAll('.form-check-input').forEach(checkbox => checkbox.checked = false);
  mealTypeSelections.length = 0;
  dishTypeSelections.length = 0;
  cuisineTypeSelections.length = 0;
  utils.removeFromStorage('mealTypeSelections');
  utils.removeFromStorage('dishTypeSelections');
  utils.removeFromStorage('cuisineTypeSelections');
  console.log('All selections cleared');
}

function loadSelectionsFromStorage() {
  const storedMealTypes = utils.getFromStorage('mealTypeSelections');
  const storedDishTypes = utils.getFromStorage('dishTypeSelections');
  const storedCuisineTypes = utils.getFromStorage('cuisineTypeSelections');

  if (storedMealTypes) mealTypeSelections.push(...storedMealTypes);
  if (storedDishTypes) dishTypeSelections.push(...storedDishTypes);
  if (storedCuisineTypes) cuisineTypeSelections.push(...storedCuisineTypes);

  document.querySelectorAll('.form-check-input').forEach(checkbox => {
    const category = checkbox.getAttribute('data-category');
    const checkboxLabel = checkbox.nextElementSibling.innerText.toLowerCase();

    if ((category === 'mealType' && mealTypeSelections.includes(checkboxLabel)) ||
      (category === 'dishType' && dishTypeSelections.includes(checkboxLabel)) ||
      (category === 'cuisineType' && cuisineTypeSelections.includes(checkboxLabel))) {
      checkbox.checked = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loadSelectionsFromStorage();

  document.querySelectorAll('.form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const category = this.getAttribute('data-category');
      const checkboxLabel = this.nextElementSibling.innerText.toLowerCase();
      let selectionArray;

      switch (category) {
        case 'mealType':
          selectionArray = mealTypeSelections;
          break;
        case 'dishType':
          selectionArray = dishTypeSelections;
          break;
        case 'cuisineType':
          selectionArray = cuisineTypeSelections;
          break;
      }

      if (this.checked) {
        selectionArray.push(checkboxLabel);
        console.debug(`[${checkboxLabel}] added to [${category}]`);
      } else {
        const index = selectionArray.indexOf(checkboxLabel);
        if (index > -1) {
          selectionArray.splice(index, 1);
          console.debug(`[${checkboxLabel}] removed from [${category}]`);
        }
      }

      utils.setStorage('mealTypeSelections', mealTypeSelections);
      utils.setStorage('dishTypeSelections', dishTypeSelections);
      utils.setStorage('cuisineTypeSelections', cuisineTypeSelections);
    });
  });

  document.getElementById('clearSelections').addEventListener('click', function () {
    clearAllSelections();
  });

  $('#recipe-filter-modal').on('hidden.bs.modal', function () {
    clearAllSelections();
  });

  document.getElementById('applyFilter').addEventListener('click', function () {
    $('#recipe-filter-modal').modal('hide');
    document.querySelector('.recipe-search-btn').click();
  });

  const params = new URLSearchParams(window.location.search);
  const search = params.get('search_recipes');
  if (search) {
    document.getElementById('search_recipes').value = search;
  }
  recipesView.load(search, null, null, mealTypeSelections, dishTypeSelections, cuisineTypeSelections);
});