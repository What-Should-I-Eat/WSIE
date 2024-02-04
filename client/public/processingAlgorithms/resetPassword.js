//ensure email is valid wsie email
//send verification code via email passing fullname, email, UN, and verification code
//user puts code in
//user enters username from email
//user inputs new password twice
//server hashes password
//new password saved

var username;

var loginHandler = (() => {
    var forgotPassword = async (event) => {
      event.preventDefault();
  
      //Get applicable user info from email
      const userEmail = document.getElementById('email-input').value;
      var verificationMessage = document.getElementById('valid-user-email');
  
        const forgotCredentialsData = await getUserCredentials(userEmail);
        console.log("Here's our data", forgotCredentialsData);
        username = forgotCredentialsData.username;

        if(forgotCredentialsData.error){
            verificationMessage.innerHTML = "This email is not in our database. Please try again.";
            return false;
        }

        const verificationCode = await getVerificationCode();
        sendEmail(forgotCredentialsData.email, forgotCredentialsData.fullName, forgotCredentialsData.username, verificationCode, emailjs);
        const verificationCodeIsUpdated = await putVerificationCodeInDB(forgotCredentialsData.username, verificationCode);

        console.log("verification code is updated: ", verificationCodeIsUpdated);

        if(!verificationCodeIsUpdated){
            verificationMessage.innerHTML = "An error occurred. Please try again.";
            return false;
        }

        verificationMessage.innerHTML = "Sending verification code!";
        showInputFormForVerification();

      return false;
    };
  
    var enterNewVerificationCode = async (event) => {
        event.preventDefault();

        //Verify verification code 
        const verificationCodeInput = document.getElementById('vc-input').value;
        const isValidated = await validateCode(username, verificationCodeInput);
        console.log("user is verified: ", isValidated);

        if(!isValidated){
            //Add message in ui
            console.log("verification code was not correct.");
            return false;
        }
        
        showInputFormForNewPassword();
    };

    var enterNewPassword = async (event) => {
        event.preventDefault();

        var verificationMessage = document.getElementById('verification-message').value;
        const password1 = document.getElementById('password-input1').value;
        const password2 = document.getElementById('password-input2').value;

        if(password1 != password2){
            verificationMessage.innerHTML = "Passwords do not match. Please try again.";
            return false;
        }

        //UPDATE DB WITH NEW PW

    };

    return {
      forgotPassword,
      enterNewVerificationCode,
      enterNewPassword,
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

    //Returns boolean of email sent success/failure
    function sendEmail(email, fullName, username, verificationCode, emailjs){
        console.log("Attempting to send verification code");
    
        console.log("verification code: ", verificationCode);
        const params = {
            userEmail: email,
            userFullName: fullName,
            username: username,
            verificationCode: verificationCode,
        }
    
        //need to get this out of the client
        const serviceID = "service_ms0318i";
        const templateID = "template_u9dl10r";
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

    async function getVerificationCode() {
        try {
            const response = await fetch(`http://${host}/api/v1/users/getVerificationCode`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            });
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const verificationCode = response.json();
            return verificationCode;
    
        } 
        catch (error) {
            console.error('Error fetching verification code:', error.message);
            throw error;
        }
    }

    async function putVerificationCodeInDB(username, verificationCode){
        try {
            const response = await fetch(`http://${host}/api/v1/users/resendVerificationCode`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    verificationCode: verificationCode,
                }),
            });
            if(!response.ok) {
                console.log('Cannot resend code');
                throw new Error('Cannot resend code');
            }
            const targetUser = await response.json();
            console.log('User code resent: ', targetUser);
            return true;
        } catch (error) {
            console.error('Error updating verification code:', error);
            return false;
        }
    }

    async function validateCode(username, verificationCodeInput){
        try {
            const response = await fetch(`http://${host}/api/v1/users/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    verificationCode: verificationCodeInput,
                }),
            });
    
            if(!response.ok) {
                const errorData = await response.json();
                console.error('Error verifying user:', errorData.error);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const verifiedUserData = await response.json();
            console.log('User verified:', verifiedUserData);
            return true;
    
        } catch(error) {
            console.error('Error verifying user:', error.message);
            return false;
        }
    }

    function showInputFormForVerification(){
        const enterEmailDiv = document.getElementById('reset-enter-email');
        const verificationCodeDiv = document.getElementById('password-reset-code');
        enterEmailDiv.style.display = 'none';
        verificationCodeDiv.style.display = 'block';
    }

    function showInputFormForNewPassword(){
        const verificationCodeDiv = document.getElementById('password-reset-code');
        const newPasswordDiv = document.getElementById('reset-password');
        verificationCodeDiv.style.display = 'none';
        newPasswordDiv.style.display = 'block';
    }




  })();
  