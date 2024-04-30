import { Alert } from "react-native";
import { hostForAppCalls } from "./hostCallConst";
import emailjs from '@emailjs/react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const onVerifyUser = (textUsername, textVerificationCode, navigation) => {

    if(areInputsFilledIn(textUsername, textVerificationCode)){
    fetch(`${hostForAppCalls}/api/v1/users/verify`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: textUsername,            
            verificationCode: textVerificationCode
        }),
    })
    .then(response => {
    if(response.status == 437){
      throw new Error('Code has expired');
    }else if(response.status != 200){
        throw new Error('Cannot verify user');
    }
    return response.json();
    })
    .then(verifiedUser => {
        console.log('User verified: ', verifiedUser);
        Alert.alert("Account Verified", "You have successfully verified your WSIE profile!\nPlease continue to the Login page!");
        navigation.navigate("LoginScreen");
    })
    .catch(error => {
        const verificationError = 'Verification Error';
        if(error == 'Error: Code has expired'){
            Alert.alert(verificationError, 'Code has expired after 10 minutes.\nPlease click resend code for a new code.');
        } else{
            Alert.alert(verificationError, 'Could not verify user.\nPlease check code is entered correctly');
        }
    });
  } 
}

// const setUsernameFromFile = (inputtedUsername, setUsernameText) => {
//     setUsernameText(inputtedUsername);
// }

const onResendCode = async (textUsername) => {

    const inputError = 'Input Error';
    if (textUsername.trim() === '') {
        Alert.alert(inputError, "Username cannot be left empty.");
        return false;
    } else {

        const email = await getUserEmail(textUsername); 
        const newlyGeneratedVerificationCode = await getVerificationCode();
        console.log(newlyGeneratedVerificationCode);

        sendEmailForNewCode(textUsername, email, newlyGeneratedVerificationCode, emailjs);
        fetch(`${hostForAppCalls}/api/v1/users/resendVerificationCode`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: textUsername,            
                verificationCode: newlyGeneratedVerificationCode
            }),
        })
        .then(response => {
            if(response.status != 200){
            throw new Error('Could not resend code');
            }
            return response.json();
        })
        .then(targetUser => {
            console.log('User code resent to: ', targetUser);
            Alert.alert("Verification Code Sent", "Please check your email for your new verification code.\nCodes expire after 10 minutes.");
        })
        .catch(error => {
            console.error('Fetch error:', error);
            Alert.alert('Error Sending Code', 'Sorry, there was a problem sending the code. Please try again later.');
        });
    }
}

async function getVerificationCode() {
    try {
        const response = await fetch(`${hostForAppCalls}/api/v1/users/getVerificationCode`, {
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

function areInputsFilledIn(textUsername, textVerificationCode){
    const inputError = 'Input Error';
    if (textUsername.trim() === '') {
        Alert.alert(inputError, "Username cannot be left empty.");
        return false;
    } else if (textVerificationCode.trim() === '') {
        Alert.alert(inputError, "Verification Code cannot be left empty.");
        return false;
    }
    return true;
}

async function getUserEmail(username){
    const email = await fetch(`${hostForAppCalls}/api/v1/users/getUserEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,            
        }),
      })
        .then(response => {
          if(response.status != 200){
            throw new Error('Cannot find user');
          }
          return response.json();
        }).then(user => {
            return user.email;
        })
        .catch(error => {
          console.error('Fetch error:', error);
          Alert.alert('Error Sending Code', 'Sorry, there was a problem sending the code. Please try again later.');
        });
    return email;
}

function sendEmailForNewCode(fullName, email, verificationCode, emailjs){
    console.log("Attempting to send verification code");

    console.log("verification code: ", verificationCode);
    const params = {
        userEmail: email,
        userFullName: fullName,
        verificationCode: verificationCode,
    }

    //need to get this out of the client
    const serviceID = "service_ms0318i";
    const templateID = "template_7av6tqc";
    const publicKey = "8nKeoQjoIWF1wyUpG";

    emailjs.send(serviceID, templateID, params, {publicKey: '8nKeoQjoIWF1wyUpG'})
        .then(function(response) {
            console.log('SUCCESS: email sent', response.status, response.text);
            return true;
        }, function(error) {
            console.log('FAILED: email could not be sent', error, error.status);
        });

    return false;
  }
function sendEmail(fullName, email, verificationCode, emailjs, template, username){

    // these are the alternate parameters if we run out of emails we can send
    // if(template === "newuser"){
    //   templateID = "template_lfefu0m";
    // }
    // else if(template === "forgotpassword"){
    //   templateID = "template_zekzics";
    // }

    // const serviceID = "service_6ivuvhw";
    // const publicKey = "YaAzvO7B3lldSIpqe"; // 1
    // const publicKey = "8nKeoQjoIWF1wyUpG"; // 2

    // emailjs.send(serviceID, templateID, params, {publicKey: 'YaAzvO7B3lldSIpqe'})

    var templateID;
        if(template === "newuser"){
          templateID = "template_7av6tqc";
        }
        else if(template === "forgotpassword"){
          templateID = "template_zekzics";
        }

        console.log("Attempting to send verification code with template ", template);
  
        console.log("verification code: ", verificationCode);
        const params = {
          userEmail: email,
          username: username,
          userFullName: fullName,
          verificationCode: verificationCode,
        }
  
        console.log("email params: ", params);
        console.log("Type of fullName: ", typeof fullName);
        console.log("Type of verificationCode: ", typeof verificationCode);
        console.log("Type of userEmail: ", typeof email);
        console.log("Type of username: ", typeof username);

        const serviceID = "service_6ivuvhw";
        const publicKey = "YaAzvO7B3lldSIpqe";
  
        emailjs.send(serviceID, templateID, params, {publicKey: 'YaAzvO7B3lldSIpqe'})
            .then(function(response) {
              console.log('SUCCESS: email sent', response.status, response.text);
              return true;
            }, function(error) {
              console.log('FAILED: email could not be sent', error);
            });
  
        return false;
  }

export{ onVerifyUser, onResendCode, getVerificationCode, sendEmail };