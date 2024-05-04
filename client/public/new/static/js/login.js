// Redirects
const BASE_HOME_REDIRECT = "account/my_dietary.html";
const VERIFY_ACCOUNT_REDIRECT = "verify_account.html";

// API Actions
const POST_ACTION = "POST";
const GET_ACTION = "GET";
const DEFAULT_DATA_TYPE = "application/json";

// User Messages
const SUCCESSFUL_LOGIN = "You were successfully logged in!"
const ACCOUNT_CREATION = "Account successfully created!";

// Server Port in NGINX
// const host = 'http://localhost:8080';
// Server Port Locally
const host = 'http://localhost:3001';
const REGISTER_URL = `${host}/api/v1/users/register`;
const LOGIN_URL = `${host}/api/v1/users/find-username`;
const PROFILE_URL = `${host}/api/v1/users/profile`;

$(document).ready(function () {
  function clearErrorMessage() {
    $(".alert-danger").remove();
  }

  // Sign-Up Business Logic
  $("#signUpForm").on("submit", function (event) {
    event.preventDefault();

    console.log("In Sign-Up Logic");

    // Set variable here so we can update with error messages
    var form = $(this);
    var formArray = form.serializeArray();

    const firstName = formArray[0].value;
    const lastName = formArray[1].value;

    formArray.push({ name: "fullName", value: firstName + " " + lastName })
    formArray.push({ name: "diet", value: [] });
    formArray.push({ name: "health", value: [] });
    formArray.push({ name: "favorites", value: [] });
    formArray.push({ name: "verificationCode", value: "test" });

    // Convert to JSON
    var formJson = convertToJson(formArray);

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
          console.log("Successfully created user:", data.fullName);
          // TODO: Temporary
          form.prepend('<div class="alert alert-success">' + ACCOUNT_CREATION + "</div>");
          // window.location.href = VERIFY_ACCOUNT_REDIRECT;
          // $('#ajaxSuccessMessage').text(response.success);
          // $('#ajaxAlertSuccess').show();
        });
      } else {
        return response.json().then(error => {
          console.error("Error Occurred:", JSON.stringify(error));
          form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
        });
      }
    }).catch(error => {
      console.error("Error Occurred:", error);
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Sign-In Business Logic
  $("#signInForm").on("submit", function (event) {
    event.preventDefault();

    console.log("In Sign-In Logic");

    // Set variable here so we can update with error messages
    var form = $(this);
    var formArray = form.serializeArray();

    // Convert to JSON
    var formJson = convertToJson(formArray);

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
          console.log("Successfully logged in user:", data.fullName);

          if (data.verified) {
            console.log("User is verified - redirect to home page");
            // TODO: Temporary
            form.prepend('<div class="alert alert-success">' + SUCCESSFUL_LOGIN + "</div>");
          } else {
            console.log("User is not verified - redirect to verification page");
            // window.location.href = VERIFY_ACCOUNT_REDIRECT;
            // $('#ajaxSuccessMessage').text(response.success);
            // $('#ajaxAlertSuccess').show();
          }
        });
      } else {
        return response.json().then(error => {
          console.error("Error Occurred:", JSON.stringify(error));
          form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
        });
      }
    }).catch(error => {
      console.error("Error Occurred:", error);
      form.prepend('<div class="alert alert-danger">' + error.error + "</div>");
    });
  });

  // Handles Sign-In Modal Switch
  $("#showSignInModalContentBtn, #signInSwitch").click(function () {
    $("#signUpModalContent").hide();
    $("#signUpForm")[0].reset();
    clearErrorMessage();
    $("#signInModalContent").show();
    $("#authModal").modal("show");
  });

  // Handles Sign-Up Modal Switch
  $("#showSignUpModalContentBtn, #signUpSwitch").click(function () {
    $("#signInModalContent").hide();
    $("#signInForm")[0].reset();
    clearErrorMessage();
    $("#signUpModalContent").show();
    $("#authModal").modal("show");
  });
});

function convertToJson(formArray) {
  var formJson = {};
  $.each(formArray, function (_, obj) {
    formJson[obj.name] = obj.value;
  });

  return formJson;
}