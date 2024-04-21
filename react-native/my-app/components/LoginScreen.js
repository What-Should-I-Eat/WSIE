import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { onLogin } from '../calls/loginCalls';

export default function LoginScreen({ navigation }) {

    const [textUsername, setUsernameText] = useState('');
    const [textPassword, setPasswordText] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const resetStates = () => {
      setUsernameText('');
      setPasswordText('');
    };

    return (
      <ScrollView>

        <View style={loginStyles.container}>
            <Text style={loginStyles.instructions}>
              Please proceed to the WSIE login below
            </Text>
            <Text style={loginStyles.inputLabel}>
              Enter Username:
            </Text>
            <TextInput
                style={loginStyles.loginBox}
                placeholder="Username"
                placeholderTextColor={"#8c8c8c"}
                onChangeText={value => setUsernameText(value)}
                defaultValue={textUsername}
            />
            <Text style={loginStyles.inputLabel}>
              Enter Password:
            </Text>
            <View style={loginStyles.passwordInputContainer}>
              <TextInput
                  style={loginStyles.loginBox}
                  placeholder="Password1"
                  placeholderTextColor={"#8c8c8c"}
                  secureTextEntry={!passwordVisible}
                  onChangeText={value => setPasswordText(value)}
                  defaultValue={textPassword}
              />
              <MaterialCommunityIcons 
                name={passwordVisible ? 'eye-off' : 'eye'} 
                size={24} 
                color="#aaa"
                style={loginStyles.icon} 
                onPress={togglePasswordVisibility} 
              />
              </View>
            <Pressable style={loginStyles.loginButton} 
                onPress={() => onLogin(textUsername, setUsernameText, textPassword, setPasswordText, navigation)}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={loginStyles.forgotPasswordButton} 
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={loginStyles.buttonTextSmall}>Forgot Password</Text>
            </Pressable>
            <Pressable style={loginStyles.newUserButton} 
              onPress={() => navigation.navigate("NewUserScreen")}
              >
              <Text style={loginStyles.buttonText}>New User</Text>
            </Pressable>
      </View>
      </ScrollView>

    );
  }
  const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    icon: {
      marginLeft: -40,
    },
    loginButton: {
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
    forgotPasswordButton: {
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