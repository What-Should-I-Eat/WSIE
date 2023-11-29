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
              if (response.ok) {
                _context.next = 8;
                break;
              }

              _context.next = 3;
              return regeneratorRuntime.awrap(response.json());

            case 3:
              errorResponse = _context.sent;
              console.error('Error logging in:', errorResponse.error);
              loginValidation.textContent = errorResponse.error || 'Error logging in';
              _context.next = 13;
              break;

            case 8:
              _context.next = 10;
              return regeneratorRuntime.awrap(response.json());

            case 10:
              successResponse = _context.sent;
              console.log('Success:', successResponse.message); //THIS IS WHAT HAPPENS AFTER THE LOGIN IS SUCCESSFUL

              window.location.href = './profile.html';

            case 13:
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