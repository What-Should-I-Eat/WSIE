var utils = (() => {
  /**
   * Method that will store the current user information in the session variable. This is
   * primarily used for building the navigation bar but also used to query the backend
   * based on the username
   * 
   * TODO: This method should be re-factored to only store KEY information from the user. Right now this is storing all the credentials which is a security concern
   * @param {*} user The user JSON structure to store in session storage
   */
  function setStorage(key, value) {
    if (key) {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.removeItem(key);
    }
  }

  /**
   * Method that will return the current user JSON from the session storage
   * @returns The user or null
   */
  function getFromStorage(key) {
    const value = sessionStorage.getItem(key);
    if (value === null || value === undefined || value === "undefined") {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  /**
 * Helper method to remove the alerts from the login modal
 */
  function clearMessageFromAuthModal(classesToRemove) {
    classesToRemove.forEach(className => {
      $(`.${className}`).remove();
    });
  }


  /**
   * Helper method that will convert a forms array to JSON
   * @param {} formArray The array to convert
   * @returns The converted array to JSON
   */
  function convertToJson(formArray) {
    return formArray.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
  }

  return {
    setStorage,
    getFromStorage,
    clearMessageFromAuthModal,
    convertToJson
  }
})();