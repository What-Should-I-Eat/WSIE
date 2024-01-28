//const host = 'localhost:8080';

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
  
    fetch(`http://${host}/api/v1/users/find-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLoginRequest),
    })
    .then(async response => {
      console.log("we are at the point of response. this is the response.status: ");
      console.log(response.status);
      if(response.status == 450){
        const errorResponse = await response.json();
        console.error('User\'s account is not verified: ', errorResponse.error);
        loginValidation.innerHTML = "Account is not yet verified.<br/>Please check your email and enter the 6 digit code below";
        throw new Error(errorResponse.error || 'User account is not verified');
      } else if (response.status !== 200) {
        const errorResponse = await response.json();
        console.error('Error logging in:', errorResponse.error);
        loginValidation.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
        throw new Error(errorResponse.error || 'Error logging in');
      } else {
        return response.json();
      }
    })
    .then(data => {
      console.log("DATA = ", data);
      console.log(data.userName);
      getProfilePageForThisUser(data.userName);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      if(error == 'Error: User account is not verified'){
        loginValidation.innerHTML = "Account is not yet verified.<br/>Please check your email and enter the 6 digit code below";
        const confirmationCodeDiv = document.getElementById('confirmationCode');
          confirmationCodeDiv.style.display = 'block';
      } else{
        loginValidation.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
      }
    });
  
    return false;
  };
  var updateVerificationStatus = (event) => {
    event.preventDefault();
    console.log('CALLING UPDATEVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const loginValidation = document.getElementById('login-validation');

    const enteredCode = document.getElementById('confirmationCodeInput').value ?? '';

    if(isVerificationCodeEmpty(enteredCode)){
      loginValidation.innerHTML = "Verification code cannot be blank";
      return false;
    } else if(username === ''){
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

  var resendVerificationStatus = (event) => {
    event.preventDefault();
    console.log('CALLING RESENDVERIFICATIONSTATUS()');

    const username = document.getElementById('username-input').value ?? '';
    const loginValidation = document.getElementById('login-validation');

    if(username === ''){
      loginValidation.innerHTML = "Username cannot be blank";
      return false;
    }

    fetch(`http://${host}/api/v1/users/sendVerificationCode`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username,            
      }),
    })
      .then(response => {
        if(response.status != 200){
          console.log('Cannot resend code');
          loginValidation.innerHTML = 'Could not resend code';
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

    function isVerificationCodeEmpty(code){
      if(code === ''){
        return true;
      } else{
        return false;
      }
    }

  
  function getProfilePageForThisUser(user){
    console.log("Inside getProfilePage()... ready to call profile endpoint");
    console.log("username: ", user);
    fetch(`http://${host}/api/v1/users/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log("Here is the response of the /profile endpoint: ", response);
      if (response.ok) {
        return response.json(); 
      } 
      else {
        throw new Error('Failed to fetch profile data');
      }
    })
    .then(data => {
      console.log('Profile Data:', data);
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });

    window.location.href = `./profile.html?name=${user}`;
  }

  return {
    userLogin,
    updateVerificationStatus,
    resendVerificationStatus
  };
})();

