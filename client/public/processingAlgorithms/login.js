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
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error logging in:', errorResponse.error);
        loginValidation.textContent = errorResponse.error || 'Error logging in';
      } 
      else {
        const successResponse = await response.json();
        console.log('Success:', successResponse.message);
        //THIS IS WHAT HAPPENS AFTER THE LOGIN IS SUCCESSFUL
        window.location.href = './profile.html';
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      loginValidation.textContent = 'Fetch error: ' + error.message;
    });

    return false; 
  };

  return {
    userLogin
  };
})();

