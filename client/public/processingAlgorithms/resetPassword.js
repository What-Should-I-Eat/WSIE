
//ensure email is valid wsie email
//send verification code via email passing fullname, email, UN, and verification code
//user puts code in
//user enters username from email
//user inputs new password twice
//server hashes password
//new password saved

var loginHandler = (() => {
    var forgotPassword = async (event) => {
      event.preventDefault();
  
      const userEmail = document.getElementById('email-input').value;
      var verificationMessage = document.getElementById('valid-user-email');
  
        const forgotCredentialsData = await getUserCredentials(userEmail);
        console.log("Here's our data", forgotCredentialsData);

        if(forgotCredentialsData.error){
            verificationMessage.innerHTML = "This email is not in our database. Please try again.";
        }
        else {
            verificationMessage.innerHTML = "Sending verification code!";
        }
  
      return false;
    };
  
    return {
      forgotPassword,
    };
  
    async function getUserCredentials(email) {
      console.log('Getting credentials for: ', email);
      let userInfo;
  
      try {
        const response = await fetch(`http://${host}/api/v1/users/requestInfoForPasswordReset?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status !== 200) {
          console.log('Cannot find user');
          console.error("Cannot find user");
          userInfo = null;
        }
        userInfo = await response.json();
  
      } catch (error) {
        console.error('Fetch error:', error);
      }
  
      return userInfo;
    }
  })();
  