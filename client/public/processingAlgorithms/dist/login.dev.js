"use strict";

var host = 'localhost:8080';

var loginHandler = function () {
  var userId;

  var userLogin = function userLogin() {
    var usernameInput = document.getElementById('username-input').value;
    var passwordInput = document.getElementById('password-input').value;
    var loginValidation = document.getElementById('login-validation');
    fetch('http://' + host + '/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      return response.json();
    }).then(function (users) {
      console.log('Fetched users:', users); // const verifiedUser = users.find(user => user.userName === usernameInput && user.password === passwordInput);
      // if (verifiedUser) {
      //   userId = verifiedUser._id;
      //   console.log(`User ID: ${userId}`);
      //   openHomePage(userId, verifiedUser.fullName); // Pass the userId to openHomePage function
      // } else {
      //   // User not found or credentials don't match
      //   console.log('User not found or incorrect credentials.');
      // }
    })["catch"](function (error) {
      // Handle errors that occurred during the fetch request
      console.error('There was a problem with the fetch operation:', error);
    });
    return false; // Assuming this function is tied to a form submission to prevent default form behavior
  };

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
      openHomePage(userId, savedUser.fullName);
    })["catch"](function (error) {
      console.error('Fetch error:', error);
    });
    var loginSuccess = "We're happy to have you, " + fullName + "!<br>You have successfully created a WSIE profie.";
    verificationMessage.innerHTML = loginSuccess; //openHomePage(id);

    return true;
  };

  function openHomePage(id, firstName) {
    var name = document.getElementById('user-identification');
    name.innerHTML = firstName;
    window.location.href = './profile.html';
  }

  return {
    newUser: newUser,
    userLogin: userLogin
  };
}();