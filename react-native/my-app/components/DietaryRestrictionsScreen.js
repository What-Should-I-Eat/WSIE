import React from 'react';
import { Pressable, Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";

export default function DietaryRestrictionsScreen({ navigation }) {

    return (
      <SafeAreaView style={DietaryRestrictionsStyles.container}>
        <ScrollView>
        <View style={DietaryRestrictionsStyles.container}>
            <Text style={DietaryRestrictionsStyles.instructions}>
               Choose the dietary restriction category to update below:
            </Text>
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground
                },
              DietaryRestrictionsStyles.pathButton]} 
              onPress={() => navigation.navigate("DietsScreen")}
            >
              <Text style={[DietaryRestrictionsStyles.buttonText, DietaryRestrictionsStyles.dietsText]}>Diet Types</Text>
            </Pressable>
            
            <Pressable style={({ pressed }) =>[
                {
                  backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground
                },
                DietaryRestrictionsStyles.pathButton]} 
              onPress={() => navigation.navigate("AllergiesScreen")}
            >
              <Text style={[DietaryRestrictionsStyles.buttonText, DietaryRestrictionsStyles.allergiesText]}>Food Allergies</Text>
            </Pressable>

      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
  const DietaryRestrictionsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
    },
    pathButton:{
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      elevation: 3,
      width: 300,
      height: 175,
      margin: 30,     
      borderWidth: 1,
    },
    buttonText:{
        fontSize: 55,
        fontWeight: '400',
        color: 'white',
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