// Validation Codes
const ValidationCodes = {
  SUCCESS: 0,
  INVALID_EMAIL: 1,
  INVALID_USERNAME_CHARACTERS: 2,
  INVALID_USERNAME_LENGTH: 3,
  INVALID_PASSWORD: 4,
  PASSWORD_MISMATCH: 5,
};

// Validation Messages Map
const validationMessages = {
  [ValidationCodes.SUCCESS]: "Success",
  [ValidationCodes.INVALID_EMAIL]: "Please enter a valid email address",
  [ValidationCodes.INVALID_USERNAME_CHARACTERS]: "Username must not contain special characters",
  [ValidationCodes.INVALID_USERNAME_LENGTH]: "Please ensure that username is between 4 and 15 characters",
  [ValidationCodes.INVALID_PASSWORD]: "Please ensure that password is between 8-15 characters, contains at least one capital and lowercase letter, and contains a number",
  [ValidationCodes.PASSWORD_MISMATCH]: "Please ensure that passwords match.",
};

const validationHandler = (() => {
  function validateSignupInput(email, username, password, confirmedPassword) {
    if (!checkIfEmailAddressIsValid(email)) {
      return ValidationCodes.INVALID_EMAIL;
    } else if (!checkIfUserNameHasValidChars(username)) {
      return ValidationCodes.INVALID_USERNAME_CHARACTERS;
    } else if (!checkIfUserNameIsCorrectLength(username)) {
      return ValidationCodes.INVALID_USERNAME_LENGTH;
    } else if (!checkIfPasswordIsValid(password)) {
      return ValidationCodes.INVALID_PASSWORD;
    } else if (!checkIfPasswordsMatch(password, confirmedPassword)) {
      return ValidationCodes.PASSWORD_MISMATCH;
    } else {
      return ValidationCodes.SUCCESS;
    }
  }

  function validateResetInput(username, password, confirmedPassword) {
    if (!checkIfUserNameHasValidChars(username)) {
      return ValidationCodes.INVALID_USERNAME_CHARACTERS;
    } else if (!checkIfUserNameIsCorrectLength(username)) {
      return ValidationCodes.INVALID_USERNAME_LENGTH;
    } else if (!checkIfPasswordIsValid(password)) {
      return ValidationCodes.INVALID_PASSWORD;
    } else if (!checkIfPasswordsMatch(password, confirmedPassword)) {
      return ValidationCodes.PASSWORD_MISMATCH;
    } else {
      return ValidationCodes.SUCCESS;
    }
  }

  function checkIfEmailAddressIsValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function checkIfUserNameHasValidChars(username) {
    return /^[0-9a-z]+$/i.test(username);
  }

  function checkIfUserNameIsCorrectLength(username) {
    return username.length >= 4 && username.length <= 15;
  }

  function checkIfPasswordIsValid(password) {
    return checkPasswordLength(password) &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password);
  }

  function checkPasswordLength(password) {
    return password.length >= 8 && password.length <= 15;
  }

  function checkIfPasswordsMatch(password, confirmedPassword) {
    return password === confirmedPassword;
  }

  function isVerificationCodeValid(verificationCode) {
    return verificationCode.length == 6;
  }

  async function getVerificationCode() {
    try {
      const response = await fetch(GET_VERIFICATION_CODE_URL, {
        methods: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching verification code:", error.error);
      throw error;
    }
  }

  return {
    validateSignupInput,
    validateResetInput,
    getValidationText: code => validationMessages[code],
    getVerificationCode,
    checkIfEmailAddressIsValid,
    checkIfPasswordIsValid,
    isVerificationCodeValid
  };
})();
