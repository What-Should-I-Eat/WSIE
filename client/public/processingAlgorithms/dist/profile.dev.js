"use strict";

var restrictionsHandler = function () {
  //Going to pass these to the edamam call after we process the arrays
  var dietRestrictions = [];
  var healthRestrictions = [];

  var handleRestrictions = function handleRestrictions() {
    var username;
    return regeneratorRuntime.async(function handleRestrictions$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            username = getUsername();
            console.log("username: ", username);
            getUserId(username).then(function (userId) {
              console.log("userId: ", userId);
              var dietButtons = document.querySelectorAll('.diet-container button');
              var healthButtons1 = document.querySelectorAll('.health-container-1 button');
              var healthButtons2 = document.querySelectorAll('.health-container-2 button');
              var healthButtons = Array.from(healthButtons1).concat(Array.from(healthButtons2));
              showArrays(dietButtons, healthButtons);
            })["catch"](function (error) {
              console.error('Error getting user ID:', error);
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  function showArrays(dietButtons, healthButtons) {
    return regeneratorRuntime.async(function showArrays$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dietRestrictions = handleDietButtons(dietButtons, dietRestrictions);
            healthRestrictions = handleDietButtons(healthButtons, healthRestrictions);
            console.log('restrictions: ', dietRestrictions);
            console.log('allergies: ', healthRestrictions);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  var submitRestrictions = function submitRestrictions(event) {
    var username;
    return regeneratorRuntime.async(function submitRestrictions$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            event.preventDefault();

            try {
              console.log("inside submitRestrictions(): ");
              username = getUsername();
              console.log("username: ", username);
              getUserId(username).then(function (userId) {
                console.log("userId: ", userId);
                console.log("diet restrictions: ", dietRestrictions);
                console.log("health restrictions: ", healthRestrictions);

                if (userId) {
                  PUTintoDatabase(username);
                }
              })["catch"](function (error) {
                console.error('Error getting user ID:', error);
              });
            } catch (error) {
              console.error('Error while submitting restrictions:', error);
            }

          case 2:
          case "end":
            return _context3.stop();
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
    return array;
  }

  function getUsername() {
    var username = document.getElementById("user-identification").textContent.trim();
    var endIndex = username.indexOf("'");
    username = username.substring(0, endIndex);
    return username;
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

  function PUTintoDatabase(username) {
    var dietData, healthData;
    return regeneratorRuntime.async(function PUTintoDatabase$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (!username) {
              _context4.next = 8;
              break;
            }

            dietData = {
              username: username,
              diet: getDietRestrictions()
            };
            healthData = {
              username: username,
              health: getHealthRestrictions()
            };
            _context4.next = 6;
            return regeneratorRuntime.awrap(sendDietData(dietData));

          case 6:
            _context4.next = 8;
            return regeneratorRuntime.awrap(sendHealthData(healthData));

          case 8:
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error('Error during beforeunload event:', _context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }

  function sendDietData(dietData) {
    return regeneratorRuntime.async(function sendDietData$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(fetch("http://".concat(host, "/api/v1/users/diet"), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dietData)
            }));

          case 3:
            _context5.next = 8;
            break;

          case 5:
            _context5.prev = 5;
            _context5.t0 = _context5["catch"](0);
            console.error('Error sending diet data:', _context5.t0);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 5]]);
  }

  function sendHealthData(healthData) {
    return regeneratorRuntime.async(function sendHealthData$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return regeneratorRuntime.awrap(fetch("http://".concat(host, "/api/v1/users/health"), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(healthData)
            }));

          case 3:
            _context6.next = 8;
            break;

          case 5:
            _context6.prev = 5;
            _context6.t0 = _context6["catch"](0);
            console.error('Error sending health data:', _context6.t0);

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 5]]);
  }

  function getDietRestrictions() {
    console.log("Diet restrictions array: ", dietRestrictions);
    return dietRestrictions;
  }

  function getHealthRestrictions() {
    console.log("Health restrictions array: ", healthRestrictions);
    return healthRestrictions;
  }

  return {
    handleRestrictions: handleRestrictions,
    submitRestrictions: submitRestrictions,
    getDietRestrictions: getDietRestrictions,
    getHealthRestrictions: getHealthRestrictions
  };
}();