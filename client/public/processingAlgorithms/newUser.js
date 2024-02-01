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
      
      //USER INPUT viability - any userInputViabilityNumber other than 0 means user input is invalid;
      const userInputViabilityNumber = checkIfUserInputIsViable(fullName, email, username, password, confirmedPassword);
      if(userInputViabilityNumber != 0) {
        verificationMessage.innerHTML = getVerificationMessage(userInputViabilityNumber);
        return false;
      }

      const verificationCode = generateRandomVerificationCode();
      sendEmail(fullName, email, verificationCode, emailjs);
      
      //After email verification, continue with registration
      const newUserData = {
        fullName: fullName,
        userName: username,
        password: password,
        email: email,
        verificationCode: verificationCode,
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
          const loginSuccess = "You have successfully created a WSIE profile.<br>To verify your account, please enter the 6 digit code from your email below:";
          verificationMessage.innerHTML = loginSuccess;
          const confirmationCodeDiv = document.getElementById('confirmationCode');
          confirmationCodeDiv.style.display = 'block';
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });

        return false;
      }

    function checkIfUserInputIsViable(fullName, email, username, password, confirmedPassword){
      const passwordIsValid = checkIfPasswordIsValid(password);
      
      if(!checkIfAllFieldsAreFilledIn(fullName, email, username, password)) {
        return 1;
      } else if(!checkIfEmailAddressIsValid(email)) {
        return 2;
      } else if(!checkIfUserNameHasValidChars(username)) {
        return 3;
      } else if(!checkIfUserNameIsCorrectLength(username)) {
        return 4;
      } else if(!passwordIsValid) {
        return 5;
      } else if(!checkIfPasswordsMatch(password, confirmedPassword)) {
        return 6;
      }

      return 0;
    }

    function getVerificationMessage(userInputViabilityNumber){
      switch(userInputViabilityNumber){
        case 1:
          return 'Please make sure all fields are filled in.';
        case 2:
          return 'Please enter a valid email address.';
        case 3:
          return 'Username must not contain special characters.';
        case 4:
          return 'Please ensure that username is between 4 and 15 characters.';
        case 5:
          return 'Please ensure that password is between 8-15 characters, contains at least one capital and lowercase letter, and contains a number.';
        case 6:
          return 'Please ensure that passwords match.';
        default:
          return 'Success';
      }
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

    //Returns boolean of email sent success/failure
    function sendEmail(fullName, email, verificationCode, emailjs){
      console.log("Attempting to send verification code");

      console.log("verification code: ", verificationCode);
      const params = {
        userEmail: email,
        userFullName: fullName,
        verificationCode: verificationCode,
      }

      //need to get this out of the client
      const serviceID = "service_ms0318i";
      const templateID = "template_7av6tqc";
      const publicKey = "8nKeoQjoIWF1wyUpG";

      emailjs.send(serviceID, templateID, params, publicKey)
          .then(function(response) {
            console.log('SUCCESS: email sent', response.status, response.text);
            return true;
          }, function(error) {
            console.log('FAILED: email could not be sent', error);
          });

      return false;
    }
    function generateRandomVerificationCode(){
      return String(Math.floor(100000 + Math.random() * 900000));
    }

    return {
      newUser,
    }
})();
