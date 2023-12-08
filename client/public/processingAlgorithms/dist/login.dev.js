"use strict";

//import { setUserData, getUserData } from './currentUser.js';
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
      var errorResponse;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("we are at the point of response. this is the response.status: ");
              console.log(response.status);

              if (!(response.status !== 200)) {
                _context.next = 11;
                break;
              }

              _context.next = 5;
              return regeneratorRuntime.awrap(response.json());

            case 5:
              errorResponse = _context.sent;
              console.error('Error logging in:', errorResponse.error);
              loginValidation.textContent = errorResponse.error || 'Error logging in';
              throw new Error(errorResponse.error || 'Error logging in');

            case 11:
              return _context.abrupt("return", response.json());

            case 12:
            case "end":
              return _context.stop();
          }
        }
      });
    }).then(function (data) {
      console.log("DATA = ", data);
      UserModule.setUserData(data);
      console.log("userModule.getUserData() = ", UserModule.getUserData());
      getProfilePageForThisUser(UserModule.getUserData());
    })["catch"](function (error) {
      console.error('Fetch error:', error);
      loginValidation.textContent = 'Fetch error: ' + error.message;
    });
    return false;
  };

  function getProfilePageForThisUser(user) {
    console.log("Inside getProfilePage()... ready to call profile endpoint");
    console.log("user: ", user);
    fetch("http://localhost:8080/api/v1/users/profile", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      console.log("Here is the response of the /profile endpoint: ", response);

      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch profile data');
      }
    }).then(function (data) {
      console.log('Profile Data:', data);
    })["catch"](function (error) {
      console.error('Error fetching profile data:', error);
    });
    window.location.href = "./profile.html?name=".concat(user.userName);
  }

  return {
    userLogin: userLogin
  };
}();