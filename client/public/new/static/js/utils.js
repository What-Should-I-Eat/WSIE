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
    return formArray.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
  }

  /**
   * Renders the navigation bar dynamically based on user's login status.
   * Uses session information to decide which options to display.
   */
  async function renderNavbar() {
    const navBar = $('#navBarMyAccountSignInSignUp');
    navBar.empty();

    const username = getUserNameFromCookie();

    if (username) {
      const user = await getUserFromUsername(username);
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
        dropdownMenu.append('<a class="dropdown-item" href="/signout">Sign Out</a>');

        myAccountDropdown.append(dropdownToggle);
        myAccountDropdown.append(dropdownMenu);
        navBar.append(myAccountDropdown);
      } else {
        setNotLoggedInNavBar(navBar);
      }
    } else {
      setNotLoggedInNavBar(navBar);
    }
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
   * @param {string} username The username associated with the cookies to check
   */
  async function cookieWorkaround(username) {
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
      return response.json();
    }).then(data => {
      console.log('Profile Data:', data);
    }).catch(error => {
      console.error("Error verifying cookies:", error);
    });
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
    cleanupSignOut
  };
})();
