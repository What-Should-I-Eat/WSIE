var loginHandler = (() => {

    var newUser = (event) => {
      event.preventDefault();
      console.log('CALLING NEWUSER()');

      const fullName = document.getElementById('fullname-input').value ?? '';
      const email = document.getElementById('email-input').value ?? '';
      const username = document.getElementById('username-input').value ?? '';
      const password = document.getElementById('password-input1').value ?? '';
      const confirmedPassword = document.getElementById('password-input2').value ?? '';
      const verificationMessage = document.getElementById('verification-message');

      const allFieldsAreFilledIn = checkIfAllFieldsAreFilledIn(fullName, email, username, password, verificationMessage);
      const emailAddressIsValid = checkIfEmailAddressIsValid(email);
      const userNameHasValidChars = checkIfUserNameHasValidChars(username);
      const userNameIsCorrectLength = checkIfUserNameIsCorrectLength(username);

      //Verification message
      if(!allFieldsAreFilledIn) {
        console.log("printing fields not filled in verification message");
        verificationMessage.innerHTML = 'Please make sure all fields are filled in.';
        return false;
      } else if(!emailAddressIsValid) {
        verificationMessage.innerHTML = 'Please enter a valid email address.';
        return false;
      } else if(!userNameHasValidChars) {
        verificationMessage.innerHTML = 'Username must not contain special characters.';
        return false;
      } else if(!userNameIsCorrectLength) {
        verificationMessage.innerHTML = 'Please ensure username is between 4 and 15 characters.';
      }
      

      //Check for valid password
      // password minimum length is between 8 and 15 characters, has at least one number, one capital letter, and one lowercase letter
      var hasNumber = /\d/;
      var hasCapitalLetter = /[A-Z]/;
      var hasLowercaseLetter = /[a-z]/;
      if(password.length > 15 || password.length < 8){
        verificationMessage.innerHTML = 'Please ensure password is between 8 and 15 characters.';
        return false;
      } else if(!hasNumber.test(password)){
        verificationMessage.innerHTML = 'Please ensure password contains at least one number.';
        return false;
      } else if(!hasCapitalLetter.test(password)){
        verificationMessage.innerHTML = 'Please ensure password contains at least one capital letter.';
        return false;
      } else if(!hasLowercaseLetter.test(password)){
        verificationMessage.innerHTML = 'Please ensure password contains at least one lowercase letter.';
        return false;
      } else if(password != confirmedPassword) { //Password verification
        verificationMessage.innerHTML = 'Passwords do not match.';
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
          if(response.status == 444){
            console.log('444 sent');
            verificationMessage.innerHTML = 'Username already exists in database.';
            throw new Error('User already exists');
          } else if(response.status == 445){
            console.log('445 sent');
            verificationMessage.innerHTML = 'Email already exists in database.';
            throw new Error('Email already exists');
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
            const confirmationCodeDiv = document.getElementById('confirmationCode');
            confirmationCodeDiv.style.display = 'block';
            // Show login button
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Log In'; 
            loginButton.id = 'loginButton';
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

        return false;
      }

    function checkIfAllFieldsAreFilledIn(fullName, email, username, password){
      if(fullName === '' || email === '' || username === '' || password === ''){
        console.log("fields not filled in");
        return false;
      }
      return true;
    }

    function checkIfEmailAddressIsValid(email) {
      //Check for valid email address format
      // string@string.string is the meaning of the below variable
      var validEmailFormat = /\S+@\S+\.\S+/;
      if(!validEmailFormat.test(email)){
        
        return false;
      }
      return true;
    }

    function checkIfUserNameHasValidChars(username) {
      var alphaNumberic = /^[0-9a-z]+$/i;
      if(!username.match(alphaNumberic)){
        return false;
      }
    }

    function checkIfUserNameIsCorrectLength(username){
      if(username.length > 15 || username.length < 4){
        return false;
      }
      return true;
    }

    return {
      newUser
    }
})();
