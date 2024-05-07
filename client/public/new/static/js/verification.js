// Logs to bypass email verification
console.log("Verification Code:", utils.getFromStorage("verificationCode"));
console.log("Username:", utils.getFromStorage("username"));

$(document).ready(function () {

  // Handles verification form submission logic
  $("#verifyAccountForm").on("submit", function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const form = $(this);
    const formArray = form.serializeArray();

    const [verificationCode] = formArray.map(({ value }) => value);
    const username = utils.getFromStorage("username");

    if (!validationHandler.isVerificationCodeValid(verificationCode)) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_VERIFY_USER_INVALID_VERIFICATION_CODE + "</div>");
      return;
    } else if (!username) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_VERIFY_USER_MISSING_USERNAME + "</div>");
      return;
    }

    const request = {
      username: username,
      verificationCode: verificationCode
    };

    fetch(VERIFICATION_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    })
      .then(response => {
        if (!response.ok) {
          if (response.status == 437) {
            throw new Error(ERROR_CODE_EXPIRED);
          } else {
            throw new Error(ERROR_UNABLE_TO_GET_USER);
          }
        } else {
          return response.json().then(_ => {
            form.prepend('<div class="alert alert-success">' + VERIFIED_SUCCESSFULLY + "</div>");
          });
        }
      })
      .catch(error => {
        console.error(error);
        form.prepend('<div class="alert alert-danger">' + error + "</div>");
      });
  });

  // Handles re-sending the verification code to the user
  $("#resendVerificationCodeBtn").on("click", async function (event) {
    event.preventDefault();
    utils.clearMessageFromAuthModal(authClassesToRemove);

    const username = utils.getFromStorage("username");

    if (!username) {
      $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_USERNAME + "</div>");
      return;
    }

    const user = await utils.getUserFromUsername(username);
    const email = user.email;
    const fullName = user.fullName;

    if (!email) {
      form.prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_EMAIL + "</div>");
      return;
    } else if (!fullName) {
      $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_NAME + "</div>");
      return;
    }

    const verificationCode = await validationHandler.getVerificationCode();
    emailWrapper.sendEmail(fullName, email, verificationCode, emailjs, "resend", username);

    const request = {
      username: username,
      verificationCode: verificationCode
    };

    fetch(RESEND_VERIFICATION_URL, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    })
      .then(async response => {
        if (!response.ok) {
          const data = await response.json();
          const error = data.error;
          $('#verifyAccountForm').prepend('<div class="alert alert-error">' + error + "</div>");
        } else {
          $('#verifyAccountForm').prepend('<div class="alert alert-warning">' + RESENT_VERIFICATION_CODE + "</div>");
        }
      })
      .catch(error => {
        console.error(error);
        $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + error + "</div>");
      });
  });
});
