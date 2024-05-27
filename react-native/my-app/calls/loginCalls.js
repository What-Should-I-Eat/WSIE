import { Alert } from "react-native";
import { onResendCode } from "./verificationCodeCalls";
import { hostForAppCalls } from "./hostCallConst";
import emailjs from '@emailjs/react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

var loggedInUser = 'default';

const onLogin = (textUsername, textPassword, navigation) => {

    if(areInputsFilledIn(textUsername, textPassword)){
        const userLoginRequest = {
            userName: textUsername,
            password: textPassword
        };
        fetch(`${hostForAppCalls}/api/v1/users/find-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userLoginRequest),
        })
        .then(async response => {
          if(response.status == 450){
            throw new Error('User account is not verified');
          } else if(response.status == 453){
            throw new Error('Must reset password');
          } else if(response.status == 452){
            throw new Error('10 minute lockout');
          } else if (response.status !== 200) {
            throw new Error(response.error || 'Error logging in');
          } 
          return response.json();
        })
        .then(data => {
          console.log("DATA = ", data);
          console.log(data.userName);
          loggedInUser = data.userName;
          navigation.navigate("Home");
        })
        .catch(error => {
          const loginError = 'Login Error';
          console.error('Fetch error:', error);
          if(error == 'Error: User account is not verified'){
            Alert.alert(loginError, "Account is not yet verified.");
            onResendCode(textUsername);
            navigation.navigate("VerificationCodeScreen");
          } else if(error == 'Error: Must reset password'){
            Alert.alert(loginError, "Sorry, you've attempted at least 10 incorrect password attempts in a row. Please reset your password to login.");
            navigation.navigate("ForgotPasswordScreen");
          } else if(error == 'Error: 10 minute lockout'){
            Alert.alert(loginError, "Sorry, you've attempted 5 incorrect passwords in a row\nFor security reasons, your account is locked for 10 minutes unless you reset your password.");
          } else{
            Alert.alert(loginError, "Unable to verify login credentials.\nUsername or password is incorrect.");
          }
      });
    }
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
export{ onLogin, loggedInUser };