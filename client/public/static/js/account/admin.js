$(document).ready(function () {
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

        const pubRequests = await this.getRecipePubRequests();
        this.renderMyRecipes(pubRequests);
      } catch (error) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
      }
    };

    this.getRecipePubRequests = async () => {
      const url = `${PUBLIC_USER_RECIPES_URL}/publish_requests`;
      console.log(`Querying Server at: ${url}`);
  
      const response = await fetch(url, {
        method: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });
  
      if (response.ok) {
        const pubRequests = await response.json();
        return pubRequests;
      } else {
        console.error(`Error occurred getting publish requests`);
        return undefined;
      }
    }

    this.renderMyRecipes = (pubRequests) => {
      container.empty();

      if (!pubRequests || pubRequests.length === 0) {
        container.append(this.getNoSavedRecipes());
        return;
      }

      console.log(`About to iterate through: ${pubRequests.length} publish recipes`);
      pubRequests.forEach(async pubRequest => {
          recipe = await getRecipeDetails(pubRequest.recipeId);
          const recipeName = recipe.recipeName;
          //const userEmail = recipe.userEmail;
         
          let recipeImage = "";
          let recipeImageType = "";

          if (hasValidImage(recipe)) {
            recipeImage = recipe.recipeImage;
            recipeImageType = getImageType(recipeImage);
          } else {
            recipeImage = NO_IMAGE_AVAILABLE;
            recipeImageType = "SVG";
          }

          const parameter = PUBLIC_RECIPE_URL_PARAMETER;
          const recipeType = "public user";
          
          const recipeHtml = `
            <div class="box box-shadow-custom">
                <a href="/recipes/recipe_details?${parameter}=${encodeURIComponent(recipeName)}&publishReview=${encodeURIComponent(true)}">
                    <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
                </a>
                <h3>${recipeName}</h3>
            </div>`;

          console.debug(`Adding ${recipeType} created recipe: [${recipeName}]`);
          container.append(recipeHtml);
      });
    };

    this.getNoSavedRecipes = () => {
      return `
              <div>
                  <h2>${NO_SAVED_RECIPES}</h2>
              </div>`;
    }
  }

  async function getRecipeDetails(recipeIdToFind){
    const url = `${PUBLIC_USER_RECIPES_URL}/get_requested_recipe?recipeId=${recipeIdToFind}`;
    console.log(`Querying Server at: ${url}`);

    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });

    if (response.ok) {
      const recipeDetails = await response.json();
      return recipeDetails;
    } else {
      console.error(`Error occurred getting pub requests`);
      return undefined;
    }
  }

  function hasValidImage(recipe) {
    return recipe.recipeImage && recipe.recipeImage !== "";
  }

  function getImageType(recipeImage) {
    return recipeImage.match(/data:image\/(.*);/)[1].toUpperCase();
  }

  const myRecipesView = new MyRecipesView();
  myRecipesView.load();
});

function changeLanguage(language) {
  var element = document.getElementById("url");
  element.value = language;
  element.innerHTML = language;
}