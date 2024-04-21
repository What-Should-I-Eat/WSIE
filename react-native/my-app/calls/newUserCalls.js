import { Alert } from "react-native";

const onNewUserCalls = async (textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo) => {

    if(areInputsAllValid(textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo)){
        const verificationCode = await getVerificationCode();
        // Alert.alert('Success', "Success");
        const newUserData = {
            fullName: textRealName,
            userName: textUsername,
            password: textPasswordOne,
            email: textEmail,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };
    
          fetch(`http:localhost:8080/api/v1/users/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
          })
            .then(response => {
            //   if(response.status == 444){
            //     console.log('444 sent');
            //     feedbackMessage.innerHTML = 'Username already exists in database.';
            //     throw new Error('User already exists');
            //   } else if(response.status == 445){
            //     console.log('445 sent');
            //     feedbackMessage.innerHTML = 'Email already exists in database.';
            //     throw new Error('Email already exists');
            //   } else if(response.status == 500){
            //     console.log('500 sent');
            //     feedbackMessage.innerHTML = 'Sorry, there\'s a problem on our end. Please try again later.';
            //     throw new Error('Server error.');
            //   } else if(response.status == 400){
            //     console.log('400 sent');
            //     feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            //     throw new Error('Bad Request.');
            //   } else if(response.status == 401){
            //     console.log('401 sent');
            //     feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            //     throw new Error('Unauthorized.');
            //   } else if(response.status == 404){
            //     console.log('404 sent');
            //     feedbackMessage.innerHTML = 'Sorry, it looks like there\'s a problem on your end. Please try again later.';
            //     throw new Error('Not found.');
            //   } else if(response.status == 408){
            //     console.log('408 sent');
            //     feedbackMessage.innerHTML = 'Sorry, the request timed out. Please try again later.';
            //     throw new Error('Request timeout error.');
            //   } else if(response.status == 429){
            //     console.log('429 sent');
            //     feedbackMessage.innerHTML = 'Sorry, it looks like you have made too many requests. Please try again later.';
            //     throw new Error('Too many requests.');
            //   }else if (response.status != 200) {
            //     throw new Error('Error adding new user');
            //   }
    
              return response.json();
            })
            .then(savedUser => {
              console.log('User created: ', savedUser);
              userId = savedUser._id;
              console.log(userId);
      
              // After creating the user, handle UI changes
            //   const loginSuccess = "You have successfully created a WSIE profile.<br>To verify your account, please enter the 6 digit code from your email below.<br/>Code expires in 10 minutes";
            //   feedbackMessage.innerHTML = loginSuccess;
            //   const verificationCodeDiv = document.getElementById('verificationCodeDiv');
            //   verificationCodeDiv.style.display = 'block';
            //   passwordRequirement.style.display = 'none';
            })
            .catch(error => {
              console.error('Fetch error:', error);
            });


    }
}

async function getVerificationCode() {
  try {
      const response = await fetch(`http:localhost:8080/api/v1/users/getVerificationCode`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      });
      if (response.status != 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const verificationCode = response.json();
      console.log("Verification code response from server: ", verificationCode);
      return verificationCode;
  } 
  catch (error) {
      console.error('Error fetching verification code:', error.message);
      throw error;
  }
}

function areInputsAllValid(textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo){
    const newUserError = 'New User Error';
    if(textUsername.trim() === '' || textRealName.trim() === '' || textEmail.trim() === '' || textPasswordOne.trim() === '' || textPasswordTwo.trim() === '') {
        Alert.alert(newUserError, "Input fields cannot be left empty");
        return false;
    } 

    var alphaNumberic = /^[0-9a-z]+$/i;
    if(!textUsername.match(alphaNumberic)){
        Alert.alert(newUserError, "Username must be only alpha-numeric.");
        return false;
    }

    if(textUsername.trim().length > 15 || textUsername.trim().length < 4){
        Alert.alert(newUserError, "Username must be between 4 and 15 characters.");
        return false;
    }

    var validEmailFormat = /\S+@\S+\.\S+/;
    if(!validEmailFormat.test(textEmail)){
        Alert.alert(newUserError, "Please enter a valid email address.");
        return false;
    }

    if(textPasswordOne.trim().length > 15 || textPasswordOne.trim().length < 8){
        Alert.alert(newUserError, "Password must be between 8 and 15 characters.");
        return false;
    }

    var hasNumber = /\d/;
    var hasCapitalLetter = /[A-Z]/;
    var hasLowercaseLetter = /[a-z]/;
    
    if(!hasNumber.test(textPasswordOne)){
        Alert.alert(newUserError, "Password must contain at least one number.");
        return false;
    }     
    if(!hasCapitalLetter.test(textPasswordOne)){
        Alert.alert(newUserError, "Password must contain at least one capital letter.");
        return false;
    } 
    if(!hasLowercaseLetter.test(textPasswordOne)){
        Alert.alert(newUserError, "Password must contain at least one lowercase letter.");
        return false;
    } 

    if(textPasswordOne != textPasswordTwo){
        Alert.alert(newUserError, "Passwords must match.");
        return false;
    } 

    return true;
}


export{ onNewUserCalls };