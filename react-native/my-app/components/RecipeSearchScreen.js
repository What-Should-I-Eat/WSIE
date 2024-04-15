import React, {useState} from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from 'react-native';

export default function RecipeSearchScreen({ navigation }) {

    const [textInput, setInputText] = useState('');

    return (
        <ScrollView>
        <View style={RecipeSearchStyles.container}>
            <Text style={RecipeSearchStyles.instructions}>
               Search for your favorite recipe below:
            </Text>
            <TextInput
                style={RecipeSearchStyles.inputBox}
                placeholder="chicken"
                placeholderTextColor={"#8c8c8c"}
                placeholderFon
                onChangeText={value => setInputText(value)}
                defaultValue={textInput}
            />
            <Pressable style={RecipeSearchStyles.searchButton} 
                // onPress={() => onLogin(textUsername, setUsernameText)}
            >
              <Text style={RecipeSearchStyles.buttonText}>Search</Text>
            </Pressable>
      </View>
      </ScrollView>
    );
  }
  const RecipeSearchStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 30,     
        backgroundColor: '#3cdfff' 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    inputBox: {
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
  }
);