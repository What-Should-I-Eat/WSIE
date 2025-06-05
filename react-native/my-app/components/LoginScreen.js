import React, {useState} from 'react';
import { SafeAreaView, Pressable, Text, TextInput, View, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {requestLogin, loggedInUser, onLogin, onGuestLogin} from '../calls/loginCalls';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";
import NewUserScreen from "./NewUserScreen";

export default function LoginScreen({ navigation }) {

    const [textUsername, setUsernameText] = useState('');
    const [textPassword, setPasswordText] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
      <SafeAreaView style={loginStyles.container}>
      <ScrollView>
        <View style={loginStyles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
              source={require('../assets/logo-icon.png')}
              style={loginStyles.images}
            />
            <Text style={loginStyles.headerTitle}>
              What Should I Eat?
            </Text>
          </View>
            <Text style={loginStyles.inputLabel}>
              Username:
            </Text>
            <TextInput
                style={loginStyles.loginBox}
                placeholder="Username"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setUsernameText(value)}
                defaultValue={textUsername}
            />
            <Text style={loginStyles.inputLabel}>
              Password:
            </Text>
            <View style={loginStyles.passwordInputContainer}>
              <TextInput
                  style={loginStyles.loginBox}
                  placeholder="Password1"
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
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
            <View style={loginStyles.buttonRow}>
                <Pressable style={({ pressed }) =>[
                    {
                        backgroundColor: pressed ? blueClicked : '#4567b7',
                    },
                    loginStyles.loginButton]}
                           onPress={() => onLogin(textUsername, textPassword, navigation)}
                >
                    <Text style={loginStyles.buttonText}>Login</Text>
                </Pressable>

                <Pressable style={({ pressed }) =>[
                    {
                        backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                    },
                    loginStyles.newUserButton]}
                           onPress={() => navigation.navigate("NewUserScreen")}
                >
                    <Text style={loginStyles.buttonText}>Sign Up</Text>
                </Pressable>
            </View>

            <Pressable style={({ pressed }) =>[
                {
                    backgroundColor: pressed ? blueClicked : '#E74C3C',
                },
                loginStyles.forgotPasswordButton]}
                       onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
                <Text style={loginStyles.buttonTextSmall}>Forgot Password</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? blueClicked : '#56B3FA',
                    },
                    loginStyles.guestButton
                ]}
                onPress={() => onGuestLogin(navigation)}
            >
                <Text style={loginStyles.buttonText}>Continue as Guest</Text>
            </Pressable>
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
    },
    icon: {
      marginLeft: -45,
      marginRight: 10
    },
    images: {
      width: 75,
      height: 75,
      resizeMode: 'contain',
      marginVertical: 10,
    },
    loginButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 140,
        height: 66,
        marginBottom: 20,
    },
    forgotPasswordButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 290,
        height: 66,
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
      borderRadius: 8,
      elevation: 3,
      width: 140,
      height: 66,
      borderWidth: 1,
  },
    buttonText:{
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    },
    buttonTextSmall:{
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    },
    loginBox: {
      padding: 18,
      margin: 10,
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
        marginTop: 10,
        marginBottom: 5,
    },
      guestButton: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          elevation: 3,
          borderWidth: 1,
          width: 290,
          height: 66,
          marginTop: 15,
      },
      buttonRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 290,
          marginTop: 20,
      },
    headerTitle: {
        fontSize: 32,
        fontWeight: '600',
        width: 300,
        marginLeft: -10,
        textAlign: 'center'
    }
  }
);