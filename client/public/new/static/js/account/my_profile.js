function MyProfileView() {
  const usernameElement = document.getElementById('username');
  const firstNameElement = document.getElementById('first_name');
  const lastNameElement = document.getElementById('last_name');
  const emailElement = document.getElementById('email_address');

  this.load = async () => {
    try {
      const username = utils.getUserNameFromCookie();

      if (!username) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        return;
      }

      const userData = await utils.getUserFromUsername(username);

      if (!userData) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
        return;
      }

      this.renderProfile(userData);
    } catch (error) {
      console.error();
      utils.showAjaxAlert("Error", "");
    }
  }

  this.renderProfile = (userData) => {
    const { username, fullName, email } = userData;
    const fullNameArray = fullName.split(" ");
    const firstName = fullNameArray[0];
    const lastName = fullNameArray.length > 1 ? fullNameArray[fullNameArray.length - 1] : "";

    usernameElement.value = username;
    usernameElement.setAttribute('data-initial-value', username);

    firstNameElement.value = firstName;
    firstNameElement.setAttribute('data-initial-value', firstName);

    lastNameElement.value = lastName;
    lastNameElement.setAttribute('data-initial-value', lastName);

    emailElement.value = email;
    emailElement.setAttribute('data-initial-value', email);
  };

  // Handles user details submission form logic
  document.getElementById('updateMyInfoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const username = utils.getUserNameFromCookie();
      if (!username) {
        console.error(FAILED_TO_VERIFY_USER);
        utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
        return;
      }

      if (!formHasChanges(this)) {
        console.warn(NO_USER_INFO_CHANGES);
        utils.showAjaxAlert("Warning", NO_USER_INFO_CHANGES);
        return;
      }

      const formData = new FormData(this);
      const firstName = formData.get('first_name');
      const lastName = formData.get('last_name');

      const request = {
        username: username,
        firstName: firstName,
        lastName: lastName
      }

      const response = await fetch(USER_UPDATE_DETAILS, {
        method: PUT_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(FAILED_TO_UPDATE_USER_DETAILS);
      }

      // Update the initial value
      firstNameElement.setAttribute('data-initial-value', firstName);
      lastNameElement.setAttribute('data-initial-value', lastName);

      console.log(SUCCESSFULLY_UPDATED_USER_DETAILS);
      utils.showAjaxAlert("Success", SUCCESSFULLY_UPDATED_USER_DETAILS);
    } catch (error) {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    };
  });

  // Handles user email address submission form logic
  document.getElementById('updateEmailAddressForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const username = utils.getUserNameFromCookie();
      if (!username) {
        console.error(FAILED_TO_VERIFY_USER);
        utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
        return;
      }

      if (!formHasChanges(this)) {
        console.warn(NO_USER_EMAIL_CHANGES);
        utils.showAjaxAlert("Warning", NO_USER_EMAIL_CHANGES);
        return;
      }

      const formData = new FormData(this);
      const email = formData.get('email_address');

      const isEmailValid = validationHandler.checkIfEmailAddressIsValid(email);
      if (!isEmailValid) {
        const errorMessage = validationHandler.getValidationText(ValidationCodes.INVALID_EMAIL);
        console.error(errorMessage);
        utils.showAjaxAlert("Error", errorMessage);
        return;
      }

      const request = {
        username: username,
        email: email
      }

      const response = await fetch(USER_UPDATE_EMAIL, {
        method: PUT_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(FAILED_TO_UPDATE_USER_EMAIL);
      }

      // Update the initial value
      emailElement.setAttribute('data-initial-value', email);

      console.log(SUCCESSFULLY_UPDATED_USER_EMAIL);
      utils.showAjaxAlert("Success", SUCCESSFULLY_UPDATED_USER_EMAIL);
    } catch (error) {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    };
  });

  // Handles user password submission form logic
  document.getElementById('updatePasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const username = utils.getUserNameFromCookie();
      if (!username) {
        console.error(FAILED_TO_VERIFY_USER);
        utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
        return;
      }

      const formData = new FormData(this);
      const password = formData.get('profileOriginalPassword');
      const newPassword = formData.get('profileNewPassword');
      const retypedPassword = formData.get('profileNewPasswordRetyped');

      const validationCode = validationHandler.validateUpdatePassword(password, newPassword, retypedPassword);
      if (validationCode !== ValidationCodes.SUCCESS) {
        const errorMessage = validationHandler.getValidationText(validationCode);
        console.error(errorMessage);
        utils.showAjaxAlert("Error", errorMessage);
        return;
      }

      const request = {
        username: username,
        originalPassword: password,
        newPassword: newPassword
      }

      const response = await fetch(USER_UPDATE_PASSWORD, {
        method: PUT_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        },
        body: JSON.stringify(request)
      });


      if (response.ok) {
        console.log(SUCCESSFULLY_UPDATED_USER_PASSWORD);
        utils.showAjaxAlert("Success", SUCCESSFULLY_UPDATED_USER_PASSWORD);
      } else {
        const error = await response.json();
        if (response.status == 400) {
          console.error(error);
          utils.showAjaxAlert("Warning", error.error);
        } else {
          throw new Error(FAILED_TO_UPDATE_USER_PASSWORD);
        }
      }
    } catch (error) {
      console.error(error);
      utils.showAjaxAlert("Error", error.message);
    };
  });
}

/**
 * Checks to see if any of the input fields have changed
 * 
 * @param {formObject} form 
 * @returns true if the form has changes, false otherwise
 */
function formHasChanges(form) {
  let hasChanges = false;
  const inputs = form.querySelectorAll('input');

  inputs.forEach(input => {
    if (input.type !== 'submit' && !input.readOnly) {
      const initialValue = input.getAttribute('data-initial-value');
      if (input.value !== initialValue) {
        hasChanges = true;
      }
    }
  });

  return hasChanges;
}