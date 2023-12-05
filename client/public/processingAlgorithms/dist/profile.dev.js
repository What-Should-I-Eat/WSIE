"use strict";

var restrictionsHandler = function () {
  //Going to pass these to the edamam call after we process the arrays
  var dietRestrictions = [];
  var healthRestrictions = [];

  var handleRestrictions = function handleRestrictions() {
    var username, userId, dietButtons, healthButtons1, healthButtons2, healthButtons;
    return regeneratorRuntime.async(function handleRestrictions$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = getUsername();
            console.log("username: ", username);
            _context.next = 4;
            return regeneratorRuntime.awrap(getUserId(username));

          case 4:
            userId = _context.sent;
            console.log("userId: ", userId);
            dietButtons = document.querySelectorAll('.diet-container button');
            healthButtons1 = document.querySelectorAll('.health-container-1 button');
            healthButtons2 = document.querySelectorAll('.health-container-2 button');
            healthButtons = Array.from(healthButtons1).concat(Array.from(healthButtons2));
            dietRestrictions = handleDietButtons(dietButtons, dietRestrictions);
            healthRestrictions = handleDietButtons(healthButtons, healthRestrictions);
            console.log('restrictions: ', dietRestrictions);
            console.log('allergies: ', healthRestrictions); //edamam.handleRestrictions(selectedRestrictions, selectedAllergies);
            //PUT to server (need to find id thru username in the endpoint)

          case 14:
          case "end":
            return _context.stop();
        }
      }
    });
  }; //Puts user restrictions into an array and gives the array to edamam.js


  function handleDietButtons(buttonType, array) {
    buttonType.forEach(function (button) {
      button.addEventListener('click', function () {
        button.classList.toggle('selected');
        var sanitizedRestriction = getEdamamNameOfRestriction(button.textContent);

        if (button.classList.contains('selected')) {
          array.push(sanitizedRestriction);
          console.log('added ', sanitizedRestriction, ' to array');
          console.log('state of this array: ', array);
        } else {
          var indexRestrictions = array.indexOf(sanitizedRestriction);

          if (indexRestrictions !== -1) {
            array.splice(indexRestrictions, 1);
            console.log('removed ', sanitizedRestriction, ' from array');
            console.log('state of this array: ', array);
          }
        }

        return array;
      });
    });
  }

  function PUTintoDatabase() {}

  function getUsername() {
    var username = document.getElementById("user-identification").textContent.trim();
    var endIndex = username.indexOf("'");
    username = username.substring(0, endIndex);
    return username;
  }

  function getUserId(username) {
    var response, data;
    return regeneratorRuntime.async(function getUserId$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(fetch("http://localhost:8080/api/v1/users/findUserId?username=".concat(username), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }));

          case 3:
            response = _context2.sent;

            if (response.ok) {
              _context2.next = 6;
              break;
            }

            throw new Error('Network response was not ok');

          case 6:
            _context2.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            data = _context2.sent;
            return _context2.abrupt("return", data);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            console.error('There was a problem with the fetch operation:', _context2.t0);
            return _context2.abrupt("return", "");

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }

  function getEdamamNameOfRestriction(buttonName) {
    switch (buttonName) {
      case 'Balanced':
        return 'balanced';

      case 'High Fiber':
        return 'high-fiber';

      case 'High Protein':
        return 'high-protein';

      case 'Low Carb':
        return 'low-carb';

      case 'Low Fat':
        return 'low-fat';

      case 'Low Sodium':
        return 'low-sodium';

      case 'Vegan':
        return 'vegan';

      case 'Vegetarian':
        return 'vegetarian';

      case 'Alcohol Free':
        return 'alcohol-free';

      case 'Dairy':
        return 'dairy-free';

      case 'Eggs':
        return 'egg-free';

      case 'Fish':
        return 'fish-free';

      case 'Low FODMAP':
        return 'fodmap-free';

      case 'Gluten':
        return 'gluten-free';

      case 'Gluten Free':
        return 'gluten-free';

      case 'Immunity Supporting':
        return 'immuno-supportive';

      case 'Keto':
        return 'keto-friendly';

      case 'Kosher':
        return 'kosher';

      case 'Low Sugar':
        return 'low-sugar';

      case 'Paleo':
        return 'paleo';

      case 'Peanuts':
        return 'peanut-free';

      case 'Pescatarian':
        return 'pescatarian';

      case 'Pork Free':
        return 'pork-free';

      case 'Paleo':
        return 'paleo';

      case 'Sesame':
        return 'sesame-free';

      case 'Red Meat Free':
        return 'red-meat-free';

      case 'Shellfish':
        return 'shellfish-free';

      case 'Soy':
        return 'soy-free';

      case 'Tree Nuts':
        return 'tree-nut-free';

      case 'Wheat':
        return 'wheat-free';
    }
  }

  function getDietRestrictions() {
    return dietRestrictions;
  }

  function getHealthRestrictions() {
    return healthRestrictions;
  }

  return {
    handleRestrictions: handleRestrictions,
    getDietRestrictions: getDietRestrictions,
    getHealthRestrictions: getHealthRestrictions,
    selectedRestrictions: dietRestrictions,
    selectedAllergies: healthRestrictions
  };
}();