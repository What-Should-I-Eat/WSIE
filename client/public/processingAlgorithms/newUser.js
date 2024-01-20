

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

      //Check for valid email address format
      // string@string.string is the meaning of the below variable
      var validEmailFormat = /\S+@\S+\.\S+/;
      if(!validEmailFormat.test(email)){
        verificationMessage.innerHTML = 'Please enter a valid email address.';
        return false;
      }

      //Check username does not contain special characters and is between 4 and 15 characters
      var alphaNumberic = /^[0-9a-z]+$/i;
      if(username.length > 15 || username.length < 4){
        verificationMessage.innerHTML = 'Please ensure username is between 4 and 15 characters.';
        return false;
      }else if(!username.match(alphaNumberic)){
        verificationMessage.innerHTML = 'Username must not contain special characters.';
        return false;
      }

      //Check for valid password
      var hasNumber = /\d/;
      // password minimum length is between 8 and 15 characters, has at least one number, one capital letter, one lowercase letter, and one special characters
      if(password.length > 15 || password.length < 8){
        verificationMessage.innerHTML = 'Please ensure password is between 8 and 15 characters.';
        return false;
      } else if(!hasNumber.test(password)){
        verificationMessage.innerHTML = 'Please ensure password contains at least one number.';
        return false;
      }
      // } else if(password.match(alphaNumberic)){
      //   verificationMessage.innerHTML = 'Please ensure password contains at least one special character.';
      //   return false;
      // }

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
          if(response.status == 444){
            console.log('444 sent');
            verificationMessage.innerHTML = 'Username already exists in database.';
            throw new Error('User already exists');
          }else if (!response.ok) {
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
