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
      updateDietaryButtons(user, ".food-allergies-container button", healthRestrictions);

      // Set initial restrictions at page load
      initialDietRestrictions = [...dietRestrictions];
      initialHealthRestrictions = [...healthRestrictions];
    }).catch(error => {
      console.error("Error occurred getting user information:", error);
    });
  };

  const updateDietaryButtons = (user, selector, restrictionsList) => {
    const buttons = $(selector);
    buttons.each(function () {
      const button = $(this);
      const restriction = getEdamamRestrictionMapping(button.text());

      if (user.diet.includes(restriction)) {
        button.addClass('selected');
        if (!restrictionsList.includes(restriction)) {
          restrictionsList.push(restriction);
        }
      }

      button.off('click').on('click', function () {
        $(this).toggleClass('selected');
        const index = restrictionsList.indexOf(restriction);
        if (index === -1) {
          restrictionsList.push(restriction);
          console.log('Added [', restriction, '] to array');
        } else {
          restrictionsList.splice(index, 1);
          console.log('Removed: [', restriction, '] from array');
        }

        console.log("Current State:", restrictionsList);
      });
    });
  };

  // Handles dietary and food allergies submission form logic
  $("#updateDietaryRestrictionsForm, #updateFoodAllergiesForm").on("submit", function (event) {
    event.preventDefault();
    const formId = $(this).attr('id');
    const isDietForm = formId === "updateDietaryRestrictionsForm";
    const currentRestrictions = isDietForm ? dietRestrictions : healthRestrictions;
    const initialRestrictions = isDietForm ? initialDietRestrictions : initialHealthRestrictions;

    const username = utils.getUserNameFromCookie();
    if (!username) {
      console.error(FAILED_TO_VERIFY_USER);
      utils.showAjaxAlert("Error", FAILED_TO_VERIFY_USER);
      return;
    }

    console.log(`Updating ${username} ${isDietForm ? 'dietary restrictions' : 'food allergies'}`);
    if (utils.arraysEqual(currentRestrictions, initialRestrictions)) {
      console.warn(NO_CHANGED_DETECTED);
      utils.showAjaxAlert("Warning", NO_CHANGED_DETECTED);
      return;
    }

    const request = getRequest(isDietForm, username, currentRestrictions);
    const url = isDietForm ? UPDATE_USER_DIET_URL : UPDATE_USER_HEALTH_URL;

    fetch(url, {
      method: PUT_ACTION,
      headers: {
        'Content-Type': DEFAULT_DATA_TYPE
      },
      body: JSON.stringify(request)
    }).then(response => {
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      initialRestrictions.splice(0, initialRestrictions.length, ...currentRestrictions);

      const successMessage = isDietForm ? SUCCESSFULLY_UPDATED_USER_DIETARY : SUCCESSFULLY_UPDATED_USER_HEALTH
      console.log(successMessage);
      utils.showAjaxAlert("Success", successMessage);
    }).catch(error => {
      console.log(error);
      utils.showAjaxAlert("Error", error.message);
    });
  });
}

function getRequest(isDietForm, username, currentRestrictions) {
  if (isDietForm) {
    return {
      username: username,
      diet: currentRestrictions
    }
  } else {
    return {
      username: username,
      health: currentRestrictions
    }
  }
}

function getEdamamRestrictionMapping(buttonName) {
  const restrictionMap = {
    'Balanced': 'balanced',
    'High Fiber': 'high-fiber',
    'High Protein': 'high-protein',
    'Low Carb': 'low-carb',
    'Low Fat': 'low-fat',
    'Low Sodium': 'low-sodium',
    'Vegan': 'vegan',
    'Vegetarian': 'vegetarian',
    'Alcohol Free': 'alcohol-free',
    'Dairy': 'dairy-free',
    'Eggs': 'egg-free',
    'Fish': 'fish-free',
    'Low FODMAP': 'fodmap-free',
    'Gluten': 'gluten-free',
    'Immunity Supporting': 'immuno-supportive',
    'Keto': 'keto-friendly',
    'Kosher': 'kosher',
    'Low Sugar': 'low-sugar',
    'Paleo': 'paleo',
    'Peanuts': 'peanut-free',
    'Pescatarian': 'pescatarian',
    'Pork Free': 'pork-free',
    'Sesame': 'sesame-free',
    'Red Meat Free': 'red-meat-free',
    'Shellfish': 'shellfish-free',
    'Soy': 'soy-free',
    'Tree Nuts': 'tree-nut-free',
    'Wheat': 'wheat-free'
  };

  return restrictionMap[buttonName] || null;
}
