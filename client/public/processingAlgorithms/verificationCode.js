var verificationHandler = (() => {
  var updateVerificationStatusNewUser = (event) => {
    event.preventDefault();
    console.log('CALLING UPDATEVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const fullName = document.getElementById('fullname-input').value ?? '';
    const verificationMessage = document.getElementById('verification-message');
    const enteredCode = document.getElementById('confirmationCodeInput').value ?? '';

    if(isVerificationCodeEmpty(enteredCode)){
        verificationMessage.innerHTML = "Verification code cannot be blank";
        return false;
    } else if(isUsernameEmpty(username)){
        verificationMessage.innerHTML = "Username cannot be blank";
        return false;
    } else if(isFullNameEmpty(fullName)){
        verificationMessage.innerHTML = "Name field cannot be blank";
        return false;
    }

    fetch(`http://${host}/api/v1/users/verify`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        userName: username,            
        verificationCode: enteredCode
        }),
    })
    .then(response => {
    if(response.status != 200){
        console.log('Cannot verify user');
        verificationMessage.innerHTML = 'Could not verify user';
        throw new Error('Cannot verify user');
    }
    return response.json();
    })
    .then(verifiedUser => {
    console.log('User verified: ', verifiedUser);

    const verificationSuccess = "You have successfully verified your WSIE profile, " + fullName +"!<br>Please continue to the Login page!";
    verificationMessage.innerHTML = verificationSuccess;

    const loginDiv = document.getElementById('login');

    if (!document.getElementById('loginButton')) {
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

  var updateVerificationStatusLogin = (event) => {
        event.preventDefault();
        console.log('CALLING UPDATEVERIFICATIONSTATUS()');
    
        const username = document.getElementById('username-input').value ?? '';
        const loginValidation = document.getElementById('login-validation');
    
        const enteredCode = document.getElementById('confirmationCodeInput').value ?? '';
    
        if(isVerificationCodeEmpty(enteredCode)){
          loginValidation.innerHTML = "Verification code cannot be blank";
          return false;
        } else if(isUsernameEmpty(username)){
          loginValidation.innerHTML = "Username cannot be blank";
          return false;
        }
    
        fetch(`http://${host}/api/v1/users/verify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,            
            verificationCode: enteredCode
          }),
        })
          .then(response => {
            if(response.status != 200){
              console.log('Cannot verify user');
              loginValidation.innerHTML = 'Could not verify user';
              throw new Error('Cannot verify user');
            }
            return response.json();
          })
          .then(verifiedUser => {
            console.log('User verified: ', verifiedUser);
    
            // After creating the user, handle UI changes
            const verificationSuccess = "You have successfully verified your WSIE profile!<br>Please continue to the Login!";
            loginValidation.innerHTML = verificationSuccess;
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });
    
          return false;
  }

  var resendVerificationCodeNewUser = (event) => {
    event.preventDefault();
    console.log('CALLING RESENDVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const verificationMessage = document.getElementById('verification-message');
    const fullName = document.getElementById('fullname-input').value ?? '';
    const email = document.getElementById('email-input').value ?? '';

    if(isFullNameEmpty(fullName)){
        verificationMessage.innerHTML = "Verification code cannot be blank";
        return false;
    } else if(isUsernameEmpty(username)){
        verificationMessage.innerHTML = "Username cannot be blank";
        return false;
    } else if(isEmailEmpty(email)){
        verificationCode.innerHTML = "Email cannot be blank";
        return false;
    }

    const verificationCode = generateRandomVerificationCode();
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
            verificationMessage.innerHTML = 'Could not resend code';
            throw new Error('Cannot resend code');
        }
        return response.json();
        })
        .then(targetUser => {
        console.log('User code resent: ', targetUser);

        // After creating the user, handle UI changes
        const resentCode = "Verification code has been resent.<br/>Please check your email and enter the 6 digit code below";
        verificationMessage.innerHTML = resentCode;
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
    const loginValidation = document.getElementById('login-validation');

    if(username === ''){
      loginValidation.innerHTML = "Username cannot be blank";
      return false;
    }
    const email = await getUserEmail(username); 

    const verificationCode = generateRandomVerificationCode();
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
            verificationMessage.innerHTML = 'Could not resend code';
            throw new Error('Cannot resend code');
        }
        return response.json();
        })
        .then(targetUser => {
        console.log('User code resent: ', targetUser);

        // After creating the user, handle UI changes
        const resentCode = "Verification code has been resent.<br/>Please check your email and enter the 6 digit code below";
        loginValidation.innerHTML = resentCode;
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

  function generateRandomVerificationCode(){
    return String(Math.floor(100000 + Math.random() * 900000));
  }
  async function getUserEmail(username){
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
            loginValidation.innerHTML = 'Could not verify user';
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

  function isVerificationCodeEmpty(code){
    if(code === ''){
        return true;
    } else{
        return false;
    }
  }

  function isUsernameEmpty(username){
    if(username === ''){
        return true;
    } else{
        return false;
    }
  }
  function isFullNameEmpty(fullName){
    if(fullName === ''){
        return true;
    } else{
        return false;
    }
  }
  function isEmailEmpty(email){
    if(email === ''){
        return true;
    } else{
        return false;
    }
  }

  return {
    updateVerificationStatusNewUser,
    updateVerificationStatusLogin,
    resendVerificationCodeNewUser,
    resendVerificationStatusLogin
  }

})();