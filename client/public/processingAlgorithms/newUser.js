var loginHandler = (() => {
    var newUser = (event) => {
      event.preventDefault();
      console.log('CALLING NEWUSER()');
      console.log(new Date().toISOString());
      const fullName = document.getElementById('fullname-input').value ?? '';
      const email = document.getElementById('email-input').value ?? '';
      const username = document.getElementById('username-input').value ?? '';
      const password = document.getElementById('password-input1').value ?? '';
      const confirmedPassword = document.getElementById('password-input2').value ?? '';
      const verificationMessage = document.getElementById('verification-message');
      const passwordRequirement = document.getElementById('password-requirement');
      
      //User input is invalid if function returns anything other than 0
      const userInputViabilityNumber = loginHandler2.checkIfUserInputIsViable(
        fullName,
        email,
        username,
        password,
        confirmedPassword
      );
  
      //Depending on the userInputViabilityNumber, verification message shows
      if (userInputViabilityNumber !== 0) {
        verificationMessage.innerHTML = loginHandler2.getVerificationMessage(userInputViabilityNumber);
        return false;
      }

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
          const loginSuccess = "You have successfully created a WSIE profile.<br>To verify your account, please enter the 6 digit code from your email below.<br/>Code expires in 10 minutes";
          verificationMessage.innerHTML = loginSuccess;
          const confirmationCodeDiv = document.getElementById('confirmationCode');
          confirmationCodeDiv.style.display = 'block';
          passwordRequirement.style.display = 'none';
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });

        return false;
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

    return {
      newUser
    }
})();
