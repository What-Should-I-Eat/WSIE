import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';

export default function DietaryRestrictionsScreen({ navigation }) {

    return (
        <ScrollView>
        <View style={DietaryRestrictionsStyles.container}>
            <Text style={DietaryRestrictionsStyles.instructions}>
               Choose dietary restrictions to update below:
            </Text>
            <Pressable style={DietaryRestrictionsStyles.pathButton} 
              onPress={() => navigation.navigate("DietsScreen")}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Diet Types</Text>
            </Pressable>
            
            <Pressable style={DietaryRestrictionsStyles.pathButton} 
              onPress={() => navigation.navigate("Allergies")}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Food Allergies</Text>
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
    pathButton: {
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