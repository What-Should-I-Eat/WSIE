import { Alert } from "react-native";

const onLogin = (textUsername, setUsernameText, textPassword, setPasswordText, navigation) => {

    if(areInputsFilledIn(textUsername, textPassword)){

        navigation.navigate("Home");

        const userLoginRequest = {
            userName: textUsername,
            password: textPassword
        };
    // }

        
          fetch(`http://localhost:8080/api/v1/users/find-username`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userLoginRequest),
          })
          .then(async response => {
            console.log("we are at the point of response. this is the response.status: ");
            console.log(response.status);
            // if(response.status == 450){
            //   const errorResponse = await response.json();
            //   throw new Error('User account is not verified');
            // } else if(response.status == 453){
            //   const errorResponse = await response.json();
            //   throw new Error('Must reset password');
            // } else if(response.status == 452){
            //   const errorResponse = await response.json();
            //   throw new Error('10 minute lockout');
            // } else if (response.status !== 200) {
            //   const errorResponse = await response.json();
            //   console.error('Error logging in:', errorResponse.error);
            //   throw new Error(errorResponse.error || 'Error logging in');
            // } else {
            //   return response.json();
            // }
            return response.json();
          })
          .then(data => {
            console.log("DATA = ", data);
            console.log(data.userName);
            // getProfilePageForThisUser(data.userName);
          })
          .catch(error => {
            console.error('Fetch error:', error);
            // if(error == 'Error: User account is not verified'){
            //   feedbackMessage.innerHTML = "Account is not yet verified.<br/>Please check your email and enter the 6 digit code below<br/>Code expires in 10 minutes";
            //   console.log("this is innerHTML: ", feedbackMessage.innerHTML);
            //   const verificationCodeDiv = document.getElementById('verificationCodeDiv');
            //   verificationCodeDiv.style.display = 'block';
            // } else if(error == 'Error: Must reset password'){
            //   feedbackMessage.innerHTML = "Sorry, you've attempted at least 10 incorrect password attempts in a row. Please reset your password to login.";
            // } else if(error == 'Error: 10 minute lockout'){
            //   feedbackMessage.innerHTML = "Sorry, you've attempted 5 incorrect passwords in a row<br/>For security reasons, your account is locked for 10 minutes unless you reset your password.";
            // } else{
            //   feedbackMessage.innerHTML = "Unable to verify login credentials.<br/>Username or password is incorrect.";
            // }
          });
        }

        // try {
        //     fetch("http://192.168.0.11:8080/api/v1/login", {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             username: textUsername
        //         }),
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //         }
        //     }).then(resp => resp.json())
        //         .then(data => {
        //             jwtToken = data.token;
        //             global.jwtToken = jwtToken;
        //             setUsernameText("");
        //         });
        //     Alert.alert('Success', 'User logged in.');
        // } catch (e) {
        //     console.log(e);
        //     console.log("--------------------------");
        // }

}

function areInputsFilledIn(textUsername, textPassword){
    const loginError = 'Login Error';
    if (textUsername.trim() === '') {
        Alert.alert(loginError, "Username cannot be left empty.");
        return false;
    } else if (textPassword.trim() === '') {
        Alert.alert(loginError, "Password cannot be left empty.");
        return false;
    }
    return true;

}
export{ onLogin };