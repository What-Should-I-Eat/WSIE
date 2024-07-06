function MyDietaryView() {
  let dietRestrictions = [];
  let healthRestrictions = [];
  let initialDietRestrictions = [];
  let initialHealthRestrictions = [];

  this.load = async () => {
    const username = utils.getUserNameFromCookie();
    if (username) {
      update(username);
    } else {
      console.error(FAILED_TO_VERIFY_USER);
      utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
      return;
    }
  };

  const update = (username) => {
    console.log("Loading dietary for username:", username);

    utils.getUserFromUsername(username).then(user => {
      console.log("Updating Dietary for username:", username);
      updateDietaryButtons(user, ".dietary-restrictions-container button", dietRestrictions);
      updateDietaryButtons(user, ".health-restrictions-container button", healthRestrictions);

      // Set initial restrictions at page load
      initialDietRestrictions = [...dietRestrictions];
      initialHealthRestrictions = [...healthRestrictions];
    }).catch(error => {
      console.error(ERROR_UNABLE_TO_GET_USER, error);
      utils.showAjaxAlert("Error", ERROR_UNABLE_TO_GET_USER);
    });
  };

  const updateDietaryButtons = (user, selector, restrictionsList) => {
    $(selector).each(function () {
      const button = $(this);
      const restriction = getButtonEdamamMapping(cleanButtonText(button.text()));

      if (user.diet.includes(restriction) || user.health.includes(restriction)) {
        button.addClass('selected');
        if (!restrictionsList.includes(restriction)) {
          restrictionsList.push(restriction);
        }
      }

      button.off('click').on('click', function () {
        toggleRestriction(button, restriction, restrictionsList);
      });
    });
  };

  const toggleRestriction = (button, restriction, restrictionsList) => {
    button.toggleClass('selected');
    const index = restrictionsList.indexOf(restriction);
    if (index === -1) {
      restrictionsList.push(restriction);
      console.log(`Added [${restriction}] from array`);
    } else {
      restrictionsList.splice(index, 1);
      console.log(`Removed [${restriction}] from array`);
    }
    console.log("Current State:", restrictionsList);
  };


  $("#updateDietaryRestrictionsForm, #updateHealthRestrictionsForm").on("submit", function (event) {
    event.preventDefault();
    const isDietForm = this.id === "updateDietaryRestrictionsForm";
    const currentRestrictions = isDietForm ? dietRestrictions : healthRestrictions;
    const initialRestrictions = isDietForm ? initialDietRestrictions : initialHealthRestrictions;

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(FAILED_TO_VERIFY_USER);
      utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
      return;
    }

    console.log(`Updating ${username} ${isDietForm ? 'dietary restrictions' : 'health restrictions'}`);
    if (utils.arraysEqual(currentRestrictions, initialRestrictions)) {
      console.warn(NO_USER_DIETARY_CHANGES_DETECTED);
      utils.showAjaxAlert("Warning", NO_USER_DIETARY_CHANGES_DETECTED);
      return;
    }

    updateUserRestrictions(isDietForm, username, currentRestrictions, initialRestrictions);
  });

  const updateUserRestrictions = (isDietForm, username, currentRestrictions, initialRestrictions) => {
    const request = getRequest(isDietForm, username, currentRestrictions);
    const url = isDietForm ? UPDATE_USER_DIET_URL : UPDATE_USER_HEALTH_URL;

    fetch(url, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(response => {
      if (!response.ok) throw new Error(isDietForm ? FAILED_TO_UPDATED_USER_DIETARY : FAILED_TO_UPDATE_USER_HEALTH);

      initialRestrictions.splice(0, initialRestrictions.length, ...currentRestrictions);
      const successMessage = isDietForm ? SUCCESSFULLY_UPDATED_USER_DIETARY : SUCCESSFULLY_UPDATED_USER_HEALTH;
      console.log(successMessage);
      utils.showAjaxAlert("Success", successMessage);
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  };

  const getRequest = (isDietForm, username, currentRestrictions) => ({
    username,
    [isDietForm ? 'diet' : 'health']: currentRestrictions
  });

  const cleanButtonText = (text) => {
    // Normalize the text: trim and replace multiple spaces with a single space
    return text.trim().replace(/\s+/g, ' ');
  };

  // API For Diet and Health can be found here: https://developer.edamam.com/edamam-docs-recipe-api
  const getButtonEdamamMapping = (buttonName) => {
    const buttonApiMap = {
      // Diet
      'Balanced': 'balanced',
      'High Fiber': 'high-fiber',
      'High Protein': 'high-protein',
      'Low Carb': 'low-carb',
      'Low Fat': 'low-fat',
      'Low Sodium': 'low-sodium',
      // Health
      'Alcohol Free': 'alcohol-free',
      'Celery Free': 'celery-free',
      'Crustacean Free': 'crustacean-free',
      'Dairy Free': 'dairy-free',
      'Egg Free': 'egg-free',
      'Fish Free': 'fish-free',
      'FODMAP Free': 'fodmap-free',
      'Gluten Free': 'gluten-free',
      'Immuno Supportive': 'immuno-supportive',
      'Keto Friendly': 'keto-friendly',
      'Kidney Friendly': 'kidney-friendly',
      'Kosher': 'kosher',
      'Low Potassium': 'low-potassium',
      'Low Sugar': 'low-sugar',
      'Lupine Free': 'lupine-free',
      'Mediterranean': 'Mediterranean',
      'Mollusk Free': 'mollusk-free',
      'Mustard Free': 'mustard-free',
      'No Oil Added': 'no-oil-added',
      'Paleo': 'paleo',
      'Peanut Free': 'peanut-free',
      'Pescatarian': 'pescatarian',
      'Pork Free': 'pork-free',
      'Red Meat Free': 'red-meat-free',
      'Sesame Free': 'sesame-free',
      'Shellfish Free': 'shellfish-free',
      'Soy Free': 'soy-free',
      'Sugar Conscious': 'sugar-conscious',
      'Sulfite Free': 'sulfite-free',
      'Tree Nut Free': 'tree-nut-free',
      'Vegan': 'vegan',
      'Vegetarian': 'vegetarian',
      'Wheat Free': 'wheat-free',
    };

    return buttonApiMap[buttonName] || null;
  };
}
