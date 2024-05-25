import React, {useState} from 'react';
import { SafeAreaView, Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { onEnteredCodeForForgotPassword, onEnteredEmailForForgotPassword, onEnteredNewPasswords } from '../calls/forgotPasswordCalls';
import { appBackgroundColor, mainIndigoButtonBackground } from "../calls/colorConstants";

export default function ForgotPasswordScreen({ navigation }) {

    const [textEmail, setEmailText] = useState('');
    const [textVerificationCode, setVerificationCodeText] = useState('');
    const [textPasswordOne, setPasswordOneText] = useState('');
    const [textPasswordTwo, setPasswordTwoText] = useState('');

    const [isEmailEntryVisible, setIsEmailEntryVisible] = useState(true);
    const [isCodeEntryVisible, setIsCodeEntryVisible] = useState(false);
    const [isPasswordEntryVisible, setIsPasswordEntryVisible] = useState(false);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
      <SafeAreaView style={forgotPasswordStyles.container}>
        <ScrollView>
        <View style={forgotPasswordStyles.container}>

          {isEmailEntryVisible && <View style={forgotPasswordStyles.container}>
            <Text style={forgotPasswordStyles.instructions}>
                Please follow the directions below to reset your password.
              </Text>
              <Text style={forgotPasswordStyles.inputLabel}>
                Enter Account Email:
              </Text>
              <TextInput
                  style={forgotPasswordStyles.inputBox}
                  placeholder="hello@gmail.com"
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  onChangeText={value => setEmailText(value)}
                  defaultValue={textEmail}
              />
              <Pressable style={forgotPasswordStyles.submitButton} 
                  onPress={() => onEnteredEmailForForgotPassword(textEmail, setIsEmailEntryVisible, setIsCodeEntryVisible)}
              >
                <Text style={forgotPasswordStyles.buttonText}>Submit</Text>
              </Pressable>
            </View>  
          }

          {isCodeEntryVisible && <View style={forgotPasswordStyles.container}>
              <Text style={forgotPasswordStyles.inputLabel}>
                Enter Verification Code:
              </Text>
              <TextInput
                  style={forgotPasswordStyles.inputBox}
                  placeholder="123456"
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  onChangeText={value => setVerificationCodeText(value)}
                  defaultValue={textVerificationCode}
              />
              <Pressable style={forgotPasswordStyles.submitButton} 
                  onPress={() => onEnteredCodeForForgotPassword(textVerificationCode, setIsCodeEntryVisible, setIsPasswordEntryVisible)}
              >
                <Text style={forgotPasswordStyles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          }

          {isPasswordEntryVisible && <View style={forgotPasswordStyles.container}>
              <Text style={forgotPasswordStyles.inputLabel}>
                Enter New Password:
              </Text>
              <View style={forgotPasswordStyles.passwordOneBox}>
                <TextInput
                    style={forgotPasswordStyles.inputBox}
                    placeholder="pASswORd35"
                    placeholderTextColor={"#8c8c8c"}
                    autoCapitalize="none"
                    secureTextEntry={!passwordVisible}
                    onChangeText={value => setPasswordOneText(value)}
                    defaultValue={textPasswordOne}
                />
                <MaterialCommunityIcons 
                name={passwordVisible ? 'eye-off' : 'eye'} 
                size={24} 
                color="#aaa"
                style={forgotPasswordStyles.icon} 
                onPress={togglePasswordVisibility} 
              />
            </View>
              <Text style={forgotPasswordStyles.inputLabel}>
                Confirm Password:
              </Text>
              <View style={forgotPasswordStyles.passwordTwoBox}>
                <TextInput
                    style={forgotPasswordStyles.inputBox}
                    placeholder="pASswORd35"
                    placeholderTextColor={"#8c8c8c"}
                    autoCapitalize="none"
                    onChangeText={value => setPasswordTwoText(value)}
                    defaultValue={textPasswordTwo}
                />
                <MaterialCommunityIcons 
                name={passwordVisible ? 'eye-off' : 'eye'} 
                size={24} 
                color="#aaa"
                style={forgotPasswordStyles.icon} 
                onPress={togglePasswordVisibility} 
              />
            </View>
              <Pressable style={forgotPasswordStyles.submitButton} 
                  onPress={() => onEnteredNewPasswords(textPasswordOne, textPasswordTwo, navigation)}
              >
                <Text style={forgotPasswordStyles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          }
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const forgotPasswordStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 30,     
        backgroundColor: mainIndigoButtonBackground, 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    inputBox: {
      padding: 18,
      marginBottom: 10,
      marginTop: 5,
      position: 'relative',
      top: 0,
      borderWidth: 1,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 300,
      height: 90,
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 30
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 20,
        marginBottom: 15,
        textAlign: 'center'
    },
    passwordOneBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -10,
    },
    passwordTwoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -10,
    },
    icon: {
      marginLeft: -40,
    },
  }
);