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
    }
  }

  /**
   * Removes data from session storage
   * 
   * @param {string} key 
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
   * Helper function to clear all data from the session's storage
   */
  function clearStorage() {
    sessionStorage.clear();
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
      dropdownMenu.append('<a class="dropdown-item" href="/account/my_dietary">My Dietary</a>');
      dropdownMenu.append('<a class="dropdown-item" href="/account/my_recipes">My Recipes</a>');
      dropdownMenu.append('<a class="dropdown-item" href="/account/profile">My Settings</a>');
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

      console.debug(`Got user from username: ${username}`);
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

      console.debug(`Got user from email: ${email}`);
      return response.json();
    } catch (error) {
      console.error(error.error);
      return null;
    }
  }

  /**
   * Fetches user id based on the username.
   * 
   * @param {string} username The username to query
   * @returns {Object} The user id or error
   */
  async function getUserIdFromUsername(username) {
    const urlWithQueryParams = `${GET_USER_ID}=${username}`;
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

      console.debug(`Got userId from username: ${username}`);
      return response.json();
    } catch (error) {
      console.error(error.error);
      return null;
    }
  }

  /**
   * Function that serves as a work around to verify post-login cookies are set correctly
   * 
   * @param {string} username 
   */
  async function cookieWorkaround(username) {
    console.log("Querying Server for:", username);

    fetch(PROFILE_URL, {
      method: GET_ACTION,
      credentials: 'include',
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(FAILED_TO_GET_USER_PROFILE);
      }

      console.log(SUCCESSFULLY_GOT_PROFILE)
      return response.json();
    }).then(data => {
      console.log('Profile Data:', data);
    }).catch(error => {
      console.error(error);
    });
  }

  /**
   * Function that gets the username from the cookie
   * 
   * @returns The username
   */
  function getUserNameFromCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; username=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }

  /**
   * Function that checks if two arrays are equal
   * 
   * @param {array} a 
   * @param {array} b 
   * @returns true if equal, false otherwise
   */
  function arraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

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
   * Function that shows an ajax alert dynamically
   * 
   * @param {string} type The div to find
   * @param {string} message The message to display
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
    }

    const alertDiv = $(alertDivMap[type]);
    if (!alertDiv) {
      console.error("Alert type does not have a corresponding div.");
      return;
    }

    var alertMessage = $(alertMessageMap[type]);
    if (!alertMessage) {
      console.error("Alert type does not have a corresponding span.");
      return;
    }

    alertDiv.removeClass('hide').removeAttr('style').addClass('show');
    alertMessage.text(message);
    alertDiv.show();
    alertDiv.alert();
  }

  /**
   * Clears all cookies from the browser
   */
  function clearCookies() {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.trim().split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    });
  }

  /**
   * Helper function to clean up session storage and remove all cookies
   */
  function cleanupSignOut() {
    console.debug("Clearing session storage");
    clearStorage();
    console.log("Clearing document cookies");
    clearCookies();
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
    arraysEqual,
    showAjaxAlert,
    clearCookies,
    cleanupSignOut
  };
})();
