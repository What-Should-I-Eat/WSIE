$(document).ready(function () {
    // Render navbar
    utils.renderNavbar();

    // Handles showing logged in message
    const loginMessage = utils.getFromStorage("loginMessage");
    if (loginMessage) {
        utils.showAjaxAlert("Success", loginMessage);
        utils.removeFromStorage("loginMessage");
    }

    // Handles showing sign out message
    const signOutMessage = utils.getFromStorage("signOutMessage");
    if (signOutMessage) {
        utils.showAjaxAlert("Success", signOutMessage);
        utils.removeFromStorage('signOutMessage');
    }

    // Hide Public Profile link by default
    $("#publicProfileNavItem").hide();

    // Get logged-in username
    const username = utils.getFromStorage("username");
    if (username) {
        $("#publicProfileNavItem").show();
    }

    // Handles sign-up form submission logic
    $("#signUpForm").on("submit", async function (event) {
        event.preventDefault();
        utils.clearMessageFromAuthModal(authClassesToRemove);

        const form = $(this);
        const formArray = form.serializeArray();
        const [firstName, lastName, email, username, password, retypedPassword] = formArray.map(({ value }) => value);
        const fullName = `${firstName} ${lastName}`;
        const validationCode = validationHandler.validateSignupInput(email, username, password, retypedPassword);

        if (validationCode !== ValidationCodes.SUCCESS) {
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
            verificationCode: verificationCode,
            isAdmin: false,
            diet: [],
            health: [],
            favorites: []
        };

        fetch(REGISTER_URL, {
            method: POST_ACTION,
            body: JSON.stringify(user),
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            }
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    utils.setStorage("username", data.username);
                    utils.setStorage("verificationCode", verificationCode);
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
            })
            .catch(error => {
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
        const username = formJson.username;

        fetch(LOGIN_URL, {
            method: POST_ACTION,
            body: JSON.stringify(formJson),
            headers: {
                'Content-Type': DEFAULT_DATA_TYPE
            }
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json();
                    utils.setStorage("username", data.username);

                    if (data.username) {
                        $("#publicProfileNavItem").show();
                    }

                    setTimeout(async function () {
                        alert('hello');
                        await utils.cookieWorkaround();
                    }, 1000);

                    // Update the storage for the banner
                    utils.setStorage("loginMessage", SUCCESSFUL_LOGIN);
                    // Hide the modal
                    $("#signInModalContent").hide();
                    $("#signInForm")[0].reset();
                    $("#authModal").modal("show");
                    // Refresh the page
                    window.location.reload();
                } else {
                    const data = await response.json();
                    const error = data.error;
                    console.error(error);
                    if (error === ACCOUNT_NOT_VERIFIED) {
                        utils.setStorage("username", username);
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
            })
            .catch(error => {
                console.error(error);
                form.prepend('<div class="alert alert-danger">' + error.message + "</div>");
            });
    });

    // Handles showing sign-in modal
    $("#showSignInModalContentBtn, #signInSwitch, #signInSwitchVerification").click(function () {
        $("#signUpModalContent, #verifyAccountModalContent, #forgotUsernamePasswordModalContent, #forgotUsernamePasswordVerifyAccountModalContent, #resetAccountModalContent").hide();
        $("#signUpForm, #verifyAccountForm, #forgotUsernamePasswordForm, #forgotUsernamePasswordVerifyAccountForm, #resetAccountForm").get(0).reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#signInModalContent").show();
        $("#authModal").modal("show");
    });

    // Handles showing sign-up modal
    $("#showSignUpModalContentBtn, #signUpSwitch").click(function () {
        $("#signInModalContent, #verifyAccountModalContent, #forgotUsernamePasswordModalContent, #forgotUsernamePasswordVerifyAccountModalContent, #resetAccountModalContent").hide();
        $("#signInForm, #verifyAccountForm, #forgotUsernamePasswordForm, #forgotUsernamePasswordVerifyAccountForm, #resetAccountForm").get(0).reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#signUpModalContent").show();
        $("#authModal").modal("show");
    });

    // Handles showing forgot username / password modal
    $("#signInForgotUsernamePasswordBtn, #signUpForgotUsernamePasswordBtn").click(function () {
        $("#signInModalContent, #signUpModalContent, #verifyAccountModalContent, #forgotUsernamePasswordVerifyAccountModalContent, #resetAccountModalContent").hide();
        $("#signInForm, #signUpForm, #verifyAccountForm, #forgotUsernamePasswordVerifyAccountForm, #resetAccountForm").get(0).reset();
        utils.clearMessageFromAuthModal(authClassesToRemove);
        $("#forgotUsernamePasswordModalContent").show();
        $("#authModal").modal("show");
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

    // Handles logout functionality
    $("#logoutButton").on("click", function () {
        utils.removeFromStorage("username");
        $("#publicProfileNavItem").remove();
        window.location.href = "/";
    });
});
