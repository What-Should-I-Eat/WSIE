import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';
import { MultiSelectListAllergy, selectedAllergyArray } from './AllergiesList';
import { sendHealthData } from '../calls/dietHealthCalls';
import { appBackgroundColor, blueClicked } from "../calls/colorConstants";

export default function AllergiesScreen({ navigation }) {
  
  const allergies = ['Gluten', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Sesame', 'Low Sugar', 'Alcohol Free'];

    return (
        <View style={AllergiesStyles.container}>
          <Text style={AllergiesStyles.instructions}>Select the food you wish to remove from your search results</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MultiSelectListAllergy data={allergies} />
        </View>
        <Pressable style={({ pressed }) =>[
          {
            backgroundColor: pressed ? blueClicked : 'red'
          },
          AllergiesStyles.updateButton]}
          onPress={() => sendHealthData(selectedAllergyArray)}
        >
          <Text style={AllergiesStyles.buttonText}>Update Allergies</Text>
        </Pressable>
      </View>
    );
  }
  const AllergiesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
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
    },
    buttonText:{
        fontSize: 35,
        fontWeight: '600',
        color: '#ffffff'
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 15,
        marginBottom: 20,
        textAlign: 'center'
    },
  }
);