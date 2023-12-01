"use strict";

var host = 'localhost:8080';

var loginHandler = function () {
  var userLogin = function userLogin(event) {
    event.preventDefault();
    console.log("Made it to userLogin()");
    var usernameInput = document.getElementById('username-input').value;
    var passwordInput = document.getElementById('password-input').value;
    var loginValidation = document.getElementById('login-validation');
    var userLoginRequest = {
      userName: usernameInput,
      password: passwordInput
    };
    fetch("http://" + host + "/api/v1/users/find-username", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userLoginRequest)
    }).then(function _callee(response) {
      var errorResponse, successResponse;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("we are at the point of response. this is the response.status: ");
              console.log(response.status);

              if (!(response.status != 200)) {
                _context.next = 10;
                break;
              }

              _context.next = 5;
              return regeneratorRuntime.awrap(response.json());

            case 5:
              errorResponse = _context.sent;
              console.error('Error logging in:', errorResponse.error);
              loginValidation.textContent = errorResponse.error || 'Error logging in';
              _context.next = 15;
              break;

            case 10:
              _context.next = 12;
              return regeneratorRuntime.awrap(response.json());

            case 12:
              successResponse = _context.sent;
              console.log('Success:', successResponse.message); //THIS IS WHAT HAPPENS AFTER THE LOGIN IS SUCCESSFUL

              window.location.href = './profile.html';

            case 15:
            case "end":
              return _context.stop();
          }
        }
      });
    })["catch"](function (error) {
      console.error('Fetch error:', error);
      loginValidation.textContent = 'Fetch error: ' + error.message;
    });
    return false;
  };

  return {
    userLogin: userLogin
  };
}();