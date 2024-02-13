
var loginHandler = (() => {
  var userLogin = (event) => {
    event.preventDefault();
    console.log("Made it to userLogin()");
  
    const usernameInput = document.getElementById('username-input').value;
    const passwordInput = document.getElementById('password-input').value;
    const feedbackMessage = document.getElementById('feedback-message');
  
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
        feedbackMessage.innerHTML = "Account is not yet verified.<br/>Please check your email and enter the 6 digit code below<br/>Code expires in 10 minutes";
        throw new Error(errorResponse.error || 'User account is not verified');
      } else if (response.status !== 200) {
        const errorResponse = await response.json();
        console.error('Error logging in:', errorResponse.error);
        feedbackMessage.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
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
        feedbackMessage.innerHTML = "Account is not yet verified.<br/>Please check your email and enter the 6 digit code below<br/>Code expires in 10 minutes";
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');
        verificationCodeDiv.style.display = 'block';
      } else{
        feedbackMessage.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
      }
    });
  
    return false;
  };

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
  };
})();

