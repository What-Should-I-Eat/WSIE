import { Alert } from "react-native";
import { getVerificationCode } from "./verificationCodeCalls";
import { hostForAppCalls } from "./hostCallConst";
import { sendEmailForNewCode } from "./verificationCodeCalls";
import emailjs from '@emailjs/react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const onNewUserCalls = async (textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo, navigation) => {

    if(areInputsAllValid(textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo)){
        const verificationCode = await getVerificationCode();
        console.log(verificationCode);
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
          sendEmailForNewCode(textRealName, textEmail, verificationCode, emailjs);
    
          fetch(`${hostForAppCalls}/api/v1/users/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
          })
            .then(response => {
              if(response.status == 444){
                throw new Error('User already exists');
              } else if(response.status == 445){
                throw new Error('Email already exists');
              }
              return response.json();
            })
            .then(savedUser => {
              console.log('User created: ', savedUser);
              userId = savedUser._id;
              console.log(userId);

              Alert.alert("Account Successfully Created", "You have successfully created a WSIE profile.\nTo verify your account, please enter the 6 digit code from your email below.\nCode expires in 10 minutes")

              navigation.navigate("VerificationCodeScreen");
            })
            .catch(error => {
                console.error('Fetch error:', error);
                const accountCreationError = 'Account Creation Error';

                if(error == 'Error: User already exists'){
                    Alert.alert(accountCreationError, 'Username already exists in database.');
                } else if(error == 'Error: Email already exists'){
                    Alert.alert(accountCreationError, 'Email already exists in database.');
                } else{
                    Alert.alert(accountCreationError, 'There was an issue creating your account, please try again later.');
                }
            });
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