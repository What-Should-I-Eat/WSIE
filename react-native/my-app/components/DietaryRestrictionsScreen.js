import React, {useState} from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function DietaryRestrictionsScreen({ navigation }) {

    return (
      <SafeAreaView style={DietaryRestrictionsStyles.container}>
        <ScrollView>
        <View style={DietaryRestrictionsStyles.container}>
            <Text style={DietaryRestrictionsStyles.instructions}>
               Choose the dietary restriction category to update below:
            </Text>
            <Pressable style={DietaryRestrictionsStyles.pathButtonDiets} 
              onPress={() => navigation.navigate("DietsScreen")}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Diet Types</Text>
            </Pressable>
            
            <Pressable style={DietaryRestrictionsStyles.pathButtonAllergies} 
              onPress={() => navigation.navigate("AllergiesScreen")}
            >
              <Text style={DietaryRestrictionsStyles.buttonText}>Food Allergies</Text>
            </Pressable>

      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const DietaryRestrictionsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
    },
    pathButtonDiets: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 150,
        margin: 30,     
        backgroundColor: 'green' 
    },
    pathButtonAllergies: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 150,
        margin: 30,     
        backgroundColor: 'red' 
    },
    buttonText:{
        fontSize: 50,
        fontWeight: '600',
        color: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    instructions: {
        fontSize: 32,
        fontWeight: '600',
        width: 350,
        marginTop: 50,
        marginBottom: 50,
        textAlign: 'center'
    },
  }
);