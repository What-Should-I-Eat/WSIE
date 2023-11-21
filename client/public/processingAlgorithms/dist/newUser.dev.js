"use strict";

var host = 'localhost:8080';

var loginHandler = function () {
  var newUser = function newUser(event) {
    event.preventDefault();
    console.log('CALLING NEWUSER()');
    var fullName = document.getElementById('fullname-input').value;
    var email = document.getElementById('email-input').value;
    var username = document.getElementById('username-input').value;
    var password = document.getElementById('password-input').value;
    var verificationMessage = document.getElementById('verification-message'); //Check if all fields are filled in

    if (fullName === '' || email === '' || username === '' || password === '') {
      verificationMessage.innerHTML = 'Please make sure all fields are filled in.';
      return false;
    } //If all fields are filled in, continue


    var newUserData = {
      fullName: fullName,
      userName: username,
      password: password,
      email: email,
      diet: [],
      health: [],
      favorites: []
    };
    fetch("http://" + host + "/api/v1/users/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Error adding new user');
      }

      return response.json();
    }).then(function (savedUser) {
      console.log('User created: ', savedUser);
      userId = savedUser._id;
      console.log(userId);
    })["catch"](function (error) {
      console.error('Fetch error:', error);
    });
    var loginSuccess = "We're happy to have you, " + fullName + "!<br>You have successfully created a WSIE profie.";
    verificationMessage.innerHTML = loginSuccess;
    var loginDiv = document.getElementById('login'); //Show login button

    var loginButton = document.createElement('button');
    loginButton.textContent = 'Log In'; // Set button text

    loginButton.addEventListener('click', function () {
      window.location.href = './login.html';
    });
    loginDiv.appendChild(loginButton);
    return true;
  };

  return {
    newUser: newUser
  };
}();