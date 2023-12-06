//import { setUserData, getUserData } from './currentUser.js';

const host = 'localhost:8080';

var loginHandler = (() => {
  var userLogin = (event) => {
    event.preventDefault();
    console.log("Made it to userLogin()");

    const usernameInput = document.getElementById('username-input').value;
    const passwordInput = document.getElementById('password-input').value;
    const loginValidation = document.getElementById('login-validation');
  
    const userLoginRequest = {
      userName: usernameInput,
      password: passwordInput
    };

    fetch("http://" + host + "/api/v1/users/find-username", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLoginRequest),
    })
    .then(async response => {
      console.log("we are at the point of response. this is the response.status: ");
      console.log(response.status);
      if (response.status != 200) {
        const errorResponse = await response.json();
        console.error('Error logging in:', errorResponse.error);
        loginValidation.textContent = errorResponse.error || 'Error logging in';
      } 
      else { //The user is successfully logged in
        const successResponse = await response.json();
        console.log('Success:', successResponse.message);
        console.log("Response: ", response.json);
        console.log("User login request: ", userLoginRequest.userName);
        
        //THIS IS WHAT HAPPENS AFTER THE LOGIN IS SUCCESSFUL
        //First we put user data in the model

        // try {
        //   const userData = await response.json();
        //   setUserData(userData);
        //   const currentUser = getUserData();
        //   console.log(currentUser);
        //   // Additional actions with currentUser if needed
        // } catch (error) {
        //   console.error('Error parsing response:', error);
        //   // Handle parsing error (display message, etc.)
        // }


        getProfilePageForThisUser(userLoginRequest.userName);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      loginValidation.textContent = 'Fetch error: ' + error.message;
    });

    return false; 
  };

  function getProfilePageForThisUser(username){
    console.log("Inside getProfilePage()... ready to call profile endpoint");
    fetch("http://localhost:8080/api/v1/users/profile", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log("Here is the response of the /profile endpoint: ", response);
      if (response.ok) {
        return response.json(); 
      } 
      else {
        throw new Error('Failed to fetch profile data');
      }
    })
    .then(data => {
      console.log('Profile Data:', data);
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });

    window.location.href = `./profile.html?name=${username}`;
  }

  return {
    userLogin
  };
})();

