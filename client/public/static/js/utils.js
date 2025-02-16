const utils = (() => {
    /**
     * Stores data in session storage.
     *
     * @param {string} key The key to store the data under
     * @param {*} value The value to store
     */
    function setStorage(key, value) {
        if (key) { //why is this a boolean??
            //sessionStorage.setItem(key, JSON.stringify(value));
            sessionStorage.setItem(key, value);

            console.log("value = ", value);
            console.log("Session set with: ", JSON.stringify(value));
        }
    }

    /**
     * Removes data from session storage.
     *
     * @param {string} key The key from which data should be removed
     */
    function removeFromStorage(key) {
        if (key) {
            sessionStorage.removeItem(key);
        }
    }

    /**
     * Retrieves data from session storage.
     *
     * @param {string} key The key to retrieve the data for
     * @returns {*} The retrieved data or null if not found
     */
    function getFromStorage(key) {
        console.log("key value: ", key);
        const value = sessionStorage.getItem(key);
        if (!value || value === "undefined") {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    /**
     * Clears all data from session storage.
     */
    function clearStorage() {
        sessionStorage.clear();
    }

    /**
     * Removes specific classes from elements in the authentication modal, typically used to clear alerts.
     *
     * @param {string[]} classesToRemove Array of class names to be removed from elements
     */
    function clearMessageFromAuthModal(classesToRemove) {
        classesToRemove.forEach(className => {
            $(`.${className}`).remove();
        });
    }

    /**
     * Converts a form array to a JSON object.
     *
     * @param {Object[]} formArray An array of objects typically generated from serializing a form
     * @returns {Object} The JSON object created from the form array
     */
    function convertToJson(formArray) {
        return formArray.reduce((acc, {name, value}) => {
            acc[name] = value;
            return acc;
        }, {});
    }

    /**
     * Renders the navigation bar dynamically based on user's login status.
     * Uses session information to decide which options to display.
     */
    /**

     * Dynamically renders the navigation bar based on the user's session.

     * Called after login or verification to reflect the authenticated state.

     */

    async function renderNavbar() {

        const navBar = $('#navBarMyAccountSignInSignUp');
        const adminTab = $('#enable-admin-tab');
        navBar.empty();
        const username = utils.getUserNameFromCookie(); // Fetch username from cookies

        if (username) {
            const user = await utils.getUserFromUsername(username); // Fetch user data

            if (user) {

                const myAccountDropdown = $('<div id="myAccountDropdown" class="dropdown"></div>');
                const dropdownToggle = $('<button class="btn btn-link account-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">My Account</button>');
                const dropdownMenu = $('<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navLink"></div>');
                dropdownMenu.append('<h6 class="dropdown-header">Welcome back!</h6>');
                dropdownMenu.append(`<h6 class="dropdown-header">${user.fullName}</h6>`);
                dropdownMenu.append('<div class="dropdown-divider"></div>');
                dropdownMenu.append('<a class="dropdown-item" href="/account/my_dietary">My Dietary</a>');
                dropdownMenu.append('<a class="dropdown-item" href="/account/my_recipes">My Recipes</a>');
                dropdownMenu.append('<a class="dropdown-item" href="/account/my_profile">My Profile</a>');
                const signOutLink = $('<a class="dropdown-item" href="#">Sign Out</a>').on('click', function (e) {
                    e.preventDefault();
                    utils.signOutUser(); // Handle sign-out logic
                });

                dropdownMenu.append(signOutLink);
                myAccountDropdown.append(dropdownToggle);
                myAccountDropdown.append(dropdownMenu);
                navBar.append(myAccountDropdown);


                if (user.isAdmin) {
                    const adminDropdown = $('<div id="adminDropdown" class="dropdown"></div>');
                    const adminDropdownToggle = $('<button class="btn btn-link account-link dropdown-toggle" type="button" id="dropdownAdminButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Admin</button>');
                    const adminDropdownMenu = $('<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navLink"></div>');

                    adminDropdownMenu.append('<a class="nav-link" href="/admin">Publish Requests</a>');
                    adminDropdownMenu.append('<a class="nav-link" href="/admin/reported_content">Reported Content</a>');

                    adminDropdown.append(adminDropdownToggle);
                    adminDropdown.append(adminDropdownMenu);
                    adminTab.append(adminDropdown);
                }
            } else {
                utils.setNotLoggedInNavBar(navBar); // Display "Sign In" and "Sign Up"
            }
        } else {
            utils.setNotLoggedInNavBar(navBar);
        }
    }


    /**
     * Initiates the user sign-out process by sending a request to the sign-out route.
     * Upon successful sign-out, stores a success message in the session storage
     * and redirects the user to the base home page.
     * If there is an error during the sign-out process, logs the error to the console.
     */
    function signOutUser() {
        fetch(SIGNOUT_ROUTE)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setStorage("signOutMessage", SUCCESSFUL_SIGNOUT);
                    window.location.href = BASE_HOME_REDIRECT;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
            });
    }

    /**
     * Sets up the navigation bar for users who are not logged in.
     * Displays "Sign In" and "Sign Up" options.
     *
     * @param {jQuery} navBar The jQuery element representing the navigation bar
     */
    function setNotLoggedInNavBar(navBar) {
        const signInButton = $('<button id="showSignInModalContentBtn" type="button" class="mb-2 mb-md-0 mr-md-2 btn btn-link account-link" data-toggle="modal">Sign in</button>');
        const signUpButton = $('<button id="showSignUpModalContentBtn" type="button" class="btn btn-link account-link" data-toggle="modal">Sign up</button>');
        navBar.append(signInButton, signUpButton);
    }

    /**
     * Fetches user data based on the username.
     *
     * @param {string} username The username to query
     * @returns {Promise<Object>} A promise that resolves to the user data or null in case of an error
     */
    async function getUserFromUsername(username) {
        const urlWithQueryParams = `${GET_USER_DATA_URL}=${username}`;
        try {
            const response = await fetch(urlWithQueryParams, {
                method: GET_ACTION,
                headers: {
                    'Content-Type': DEFAULT_DATA_TYPE
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return response.json();
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            return null;
        }
    }

    /**
     * Fetches user data based on the email address provided.
     *
     * @param {string} email The email to query
     * @returns {Promise<Object>} A promise that resolves to the user data or null in case of an error
     */
    async function getUserFromEmail(email) {
        const urlWithQueryParams = `${REQUEST_USER_INFO_FOR_RESET_URL}=${email}`;
        try {
            const response = await fetch(urlWithQueryParams, {
                method: GET_ACTION,
                headers: {
                    'Content-Type': DEFAULT_DATA_TYPE
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return response.json();
        } catch (error) {
            console.error("Failed to fetch user data by email:", error);
            return null;
        }
    }

    /**
     * Fetches user ID based on the username provided.
     *
     * @param {string} username The username to query
     * @returns {Promise<Object>} A promise that resolves to the user ID or null in case of an error
     */
    async function getUserIdFromUsername(username) {
        const urlWithQueryParams = `${GET_USER_ID}=${username}`;
        try {
            const response = await fetch(urlWithQueryParams, {
                method: GET_ACTION,
                headers: {
                    'Content-Type': DEFAULT_DATA_TYPE
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return response.json();
        } catch (error) {
            console.error("Failed to fetch user ID:", error);
            return null;
        }
    }

    /**
     * Handles post-login cookie verification and debugging.
     *
     */
    /**

     * Handles post-login and post-verification cookie handling.

     * Verifies the session and fetches the user's profile to render UI dynamically.

     */

    async function cookieWorkaround() {
        try {
            const response = await fetch(PROFILE_URL, {
                method: 'GET_ACTION',
                credentials: 'include', // Ensures cookies are sent with the request
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile. Please log in again.');
            }

            const data = await response.json();
            console.log('Profile Data:', data);

            // Update session storage for easy access
            utils.setStorage('username', data.user.username);
            utils.setStorage('userId', data.user._id);
            utils.setStorage('fullName', data.user.fullName);

            // Render the navigation bar for the logged-in user
            await utils.renderNavbar();

        } catch (error) {
            console.error('Error in cookieWorkaround:', error.message);
            utils.cleanupSignOut(); // Clear storage and cookies if something goes wrong
            window.location.href = '/login'; // Redirect to login if session is invalid
        }
    }


    /**
     * Retrieves the username from the browser cookies.
     *
     * @returns {string|null} The username if found, otherwise null
     */
    function getUserNameFromCookie() {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; username=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }

        return null;
    }

    /**
     * Checks if two strings are equal, ignoring case.
     *
     * @param {string} str1 The first string
     * @param {string} str2 The second string
     * @returns {boolean} True if the strings are equal, false otherwise
     */
    function checkIfStringsAreEqual(str1, str2) {
        return str1.length === str2.length && str1.toLowerCase() === str2.toLowerCase();
    }

    /**
     * Determines if two arrays are equal in terms of elements and their frequencies.
     *
     * @param {Array} a The first array
     * @param {Array} b The second array
     * @returns {boolean} True if the arrays are equal, false otherwise
     */
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;

        const uniqueValues = new Set([...a, ...b]);
        for (let value of uniqueValues) {
            const aCount = a.filter(item => item === value).length;
            const bCount = b.filter(item => item === value).length;
            if (aCount !== bCount) {
                return false;
            }
        }
        return true;
    }

    /**
     * Shows an Ajax alert message dynamically on the page.
     *
     * @param {string} type The type of alert ('Error', 'Success', 'Warning')
     * @param {string} message The message to display in the alert
     */
    function showAjaxAlert(type, message) {
        const alertDivMap = {
            "Error": "#ajaxAlertError",
            "Success": "#ajaxAlertSuccess",
            "Warning": "#ajaxAlertWarning"
        };

        const alertMessageMap = {
            "Error": "#ajaxErrorMessage",
            "Success": "#ajaxSuccessMessage",
            "Warning": "#ajaxWarningMessage"
        };

        // Reset and hide all alerts, clear their messages
        Object.keys(alertDivMap).forEach(key => {
            const div = $(alertDivMap[key]);
            div.hide().removeClass('show fade').addClass('hide');
            div.find('.close').off('click').on('click', function () {
                div.hide().removeClass('show fade in').addClass('hide');
            });
            $(alertMessageMap[key]).text('');
        });

        const alertDiv = $(alertDivMap[type]);
        if (!alertDiv.length) {
            console.error(`Alert [${type}] does not have a corresponding div.`);
            return;
        }

        var alertMessage = $(alertMessageMap[type]);
        if (!alertMessage.length) {
            console.error(`Alert [${type}] does not have a corresponding span.`);
            return;
        }

        // Setup and show the specific alert
        alertDiv.removeClass('hide').addClass('show fade');
        alertMessage.text(message);
        alertDiv.show();
        alertDiv.alert();

        // Scroll the window to the top whenever an alert is displayed
        scrollToTop();
    }

    /**
     * Clears all cookies from the browser.
     */
    function clearCookies() {
        document.cookie.split(";").forEach(c => {
            document.cookie = c.trim().split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        });
    }

    /**
     * Cleans up session storage and cookies, typically used during sign out.
     */
    function cleanupSignOut() {
        clearStorage();
        clearCookies();
    }

    /**
     * Retrieves and decodes the user recipe image from the recipe data.
     * Handles errors by reverting to a default "no image available" state.
     * @param {Object} recipe - A recipe object containing image data.
     * @returns {Promise<string>} - A Promise that resolves to the image URL or a default image.
     */
    async function getUserRecipeImage(recipe) {
        try {
            if (recipe.recipeImage) {
                return recipe.recipeImage;
            } else {
                return NO_IMAGE_AVAILABLE;
            }
        } catch (error) {
            console.error(error.message);
            return NO_IMAGE_AVAILABLE;
        }
    }

    /**
     * Converts the recipe image data to a data URL using FileReader.
     * @param {Object} recipe - A recipe object containing image data.
     * @returns {Promise<string>} - A Promise that resolves to a data URL.
     */
    async function decodeUserRecipeImage(recipe) {
        if (!recipe.userRecipeImage || !recipe.userRecipeImage.recipeImageData) {
            throw new Error(`${USER_CREATED_RECIPE_HAS_NO_IMAGE} for [${recipe.recipeName}]`);
        }

        const {data, imageType} = recipe.userRecipeImage.recipeImageData;
        const blob = new Blob([new Uint8Array(data)], {type: imageType});
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(`${FAILED_TO_DECODE_USER_RECIPE_IMAGE} for [${recipe.recipeName}]`));
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Handles requesting Edamam recipe image for recipe details and my recipes view
     * @param {string} imageUrl - A recipes image
     * @returns {Promise<string>} - A Promise that resolves to a data URL.
     */
    async function getEdamamRecipeImage(imageUrl) {
        try {
            // Let the client's server handle the data
            const response = await fetch(`/recipes/get_edamam_image?url=${encodeURIComponent(imageUrl)}`);
            const data = await response.json();
            return `data:${data.imageType};base64,${data.base64Image}`;
        } catch (error) {
            console.error(error);
            return NO_IMAGE_AVAILABLE;
        }
    }

    /**
     * Helper function that will scroll the window nice and smooth to the top.
     * This should be used for things such as alerts to the user and for
     * pagination
     */
    function scrollToTop() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Helper function that will remove filters from the browser's session
     * storage based on the current URL. We only remove the session storage
     * for the given checkbox selection when we are NOT on a page that
     * contains `/recipes/`
     */
    function clearRecipesFilterStorageWrapper() {
        const urlPart = "/recipes/";
        const currentUrl = window.location.href;
        const itemsToRemove = ["mealTypeSelections", "dishTypeSelections", "cuisineTypeSelections"];

        if (!currentUrl.includes(urlPart)) {
            itemsToRemove.forEach(item => {
                console.log(`Removing [${item}] from session storage`);
                removeFromStorage(item);
            });
        }
    }

    /**
     * Helper function that is used to check for user being signed in before
     * allowing for submission of updating recipes (fav/unfav/delete/update).
     * @returns {userId} - UserId of signed in user
     */
    async function checkUserIdAndUsername() {
        const username = utils.getUserNameFromCookie();
        if (!username) {
            console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
            utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
            return 0;
        }

        const userId = await utils.getUserIdFromUsername(username);
        if (!userId) {
            console.error(UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
            utils.showAjaxAlert("Error", UNABLE_TO_UPDATE_USER_NOT_LOGGED_IN);
            return 0;
        }
        return userId;
    }

    /**
     * Handles rerouting to user created recipe update page
     * @param {string} recipeName - User created recipe name
     */
    async function updateRecipe(recipeName) {
        const userId = await checkUserIdAndUsername();
        if (userId) {
            window.location = "/account/update_recipe?userRecipeName=" + recipeName;
        }
    }

    /**
     * Handles deleting recipe based on provided recipe name and user
     * signed in.
     * @param {string} recipeName - Name of user create recipe to delete
     */
    async function deleteRecipe(recipeName) {
        const userId = await checkUserIdAndUsername();
        if (userId) {
            // Delete recipe
            let request = {
                recipeName: recipeName
            }
            let successMessage = SUCCESSFULLY_DELETED_RECIPE;
            let errorMessage = UNABLE_TO_DELETE_RECIPE_ERROR;

            let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/recipe/delete_recipe`;

            try {
                const response = await fetch(url, {
                    method: DELETE_ACTION,
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
                    utils.setStorage("deleteRecipeMessage", successMessage);
                    window.location.reload();
                }
            } catch (error) {
                console.error(error);
                utils.showAjaxAlert("Error", error.message);
            }
        }
    }

    /**
     * Handles unfavoriting recipe based on provided recipe name and user
     * signed in.
     * @param {string} recipeName - Name of user create recipe to unfavorite
     */
    async function unfavoriteRecipe(recipeName) {
        const userId = await checkUserIdAndUsername();
        if (userId) {
            // Remove from favorites
            let request = {
                recipeName: recipeName
            }
            let successMessage = SUCCESSFULLY_UNFAVORITE_RECIPE;
            let errorMessage = UNABLE_TO_UNFAVORITE_UNEXPECTED_ERROR;

            let url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;
            try {
                const response = await fetch(url, {
                    method: DELETE_ACTION,
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
                    utils.setStorage("deleteRecipeMessage", successMessage);
                    window.location.reload();
                }
            } catch (error) {
                console.error(error);
                utils.showAjaxAlert("Error", error.message);
            }
        }
    }

    /**
     * Handles checking if a recipe is listed as the signed in users favorite
     * provided recipe name and user signed in.
     * @param {string} recipeName - Name of user create recipe to check favorite
     * status
     * * @returns {isFavorite or false} - False or true status of recipe fav status
     */
    async function checkIfFavorite(username, recipeName) {
        if (username == null || username == undefined) {
            console.debug("User not logged in. Not checking if recipe is a favorite");
            return false;
        }

        const userId = await utils.getUserIdFromUsername(username);

        const request = {
            recipeName: recipeName
        };

        const url = `${USER_FAVORITES_RECIPES_CRUD_URL}/${userId}/favorites`;

        try {
            const response = await fetch(url, {
                method: POST_ACTION,
                headers: {
                    'Content-Type': DEFAULT_DATA_TYPE
                },
                body: JSON.stringify({favorites: request})
            });

            //if the recipe is not found at all then this immediately throws an error rather than returning false
            if (!response.ok) {
                return false;
                throw new Error(ERROR_OCCURRED_CHECKING_IF_RECIPE_FAVORITE);
            }

            const isFavorite = await response.json();
            console.log(`Recipe: [${recipeName}] is ${isFavorite ? "a favorite" : "not a favorite"}`);
            return isFavorite
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function utilizes Greip's profanity filter.
     * @param {string} text - String of text that is to be checked in the profanity filter
     * * @returns {data} - data object that contains profanity status and other currently
     * unused elements.
     * See full terms and conditions at https://greip.io/terms
     */
    async function checkForProfanity(text) {
        const options = {
            method: GET_ACTION,
            headers: {Authorization: 'Bearer b30c3a2dbb27b1f84c31fc3e1123df73'}
        };

        const response = await fetch('https://greipapi.com/scoring/profanity?text=' + text, options);
        const data = await response.json();

        if (data.data.isSafe) {
            return false;
        } else {
            return true;
        }
    }

    return {
        setStorage,
        removeFromStorage,
        getFromStorage,
        clearStorage,
        clearMessageFromAuthModal,
        convertToJson,
        renderNavbar,
        getUserFromUsername,
        getUserFromEmail,
        getUserIdFromUsername,
        cookieWorkaround,
        getUserNameFromCookie,
        checkIfStringsAreEqual,
        arraysEqual,
        showAjaxAlert,
        clearCookies,
        cleanupSignOut,
        getUserRecipeImage,
        getEdamamRecipeImage,
        scrollToTop,
        clearRecipesFilterStorageWrapper,
        updateRecipe,
        deleteRecipe,
        unfavoriteRecipe,
        checkIfFavorite,
        checkUserIdAndUsername,
        signOutUser,
        setNotLoggedInNavBar,
        checkForProfanity
    };
})();
