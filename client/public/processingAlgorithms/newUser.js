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
      const passwordIsValid = checkIfPasswordIsValid(password);
      const passwordsMatch = checkIfPasswordsMatch(password, confirmedPassword);

      //Verification message - put this into its own method after refactoring
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
        verificationMessage.innerHTML = 'Please ensure that username is between 4 and 15 characters.';
        return false;
      } else if(!passwordIsValid) {
        verificationMessage.innerHTML = 'Please ensure that password is between 8-15 characters, contains at least one capital and lowercase letter, and contains a number.';
        return false;
      } else if(!passwordsMatch) {
        verificationMessage.innerHTML = 'Please ensure that passwords match.';
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
      // string@string.string is the meaning of the below variable
      var validEmailFormat = /\S+@\S+\.\S+/;
      if(!validEmailFormat.test(email)){
        console.log("email not valid");
        return false;
      }
      return true;
    }

    function checkIfUserNameHasValidChars(username) {
      var alphaNumberic = /^[0-9a-z]+$/i;
      if(!username.match(alphaNumberic)){
        return false;
      }
      return true;
    }

    function checkIfUserNameIsCorrectLength(username){
      if(username.length > 15 || username.length < 4){
        return false;
      }
      return true;
    }

    function checkIfPasswordIsValid(password) {
      // password minimum length is between 8 and 15 characters, has at least one number, one capital letter, and one lowercase letter
      var hasNumber = /\d/;
      var hasCapitalLetter = /[A-Z]/;
      var hasLowercaseLetter = /[a-z]/;

      if(!checkPasswordLength(password)){
        return false;
      }
      if(!checkIfPasswordContainsNumber(password, hasNumber)){
        return false;
      }
      if(!checkIfPasswordContainsCapitalLetter(password, hasCapitalLetter)){
        return false;
      }
      if(!checkIfPasswordContainsLowercaseLetter(password, hasLowercaseLetter)){
        return false;
      }
      
      return true;
    }

    function checkPasswordLength(password){
      if(password.length > 15 || password.length < 8){
        console.log("password incorrect length");
        return false;
      }
      return true;
    }

    function checkIfPasswordContainsNumber(password, hasNumber){
      if(!hasNumber.test(password)){
        console.log("no number in password");
        return false;
      }
      return true;
    }

    function checkIfPasswordContainsCapitalLetter(password, hasCapitalLetter){
      if(!hasCapitalLetter.test(password)){
        console.log("no capital letter in password");
        return false;
      }
      return true;
    }

    function checkIfPasswordContainsLowercaseLetter(password, hasLowercaseLetter){
      if(!hasLowercaseLetter.test(password)){
        console.log("no lowercase letter in password");
        return false;
      }
      return true;
    }

    function checkIfPasswordsMatch(password, confirmedPassword){
      if(password != confirmedPassword) { //Password verification
        console.log("passwords don't match");
        return false;
      }
      return true;
    }

    return {
      newUser
    }
})();
