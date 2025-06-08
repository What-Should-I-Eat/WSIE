import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { onResendCode, onVerifyUser } from '../calls/verificationCodeCalls';
import { appBackgroundColor, blueClicked } from "../calls/styleSheets";

export default function VerificationCodeScreen({ route, navigation }) {
    const [textUsername, setUsernameText] = useState(route.params.user);

    const [textVerificationCode, setVerificationCodeText] = useState('');

    return (
      <SafeAreaView style={verificationCodeStyles.container}>
      <ScrollView>
        <View style={verificationCodeStyles.container}>
            <Text style={verificationCodeStyles.instructions}>
              Please proceed to verify your WSIE account below
            </Text>
            <Text style={verificationCodeStyles.inputLabel}>
              Account username:
            </Text>
            <TextInput
                  style={verificationCodeStyles.inputBox}
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
                style={verificationCodeStyles.inputBox}
                placeholder="123456"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setVerificationCodeText(value)}
                defaultValue={textVerificationCode}
            />
            <Pressable  style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : '#155724',
                },
                verificationCodeStyles.submitCodeButton]} 
                onPress={() => onVerifyUser(textUsername, textVerificationCode, navigation)}
            >
              <Text style={verificationCodeStyles.buttonText}>Verify Account</Text>
            </Pressable>
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : '#ff0000',
                },
                verificationCodeStyles.resendCodeButton]} 
              onPress={() => onResendCode(textUsername)}
            >
              <Text style={verificationCodeStyles.buttonText}>Resend Code</Text>
            </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const verificationCodeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
    },
    icon: {
      marginLeft: -40,
    },
    submitCodeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 300,
        height: 100,
        margin: 10,
        marginTop: 30,   
    },
    resendCodeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 300,
        height: 100,
        margin: 10, 
    },
    buttonText:{
        fontSize: 38,
        fontWeight: '500',
        color: 'white'
    },
    inputBox: {
      padding: 18,
      marginTop: 5,
      marginBottom: 15,
      position: 'relative',
      top: 0,
      borderWidth: 1,
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
        marginBottom: 5,
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