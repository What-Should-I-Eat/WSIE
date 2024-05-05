// TODO: Consider a better way of storing the current user email
let currentUserEmail = "";
let currentUsername = "";

$(document).ready(function () {

  // Handles forgot username / password form submission logic
  $("#forgotUsernamePasswordForm").on("submit", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();

    const [email] = formArray.map(({ value }) => value);

    if (!validationHandler.checkIfEmailAddressIsValid(email)) {
      const errorMessage = validationHandler.getValidationText(INVALID_EMAIL_CODE);
      form.prepend('<div class="alert alert-danger">' + errorMessage + "</div>");
      return;
    }

    currentUserEmail = email;

    const user = await utils.getUserFromEmail(email);

    if (!user) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_VERIFY_USER_MISSING_INFO + "</div>");
      return;
    }

    const username = user.username;
    currentUsername = username;

    const verificationCode = await validationHandler.getVerificationCode();
    emailWrapper.sendEmail(user.fullName, email, verificationCode, emailjs, "forgotPassword", username);

    const request = {
      username: username,
      verificationCode: verificationCode
    }

    fetch(RESEND_VERIFICATION_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(async response => {
      if (!response.ok) {
        const data = await response.json();
        const error = data.error;
        form.prepend('<div class="alert alert-error">' + error + "</div>");
      } else {
        $("#forgotUsernamePasswordModalContent").hide();
        $("#forgotUsernamePasswordForm")[0].reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#forgotUsernamePasswordVerifyAccountModalContent").show();
        $("#authModal").modal("show");
        $("#forgotUsernamePasswordVerifyAccountForm").prepend('<div class="alert alert-warning">' + RESET_ACCOUNT + "</div>");
      }
    }).catch(error => {
      console.error(error);
      form.prepend('<div class="alert alert-danger">' + error + "</div>");
    });
  });

  // Handles re-sending the verification code to the user
  $("#forgotUsernamePasswordResendVerificationCodeBtn").on("click", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const username = utils.getFromStorage("username");
    if (!username) {
      $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_USERNAME + "</div>");
      return;
    }

    const user = await utils.getUserFromUsername(username);

    const email = user.email;
    if (!email) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_EMAIL + "</div>");
      return;
    }

    const fullName = user.fullName;
    if (!fullName) {
      $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_NAME + "</div>");
      return;
    }

    const verificationCode = await validationHandler.getVerificationCode();
    emailWrapper.sendEmail(fullName, email, verificationCode, emailjs, "resend", username);

    const request = {
      username: username,
      verificationCode: verificationCode
    }

    fetch(RESEND_VERIFICATION_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(async response => {
      if (!response.ok) {
        const data = await response.json();
        const error = data.error;
        $('#forgotUsernamePasswordVerifyAccountForm').prepend('<div class="alert alert-error">' + error + "</div>");
      } else {
        $('#forgotUsernamePasswordVerifyAccountForm').prepend('<div class="alert alert-warning">' + RESENT_VERIFICATION_CODE + "</div>");
      }
    }).catch(error => {
      console.error(error);
      $('#forgotUsernamePasswordVerifyAccountForm').prepend('<div class="alert alert-danger">' + error + "</div>");
    });
  });

  // Handles forgot username / password verification submission logic
  $("#forgotUsernamePasswordVerifyAccountForm").on("submit", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();

    const [verificationCode] = formArray.map(({ value }) => value);
    if (!isVerificationCodeValid(verificationCode)) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_VERIFY_USER_INVALID_VERIFICATION_CODE + "</div>");
      return;
    }

    if (!currentUserEmail) {
      const errorMessage = validationHandler.getValidationText(INVALID_EMAIL_CODE);
      form.prepend('<div class="alert alert-danger">' + errorMessage + "</div>");
      return;
    }

    if (!currentUsername) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_VERIFY_USER_MISSING_INFO + "</div>");
      return;
    }

    const request = {
      username: currentUsername,
      verificationCode: verificationCode
    }

    fetch(VERIFICATION_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(async response => {
      if (!response.ok) {
        if (response.status == 437) {
          throw new Error(ERROR_CODE_EXPIRED);
        } else {
          throw new Error(ERROR_UNABLE_TO_GET_USER);
        }
      } else {
        $("#forgotUsernamePasswordVerifyAccountModalContent").hide();
        $("#forgotUsernamePasswordVerifyAccountForm")[0].reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#resetAccountUsernameInput").val(currentUsername);
        $("#resetAccountModalContent").show();
        $("#authModal").modal("show");
      }
    }).catch(error => {
      console.error(error);
      form.prepend('<div class="alert alert-danger">' + error + "</div>");
    });
  });

  // Handles reset account form submission logic
  $("#resetAccountForm").on("submit", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();

    console.log(formArray);

    const [username, password, retypedPassword] = formArray.map(({ value }) => value);
    console.log(username);
    console.log(password);
    console.log(retypedPassword);

    const validationCode = validationHandler.validateResetInput(username, password, retypedPassword);

    if (validationCode !== 0) {
      const errorMessage = validationHandler.getValidationText(validationCode);
      form.prepend('<div class="alert alert-danger">' + errorMessage + "</div>");
      return;
    }

    const request = {
      username: username,
      password: password
    }

    fetch(CHANGE_PASSWORD_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(async response => {
      if (response.ok) {
        console.log(SUCCESSFULLY_RESET_ACCOUNT);
        form.prepend('<div class="alert alert-success">' + SUCCESSFULLY_RESET_ACCOUNT + "</div>");
      } else {
        const data = await response.json();
        const error = data.error;
        console.error(error);
        form.prepend('<div class="alert alert-danger">' + error + "</div>");
      }
    }).catch(error => {
      console.error(error);
      form.prepend('<div class="alert alert-danger">' + error + "</div>");
    });
  });
});