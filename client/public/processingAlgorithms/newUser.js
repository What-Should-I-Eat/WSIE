var loginHandler = (() => {
    var newUser = async (event) => {
      event.preventDefault();
      
      console.log(new Date().toISOString());
      const fullName = document.getElementById('fullname-input').value ?? '';
      const email = document.getElementById('email-input').value ?? '';
      const username = document.getElementById('username-input').value ?? '';
      const password = document.getElementById('password-input1').value ?? '';
      const confirmedPassword = document.getElementById('password-input2').value ?? '';
      const feedbackMessage = document.getElementById('feedback-message');
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
        feedbackMessage.innerHTML = loginHandler2.getVerificationMessage(userInputViabilityNumber);
        return false;
      }
      const verificationCode = await loginHandler2.getVerificationCode();

      
      loginHandler2.sendEmail(fullName, email, verificationCode, emailjs, "newuser", username);


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

      fetch(`${host}/api/v1/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      })
        .then(response => {
          if(response.status == 444){
            console.log('444 sent');
            feedbackMessage.innerHTML = 'Username already exists in database.';
            throw new Error('User already exists');
          } else if(response.status == 445){
            console.log('445 sent');
            feedbackMessage.innerHTML = 'Email already exists in database.';
            throw new Error('Email already exists');
          } else if(response.status == 500){
            console.log('500 sent');
            feedbackMessage.innerHTML = 'Sorry, there\'s a problem on our end. Please try again later.';
            throw new Error('Server error.');
          } else if(response.status == 400){
            console.log('400 sent');
            feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            throw new Error('Bad Request.');
          } else if(response.status == 401){
            console.log('401 sent');
            feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            throw new Error('Unauthorized.');
          } else if(response.status == 404){
            console.log('404 sent');
            feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            throw new Error('Not found.');
          } else if(response.status == 408){
            console.log('408 sent');
            feedbackMessage.innerHTML = 'Sorry, the request timed out. Please try again later.';
            throw new Error('Request timeout error.');
          } else if(response.status == 429){
            console.log('429 sent');
            feedbackMessage.innerHTML = 'Sorry, it looks like you have made too many requests. Please try again later.';
            throw new Error('Too many requests.');
          }else if (response.status != 200) {
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
          feedbackMessage.innerHTML = loginSuccess;
          const verificationCodeDiv = document.getElementById('verificationCodeDiv');
          verificationCodeDiv.style.display = 'block';
          passwordRequirement.style.display = 'none';
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });

        return false;
      }

    return {
      newUser
    }
})();
if(typeof module === 'object'){
  module.exports = loginHandler;
}