import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";

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
      <SafeAreaView style={newUserStyles.container}>
        <ScrollView>
        <View style={newUserStyles.container}>
            <Text style={newUserStyles.instructions}>
               Please sign up below
            </Text>
            <Text style={newUserStyles.inputLabel}>
              Desired Username:
            </Text>
            <TextInput
                style={newUserStyles.inputBox}
                placeholder="iLoveFood45"
                placeholderTextColor={"#8c8c8c"}
                autoCapitalize="none"
                onChangeText={value => setUsernameText(value)}
                defaultValue={textUsername}
            />
            <Text style={newUserStyles.inputLabel}>
              Real Name:
            </Text>
            <TextInput
                style={newUserStyles.inputBox}
                placeholder="John Smith"
                placeholderTextColor={"#8c8c8c"}
                onChangeText={value => setRealNameText(value)}
                defaultValue={textRealName}
            />
            <Text style={newUserStyles.inputLabel}>
              Email Address:
            </Text>
            <TextInput
                style={newUserStyles.inputBox}
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
                  style={newUserStyles.inputBox}
                  placeholder="PasSWoRd1"
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
                  style={newUserStyles.inputBox}
                  placeholder="PasSWoRd1"
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
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
                },         
              newUserStyles.submitButton]} 
                onPress={() => onNewUserCalls(textUsername, textRealName, textEmail, textPasswordOne, textPasswordTwo, navigation)}
            >
              <Text style={newUserStyles.buttonText}>Submit</Text>
            </Pressable>
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const newUserStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        elevation: 3,
        width: 300,
        height: 80,
        margin: 20,     
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
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
      height: 65,
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        marginTop: 2,
        marginBottom: 1,
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 15,
        marginBottom: 20,
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
      marginBottom: 5,
    },
  }
);