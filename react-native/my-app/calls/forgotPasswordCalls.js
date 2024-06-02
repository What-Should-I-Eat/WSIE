import { Alert } from "react-native";
import { getVerificationCode, sendEmailForNewCode } from "./verificationCodeCalls";
import { hostForAppCalls } from "./hostCallConst";
import emailjs from '@emailjs/react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

var username;

const onEnteredEmailForForgotPassword = async (textEmail, setIsEmailEntryVisible, setIsCodeEntryVisible) => {

    const inputError = 'Input Error';
    if (textEmail.trim() === '') {
        Alert.alert(inputError, "Email cannot be left empty.");
        return false;
    } else {
        const forgotCredentialsData = await getUserCredentials(textEmail);
        console.log("Here's our data", forgotCredentialsData);

        if(forgotCredentialsData.error){
            Alert.alert('Unknown Email', "Email was not found within our database.");
            return false;
        }
        username = forgotCredentialsData.username;
        const verificationCode = await getVerificationCode();
        sendEmailForNewCode(forgotCredentialsData.fullName, forgotCredentialsData.email, verificationCode, emailjs);

        const verificationCodeIsUpdated = await putVerificationCodeInDB(forgotCredentialsData.username, verificationCode);

        if(!verificationCodeIsUpdated){
            Alert.alert('Error', "Sorry, an error occurred. Please try again.");            
            return false;
        }

        Alert.alert("Verification Code Sent", "Please check your email for your new verification code.\nCodes expire after 10 minutes.");  

        setIsEmailEntryVisible(false);
        setIsCodeEntryVisible(true);
  }
}

async function getUserCredentials(email) {
    console.log('Getting credentials for: ', email);
    let userInfo;
    try {
      const response = await fetch(`${hostForAppCalls}/api/v1/users/requestInfoForPasswordReset?email=${email}`, {
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

async function putVerificationCodeInDB(username, verificationCode){
    try {
        const response = await fetch(`${hostForAppCalls}/api/v1/users/resendVerificationCode`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                verificationCode: verificationCode,
            }),
        });
        if(response.status != 200) {
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

const onEnteredCodeForForgotPassword = async (textVerificationCode, setIsCodeEntryVisible, setIsPasswordEntryVisible) => {

    const isValidated = await validateCode(username, textVerificationCode);
    console.log("user is verified: ", isValidated);

    if(!isValidated){
        Alert.alert('Verification Error', 'Could not verify user.\nPlease check code is entered correctly');
        return false;
    } else{
        setIsCodeEntryVisible(false);
        setIsPasswordEntryVisible(true);
    }
};

async function validateCode(username, verificationCodeInput){
    try {
        const response = await fetch(`${hostForAppCalls}/api/v1/users/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                verificationCode: verificationCodeInput,
            }),
        });

        if(response.status != 200) {
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

const onEnteredNewPasswords = async (textPasswordOne, textPasswordTwo, navigation) => {

    if(arePasswordsValid(textPasswordOne, textPasswordTwo)){

        try {
            const response = await fetch(`${hostForAppCalls}/api/v1/users/changePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: textPasswordOne,
                }),
            });
    
            if (response.status != 200) {
                const errorData = await response.json();
                console.error('Error changing password:', errorData.error);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const updatedPasswordData = await response.json();
            console.log('Password changed:', updatedPasswordData);
            Alert.alert('Success', "You have successfully changed your password. Please proceed to the login page.")
            navigation.navigate("LoginScreen");

        } catch (error) {
            console.error('Error changing password:', error.message);
            Alert.alert('Error Changing Password', 'Sorry, there was a problem changing your password. Please try again later.');
        }
    }
};

function arePasswordsValid(textPasswordOne, textPasswordTwo){
    const newPasswordError = 'Password Error';
    if(textPasswordOne.trim() === '' || textPasswordTwo.trim() === '') {
        Alert.alert(newPasswordError, "Input fields cannot be left empty");
        return false;
    } 

    if(textPasswordOne.trim().length > 15 || textPasswordOne.trim().length < 8){
        Alert.alert(newPasswordError, "Password must be between 8 and 15 characters.");
        return false;
    }

    var hasNumber = /\d/;
    var hasCapitalLetter = /[A-Z]/;
    var hasLowercaseLetter = /[a-z]/;
    
    if(!hasNumber.test(textPasswordOne)){
        Alert.alert(newPasswordError, "Password must contain at least one number.");
        return false;
    }     
    if(!hasCapitalLetter.test(textPasswordOne)){
        Alert.alert(newPasswordError, "Password must contain at least one capital letter.");
        return false;
    } 
    if(!hasLowercaseLetter.test(textPasswordOne)){
        Alert.alert(newPasswordError, "Password must contain at least one lowercase letter.");
        return false;
    } 
    if(textPasswordOne != textPasswordTwo){
        Alert.alert(newPasswordError, "Passwords must match.");
        return false;
    } 
    return true;
}


export{ onEnteredEmailForForgotPassword, onEnteredCodeForForgotPassword, onEnteredNewPasswords };