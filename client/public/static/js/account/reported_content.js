$(document).ready(function () {
  function MyRecipesView() {
    const container = $('.reported-recipes-container');

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

        const reportedRecipes = await this.getReportedRecipes();
        this.renderMyRecipes(reportedRecipes);
      } catch (error) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
      }
    };

    this.getReportedRecipes = async () => {
      const url = `${PUBLIC_USER_RECIPES_URL}/reported_content`;
      console.log(`Querying Server at: ${url}`);
  
      const response = await fetch(url, {
        method: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });
  
      if (response.ok) {
        const reportedRecipes = await response.json();
        return reportedRecipes;
      } else {
        console.error(`Error occurred getting publish requests`);
        return undefined;
      }
    }

    this.renderMyRecipes = (reportedRecipes) => {
      container.empty();

      if (!reportedRecipes || reportedRecipes.length === 0) {
        container.append(this.getNoReportedRecipes());
        return;
      }

      console.log(`About to iterate through: ${reportedRecipes.length} reported recipes`);
      reportedRecipes.forEach(async reportedRecipe => {
          recipe = await getRecipeDetails(reportedRecipe._id);
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
                <a href="/recipes/recipe_details?${parameter}=${encodeURIComponent(recipeName)}&reportedReview=${encodeURIComponent(true)}">
                    <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
                </a>
                <h3>${recipeName}</h3>
            </div>`;

          console.debug(`Adding ${recipeType} created recipe: [${recipeName}]`);
          container.append(recipeHtml);
      });
    };

    this.getNoReportedRecipes = () => {
      return `
              <div>
                  <h2>${NO_REPORTED_RECIPES}</h2>
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
      console.error(`Error occurred getting reported recipe`);
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