// const loginHandler2 = require('./testRefactorMethods');
// const emailjs = require('@emailjs/browser');

var verificationHandler = (() => {
  var updateVerificationStatusNewUser = (event) => {
    event.preventDefault();
    console.log('CALLING UPDATEVERIFICATIONSTATUS()');
    console.log(new Date().toISOString());

    const username = document.getElementById('username-input').value ?? '';
    const fullName = document.getElementById('fullname-input').value ?? '';
    const feedbackMessage = document.getElementById('feedback-message');
    const enteredVerificationCode = document.getElementById('verificationCodeInput').value ?? '';
    if(loginHandler2.isInputEmpty(enteredVerificationCode)){
        feedbackMessage.innerHTML = "Verification code cannot be blank";
        return false;
    } else if(loginHandler2.isInputEmpty(username)){
        feedbackMessage.innerHTML = "Username cannot be blank";
        return false;
    } else if(loginHandler2.isInputEmpty(fullName)){
        feedbackMessage.innerHTML = "Name field cannot be blank";
        return false;
    }

    fetch(`http://${host}/api/v1/users/verify`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        userName: username,            
        verificationCode: enteredVerificationCode
        }),
    })
    .then(response => {
    if(response.status == 437){
      console.log('Code has expired');
      feedbackMessage.innerHTML = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.';
      throw new Error('Code has expired');
    }else if(response.status != 200){
        console.log('Cannot verify user');
        feedbackMessage.innerHTML = 'Could not verify user';
        throw new Error('Cannot verify user');
    }
    return response.json();
    })
    .then(verifiedUser => {
    console.log('User verified: ', verifiedUser);

    const verificationSuccess = "You have successfully verified your WSIE profile, " + fullName +"!<br>Please continue to the Login page!";
    feedbackMessage.innerHTML = verificationSuccess;
    })
    .catch(error => {
    console.error('Fetch error:', error);
    if(error == 'Error: Code has expired'){
      feedbackMessage.innerHTML = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.';
    } else{
      feedbackMessage.innerHTML = 'Could not verify user.<br/>Please check code is entered correctly';
    }
    });
    return false;
  }

  var updateVerificationStatusLogin = (event) => {
        event.preventDefault();
        console.log('CALLING UPDATEVERIFICATIONSTATUS()');
    
        const username = document.getElementById('username-input').value ?? '';
        const feedbackMessage = document.getElementById('feedback-message');
    
        const enteredVerificationCode = document.getElementById('verificationCodeInput').value ?? '';
    
        if(loginHandler2.isInputEmpty(enteredVerificationCode)){
          feedbackMessage.innerHTML = "Verification code cannot be blank";
          return false;
        } else if(loginHandler2.isInputEmpty(username)){
          feedbackMessage.innerHTML = "Username cannot be blank";
          return false;
        }
    
        fetch(`http://${host}/api/v1/users/verify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,            
            verificationCode: enteredVerificationCode
          }),
        })
          .then(response => {
            if(response.status == 437){
              console.log('Code has expired');
              feedbackMessage.innerHTML = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.';
              throw new Error('Code has expired');
            } else if(response.status != 200){
              console.log('Cannot verify user');
              feedbackMessage.innerHTML = 'Could not verify user';
              throw new Error('Cannot verify user');
            }
            return response.json();
          })
          .then(verifiedUser => {
            console.log('User verified: ', verifiedUser);
    
            // After creating the user, handle UI changes
            const verificationSuccess = "You have successfully verified your WSIE profile!<br>Please continue to the Login!";
            feedbackMessage.innerHTML = verificationSuccess;
          })
          .catch(error => {
            console.error('Fetch error:', error);
            if(error == 'Error: Code has expired'){
              feedbackMessage.innerHTML = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.';
            } else{
              feedbackMessage.innerHTML = 'Could not verify user.<br/>Please check code is entered correctly';
            }
          });
    
          return false;
  }

  var resendVerificationCodeNewUser = async (event) => {
    event.preventDefault();
    console.log('CALLING RESENDVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const feedbackMessage = document.getElementById('feedback-message');
    const fullName = document.getElementById('fullname-input').value ?? '';
    const email = document.getElementById('email-input').value ?? '';

    if(loginHandler2.isInputEmpty(fullName)){
      feedbackMessage.innerHTML = "Verification code cannot be blank";
      return false;
    } else if(loginHandler2.isInputEmpty(username)){
        feedbackMessage.innerHTML = "Username cannot be blank";
        return false;
    } else if(loginHandler2.isInputEmpty(email)){
        feedbackMessage.innerHTML = "Email cannot be blank";
        return false;
    }
    const verificationCode = await loginHandler2.getVerificationCode();
    sendEmail(fullName, email, verificationCode, emailjs);

    fetch(`http://${host}/api/v1/users/resendVerificationCode`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        userName: username,
        verificationCode: verificationCode,            
        }),
    })
        .then(response => {
        if(response.status != 200){
            console.log('Cannot resend code');
            feedbackMessage.innerHTML = 'Could not resend code';
            throw new Error('Cannot resend code');
        }
        return response.json();
        })
        .then(targetUser => {
        console.log('User code resent: ', targetUser);

        // After creating the user, handle UI changes
        const resentCode = "Verification code has been resent.<br/>Please check your email and enter the 6 digit code below.<br/>Code expires after 10 minutes";
        feedbackMessage.innerHTML = resentCode;
        })
        .catch(error => {
        console.error('Fetch error:', error);
        });

        return false;
  }

  async function resendVerificationStatusLogin(event){
    event.preventDefault();
    console.log('CALLING RESENDVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const feedbackMessage = document.getElementById('feedback-message');

    if(loginHandler2.isInputEmpty(username)){
      feedbackMessage.innerHTML = "Username cannot be blank";
      return false;
    }
    const email = await getUserEmail(username); 

    const verificationCode = await loginHandler2.getVerificationCode();
    sendEmail(username, email, verificationCode, emailjs);

    fetch(`http://${host}/api/v1/users/resendVerificationCode`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        userName: username,
        verificationCode: verificationCode,            
        }),
    })
        .then(response => {
        if(response.status != 200){
            console.log('Cannot resend code');
            feedbackMessage.innerHTML = 'Could not resend code';
            throw new Error('Cannot resend code');
        }
        return response.json();
        })
        .then(targetUser => {
        console.log('User code resent: ', targetUser);

        // After creating the user, handle UI changes
        const resentCode = "Verification code has been resent.<br/>Please check your email and enter the 6 digit code below.<br/>Code expires after 10 minutes";
        feedbackMessage.innerHTML = resentCode;
        })
        .catch(error => {
        console.error('Fetch error:', error);
        });

      return false;
    }


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

  async function getUserEmail(username){
    const feedbackMessage = document.getElementById('feedback-message');
    const email = await fetch(`http://${host}/api/v1/users/getUserEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,            
        }),
      })
        .then(response => {
          if(response.status != 200){
            console.log('Cannot verify user');
            feedbackMessage.innerHTML = 'Could not verify user';
            throw new Error('Cannot verify user');
          }
          return response.json();
        }).then(user => {
            return user.email;
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
        return email;
  }

  return {
    updateVerificationStatusNewUser,
    updateVerificationStatusLogin,
    resendVerificationCodeNewUser,
    resendVerificationStatusLogin,
    getUserEmail,
    sendEmail
  }

})();

if(typeof module === 'object'){
  module.exports = verificationHandler;
}