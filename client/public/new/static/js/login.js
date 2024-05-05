// Sign-In / Sign-Up Messages
const SUCCESSFUL_LOGIN = "You were successfully logged in!";
const ACCOUNT_CREATION = "Account successfully created!";

// Server Error Messages
const ACCOUNT_NOT_VERIFIED = "User account is not verified";

/**
 * Method used to render the navigation bar based on whether the user is logged in or not. 
 * This is similar implementation to how django handles the 'session' of the user from
 * the backend. Here we are dynamically building the navigation bar based on user session
 */
function renderNavbar() {
  const navBar = $('#navBarMyAccountSignInSignUp');
  navBar.empty();

  const currentUser = utils.getFromStorage("user");

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

$(document).ready(function () {
  renderNavbar();

  // Handles sign-up form submission logic
  $("#signUpForm").on("submit", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();

    const [firstName, lastName, email, username, password, retypedPassword] = formArray.map(({ value }) => value);
    const fullName = `${firstName} ${lastName}`;

    const validationCode = validationHandler.validateSignupInput(email, username, password, retypedPassword);

    if (validationCode !== 0) {
      const errorMessage = validationHandler.getValidationText(validationCode);
      form.prepend('<div class="alert alert-danger">' + errorMessage + "</div>");
      return;
    }

    const verificationCode = await validationHandler.getVerificationCode();
    emailWrapper.sendEmail(fullName, email, verificationCode, emailjs, "newUser", username);

    const user = {
      fullName: fullName,
      username: username,
      password: password,
      email: email,
      verificationCode, verificationCode,
      diet: [],
      health: [],
      favorites: []
    }

    fetch(REGISTER_URL, {
      method: POST_ACTION,
      body: JSON.stringify(user),
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(async response => {
      if (response.ok) {
        console.log(ACCOUNT_CREATION)

        const data = await response.json();
        // Store the username and email so we can access for verification
        utils.setStorage("username", data.username);
        // Store the verification so we can bypass email
        utils.setStorage("verificationCode", verificationCode);

        // Hide Sign-Up Modal and Show the Verify Account Modal with Message to User
        $("#signUpModalContent").hide();
        $("#signUpForm")[0].reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#verifyAccountModalContent").show();
        $("#authModal").modal("show");
        $('#verifyAccountForm').prepend('<div class="alert alert-warning">' + VERIFY_ACCOUNT + "</div>");
      } else {
        const data = await response.json();
        const error = data.error;
        console.error(error);
        form.prepend('<div class="alert alert-danger">' + error + "</div>");
      }
    }).catch(error => {
      console.error(error);
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Handles sign-in form submission logic
  $("#signInForm").on("submit", function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();
    const formJson = utils.convertToJson(formArray);

    fetch(LOGIN_URL, {
      method: POST_ACTION,
      body: JSON.stringify(formJson),
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(async response => {
      if (response.ok) {
        console.log(SUCCESSFUL_LOGIN)

        const data = await response.json();
        // Only set the user if they're verified
        utils.setStorage("user", data);
        // Store the username and email so we can access for verification
        utils.setStorage("username", data.username);
        window.location.href = BASE_HOME_REDIRECT;
      } else {
        const data = await response.json();
        const error = data.error;
        console.error(error);

        if (error === ACCOUNT_NOT_VERIFIED) {
          $("#signInModalContent").hide();
          $("#signInForm")[0].reset();
          utils.clearMessageFromAuthModal(authClassesToRemove);
          $("#verifyAccountModalContent").show();
          $("#authModal").modal("show");
          $('#verifyAccountForm').prepend('<div class="alert alert-warning">' + VERIFY_ACCOUNT + "</div>");
        } else {
          form.prepend('<div class="alert alert-danger">' + error + "</div>");
        }
      }
    }).catch(error => {
      console.error(error);
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Handles showing sign-in modal
  $("#showSignInModalContentBtn, #signInSwitch, #signInSwitchVerification").click(function () {
    $("#signUpModalContent").hide();
    $("#signUpForm")[0].reset();
    $("#verifyAccountModalContent").hide();
    $("#verifyAccountForm")[0].reset();
    utils.clearMessageFromAuthModal(authClassesToRemove);
    $("#signInModalContent").show();
    $("#authModal").modal("show");
  });

  // Handles showing sign-up modal
  $("#showSignUpModalContentBtn, #signUpSwitch").click(function () {
    $("#signInModalContent").hide();
    $("#signInForm")[0].reset();
    $("#verifyAccountModalContent").hide();
    $("#verifyAccountForm")[0].reset();
    utils.clearMessageFromAuthModal(authClassesToRemove);
    $("#signUpModalContent").show();
    $("#authModal").modal("show");
  });

  // Handles user signout
  $("a[href='/signout']").on("click", function (event) {
    event.preventDefault();
    utils.setStorage("user", undefined);
    utils.setStorage("username", undefined);
    utils.setStorage("verificationCode", undefined);
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