// Validation Codes
const SUCCESS_CODE = 0;
const INVALID_EMAIL_CODE = 1;
const INVALID_USERNAME_CHARACTERS_CODE = 2;
const INVALID_USERNAME_LENGTH_CODE = 3;
const INVALID_PASSWORD_CODE = 4;
const INVALID_PASSWORD_MATCH_CODE = 5;

// Validation Messages Map
const validationMessages = {
  [SUCCESS_CODE]: "Success",
  [INVALID_EMAIL_CODE]: "Please enter a valid email address",
  [INVALID_USERNAME_CHARACTERS_CODE]: "Username must not contain special characters",
  [INVALID_USERNAME_LENGTH_CODE]: "Please ensure that username is between 4 and 15 characters",
  [INVALID_PASSWORD_CODE]: "Please ensure that password is between 8-15 characters, contains at least one capital and lowercase letter, and contains a number",
  [INVALID_PASSWORD_MATCH_CODE]: "Please ensure that passwords match."
};

var validationHandler = (() => {
  function validateSignupInput(email, username, password, confirmedPassword) {
    if (!checkIfEmailAddressIsValid(email)) {
      return INVALID_EMAIL_CODE;
    } else if (!checkIfUserNameHasValidChars(username)) {
      return INVALID_USERNAME_CHARACTERS_CODE;
    } else if (!checkIfUserNameIsCorrectLength(username)) {
      return INVALID_USERNAME_LENGTH_CODE;
    } else if (!checkIfPasswordIsValid(password)) {
      return INVALID_PASSWORD_CODE;
    } else if (!checkIfPasswordsMatch(password, confirmedPassword)) {
      return INVALID_PASSWORD_MATCH_CODE;
    } else {
      return SUCCESS_CODE;
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

  async function getVerificationCode() {
    try {
      const response = await fetch(VERIFICATION_URL, {
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
    getValidationText: code => validationMessages[code],
    getVerificationCode
  }
})();
