const recipesView = new RecipesView();
let showPublicRecipes = true; // Toggle to show/hide public recipes
let publicUserRecipes = []; // Store all user-published recipes
let currentPublicRecipePage = 1; // Current page for user-published recipes
const publicUserRecipesPerPage = 5; // Recipes per page for public recipes

function RecipesView() {
  const addedRecipesSet = new Set();
  this.initialPageFromTo = "1-20";
  this.currentPageFromTo = this.initialPageFromTo;
  this.historyMap = new Map();
  this.nextPageUrl = null;
  this.initialPageUrl = null;

  // Load recipes, including public user recipes if enabled
  this.load = async (searchParam, apiUrl = null, pageUrl = null, mealTypes = [], dishTypes = [], cuisineTypes = []) => {
    const container = document.querySelector('.recipes-container');
    const pagination = document.getElementById('paginationList');

    try {
      // Toggle button text for showing/hiding public recipes
      const toggleButton = document.getElementById('togglePublicRecipeShownButton');
      toggleButton.textContent = showPublicRecipes ? "Hide Public Recipes" : "Show Public Recipes";

      // Get API recipes
      const url = await this.getApiUrl(searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes);
      const recipes = await this.getRecipes(url);

      // Fetch public recipes once
      if (publicUserRecipes.length === 0 && showPublicRecipes) {
        publicUserRecipes = await this.getPublicUserRecipes();
      }

      // Get paginated public recipes for current page
      const paginatedPublicRecipes = this.getPaginatedPublicRecipes();

      if (hasRecipeHits(recipes)) {
        console.log(`Fetched Recipe Results: [${recipes.from}-${recipes.to}]`);
        this.renderRecipes(recipes, paginatedPublicRecipes, container);
        this.updatePagination(recipes, url, `${recipes.from}-${recipes.to}`, mealTypes, dishTypes, cuisineTypes);
        pagination.style.display = 'block';
      } else {
        console.warn("No recipes found.");
        container.innerHTML = this.getNoRecipesFound();
        pagination.style.display = 'none';
      }
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
      container.innerHTML = this.getNoRecipesFound();
      pagination.style.display = 'none';
    }
  };

  // Fetch paginated public recipes for the current page
  this.getPaginatedPublicRecipes = () => {
    const startIdx = (currentPublicRecipePage - 1) * publicUserRecipesPerPage;
    return publicUserRecipes.slice(startIdx, startIdx + publicUserRecipesPerPage);
  };

  // Render recipes, including public user recipes if enabled
  this.renderRecipes = (recipes, paginatedPublicRecipes, container) => {
    container.innerHTML = ''; // Clear container
    addedRecipesSet.clear(); // Clear duplicate tracking
    let dropDownIndex = 0;

    // Render API recipes
    recipes.hits.forEach((data) => {
      const recipe = data.recipe;
      this.renderSingleRecipe(recipe, dropDownIndex++, container);
    });

    // Render public user recipes
    if (showPublicRecipes && paginatedPublicRecipes.length > 0) {
      paginatedPublicRecipes.forEach((recipe) => {
        this.renderSinglePublicRecipe(recipe, dropDownIndex++, container);
      });
    }
  };

  // Render a single API recipe
  this.renderSingleRecipe = (recipe, index, container) => {
    const identifier = `${recipe.label}-${recipe.source}`;
    if (addedRecipesSet.has(identifier)) {
      return; // Skip duplicate recipes
    }
    addedRecipesSet.add(identifier);

    const recipeImage = recipe.images.REGULAR?.url || "no_image_available.png";
    const recipeHtml = `
      <div class="recipe-box">
        <img src="${recipeImage}" alt="${recipe.label}" />
        <h4>${recipe.label}</h4>
      </div>
    `;
    container.innerHTML += recipeHtml;
  };

  // Render a single public user recipe
  this.renderSinglePublicRecipe = (recipe, index, container) => {
    const identifier = `public-${recipe.recipeName}`;
    if (addedRecipesSet.has(identifier)) {
      return; // Skip duplicate recipes
    }
    addedRecipesSet.add(identifier);

    const recipeImage = recipe.recipeImage || "no_image_available.png";
    const recipeHtml = `
      <div class="recipe-box">
        <img src="${recipeImage}" alt="${recipe.recipeName}" />
        <h4>${recipe.recipeName}</h4>
      </div>
    `;
    container.innerHTML += recipeHtml;
  };

  // Update pagination for API recipes
  this.updatePagination = (recipes, currentUrl, fromTo, mealTypes, dishTypes, cuisineTypes) => {
    const paginationList = document.getElementById('paginationList');
    paginationList.innerHTML = ''; // Clear pagination

    // Add previous page link
    const previousPageUrl = this.historyMap.get(this.getPreviousPageFromTo(fromTo));
    if (previousPageUrl) {
      paginationList.appendChild(this.getPaginationButton("Previous", () => {
        this.load(null, null, previousPageUrl, mealTypes, dishTypes, cuisineTypes);
      }));
    }

    // Add next page link
    if (recipes._links?.next?.href) {
      const nextPageUrl = recipes._links.next.href;
      paginationList.appendChild(this.getPaginationButton("Next", () => {
        this.load(null, null, nextPageUrl, mealTypes, dishTypes, cuisineTypes);
      }));
    }
  };

  // Create pagination button
  this.getPaginationButton = (label, onClick) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = onClick;
    return button;
  };

  // Return HTML for "No recipes found" message
  this.getNoRecipesFound = () => {
    return `<h2>No recipes found.</h2>`;
  };
}

// Toggle public recipes visibility
document.getElementById('togglePublicRecipeShownButton').addEventListener('click', () => {
  showPublicRecipes = !showPublicRecipes;
  currentPublicRecipePage = 1; // Reset to the first page
  recipesView.load();
});

// Load next/previous public recipe pages
document.getElementById('nextPublicRecipePage').addEventListener('click', () => {
  if (currentPublicRecipePage * publicUserRecipesPerPage < publicUserRecipes.length) {
    currentPublicRecipePage++;
    recipesView.load();
  }
});
document.getElementById('previousPublicRecipePage').addEventListener('click', () => {
  if (currentPublicRecipePage > 1) {
    currentPublicRecipePage--;
    recipesView.load();
  }
});

// Load recipes on page load
document.addEventListener('DOMContentLoaded', () => {
  recipesView.load();
});
