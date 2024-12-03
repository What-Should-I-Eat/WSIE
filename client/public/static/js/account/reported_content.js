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

        // Show Reported reviews
        const container = $('.reviewScrollable');
        container.empty();
        const userReviews = await getReportedReviews();
        if(userReviews.length>0){
          userReviews.forEach(review => {
            const reviewItem = `
              <li id="reviewItem">
                <span id="boldUserName">
                  ${review.reviewerUsername}
                </span>
                  ${review.writtenReview}
                  <button id="approve-post" value="Y${review._id}" title="Approve Post">
                    <i class="fas fa-check" style="color: #0A8E36;"></i>
                  </button>
                  <button id="deny-post" value="X${review._id}" title="Deny Post">
                    <i class="fas fa-trash" style="color: #801A18;"></i>
                  </button>
              </li>`;
              container.append(reviewItem);
          });
        }else{
          const noReviewsText = document.createElement('p');
          noReviewsText.innerHTML = `No reported community reviews!`;
          container.append(noReviewsText);
        }
        const reviewBox = document.getElementsByClassName("reviewScrollable");
        const reviewBoxHeight = reviewBox[0].scrollHeight;
        reviewBox[0].style.height = Math.min(reviewBoxHeight, 200) + 'px';

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

  async function getReportedReviews(){
    const url = `${PUBLIC_USER_RECIPES_URL}/get_reported_reviews`;
    console.log(`Querying Server at: ${url}`);
  
    const response = await fetch(url, {
      method: GET_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    });
  
    if (response.ok) {
      const reportedReviews = await response.json();
      return reportedReviews;
    } else {
      console.error(`Error occurred getting pub reviews`);
      return undefined;
    }
  };

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

async function handleReportedPost(denyOrApprove, reviewId){
  let url = `${PUBLIC_USER_RECIPES_URL}/deny_reported_review?reviewId=${reviewId}`;

  if(denyOrApprove == 'Y'){
    url = `${PUBLIC_USER_RECIPES_URL}/approve_reported_review?reviewId=${reviewId}`;
  }

  try {
    const response = await fetch(url, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    utils.showAjaxAlert("Success", data.message);
  } catch (error) {
    console.error(error);
    utils.showAjaxAlert("Error", error.message);
  }
}

$(document).ready(function () {
  // Handles Form Submission Logic
  $("#reviewForm").on("submit", async function (event) {
    event.preventDefault();

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(UNABLE_TO_PERFORM_ACTION_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_PERFORM_ACTION_USER_NOT_LOGGED_IN);
      return;
    }

    const userId = await utils.getUserIdFromUsername(username);
    if (!userId) {
      console.error(UNABLE_TO_PERFORM_ACTION_USER_NOT_LOGGED_IN);
      utils.showAjaxAlert("Error", UNABLE_TO_PERFORM_ACTION_USER_NOT_LOGGED_IN);
      return;
    }

    const submitter = event.originalEvent ? event.originalEvent.submitter : null;
    const action = submitter ? submitter.value : '';

    denyOrApprove = action.substring(0,1);
    reviewId = action.substring(1,action.length);

    await handleReportedPost(denyOrApprove, reviewId);

  });
});