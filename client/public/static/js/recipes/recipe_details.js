let recipeId = '';
let userName = '';
let userEmail = '';
let recipeName = '';
let reported_review = false;

function RecipeDetailsView() {
    this.loadEdamamRecipe = async (source, sourceUrl, recipeUri) => {
        if (hasAllData(source, sourceUrl, recipeUri)) {
            console.log("Loading view from Edamam recipe");

            try {
                const recipeDetails = await this.getRecipeDetails(recipeUri);
                const recipe = recipeDetails.hits[0].recipe;
                const recipeInstructions = await this.getRecipeInstructions(source, sourceUrl, recipe.label);
                recipeId = recipe.uri.substring(recipe.uri.indexOf("_") + 1);
                if (isValidResult(recipeDetails)) {
                    this.buildView(recipeDetails, recipeInstructions);
                } else {
                    console.error('Invalid data to build view', {
                        details: recipeDetails,
                        instructions: recipeInstructions
                    });
                    utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
                }
            } catch (error) {
                console.error('Error loading recipe details and instructions:', error);
                utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
            }
        } else {
            console.error(`Missing Source: ${source}, Source URL: ${sourceUrl}, and/or Recipe Uri: ${recipeUri}`);
            utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        }
    }

    this.loadUserRecipe = async (userRecipeName) => {
        try {
            console.log("Loading view from user created recipe");

            const userRecipeDetails = await this.getUserRecipe(userRecipeName);
            recipeId = userRecipeDetails._id;
            if (userRecipeDetails) {
                this.buildUserView(userRecipeDetails);
            } else {
                console.error("Invalid user recipe data to build view");
                utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
            }
        } catch (error) {
            console.error("Error loading user recipe details", error);
            utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        }
    }

    this.loadPublicUserRecipe = async (publicUserRecipeName, pubReview, reportedReview) => {
        reported_review = reportedReview
        try {
            console.log("Loading view from public user recipe");
            const userRecipeDetails = await this.getPublicUserRecipe(publicUserRecipeName);
            console.log(userRecipeDetails);
            if (userRecipeDetails.pubRequested || userRecipeDetails.isPublished || userRecipeDetails.reported) {
                recipeId = userRecipeDetails._id;
                recipeName = userRecipeDetails.recipeName;
                userName = userRecipeDetails.usernameCreator;
                if (userRecipeDetails.pubRequested) {
                    const recipePubRequest = await getRecipePubRequest(recipeId);
                    userEmail = recipePubRequest.userEmail;
                }
            }
            if (userRecipeDetails) {
                this.buildPublicUserView(userRecipeDetails, pubReview, reportedReview);
            } else {
                console.error("Invalid public user recipe data to build view");
                utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
            }
        } catch (error) {
            console.error("Error loading public user recipe details", error);
            utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        }
    }

    this.getRecipeDetails = async (recipeUri) => {
        const uri = encodeURIComponent(recipeUri);
        const apiUrl = `${EDAMAM_RECIPE_URI_URL}=${uri}`;
        const cacheKey = `edamamRecipeDetails_${uri}`;
        console.log("Querying Edamam at:", apiUrl);


        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            console.log(`Returning cached recipe details for URI: ${recipeUri}`);
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(apiUrl, {
                method: GET_ACTION,
                headers: {
                    'Accept': DEFAULT_DATA_TYPE,
                    'Content-Type': DEFAULT_DATA_TYPE
                }
            });
            if (!response.ok) {
                throw new Error("Error occurred getting recipe details");
            }
            const recipeDetails = await response.json();

            localStorage.setItem(cacheKey, JSON.stringify(recipeDetails));
            console.log(`Cached recipe details for URI: ${recipeUri}`);
            return recipeDetails;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    };


    this.getRecipeInstructions = async (source, sourceUrl, recipeName) => {
        const sourceTrimmed = source.toLowerCase().trim();
        const apiUrl = `${RECIPE_SCRAPE_URL}/?recipeLink=${sourceUrl}&source=${sourceTrimmed}&recipeName=${recipeName}`;

        const instructionsCacheKey = `recipeInstructions_${encodeURIComponent(sourceUrl)}_${encodeURIComponent(recipeName)}`;
        console.log("Querying Server for:", apiUrl);


        const cachedInstructions = localStorage.getItem(instructionsCacheKey);
        if (cachedInstructions) {
            console.log(`Returning cached instructions for: ${sourceUrl}, ${recipeName}`);
            return JSON.parse(cachedInstructions);
        }

        try {
            const response = await fetch(apiUrl, {
                method: GET_ACTION,
                headers: {
                    'Accept': DEFAULT_DATA_TYPE,
                    'Content-Type': DEFAULT_DATA_TYPE
                }
            });
            if (!response.ok) {
                throw new Error("Error occurred getting recipe instructions");
            }
            const details = await response.json();

            localStorage.setItem(instructionsCacheKey, JSON.stringify(details));
            console.log(`Cached instructions for: ${sourceUrl}, ${recipeName}`);
            return details;
        } catch (error) {
            console.error("Error occurred getting recipe instructions:", error);
            return undefined;
        }
    };

    this.getUserRecipe = async (recipeName) => {
        const username = utils.getUserNameFromCookie();
        if (!username) {
            console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
            utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
            return;
        }

        const userId = await utils.getUserIdFromUsername(username);
        if (!userId) {
            console.error(UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
            utils.showAjaxAlert("Error", UNABLE_TO_FAVORITE_USER_NOT_LOGGED_IN);
            return;
        }

        const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/get_recipe?recipeName=${recipeName}`;
        console.log(`Querying Server at: ${url}`);

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
            console.error(`Error occurred getting user recipe for ${recipeName}`);
            return undefined;
        }
    }

    this.getPublicUserRecipe = async (recipeName) => {
        const url = `${PUBLIC_USER_RECIPE_URL}?recipeName=${recipeName}`;
        console.log(`Querying Server at: ${url}`);

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

    this.buildView = async (recipeDetails, recipeInstructions) => {
        // We checked we had a result upstream
        const recipe = recipeDetails.hits[0].recipe;
        const form = document.getElementById('recipeForm');

        // Hidden Recipe URI
        let hiddenUriInput = document.getElementById('recipe-uri');
        if (!hiddenUriInput) {
            hiddenUriInput = document.createElement('input');
            hiddenUriInput.type = 'hidden';
            hiddenUriInput.id = 'recipe-uri';
            form.appendChild(hiddenUriInput);
        }
        hiddenUriInput.value = recipe.uri;

        // Hidden Recipe Source
        let hiddenRecipeSourceInput = document.getElementById('recipe-source');
        if (!hiddenRecipeSourceInput) {
            hiddenRecipeSourceInput = document.createElement('input');
            hiddenRecipeSourceInput.type = 'hidden';
            hiddenRecipeSourceInput.id = 'recipe-source';
            form.appendChild(hiddenRecipeSourceInput);
        }
        hiddenRecipeSourceInput.value = recipe.source;

        // Hidden Recipe Source URL
        let hiddenRecipeSourceUrlInput = document.getElementById('recipe-source-url');
        if (!hiddenRecipeSourceUrlInput) {
            hiddenRecipeSourceUrlInput = document.createElement('input');
            hiddenRecipeSourceUrlInput.type = 'hidden';
            hiddenRecipeSourceUrlInput.id = 'recipe-source-url';
            form.appendChild(hiddenRecipeSourceUrlInput);
        }
        hiddenRecipeSourceUrlInput.value = recipe.url;

        // Check if the recipe is a favorite
        const username = utils.getUserNameFromCookie();
        const isFavorite = await checkIfFavorite(username, recipe.label);
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        addToFavoritesBtn.textContent = isFavorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES;

        // Update header name
        document.getElementById('recipe-name').textContent = recipe.label;

        // Update image
        let imageSrc = NO_IMAGE_AVAILABLE;
        if (hasValidImage(recipe)) {
            // Use the LARGE as default in recipe details
            if (recipe.images.LARGE && recipe.images.LARGE.url) {
                imageSrc = await utils.getEdamamRecipeImage(recipe.images.LARGE.url);
            } else {
                imageSrc = await utils.getEdamamRecipeImage(recipe.images.REGULAR.url);
            }
        }

        document.getElementById('recipe-image').src = imageSrc;
        document.getElementById('recipe-image').alt = `Image of ${recipe.label}`;

        // Update ingredients list
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        recipe.ingredientLines.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            ingredientsList.appendChild(listItem);
        });

        // Update preparation
        const preparationContainer = document.getElementById('preparation-container');
        const preparationList = document.getElementById('preparation-list');
        preparationList.innerHTML = '';
        if (recipeInstructions && recipeInstructions.length > 0) {
            recipeInstructions.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                preparationList.appendChild(listItem);
            });
        } else {
            console.log(`No scraped instructions for: [${recipe.label}]`);
            const noInstructionsText = document.createElement('p');
            noInstructionsText.innerHTML = `No instructions were able to be migrated.`;
            preparationContainer.appendChild(noInstructionsText);
        }
        const source = recipe.source;
        const url = recipe.url;

        const urlLinkToInstructionsText = document.createElement('p');
        urlLinkToInstructionsText.innerHTML = `View full instructions and more at <strong><a href="${url}" target="_blank">${source}</a></strong>`;
        preparationContainer.appendChild(urlLinkToInstructionsText);

        // Update nutritional facts
        const nutritionalFactsList = document.getElementById('nutritional-facts-list');
        nutritionalFactsList.innerHTML = '';
        nutritionalFactsList.innerHTML += `<li>Servings: ${Math.round(recipe.yield)}</li>`;
        nutritionalFactsList.innerHTML += `<li>Calories: ${Math.round(recipe.totalNutrients.ENERC_KCAL.quantity)} ${recipe.totalNutrients.ENERC_KCAL.unit}</li>`;
        nutritionalFactsList.innerHTML += `<li>Fats: ${Math.round(recipe.totalNutrients.FAT.quantity)} ${recipe.totalNutrients.FAT.unit}</li>`;
        nutritionalFactsList.innerHTML += `<li>Carbohydrates: ${Math.round(recipe.totalNutrients.CHOCDF.quantity)} ${recipe.totalNutrients.CHOCDF.unit}</li>`;
        nutritionalFactsList.innerHTML += `<li>Protein: ${Math.round(recipe.totalNutrients.PROCNT.quantity)} ${recipe.totalNutrients.PROCNT.unit}</li>`;

        // Update dietary labels
        const dietaryContainer = document.getElementById('dietary-labels-section');
        const dietaryLabelsList = document.getElementById('dietary-labels-list');
        dietaryLabelsList.innerHTML = '';
        if (recipe.dietLabels && recipe.dietLabels.length > 0) {
            recipe.dietLabels.forEach(label => {
                const listItem = document.createElement('li');
                listItem.textContent = label;
                dietaryLabelsList.appendChild(listItem);
            });
        } else {
            const noDietaryText = document.createElement('p');
            noDietaryText.innerHTML = `No dietary labels.`;
            dietaryContainer.appendChild(noDietaryText);
        }

        // Fetch and display nested reviews
        const container = document.querySelector(".reviewScrollable");
        container.innerHTML = "";
        const userReviews = await getRecipePubReviews();
        displayReviews(userReviews, container);
    };

    this.buildPublicUserView = async (recipe, pubReview, reportedReview) => {
        // Leave this here so its compatible and we can share functionality
        const form = document.getElementById('recipeForm');

        // Hidden Recipe URI
        let hiddenUriInput = document.getElementById('recipe-uri');
        if (!hiddenUriInput) {
            hiddenUriInput = document.createElement('input');
            hiddenUriInput.type = 'hidden';
            hiddenUriInput.id = 'recipe-uri';
            form.appendChild(hiddenUriInput);
        }
        hiddenUriInput.value = "";

        // Hidden Recipe Source
        let hiddenRecipeSourceInput = document.getElementById('recipe-source');
        if (!hiddenRecipeSourceInput) {
            hiddenRecipeSourceInput = document.createElement('input');
            hiddenRecipeSourceInput.type = 'hidden';
            hiddenRecipeSourceInput.id = 'recipe-source';
            form.appendChild(hiddenRecipeSourceInput);
        }
        hiddenRecipeSourceInput.value = "";

        // Hidden Recipe Source URL
        let hiddenRecipeSourceUrlInput = document.getElementById('recipe-source-url');
        if (!hiddenRecipeSourceUrlInput) {
            hiddenRecipeSourceUrlInput = document.createElement('input');
            hiddenRecipeSourceUrlInput.type = 'hidden';
            hiddenRecipeSourceUrlInput.id = 'recipe-source-url';
            form.appendChild(hiddenRecipeSourceUrlInput);
        }
        hiddenRecipeSourceUrlInput.value = "";
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        if (pubReview != 'true' && reportedReview != 'true') {
            // Check if the recipe is a favorite
            const username = utils.getUserNameFromCookie();
            const isFavorite = await checkIfFavorite(username, recipe.recipeName);
            addToFavoritesBtn.textContent = isFavorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES;
            const reportRecipeBtn = document.getElementById('reportRecipeBtn');
            reportRecipeBtn.style.visibility = 'visible';
        } else {
            addToFavoritesBtn.style.visibility = 'hidden';
            //update buttons to show approve or deny request
            const approveRequestBtn = document.getElementById('approvePubReqBtn');
            approveRequestBtn.style.visibility = 'visible';
            const denyRequestButton = document.getElementById("denyPubReqBtn");
            denyRequestButton.style.visibility = 'visible';
        }

        // Update header name and image
        document.getElementById('recipe-name').textContent = recipe.recipeName;
        document.getElementById('recipe-image').src = await utils.getUserRecipeImage(recipe);
        document.getElementById('recipe-image').alt = `Image of ${recipe.recipeName}`;

        // Update ingredients list
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        if (recipe.recipeIngredients) {
            var ingredientsString = recipe.recipeIngredients[0].split(/\r\n/);
            ingredientsString.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                ingredientsList.appendChild(listItem);
            });
        }

        // Update preparation
        const preparationContainer = document.getElementById('preparation-container');
        const preparationList = document.getElementById('preparation-list');
        preparationList.innerHTML = '';
        if (recipe.recipeDirections) {
            var directionsString = recipe.recipeDirections[0].split(/\r\n/);
            directionsString.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                preparationList.appendChild(listItem);
            });
        } else {
            console.log(`No user instructions for: [${recipe.label}]`);
            const noInstructionsText = document.createElement('p');
            noInstructionsText.innerHTML = `No user instructions available.`;
            preparationContainer.appendChild(noInstructionsText);
        }

        // Update nutritional facts
        const nutritionalFactsList = document.getElementById('nutritional-facts-list');
        nutritionalFactsList.innerHTML = '';
        nutritionalFactsList.innerHTML += `<li>Servings: ${Math.round(recipe.recipeServings)}</li>`;
        nutritionalFactsList.innerHTML += `<li>Calories: ${Math.round(recipe.recipeCalories)} ${recipe.recipeCaloriesUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Fats: ${Math.round(recipe.recipeFats)} ${recipe.recipeFatsUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Carbohydrates: ${Math.round(recipe.recipeCarbs)} ${recipe.recipeCarbsUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Protein: ${Math.round(recipe.recipeProtein)} ${recipe.recipeProteinUnits}</li>`;

        // Update dietary labels
        const dietaryContainer = document.getElementById('dietary-labels-section');
        const dietaryLabelsList = document.getElementById('dietary-labels-list');
        dietaryLabelsList.innerHTML = '';
        const noDietaryText = document.createElement('p');
        noDietaryText.innerHTML = `No user dietary labels.`;
        dietaryContainer.appendChild(noDietaryText);
        // Fetch and display nested reviews
        const container = document.querySelector(".reviewScrollable");
        container.innerHTML = "";
        const userReviews = await getRecipePubReviews();
        displayReviews(userReviews, container);
    };

    this.buildUserView = async (recipe) => {
        // Leave this here so its compatible and we can share functionality
        const form = document.getElementById('recipeForm');

        // Hidden Recipe URI
        let hiddenUriInput = document.getElementById('recipe-uri');
        if (!hiddenUriInput) {
            hiddenUriInput = document.createElement('input');
            hiddenUriInput.type = 'hidden';
            hiddenUriInput.id = 'recipe-uri';
            form.appendChild(hiddenUriInput);
        }
        hiddenUriInput.value = "";

        // Hidden Recipe Source
        let hiddenRecipeSourceInput = document.getElementById('recipe-source');
        if (!hiddenRecipeSourceInput) {
            hiddenRecipeSourceInput = document.createElement('input');
            hiddenRecipeSourceInput.type = 'hidden';
            hiddenRecipeSourceInput.id = 'recipe-source';
            form.appendChild(hiddenRecipeSourceInput);
        }
        hiddenRecipeSourceInput.value = "";

        // Hidden Recipe Source URL
        let hiddenRecipeSourceUrlInput = document.getElementById('recipe-source-url');
        if (!hiddenRecipeSourceUrlInput) {
            hiddenRecipeSourceUrlInput = document.createElement('input');
            hiddenRecipeSourceUrlInput.type = 'hidden';
            hiddenRecipeSourceUrlInput.id = 'recipe-source-url';
            form.appendChild(hiddenRecipeSourceUrlInput);
        }
        hiddenRecipeSourceUrlInput.value = "";

        // Check if the recipe is a favorite
        const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
        addToFavoritesBtn.textContent = DELETE_RECIPE;

        // Update header name and image
        document.getElementById('recipe-name').textContent = recipe.recipeName;
        document.getElementById('recipe-image').src = await utils.getUserRecipeImage(recipe);
        document.getElementById('recipe-image').alt = `Image of ${recipe.recipeName}`;

        // Update ingredients list
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        if (recipe.recipeIngredients) {
            var ingredientsString = recipe.recipeIngredients[0].split(/\r\n/);
            ingredientsString.forEach(ingredient => {
                const listItem = document.createElement('li');
                listItem.textContent = ingredient;
                ingredientsList.appendChild(listItem);
            });
        }

        // Update preparation
        const preparationContainer = document.getElementById('preparation-container');
        const preparationList = document.getElementById('preparation-list');
        preparationList.innerHTML = '';
        if (recipe.recipeDirections) {
            var directionsString = recipe.recipeDirections[0].split(/\r\n/);
            directionsString.forEach(step => {
                const listItem = document.createElement('li');
                listItem.textContent = step;
                preparationList.appendChild(listItem);
            });
        } else {
            console.log(`No user instructions for: [${recipe.label}]`);
            const noInstructionsText = document.createElement('p');
            noInstructionsText.innerHTML = `No user instructions available.`;
            preparationContainer.appendChild(noInstructionsText);
        }

        // Update nutritional facts
        const nutritionalFactsList = document.getElementById('nutritional-facts-list');
        nutritionalFactsList.innerHTML = '';
        nutritionalFactsList.innerHTML += `<li>Servings: ${Math.round(recipe.recipeServings)}</li>`;
        nutritionalFactsList.innerHTML += `<li>Calories: ${Math.round(recipe.recipeCalories)} ${recipe.recipeCaloriesUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Fats: ${Math.round(recipe.recipeFats)} ${recipe.recipeFatsUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Carbohydrates: ${Math.round(recipe.recipeCarbs)} ${recipe.recipeCarbsUnits}</li>`;
        nutritionalFactsList.innerHTML += `<li>Protein: ${Math.round(recipe.recipeProtein)} ${recipe.recipeProteinUnits}</li>`;

        // Update dietary labels
        const dietaryContainer = document.getElementById('dietary-labels-section');
        const dietaryLabelsList = document.getElementById('dietary-labels-list');
        dietaryLabelsList.innerHTML = '';
        const noDietaryText = document.createElement('p');
        noDietaryText.innerHTML = `No user dietary labels.`;
        dietaryContainer.appendChild(noDietaryText);

        // Show update recipe button
        const updateRecipeButton = document.getElementById("updateRecipeBtn");
        if (updateRecipeButton) {
            updateRecipeButton.style.visibility = 'visible';
        }

        // Show publish recipe button
        const publishRecipeButton = document.getElementById('publishRecipeBtn');
        if (publishRecipeButton) {
            publishRecipeButton.style.visibility = 'visible';
            if (recipe.isPublished) {
                publishRecipeButton.textContent = RECIPE_PUBLISHED;
                publishRecipeButton.disabled = false;
            } else if (recipe.pubRequested) {
                publishRecipeButton.textContent = RECIPE_UNDER_REVIEW;
                publishRecipeButton.disabled = true;
            } else {
                publishRecipeButton.textContent = REQUEST_TO_PUBLISH_RECIPE;
                publishRecipeButton.disabled = false;
            }
        }
        // Fetch and display nested reviews
        const container = document.querySelector(".reviewScrollable");
        container.innerHTML = "";
        const userReviews = await getRecipePubReviews();
        displayReviews(userReviews, container);
    };
}

function handleUpdateRecipe() {
    const recipeName = document.getElementById('recipe-name').textContent;
    console.log("Going to update recipe: /account/update_recipe?userRecipeName=" + recipeName);
    window.location = `/account/update_recipe?userRecipeName=${recipeName}`;
};

async function handlePublishUserRecipe(userId, form) {
    fullString = await getRecipeText();
    profanityVal = await utils.checkForProfanity(fullString);
    if (!profanityVal) {
        const recipeName = document.getElementById('recipe-name').textContent;
        const buttonText = form.find("#publishRecipeBtn").text();
        if (buttonText.includes("remove")) {
            await handleUserRemovePublication();
            return;
        } else {
            request = {
                recipeName: recipeName
            }

            let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/request_publish`;
            try {
                const response = await fetch(url, {
                    method: POST_ACTION,
                    body: JSON.stringify({favorites: request}),
                    headers: {
                        'Content-Type': DEFAULT_DATA_TYPE
                    }
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                }
                const publishRecipeButton = document.getElementById('publishRecipeBtn');
                publishRecipeButton.textContent = RECIPE_UNDER_REVIEW;
                publishRecipeButton.disabled = true;
                utils.showAjaxAlert("Success", data.success);
            } catch (error) {
                console.error(error);
                utils.showAjaxAlert("Error", error.message);
            }
        }
    } else {
        utils.showAjaxAlert("Error", "Recipe content goes against community protocols and cannot be posted.");
    }
};

async function getRecipeText() {
    let fullRecipeText = "";
    fullRecipeText = document.getElementById('recipe-name').textContent;
    const ingredientsList = document.querySelectorAll('#ingredients-list li');
    ingredientsList.forEach(item => {
        const text = item.textContent.trim();
        fullRecipeText = fullRecipeText + " " + text;
    });

    const preparationList = document.querySelectorAll('#preparation-list li');
    preparationList.forEach(item => {
        const text = item.textContent.trim();
        fullRecipeText = fullRecipeText + " " + text;
    });

    return (fullRecipeText);
}


async function handleUserReview(userId) {
    const stringToCheck = document.getElementById("recipeReviewInput").value.trim();

    if (!stringToCheck) {
        utils.showAjaxAlert("Error", "Review cannot be empty!");
        return;
    }

    const profanityVal = await utils.checkForProfanity(stringToCheck);
    if (profanityVal) {
        utils.showAjaxAlert("Error", "Review content goes against community protocols and cannot be posted.");
        return;
    }

    const request = {
        reviewedRecipeId: recipeId,
        writtenReview: stringToCheck,
        reviewerUsername: utils.getUserNameFromCookie()
    };

    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/post_review`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({reviews: request}),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend Error Response:", errorData);
            throw new Error(errorData.error);
        }

        const data = await response.json();

        utils.showAjaxAlert("Success", data.success);
        document.getElementById("recipeReviewInput").value = "";
        getRecipePubReviews().then(reviews => {
            displayReviews(reviews, document.querySelector(".reviewScrollable"));
        });

    } catch (error) {
        utils.showAjaxAlert("Error", error.message);
    }
}


function displayReviews(reviews, parentElement) {
    parentElement.innerHTML = "";

    if (reviews.length === 0) {
        parentElement.innerHTML = `<p>No community reviews yet! You could be the first!</p>`;
        return;
    }

    reviews.forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
      <div class="review-content">
        <strong>${review.reviewerUsername}</strong>: ${review.writtenReview}
        <span class="reply-toggle" data-id="${review._id}" style="cursor: pointer; color: blue; text-decoration: underline;">Reply</span>
        <button class="report-button" data-review-id="${review._id}">Report
        </button>
      </div>
      <div class="replies" id="replies-${review._id}"></div>
    `;
        parentElement.appendChild(reviewItem);

        // Display nested replies if they exist
        if (review.replies && review.replies.length > 0) {
            const repliesContainer = reviewItem.querySelector(`#replies-${review._id}`);
            review.replies.forEach((reply) => {
                const replyItem = document.createElement("div");
                replyItem.classList.add("reply-item");
                replyItem.innerHTML = `
          <div class="reply-content">
            <strong>${reply.reviewerUsername}</strong>: ${reply.writtenReview}
            <span class="reply-toggle" data-id="${reply._id}" style="cursor: pointer; color: blue; text-decoration: underline;">Reply</span>
            <button class="report-button" data-review-id="${reply._id}">Report</button>
          </div>
          <div class="replies" id="replies-${reply._id}"></div>
        `;
                repliesContainer.appendChild(replyItem);
            });
        }
    });

    // Attach event listeners for reply toggle and report buttons
    document.querySelectorAll(".reply-toggle").forEach((toggle) => {
        toggle.addEventListener("click", handleReplyClick);
    });

    document.querySelectorAll(".report-button").forEach((button) => {
        button.addEventListener("click", handleReportClick);
    });
}


function showReplyForm(parentReviewId) {
    const replyContainer = document.getElementById(`replies-${parentReviewId}`);

    if (!replyContainer) {
        console.error(`Reply container not found for: replies-${parentReviewId}`);
        return;
    }

    // If a reply form already exists, remove it (to prevent duplicates)
    const existingForm = document.getElementById(`reply-form-${parentReviewId}`);
    if (existingForm) {
        existingForm.remove();
        return;
    }

    // Create the reply form dynamically
    const replyForm = document.createElement("form");
    replyForm.id = `reply-form-${parentReviewId}`;
    replyForm.classList.add("reply-form");

    replyForm.innerHTML = `
    <textarea class="reply-textarea" placeholder="Write a reply..." style="width: 100%; height: 50px; margin-top: 5px;"></textarea>
    <button type="button" class="btn btn-sm btn-primary submit-reply-btn" data-id="${parentReviewId}">
      Submit Reply
    </button>
    <button type="button" class="btn btn-sm btn-secondary cancel-reply-btn">
      Cancel
    </button>
  `;

    replyContainer.appendChild(replyForm);

    // Attach event listeners for Submit and Cancel buttons here
    replyForm.querySelector(".submit-reply-btn").addEventListener("click", async function () {
        const buttonParentReviewId = this.getAttribute("data-id");
        let userId = await utils.getUserIdFromUsername(utils.getUserNameFromCookie());
        if (!userId) {
            utils.showAjaxAlert("Error", "User ID is missing.");
            return;
        }
        handleSubmitReply(userId, buttonParentReviewId);
    });
    replyForm.querySelector(".cancel-reply-btn").addEventListener("click", () => cancelReply(parentReviewId));
}

function handleReplyClick(event) {
    const parentReviewId = event.target.getAttribute("data-id");
    if (document.getElementById(`reply-form-${parentReviewId}`)) {
        cancelReply(parentReviewId);
    } else {
        showReplyForm(parentReviewId);
    }
}

function handleReportClick(event) {
    const reviewId = event.target.getAttribute("data-review-id");
    handleReportPost(reviewId);
}

async function handleSubmitReply(userId, parentReviewId) {
    const replyText = document.querySelector(`#reply-form-${parentReviewId} .reply-textarea`).value.trim();
    if (!replyText) {
        console.error("Reply text is empty.");
        utils.showAjaxAlert("Error", "Reply cannot be empty!");
        return;
    }
    const allReviews = await getRecipePubReviews();
    const parentReview = allReviews.find(review => review._id === parentReviewId);
    if (!parentReview) {
        console.error("Parent review not found.");
        utils.showAjaxAlert("Error", "Error finding parent review.");
        return;
    }

    const currentUsername = utils.getUserNameFromCookie();

    if (parentReview.reviewerUsername === currentUsername) {
        console.error("User cannot reply to their own review.");
        utils.showAjaxAlert("Error", "You cannot reply to your own review.");
        return;
    }
    const request = {
        reviewedRecipeId: recipeId,
        writtenReview: replyText,
        parentReviewId: parentReviewId || null,
        reviewerUsername: currentUsername
    };

    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/post_review`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({reviews: request}),
            headers: {"Content-Type": "application/json"}
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend Error Response:", errorData);
            throw new Error(errorData.error || "Failed to post reply.");
        }

        const data = await response.json();
        console.log("Reply successfully submitted:", data);

        cancelReply(parentReviewId);
        getRecipePubReviews().then(reviews => {
            displayReviews(reviews, document.querySelector(".reviewScrollable"));
        });

    } catch (error) {
        console.error(" Error submitting reply:", error);
        utils.showAjaxAlert("Error", error.message);
    }
}

function cancelReply(parentReviewId) {
    const replyForm = document.getElementById(`reply-form-${parentReviewId}`);
    if (replyForm) {
        replyForm.remove();
    }
}

async function handleReportRecipe() {
    const url = `${PUBLIC_USER_RECIPES_URL}/report_recipe?recipeId=${recipeId}`;
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

async function handleReportPost(reviewId) {
    const url = `${PUBLIC_USER_RECIPES_URL}/report_review?reviewId=${reviewId}`;
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

async function getRecipePubReviews() {
    const url = `${PUBLIC_USER_RECIPES_URL}/get_reviews?recipeId=${recipeId}`;
    console.log(`Querying Server at: ${url}`);
    try {
        const response = await fetch(url, {
            method: GET_ACTION,
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            }
        });

        if (response.ok) {
            const recipePubreviews = await response.json();
            return recipePubreviews;
        } else {
            console.error(`Error occurred getting pub reviews`);
            return undefined;
        }
    } catch (error) {
        console.log("Error fetching nested reviews:", error);
        return [];
    }
};

async function handleFavoriteUnfavoriteDeleteRecipeLogic(userId, form) {
    const recipeName = document.getElementById('recipe-name').textContent;
    const recipeImage = document.getElementById('recipe-image').src;
    const recipeIngredients = Array.from(document.getElementById('ingredients-list').children).map(li => li.textContent);
    const recipeDirections = Array.from(document.getElementById('preparation-list').children).map(li => li.textContent);
    const recipeUri = document.getElementById('recipe-uri').value;
    const recipeSource = document.getElementById('recipe-source').value;
    const recipeSourceUrl = document.getElementById('recipe-source-url').value;

    const nutritionalFactsList = document.getElementById('nutritional-facts-list');
    const listItems = nutritionalFactsList.querySelectorAll('li');

    const servingsValue = listItems[0].textContent.split(': ')[1];
    const [caloriesValue, caloriesUnit] = listItems[1].textContent.split(' ').slice(1);
    const [fatValue, fatUnit] = listItems[2].textContent.split(' ').slice(1);
    const [carbsValue, carbsUnit] = listItems[3].textContent.split(' ').slice(1);
    const [proteinValue, proteinUnit] = listItems[4].textContent.split(' ').slice(1);

    const buttonText = form.find("#addToFavoritesBtn").text();

    let urlAction = "";
    let request = {};
    let newButtonText = "";
    let successMessage = "";
    let errorMessage = "";

    // Add to favorites
    if (buttonText.includes("Add")) {
        urlAction = PUT_ACTION;
        request = {
            recipeName: recipeName,
            recipeIngredients: recipeIngredients,
            recipeDirections: recipeDirections,
            recipeImage: recipeImage,
            recipeUri: recipeUri,
            recipeSource: recipeSource,
            recipeSourceUrl: recipeSourceUrl,
            recipeServings: servingsValue,
            recipeCalories: caloriesValue,
            recipeCaloriesUnits: caloriesUnit,
            recipeCarbs: carbsValue,
            recipeCarbsUnits: carbsUnit,
            recipeFats: fatValue,
            recipeFatsUnits: fatUnit,
            recipeProtein: proteinValue,
            recipeProteinUnits: proteinUnit,
            userCreated: false
        };
        newButtonText = REMOVE_FROM_FAVORITES;
        successMessage = SUCCESSFULLY_FAVORITE_RECIPE;
        errorMessage = UNABLE_TO_FAVORITE_UNEXPECTED_ERROR;
    }
    // Remove from favorites
    else if (buttonText.includes("Remove")) {
        urlAction = DELETE_ACTION;
        request = {
            recipeName: recipeName
        }
        newButtonText = ADD_TO_FAVORITES;
        successMessage = SUCCESSFULLY_UNFAVORITE_RECIPE;
        errorMessage = UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR;
    }
    // Delete recipe
    else {
        urlAction = DELETE_ACTION;
        request = {
            recipeName: recipeName
        }
        newButtonText = "";
        successMessage = SUCCESSFULLY_DELETED_RECIPE;
        errorMessage = UNABLE_TO_DELETE_RECIPE_ERROR;
    }

    let url = "";
    if (buttonText.includes("Add") || buttonText.includes("Remove")) {
        url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;
    } else {
        url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/delete_recipe`;
    }

    console.log(`Sending [${urlAction}] request to: ${url}`);

    try {
        const response = await fetch(url, {
            method: urlAction,
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            },
            body: JSON.stringify({favorites: request})
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(responseData.error || errorMessage);
            throw new Error(responseData.error || errorMessage);
        } else {
            console.log(responseData.message || successMessage);
            if (responseData.message === SUCCESSFULLY_DELETED_RECIPE) {
                utils.setStorage("deleteRecipeMessage", successMessage);
                window.location = MY_RECIPES_ROUTE;
            } else {
                form.find("#addToFavoritesBtn").text(newButtonText);
                utils.showAjaxAlert("Success", responseData.message || successMessage);
            }
        }
    } catch (error) {
        console.error(error);
        utils.showAjaxAlert("Error", error.message);
    }
};

async function handleUserRemovePublication() {
    const request = {
        isPublished: false,
        pubRequested: false
    };
    const url = `${PUBLIC_USER_RECIPES_URL}/remove_publish?recipeId=${recipeId}`;
    try {
        const response = await fetch(url, {
            method: PUT_ACTION,
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            },
            body: JSON.stringify({favorites: request})
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
};

async function handlePublishRecipeReview(reviewResult) {
    const request = {
        isPublished: reviewResult,
        pubRequested: false
    };
    const url = `${PUBLIC_USER_RECIPES_URL}/publish_review?recipeId=${recipeId}`;
    try {
        const response = await fetch(url, {
            method: PUT_ACTION,
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            },
            body: JSON.stringify({favorites: request})
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
};

async function updatePublishRequestStatus() {
    const url = `${PUBLIC_USER_RECIPES_URL}/delete_request?recipeId=${recipeId}`;

    try {
        const response = await fetch(url, {
            method: DELETE_ACTION,
            body: '',
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }

        console.log(data.message);
    } catch (error) {
        console.error(error);
    }
};

async function getRecipePubRequest(recipeId) {
    const url = `${PUBLIC_USER_RECIPES_URL}/get_pub_request?recipeId=${recipeId}`;
    console.log(`Querying Server at: ${url}`);

    const response = await fetch(url, {
        method: GET_ACTION,
        headers: {
            'Content-Type': DEFAULT_DATA_TYPE
        }
    });

    if (response.ok) {
        const recipePubRequest = await response.json();
        return recipePubRequest;
    } else {
        console.error(`Error occurred getting pub requests`);
        return undefined;
    }
};

$(document).ready(function () {
    // Handles Form Submission Logic
    $("#recipeForm").on("submit", async function (event) {
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

        const form = $(this);
        const submitter = event.originalEvent ? event.originalEvent.submitter : null;
        const action = submitter ? submitter.value : '';

        switch (action) {
            case 'addToFavorites':
                console.log("Submitting form for favorite/unfavorite or delete user recipe");
                await handleFavoriteUnfavoriteDeleteRecipeLogic(userId, form);
                break;
            case 'updateRecipe':
                console.log("Submitting form for updating user recipe");
                handleUpdateRecipe();
                break;
            case 'publishRecipe':
                console.log("Submitting form for publishing user recipe");
                await handlePublishUserRecipe(userId, form);
                break;
            case 'approvePub':
                await handlePublishRecipeReview(true);
                if (!reported_review) {
                    await updatePublishRequestStatus();
                    sendPubEmail(userName, userEmail, recipeName, emailjs, "pubApproved");
                }
                break;
            case 'denyPub':
                await handlePublishRecipeReview(false);
                if (!reported_review) {
                    await updatePublishRequestStatus();
                    sendPubEmail(userName, userEmail, recipeName, emailjs, "pubDenied");
                }
                break;
            case 'postReview':
                await handleUserReview(userId);
                break;
            case 'reportRecipe':
                await handleReportRecipe();
                break;
            case 'reportReview':
                await handleReportPost(action);
                break;
            default:
                console.error("Unknown action:", action, form);
                utils.showAjaxAlert("Error", `Unknown action submitted: ${action}`);
        }
    });
});

function sendPubEmail(fullName, email, requestedRecipeName, emailjs, template) {
    // Emailjs Credentials
    const SERVICE_ID = "service_38la09d";
    const PUBLIC_KEY = "ywVrx362IPt0-qvnx";

    // Template / Template ID
    const APPROVE = "pubApproved"
    const PUB_APPROVE_TEMPLATE_ID = "template_nzetfa7";
    const DENY = "pubDenied";
    const PUB_DENIED_TEMPLATE_ID = "template_pjxabm3";

    // Message
    const SENDING_APPROVAL_MESSAGE = "Sending approval email:";
    const SENDING_DENIAL_MESSAGE = "Sending denial email:";
    const SUCCESS_MESSAGE = "Successfully sent email:";
    const FAILED_MESSAGE = "Failed to send email:";
    var templateID;

    if (template === APPROVE) {
        templateID = PUB_APPROVE_TEMPLATE_ID;
        console.log(SENDING_APPROVAL_MESSAGE, template);
    } else if (template === DENY) {
        templateID = PUB_DENIED_TEMPLATE_ID;
        console.log(SENDING_DENIAL_MESSAGE, template);
    }

    const params = {
        to_name: fullName,
        requested_recipe: requestedRecipeName,
        user_email: email,
    }

    emailjs.send(SERVICE_ID, templateID, params, PUBLIC_KEY)
        .then(function (response) {
            console.log(SUCCESS_MESSAGE, response.status, response.text);
            return true;
        }, function (error) {
            console.log(FAILED_MESSAGE, error);
        });

    return false;
}

function hasAllData(source, sourceUrl, recipeUri) {
    return source && sourceUrl && recipeUri
}

function isValidResult(recipeDetails) {
    return recipeDetails && recipeDetails.count == 1;
}

function hasValidImage(recipe) {
    return recipe.images && ((recipe.images.LARGE && recipe.images.LARGE.url) ||
        (recipe.images.REGULAR && recipe.images.REGULAR.url));
}

async function checkIfFavorite(username, recipeName) {
    if (!username) {
        console.debug("User not logged in. Not checking if recipe is a favorite");
        return false;
    }

    const userId = await utils.getUserIdFromUsername(username);
    // Append the recipeName as a query parameter (encoded)
    const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites?recipeName=${encodeURIComponent(recipeName)}`;
    console.log(`Checking if recipe is a favorite at: ${url}`);

    try {
        const response = await fetch(url, {
            method: GET_ACTION, // Change from POST_ACTION to GET_ACTION
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            }
        });

        if (!response.ok) {
            throw new Error(ERROR_OCCURRED_CHECKING_IF_RECIPE_FAVORITE);
        }

        const isFavorite = await response.json();
        console.log(`Recipe: [${recipeName}] is ${isFavorite ? "a favorite" : "not a favorite"}`);
        return isFavorite;
    } catch (error) {
        console.error(error);
    }
}


function getRecipeId() {
    return document.querySelector('[data-recipe-id]')?.getAttribute('data-recipe-id') || '';
}