import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { onNewUserCalls } from '../calls/newUserCalls';

export default function NewUserScreen({ navigation }) {

    const [textUsername, setUsernameText] = useState('');
    const [textRealName, setRealNameText] = useState('');
    const [textEmail, setEmailText] = useState('');
    const [textPasswordOne, setPasswordOneText] = useState('');
    const [textPasswordTwo, setPasswordTwoText] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
        <ScrollView>
        <View style={newUserStyles.container}>
            {/* <Text style={newUserStyles.title}>
                Welcome to {'\n'}What Should I Eat?
            </Text> */}
            <Text style={newUserStyles.instructions}>
               Please sign up below
            </Text>
            <Text style={newUserStyles.inputLabel}>
              Desired Username:
            </Text>
            <TextInput
                style={newUserStyles.loginBox}
                placeholder="Username"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setUsernameText(value)}
                defaultValue={textUsername}
            />
            <Text style={newUserStyles.inputLabel}>
              Real Name:
            </Text>
            <TextInput
                style={newUserStyles.loginBox}
                placeholder="John Smith"
                placeholderTextColor={"#8c8c8c"}
                onChangeText={value => setRealNameText(value)}
                defaultValue={textRealName}
            />
            <Text style={newUserStyles.inputLabel}>
              Email Address:
            </Text>
            <TextInput
                style={newUserStyles.loginBox}
                placeholder="hello@gmail.com"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setEmailText(value)}
                defaultValue={textEmail}
            />
            <Text style={newUserStyles.inputLabel}>
              Enter Password:
            </Text>
            <View style={newUserStyles.passwordOneBox}>
              <TextInput
                  style={newUserStyles.loginBox}
                  placeholder="Password1"
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
                style={newUserStyles.icon} 
                onPress={togglePasswordVisibility} 
              />
            </View>
            <Text style={newUserStyles.inputLabel}>
              Confirm Password:
            </Text>
            <View style={newUserStyles.passwordTwoBox}>
              <TextInput
                  style={newUserStyles.loginBox}
                  placeholder="Password1"
                  placeholderTextColor={"#8c8c8c"}
                  autoCapitalize="none"
                  secureTextEntry={!passwordVisible}
                  onChangeText={value => setPasswordTwoText(value)}
                  defaultValue={textPasswordTwo}
              />
              <MaterialCommunityIcons 
                name={passwordVisible ? 'eye-off' : 'eye'} 
                size={24} 
                color="#aaa"
                style={newUserStyles.icon} 
                onPress={togglePasswordVisibility} 
              />
            </View>
            <Pressable style={newUserStyles.submitButton} 
                onPress={() => onNewUserCalls(textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo, navigation)}
            >
              <Text style={newUserStyles.buttonText}>Submit</Text>
            </Pressable>
      </View>
      </ScrollView>
    );
  }
  const newUserStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 70,
        margin: 20,     
        backgroundColor: '#0000ff' 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    buttonTextSmall:{
        fontSize: 30,
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
      height: 60,
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        margin: 1,
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 30,
        marginBottom: 20,
        textAlign: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 15,
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