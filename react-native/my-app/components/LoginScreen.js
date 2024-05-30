import React, {useState} from 'react';
import { SafeAreaView, Pressable, Text, TextInput, View, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { onLogin } from '../calls/loginCalls';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";

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
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : '#155724',
                },
                loginStyles.loginButton]} 
                onPress={() => onLogin(textUsername, textPassword, navigation)}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : '#ff0000',
                },
                loginStyles.forgotPasswordButton]} 
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={loginStyles.buttonTextSmall}>Forgot Password</Text>
            </Pressable>
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                },
                loginStyles.newUserButton]} 
              onPress={() => navigation.navigate("NewUserScreen")}
              >
              <Text style={loginStyles.buttonText}>
              Sign Up</Text>
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
      marginLeft: -40,
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
        width: 300,
        height: 100,
        margin: 10,
        marginTop: 30,   
    },
    forgotPasswordButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 1,
        width: 300,
        height: 100,
        margin: 10, 
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
      width: 300,
      height: 100,
      margin: 10,
      borderWidth: 1,
  },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: 'white'
    },
    buttonTextSmall:{
        fontSize: 34,
        fontWeight: '700',
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
    headerTitle: {
        fontSize: 32,
        fontWeight: '600',
        width: 300,
        marginLeft: -10,
        textAlign: 'center'
    }
  }
);