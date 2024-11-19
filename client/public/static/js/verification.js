
$(document).ready(function () {
  if (utils.getFromStorage("username")) {
    console.log("Username from SessionStorage:", utils.getFromStorage("username"));
  }

  if (utils.getFromStorage("verificationCode")) {
    console.log("Verification Code from SessionStorage:", utils.getFromStorage("verificationCode"));
  }

 // Handles verification form submission logic
 $("#verifyAccountForm").on("submit", function (event) {
  event.preventDefault();
  const verificationCode = $("#verificationCodeInput").val();
  const username = utils.getFromStorage("username");

  if (!username || !verificationCode) {
    $("#verifyAccountForm").prepend(
      `<div class="alert alert-danger">Username or verification code missing.</div>`
    );
    return;
  }

  fetch("/verify-account", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, verificationCode }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Verification failed.");
      }
      return response.json();
    })
    .then((data) => {
      // Store auth token and redirect to dashboard
      utils.setStorage("authToken", data.authToken);
      utils.setStorage("loginMessage", "Account verified and logged in successfully.");
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      console.error("Verification error:", error);
      $("#verifyAccountForm").prepend(
        `<div class="alert alert-danger">Error verifying account: ${error.message}</div>`
      );
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
      $('#verifyAccountForm').prepend('<div class="alert alert-danger">' + FAILED_TO_RESEND_CODE_MISSING_EMAIL + "</div>");
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, verificationCode }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error resending verification code.");
      }
      return response.json();
    })
    .then(() => {
      $("#verifyAccountForm").prepend(
        '<div class="alert alert-success">Verification code resent successfully.</div>'
      );
    })
      .catch((error) => {
        console.error("Resend error:", error);
        $("#verifyAccountForm").prepend(
          `<div class="alert alert-danger">Error resending code: ${error.message}</div>`
        );
      });
});
});