
var loginHandler = (() => {
  var userLogin = async (event) => {
    event.preventDefault();
    console.log("Made it to userLogin()");
  
    const usernameInput = document.getElementById('username-input').value;
    const passwordInput = document.getElementById('password-input').value;
    const feedbackMessage = document.getElementById('feedback-message');
  
    const userLoginRequest = {
      userName: usernameInput,
      password: passwordInput
    };
  
    fetch(`${host}/api/v1/users/find-username`, {
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
        throw new Error('User account is not verified');
      } else if(response.status == 453){
        const errorResponse = await response.json();
        throw new Error('Must reset password');
      } else if(response.status == 452){
        const errorResponse = await response.json();
        throw new Error('10 minute lockout');
      } else if (response.status !== 200) {
        const errorResponse = await response.json();
        console.error('Error logging in:', errorResponse.error);
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
        console.log("this is innerHTML: ", feedbackMessage.innerHTML);
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');
        verificationCodeDiv.style.display = 'block';
      } else if(error == 'Error: Must reset password'){
        feedbackMessage.innerHTML = "Sorry, you've attempted at least 10 incorrect password attempts in a row. Please reset your password to login.";
      } else if(error == 'Error: 10 minute lockout'){
        feedbackMessage.innerHTML = "Sorry, you've attempted 5 incorrect passwords in a row<br/>For security reasons, your account is locked for 10 minutes unless you reset your password.";
      } else{
        feedbackMessage.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
      }
    });
    console.log("inner again: ", feedbackMessage.innerHTML);
    return false;
  };

  function getProfilePageForThisUser(user){
    console.log("Inside getProfilePage()... ready to call profile endpoint");
    console.log("username: ", user);
    fetch(`${host}/api/v1/users/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log("Here is the response of the /profile endpoint: ", response);
      if (response.status == 200) {
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
    getProfilePageForThisUser
  };
})();

if(typeof module === 'object'){
  module.exports = loginHandler;
}