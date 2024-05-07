const utils = (() => {
  /**
   * Stores data in session storage.
   * 
   * @param {string} key The key to store the data under
   * @param {*} value The value to store
   */
  function setStorage(key, value) {
    if (key) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
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
   * Removes alerts from the login modal.
   * 
   * @param {string[]} classesToRemove Array of class names to remove
   */
  function clearMessageFromAuthModal(classesToRemove) {
    classesToRemove.forEach(className => {
      $(`.${className}`).remove();
    });
  }

  /**
   * Converts a form array to JSON.
   * 
   * @param {Object[]} formArray The form array to convert
   * @returns {Object} The converted JSON object
   */
  function convertToJson(formArray) {
    return formArray.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
  }

  /**
   * Renders the navigation bar based on user login status.
   */
  function renderNavbar() {
    const navBar = $('#navBarMyAccountSignInSignUp');
    navBar.empty();

    const currentUser = getFromStorage("user");

    if (currentUser) {
      const myAccountDropdown = $('<div id="myAccountDropdown" class="dropdown"></div>');
      const dropdownToggle = $('<button class="btn btn-link account-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">My Account</button>');
      const dropdownMenu = $('<div class="dropdown-menu dropdown-menu-right" aria-labelledby="navLink"></div>');

      dropdownMenu.append('<h6 class="dropdown-header">Welcome back!</h6>');
      dropdownMenu.append(`<h6 class="dropdown-header">${currentUser.fullName}</h6>`);
      dropdownMenu.append('<div class="dropdown-divider"></div>');
      dropdownMenu.append('<a class="dropdown-item" href="/account/my_dietary.html">My Dietary</a>');
      dropdownMenu.append('<a class="dropdown-item" href="/account/my_recipes.html">My Recipes</a>');
      dropdownMenu.append('<a class="dropdown-item" href="/account/profile.html">My Settings</a>');
      dropdownMenu.append('<a class="dropdown-item" href="/signout">Sign Out</a>');

      myAccountDropdown.append(dropdownToggle);
      myAccountDropdown.append(dropdownMenu);
      navBar.append(myAccountDropdown);
    } else {
      const signInButton = $('<button id="showSignInModalContentBtn" type="button" class="mb-2 mb-md-0 mr-md-2 btn btn-link account-link" data-toggle="modal">Sign in</button>');
      const signUpButton = $('<button id="showSignUpModalContentBtn" type="button" class="btn btn-link account-link" data-toggle="modal">Sign up</button>');
      navBar.append(signInButton, signUpButton);
    }
  }

  /**
   * Fetches user data based on the username.
   * 
   * @param {string} username The username to query
   * @returns {Object} The user data or error
   */
  async function getUserFromUsername(username) {
    const urlWithQueryParams = `${GET_USER_DATA_URL}=${username}`;
    console.log("Querying Server for:", urlWithQueryParams);

    try {
      const response = await fetch(urlWithQueryParams, {
        method: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }
      return response.json();
    } catch (error) {
      console.error(error.error);
      return null;
    }
  }

  /**
   * Fetches user data based on the email.
   * 
   * @param {string} email The email to query
   * @returns {Object} The user data or error
   */
  async function getUserFromEmail(email) {
    const urlWithQueryParams = `${REQUEST_USER_INFO_FOR_RESET_URL}=${email}`;
    console.log("Querying Server for:", urlWithQueryParams);

    try {
      const response = await fetch(urlWithQueryParams, {
        method: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }
      return response.json();
    } catch (error) {
      console.error(error.error);
      return null;
    }
  }

  return {
    setStorage,
    getFromStorage,
    clearMessageFromAuthModal,
    convertToJson,
    renderNavbar,
    getUserFromUsername,
    getUserFromEmail
  };
})();
