const BASE_HOME_REDIRECT = "account/my_dietary.html"
const POST_ACTION = "POST";
const GET_ACTION = "GET";
const DEFAULT_DATA_TYPE = "application/json";

const SUCCESSFUL_LOGIN = "You were successfully logged in!"

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

    var form = $(this);
    var formArray = form.serializeArray();

    const firstName = formArray[0].value;
    const lastName = formArray[1].value;

    formArray.push({ name: "fullName", value: firstName + " " + lastName })
    formArray.push({ name: "diet", value: [] });
    formArray.push({ name: "health", value: [] });
    formArray.push({ name: "favorites", value: [] });
    formArray.push({ name: "verificationCode", value: "test" });

    // Convert formData to object
    var formObject = {};
    $.each(formArray, function (index, obj) {
      formObject[obj.name] = obj.value;
    });

    console.log("Sending Sign-Up Form to Server:", JSON.stringify(formObject, null, 2));

    clearErrorMessage();

    fetch(REGISTER_URL, {
      method: POST_ACTION,
      body: JSON.stringify(formObject),
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      }
    }).then(response => {
      if (response.ok) {
        return response.json().then(data => {
          console.log("Successfully created user:", JSON.stringify(data, null, 2));
          // Close Modal
          $('#authModal').modal('hide');
          // Redirect
          window.location.href = BASE_HOME_REDIRECT;
          // Flash message
          $('#ajaxSuccessMessage').text(response.success);
          $('#ajaxAlertSuccess').show();
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

    var form = $(this);
    console.log("Sending Sign-In Form to Server:", JSON.stringify(form.serialize(), null, 2));

    clearErrorMessage();

    $.ajax({
      type: POST_ACTION,
      url: LOGIN_URL,
      data: form.serialize(),
      dataType: DEFAULT_DATA_TYPE,
      success: function (response) {
        console.log("In sign in success:", JSON.stringify(response));
        if (response.success) {
          window.location.href = BASE_HOME_REDIRECT;
        } else {
          form.prepend(
            '<div class="alert alert-danger">' + response.error + "</div>"
          );
        }
      },
      error: function (xhr) {
        console.error("Error Occurred:", xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        form.prepend(
          '<div class="alert alert-danger">' + response.error + "</div>"
        );
      },
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
