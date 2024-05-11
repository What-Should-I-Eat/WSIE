import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';
import { MultiSelectListDiet, selectedDietArray } from './DietaryRestrictionsList';
import { sendDietData } from '../calls/dietHealthCalls';

export default function DietsScreen({ navigation }) {

  const diets = ['Low Carb', 'Low Fat', 'Low Sodium', 'Balanced', 'High Fiber', 'High Protein', 'Vegan', 'Vegetarian', 'Paleo', 'Keto', 'Kosher', 'Halal', 'Pescatarian', 'Red Meat Free', 'Low FODMAP'];

    return (
        <View style={DietsStyles.container}>
            <Text style={DietsStyles.instructions}>
               Select diet options below:
            </Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MultiSelectListDiet data={diets} />
            </View>
            <Pressable style={DietsStyles.updateButton}
              onPress={() => sendDietData(selectedDietArray)}
            >
              <Text style={DietsStyles.buttonText}>Update Diets</Text>
            </Pressable>
      </View>
    );
  }
  const DietsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
    },
    updateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 70,
        margin: 15,   
        marginBottom: 30,  
        backgroundColor: '#008000' 
    },
    buttonText:{
        fontSize: 37,
        fontWeight: '500',
        color: '#ffffff'
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 20,
        marginBottom: 5,
        textAlign: 'center'
    },
  }
);