import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function DietaryRestrictionsScreen({ navigation }) {

    return (
        <ScrollView>
        <View style={DietaryRestrictionsStyles.container}>
            <Text style={DietaryRestrictionsStyles.instructions}>
               Update dietary restrictions below:
            </Text>
            <Pressable style={DietaryRestrictionsStyles.updateButton} 
                // onPress={() => onLogin(textUsername, setUsernameText)}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Vegan</Text>
            </Pressable>
            <Pressable style={DietaryRestrictionsStyles.updateButton} 
                // onPress={() => onLogin(textUsername, setUsernameText)}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Low Fat</Text>
            </Pressable>
            <Pressable style={DietaryRestrictionsStyles.updateButton} 
                // onPress={() => onLogin(textUsername, setUsernameText)}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Gluton Free</Text>
            </Pressable>
      </View>
      </ScrollView>
    );
  }
  const DietaryRestrictionsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6faff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    updateButton: {
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
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 30,
        textAlign: 'center'
    },
  }
);