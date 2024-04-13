import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {

    const [textEmail, setEmailText] = useState('');

    return (
        <ScrollView>
        <View style={forgotPasswordStyles.container}>
            <Text style={forgotPasswordStyles.instructions}>
               Please follow the directions below to reset your password.
            </Text>
            <Text style={forgotPasswordStyles.inputLabel}>
              Enter Account Email:
            </Text>
            <TextInput
                style={forgotPasswordStyles.loginBox}
                placeholder="hello@gmail.com"
                placeholderTextColor={"#8c8c8c"}
                placeholderFon
                onChangeText={value => setEmailText(value)}
                defaultValue={textEmail}
            />
            <Pressable style={forgotPasswordStyles.loginButton} 
                // onPress={() => onLogin(textUsername, setUsernameText)}
            >
              <Text style={forgotPasswordStyles.buttonText}>Submit</Text>
            </Pressable>
      </View>
      </ScrollView>
    );
  }
  const forgotPasswordStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    loginButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 30,     
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
      height: 90,
      fontSize: 30,
      borderRadius: 5,
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        margin: 10,
        marginTop: 30
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 30,
        textAlign: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 30,
        textAlign: 'center'
    }
  }
);