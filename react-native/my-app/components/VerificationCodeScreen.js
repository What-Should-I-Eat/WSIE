import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';
import { onResendCode, onVerifyUser } from '../calls/verificationCodeCalls';

export default function VerificationCodeScreen({ navigation }) {

    const [textUsername, setUsernameText] = useState('');
    const [textVerificationCode, setVerificationCodeText] = useState('');

    return (
      <ScrollView>
        <View style={verificationCodeStyles.container}>
            <Text style={verificationCodeStyles.instructions}>
              Please proceed to verify your WSIE account below
            </Text>
            <Text style={verificationCodeStyles.inputLabel}>
              Account username:
            </Text>
            <TextInput
                  style={verificationCodeStyles.loginBox}
                  placeholder="mydiet45"
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  onChangeText={value => setUsernameText(value)}
                  defaultValue={textUsername}
            />
            <Text style={verificationCodeStyles.inputLabel}>
              Verification code:
            </Text>
            <TextInput
                style={verificationCodeStyles.loginBox}
                placeholder="123456"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setVerificationCodeText(value)}
                defaultValue={textVerificationCode}
            />
            <Pressable style={verificationCodeStyles.submitCodeButton} 
                onPress={() => onVerifyUser(textUsername, textVerificationCode, navigation)}
            >
              <Text style={verificationCodeStyles.buttonTextSmall}>Verify Account</Text>
            </Pressable>
            <Pressable style={verificationCodeStyles.resendCodeButton} 
              onPress={() => onResendCode(textUsername)}
            >
              <Text style={verificationCodeStyles.buttonTextSmall}>Resend Code</Text>
            </Pressable>
        </View>
      </ScrollView>

    );
  }
  const verificationCodeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    icon: {
      marginLeft: -40,
    },
    submitCodeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 10,
        marginTop: 20,   
        backgroundColor: '#3cb04c' 
    },
    resendCodeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 10, 
        backgroundColor: '#ff0000' 
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -10,
    },
    newUserButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      elevation: 3,
      width: 300,
      height: 100,
      margin: 10,     
      backgroundColor: '#0000ff' 
  },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    buttonTextSmall:{
        fontSize: 34,
        fontWeight: '500',
        color: '#ffffff'
    },
    loginBox: {
      padding: 18,
      margin: 10,
      position: 'relative',
      top: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 300,
      height: 70,
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        margin: 10,
        marginTop: 20
    },
    instructions: {
        fontSize: 35,
        fontWeight: '600',
        width: 350,
        marginTop: 40,
        marginBottom: 20,
        textAlign: 'center'
    }
  }
);