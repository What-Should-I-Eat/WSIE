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
        console.log("Cookie: ", response.cookie);
        //THIS IS WHAT HAPPENS AFTER THE LOGIN IS SUCCESSFUL
        getProfilePageForThisUser(userLoginRequest);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      loginValidation.textContent = 'Fetch error: ' + error.message;
    });

    return false; 
  };

  function getProfilePageForThisUser(userLoginRequest){
    console.log("Inside getProfilePage()... ready to call profile endpoint");
    fetch("http://localhost:8080/api/v1/users/profile", {
      method: 'GET',
      credentials: 'include', // Send cookies with the request
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log("Here is the response of the /profile endpoint: ", response);
      if (response.ok) {
        return response.json(); // Parse the JSON response
      } 
      else {
        throw new Error('Failed to fetch profile data');
      }
    })
    .then(data => {
      // Handle the received profile data
      console.log('Profile Data:', data);
      // Perform actions with the profile data as needed
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
      // Handle the error (display message, redirect to login, etc.)
    });


    window.location.href = './profile.html';
  }

  return {
    userLogin
  };
})();

