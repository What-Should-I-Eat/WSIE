function RecipesView() {
  const addedRecipesSet = new Set();
  this.userRecipesLoaded = false; 
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
  
      // Fetch user-published recipes only on the first page load
      let publicUserRecipes = [];
      if (!this.userRecipesLoaded) {
        publicUserRecipes = await this.getPublicUserRecipes();
        this.userRecipesLoaded = true; // Mark that user recipes are loaded, so they won't be fetched again
      }
  
      if (hasRecipeHits(recipes)) {
        console.log(`Fetched Recipe Results: [${recipes.from}-${recipes.to}]`);
        
        // Pass user-published recipes on the first load, otherwise pass an empty array
        this.renderRecipes(recipes, !this.userRecipesLoaded ? publicUserRecipes : [], container);
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

  this.renderRecipes = (recipes, publicUserRecipes, container) => {
    container.empty();
    addedRecipesSet.clear();
    let dropDownIndex = 0;
    
    recipes.hits.forEach(async data => {
      const recipe = data.recipe;
      const recipeUri = recipe.uri;
      const recipeUrl = recipe.url;
      const recipeSource = recipe.source;
      const recipeName = recipe.label;
      const identifier = `${recipe.label}-${recipe.source}`;
      const username = utils.getUserNameFromCookie();
      const isFavorite = await utils.checkIfFavorite(username, recipeName);

      const unfavoriteDropdown = `
      <div class="recipe-dropdown">
        <!-- three dots -->
        <div class="dotbutton btn-left" id="dotButton${dropDownIndex}" onclick="showDropdown(${dropDownIndex})">
        </div>
        <!-- menu -->
        <div id="myDropdown${dropDownIndex}" class="dropdown-content">
            <button id="removeFavorite" onClick="utils.unfavoriteRecipe('${recipeName}')">Unfavorite</button>
        </div>
        </div>`;
      const favoriteDropdown = `
      <div class="recipe-dropdown">
            <!-- three dots -->
            <div class="dotbutton btn-left" id="dotButton${dropDownIndex}" onclick="showDropdown(${dropDownIndex})">
            </div>
            <!-- menu -->
            <div id="myDropdown${dropDownIndex}" class="dropdown-content">
              <button id="addFavorite" onClick="favoriteEdamamRecipe('${recipeUri} + ${recipeUrl} + ${recipeSource}')">Favorite</button>
            </div>
        </div>`;
      let setFavoriteDropdown = isFavorite ? unfavoriteDropdown : favoriteDropdown;

      if (!addedRecipesSet.has(identifier)) {
        addedRecipesSet.add(identifier);
        const recipeImage = hasValidImage(recipe) ? recipe.images.REGULAR.url : NO_IMAGE_AVAILABLE;

        const recipeHtml = `
          <div class="box box-shadow-custom">
            <a href="/recipes/recipe_details?source=${encodeURIComponent(recipe.source)}&sourceUrl=${encodeURIComponent(recipe.url)}&uri=${encodeURIComponent(recipe.uri)}">
              <img src="${recipeImage}" alt="${recipe.label}" title="View more about ${recipe.label}">
            </a>
            ${setFavoriteDropdown}
            <h4>${recipe.label}</h4>
          </div>`;

        console.debug(`Adding [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
        container.append(recipeHtml);
      } else {
        console.debug(`Skipping duplicate recipe: [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
      }
      dropDownIndex++;
    });

    // Render public user recipes only if they are passed (which happens only on the first page)
    if (publicUserRecipes.length > 0) {
      publicUserRecipes.forEach(async recipe => {
        const recipeName = recipe.recipeName;
        const recipeImage = hasValidUserCreatedImage(recipe) ? recipe.recipeImage : NO_IMAGE_AVAILABLE;

        const username = utils.getUserNameFromCookie();
        const isOwner = username && username === recipe.usernameCreator;
        const icon = isOwner ? PUBLIC_RECIPE_OWNER_ICON : PUBLIC_RECIPE_ICON;
        const parameter = isOwner ? PUBLIC_RECIPE_OWNER_URL_PARAMETER : PUBLIC_RECIPE_URL_PARAMETER;
        const recipeType = isOwner ? "user" : "public user";
        const isFavorite = await utils.checkIfFavorite(username, recipeName);

        const unfavoriteDropdown = `
        <div class="recipe-dropdown">
          <!-- three dots -->
          <div class="dotbutton btn-left" id="dotButton${dropDownIndex}" onclick="showDropdown(${dropDownIndex})">
          </div>
          <!-- menu -->
          <div id="myDropdown${dropDownIndex}" class="dropdown-content">
              <button id="removeFavorite" onClick="utils.unfavoriteRecipe('${recipeName}')">Unfavorite</button>
          </div>
          </div>`;

        const favoriteDropdown = `
        <div class="recipe-dropdown">
              <!-- three dots -->
              <div class="dotbutton btn-left" id="dotButton${dropDownIndex}" onclick="showDropdown(${dropDownIndex})">
              </div>
              <!-- menu -->
              <div id="myDropdown${dropDownIndex}" class="dropdown-content">
                <button id="addFavorite" onClick="favoriteUserRecipe('${recipeName}')">Favorite</button>
              </div>
          </div>`;
        let setFavoriteDropdown = isFavorite ? unfavoriteDropdown : favoriteDropdown;

        const updateAndDeleteDropdown = `
        <div class="recipe-dropdown">
                <!-- three dots -->
                <div class="dotbutton btn-left" id="dotButton${dropDownIndex}" onclick="showDropdown(${dropDownIndex})">
                </div>
                <!-- menu -->
                <div id="myDropdown${dropDownIndex}" class="dropdown-content">
                    <button id="updateRecipe" onClick="utils.updateRecipe('${recipeName}')">Update</button>
                    <br><button id="deleteRecipe" onClick="utils.deleteRecipe('${recipeName}')">Delete</button>
                </div>
            </div>`;
        let setUserDropdown = isOwner ? updateAndDeleteDropdown : setFavoriteDropdown;

        const recipeHtml = `
          <div class="box box-shadow-custom">
              <a href="/recipes/recipe_details?${parameter}=${encodeURIComponent(recipeName)}">
                  <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
              </a>
              <div class="user-icon">
                  <i class="fas ${icon}"></i>
              </div>
              ${setUserDropdown}
              <h3>${recipeName}</h3>
          </div>`;

        console.debug(`Adding ${recipeType} created recipe: [${recipeName}]`);
        container.append(recipeHtml);
        dropDownIndex++;
      });
    }
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

function hasValidUserCreatedImage(recipe) {
  return recipe.recipeImage && recipe.recipeImage !== "";
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

async function favoriteEdamamRecipe(recipeContent){
  const userId = await utils.checkUserIdAndUsername();
  if(userId){
    const myArray = recipeContent.split("+");
    let recipeUri = myArray[0].substring(0,myArray[0].length-1);
    let sourceUrl = myArray[1];
    let source = myArray[2];
    const recipeDetails = await getRecipeDetails(recipeUri);
    const recipe = recipeDetails.hits[0].recipe;
    const recipeInstructions = await getRecipeInstructions(source, sourceUrl, recipe.label);
    let recipeName = recipe.label;
    let imageSrc = NO_IMAGE_AVAILABLE;
    if (hasValidImage(recipe)) {
      // Use the LARGE as default in recipe details
      if (recipe.images.LARGE && recipe.images.LARGE.url) {
        imageSrc = await utils.getEdamamRecipeImage(recipe.images.LARGE.url);
      } else {
        imageSrc = await utils.getEdamamRecipeImage(recipe.images.REGULAR.url);
      }
    }
    
    let request = {
      recipeName: recipeName,
      recipeIngredients: recipe.ingredientLines,
      recipeDirections: recipeInstructions,
      recipeImage: imageSrc,
      recipeUri: recipeUri,
      recipeSource: source,
      recipeSourceUrl: sourceUrl,
      recipeServings: Math.round(recipe.yield),
      recipeCalories: Math.round(recipe.totalNutrients.ENERC_KCAL.quantity),
      recipeCaloriesUnits: recipe.totalNutrients.ENERC_KCAL.unit,
      recipeCarbs: Math.round(recipe.totalNutrients.CHOCDF.quantity),
      recipeCarbsUnits: recipe.totalNutrients.CHOCDF.unit,
      recipeFats: Math.round(recipe.totalNutrients.FAT.quantity),
      recipeFatsUnits: recipe.totalNutrients.FAT.unit,
      recipeProtein: Math.round(recipe.totalNutrients.PROCNT.quantity),
      recipeProteinUnits: recipe.totalNutrients.PROCNT.unit,
      userCreated: false
    };

    let successMessage = SUCCESSFULLY_FAVORITE_RECIPE;
    let errorMessage = UNABLE_TO_FAVORITE_UNEXPECTED_ERROR;
    let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;

    try {
      const response = await fetch(url, {
        method: PUT_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        },
        body: JSON.stringify({ favorites: request })
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error(responseData.error || errorMessage);
        throw new Error(responseData.error || errorMessage);
      } else {
        console.log(responseData.message || successMessage);
        utils.setStorage("favoriteRecipeMessage", responseData.message || successMessage);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
    }
  }
}

async function favoriteUserRecipe(userRecipeName){
  const userId = await utils.checkUserIdAndUsername();
  if(userId){
    const recipe = await getUserRecipe(userRecipeName);
    let request = {
      recipeName: recipe.recipeName,
      recipeIngredients: recipe.recipeIngredients,
      recipeDirections: recipe.recipeDirections,
      recipeImage: recipe.recipeImage,
      recipeUri: recipe.recipeUri,
      recipeSource: recipe.recipeSource,
      recipeSourceUrl: recipe.recipeSourceUrl,
      recipeServings: Math.round(recipe.recipeServings),
      recipeCalories: Math.round(recipe.recipeCalories),
      recipeCaloriesUnits: recipe.recipeCaloriesUnits,
      recipeCarbs: Math.round(recipe.recipeCarbs),
      recipeCarbsUnits: recipe.recipeCarbsUnits,
      recipeFats: Math.round(recipe.recipeFats),
      recipeFatsUnits: recipe.recipeFatsUnits,
      recipeProtein: Math.round(recipe.recipeProtein),
      recipeProteinUnits: recipe.recipeProteinUnits,
      userCreated: recipe.userCreated
    };

    let successMessage = SUCCESSFULLY_FAVORITE_RECIPE;
    let errorMessage = UNABLE_TO_FAVORITE_UNEXPECTED_ERROR;
    let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;

    try {
      const response = await fetch(url, {
        method: PUT_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        },
        body: JSON.stringify({ favorites: request })
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error(responseData.error || errorMessage);
        throw new Error(responseData.error || errorMessage);
      } else {
        console.log(responseData.message || successMessage);
        utils.setStorage("favoriteRecipeMessage", responseData.message || successMessage);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
    }
  }
}

function hasValidImage(recipe) {
  return recipe.images && ((recipe.images.LARGE && recipe.images.LARGE.url) ||
    (recipe.images.REGULAR && recipe.images.REGULAR.url));
}

async function getRecipeDetails(recipeUri) {
  const uri = encodeURIComponent(recipeUri);
  const apiUrl = `${EDAMAM_RECIPE_URI_URL}=${uri}`;

  const response = await fetch(apiUrl, {
    method: GET_ACTION,
    headers: {
      'Accept': DEFAULT_DATA_TYPE,
      'Content-Type': DEFAULT_DATA_TYPE
    }
  });

  if (response.ok) {
    const recipeDetails = await response.json();
    return recipeDetails;
  } else {
    console.error("Error occurred getting recipe details");
    return undefined;
  }
}

async function getRecipeInstructions(source, sourceUrl, recipeName) {
  const sourceTrimmed = source.toLowerCase().trim();
  const apiUrl = `${RECIPE_SCRAPE_URL}/?recipeLink=${sourceUrl}&source=${sourceTrimmed}&recipeName=${recipeName}`;

  const response = await fetch(apiUrl, {
    method: GET_ACTION,
    headers: {
      'Accept': DEFAULT_DATA_TYPE,
      'Content-Type': DEFAULT_DATA_TYPE
    }
  });

  if (response.ok) {
    const details = await response.json();
    return details;
  } else {
    console.error("Error occurred getting recipe instructions");
    return undefined;
  }
}

async function getUserRecipe(recipeName){
  const url = `${PUBLIC_USER_RECIPE_URL}?recipeName=${recipeName}`;

    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const details = await response.json();
      return details;
    } else {
      console.error(`Error occurred getting public user recipe for ${recipeName}`);
      return undefined;
    }
}

function changeLanguage(language) {
  var element = document.getElementById("url");
  element.value = language;
  element.innerHTML = language;
}

function showDropdown(dropDownIndex) {
  document.getElementById("myDropdown"+dropDownIndex).classList.toggle("show");
}

var currentDotButton;
var lastDotButton;

window.onclick = function(event) {
  //click off any dot button, close dropdowns
  if (!event.target.matches('.dotbutton')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
  //click on another dot button, close all but that dropdown
  }else{
    currentDotButton = event.target.id;
    let text = currentDotButton;
    const myArray = text.split("dotButton");
    let index = myArray[1];
    if(currentDotButton != lastDotButton){
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
      document.getElementById("myDropdown"+index).classList.toggle("show");
      lastDotButton = currentDotButton;
    }
  }
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