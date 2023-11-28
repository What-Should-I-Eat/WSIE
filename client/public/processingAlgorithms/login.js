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
        .then(response => {
          if (!response.ok) {
            //add verificationMessage in html saying user not fount
            throw new Error('Error logging in');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });

    
      
        return false; 
      }

    return {
      userLogin
    }
})();

