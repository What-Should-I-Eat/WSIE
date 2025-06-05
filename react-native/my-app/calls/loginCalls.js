import { Alert } from "react-native";
import { onResendCode } from "./verificationCodeCalls";
import * as CONST from "../calls/constants.js";

var loggedInUser = 'default';
var requestLogin = true;

const onLogin = (textUsername, textPassword, navigation) => {

    if(areInputsFilledIn(textUsername, textPassword)){
        const userLoginRequest = {
            username: textUsername,
            password: textPassword
        };
        fetch(`${CONST.HOST}/api/v1/users/find-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userLoginRequest),
        })
        .then(async response => {
          const loginError = 'Login Error';
          console.log(response.status);
          if(response.status == 450){
            Alert.alert(loginError, "Account is not yet verified.");
            onResendCode(textUsername);
            navigation.navigate("VerificationCodeScreen",  {
              user: textUsername
            });          
            return false;
          } else if(response.status == 453){
            Alert.alert(loginError, "Sorry, you've attempted at least 10 incorrect password attempts in a row. Please reset your password to login.");
            return false;
          } else if(response.status == 452){
            Alert.alert(loginError, "Sorry, you've attempted 5 incorrect passwords in a row\nFor security reasons, your account is locked for 10 minutes unless you reset your password.");
            return false;
          } else if (response.status !== 200) {
            Alert.alert(loginError, "Unable to verify login credentials.\nUsername or password is incorrect.");
            return false;
          } 
          return response.json();
        })
        .then(data => {
          if(data){
            console.log("DATA = ", data);
            console.log(data.username);
            loggedInUser = data.username;
            requestLogin = false;
            navigation.navigate("WelcomeScreen", {
                username: data.username
            });
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
      });
    }
}

const onGuestLogin = (navigation) => {
    loggedInUser = 'guest';
    requestLogin = false;
    navigation.navigate("WelcomeScreen", {
        username: 'guest',
    });
}

const onLogout = () => {
    loggedInUser = 'default';
    requestLogin = true;
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
export{ onLogin, onGuestLogin, onLogout, loggedInUser, requestLogin };