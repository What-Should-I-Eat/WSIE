// Redirects
const BASE_HOME_REDIRECT = "/";
const VERIFY_ACCOUNT_REDIRECT = "verify_account.html";

// Fetch Constants
const POST_ACTION = "POST";
const DEFAULT_DATA_TYPE = "application/json";

// Server URL - Locally
const host = 'http://localhost:3001';
// Server URL - NGINX
// const host = 'http://localhost:8080';

// Authentication API Endpoints
const REGISTER_URL = `${host}/api/v1/users/register`;
const LOGIN_URL = `${host}/api/v1/users/find-username`;
const PROFILE_URL = `${host}/api/v1/users/profile`;

// Sign-In / Sign-Up Messages
const SUCCESSFUL_LOGIN = "You were successfully logged in!";
const ACCOUNT_CREATION = "Account successfully created!";

function renderNavbar() {
  const navBar = $('#navBarMyAccountSignInSignUp');
  navBar.empty();

  const currentUser = getUser();

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
 * TODO: This method should be re-factored to only store KEY information from the user. Right now this is storing all the credentials which is a security concern
 * @param {*} user 
 */
function setUser(user) {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('user');
  }
}

function getUser() {
  const userString = sessionStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

function clearErrorMessage() {
  $(".alert-danger").remove();
}

function convertToJson(formArray) {
  return formArray.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});
}

$(document).ready(function () {
  renderNavbar();

  // Handles sign-up business logic;
  $("#signUpForm").on("submit", function (event) {
    event.preventDefault();

    const form = $(this);
    const formArray = form.serializeArray();
    const firstName = formArray[0].value;
    const lastName = formArray[1].value;

    formArray.push({ name: "fullName", value: `${firstName} ${lastName}` });
    formArray.push({ name: "diet", value: [] });
    formArray.push({ name: "health", value: [] });
    formArray.push({ name: "favorites", value: [] });
    formArray.push({ name: "verificationCode", value: "test" });

    const formJson = convertToJson(formArray);
    clearErrorMessage();

    fetch(REGISTER_URL, {
      method: POST_ACTION,
      body: JSON.stringify(formJson),
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          setUser(data);
          form.prepend('<div class="alert alert-success">' + ACCOUNT_CREATION + "</div>");
          window.location.href = BASE_HOME_REDIRECT;
        });
      } else {
        return response.json().then(error => {
          form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
        });
      }
    }).catch(error => {
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Handles sign-in business logic
  $("#signInForm").on("submit", function (event) {
    event.preventDefault();

    const form = $(this);
    const formArray = form.serializeArray();
    const formJson = convertToJson(formArray);
    clearErrorMessage();

    fetch(LOGIN_URL, {
      method: POST_ACTION,
      body: JSON.stringify(formJson),
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          setUser(data);
          if (data.verified) {
            window.location.href = BASE_HOME_REDIRECT;
          } else {
            // window.location.href = VERIFY_ACCOUNT_REDIRECT;
          }
        });
      } else {
        return response.json().then(error => {
          form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
        });
      }
    }).catch(error => {
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Handles showing sign-in modal
  $("#showSignInModalContentBtn, #signInSwitch").click(function () {
    $("#signUpModalContent").hide();
    $("#signUpForm")[0].reset();
    clearErrorMessage();
    $("#signInModalContent").show();
    $("#authModal").modal("show");
  });

  // Handles showing sign-up modal
  $("#showSignUpModalContentBtn, #signUpSwitch").click(function () {
    $("#signInModalContent").hide();
    $("#signInForm")[0].reset();
    clearErrorMessage();
    $("#signUpModalContent").show();
    $("#authModal").modal("show");
  });

  // Handles user signout
  $("a[href='/signout']").on("click", function (event) {
    event.preventDefault();
    setUser(undefined);
    window.location.href = BASE_HOME_REDIRECT;
  });

  // Toggle Password Show/Hide
  $(".toggle-password").on('click', function (event) {
    event.preventDefault();
    var $inputField = $(this).closest('.input-group').find('input');
    var $icon = $(this).find('i');

    if ($inputField.attr("type") === "text") {
      $inputField.attr('type', 'password');
      $icon.addClass("fa-eye-slash").removeClass("fa-eye");
    } else if ($inputField.attr("type") === "password") {
      $inputField.attr('type', 'text');
      $icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });
});