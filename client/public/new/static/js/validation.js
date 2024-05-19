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
  /**
   * Validates all fields required for signing up a user.
   * 
   * @param {string} email User's email address
   * @param {string} username User's chosen username
   * @param {string} password User's chosen password
   * @param {string} confirmedPassword Password confirmation field
   * @returns {number} Validation code representing the result of the validation
   */
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

  /**
   * Validates all fields required for resetting a user's password.
   * 
   * @param {string} username User's username
   * @param {string} password New password
   * @param {string} confirmedPassword Confirmation of the new password
   * @returns {number} Validation code representing the result of the validation
   */
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

  /**
   * Validates the format of an email address.
   * 
   * @param {string} email Email address to validate
   * @returns {boolean} True if the email is valid, false otherwise
   */
  function checkIfEmailAddressIsValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  /**
   * Validates that a username only contains alphanumeric characters.
   * 
   * @param {string} username Username to validate
   * @returns {boolean} True if the username has valid characters, false otherwise
   */
  function checkIfUserNameHasValidChars(username) {
    return /^[0-9a-z]+$/i.test(username);
  }

  /**
   * Validates that a username is within the required length limits.
   * 
   * @param {string} username Username to validate
   * @returns {boolean} True if the username is of correct length, false otherwise
   */
  function checkIfUserNameIsCorrectLength(username) {
    return username.length >= 4 && username.length <= 15;
  }

  /**
   * Validates the complexity of a password based on defined rules.
   * 
   * @param {string} password Password to validate
   * @returns {boolean} True if the password meets the criteria, false otherwise
   */
  function checkIfPasswordIsValid(password) {
    return checkPasswordLength(password) &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password);
  }

  /**
   * Checks the length of a password to ensure it meets the defined length requirements.
   * 
   * @param {string} password Password to check
   * @returns {boolean} True if the password length is valid, false otherwise
   */
  function checkPasswordLength(password) {
    return password.length >= 8 && password.length <= 15;
  }

  /**
   * Validates that two given passwords match.
   * 
   * @param {string} password Primary password
   * @param {string} confirmedPassword Confirmation password
   * @returns {boolean} True if both passwords match, false otherwise
   */
  function checkIfPasswordsMatch(password, confirmedPassword) {
    return password === confirmedPassword;
  }

  /**
   * Validates the format of a verification code.
   * 
   * @param {string} verificationCode Code to validate
   * @returns {boolean} True if the code is valid (exactly 6 characters), false otherwise
   */
  function isVerificationCodeValid(verificationCode) {
    return verificationCode.length == 6;
  }

  /**
   * Fetches a new verification code from the server.
   * 
   * @returns {Promise<Object>} A promise that resolves to the fetched verification code or rejects with an error
   */
  async function getVerificationCode() {
    try {
      const response = await fetch(GET_VERIFICATION_CODE_URL, {
        method: GET_ACTION,
        headers: {
          'Content-Type': DEFAULT_DATA_TYPE
        }
      });

      if (!response.ok) {
        throw new Error(ERROR_OCCURRED_GETTING_VERIFICATION);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching verification code:", error);
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
