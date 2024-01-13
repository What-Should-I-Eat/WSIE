

var loginHandler = (() => {

    var newUser = (event) => {
      event.preventDefault();
      console.log('CALLING NEWUSER()');

      const fullName = document.getElementById('fullname-input').value;
      const email = document.getElementById('email-input').value;
      const username = document.getElementById('username-input').value;
      const password = document.getElementById('password-input').value;
      const verificationMessage = document.getElementById('verification-message');

      //Check if all fields are filled in
      if(fullName === '' || email === '' || username === '' || password === ''){
        verificationMessage.innerHTML = 'Please make sure all fields are filled in.';
        return false;
      }

     //If all fields are filled in, continue
      const newUserData = {
        fullName: fullName,
        userName: username,
        password: password,
        email: email,
        diet: [],
        health: [],
        favorites: []
      };

      fetch(`http://${host}/api/v1/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error adding new user');
        }
        return response.json();
      })
      .then(savedUser => {
        console.log('User created: ', savedUser);
        userId = savedUser._id;
        console.log(userId);

        // After creating the user, handle UI changes
        const loginSuccess = "We're happy to have you, " + fullName + "!<br>You have successfully created a WSIE profile.";
        verificationMessage.innerHTML = loginSuccess;

        const loginDiv = document.getElementById('login');

        // Check if the login button is already appended to avoid duplication
        if (!document.getElementById('loginButton')) {
          // Show login button
          const loginButton = document.createElement('button');
          loginButton.textContent = 'Log In'; // Set button text
          loginButton.id = 'loginButton'; // Set an ID for the button
          loginButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = './index.html';
          });
          loginDiv.appendChild(loginButton);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }

    return {
      newUser
    }
})();
