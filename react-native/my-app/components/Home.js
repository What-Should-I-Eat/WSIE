import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { loggedInUser } from "../calls/loginCalls";
import { appBackgroundColor, mainIndigoButtonBackground, lightSilverText } from "../calls/colorConstants";

export default function Home({ navigation }) {

  return (
    <View style={styles.containerHome}>
      <Text style={styles.userInfo}>Welcome,{"\n"}{loggedInUser}!</Text>
      <Pressable
        title="Go to Dietary Restrictions"
        onPress={() => {navigation.navigate("DietaryRestrictionsScreen");}}
        style={({ pressed }) =>[
          {
            backgroundColor: pressed ? 'white' : mainIndigoButtonBackground,
          },
        styles.goToButton, styles.goToDietaryRestrictions]}
      >
        <Text style={[styles.buttonText, styles.buttonTextRestrictions]}
          >Update Dietary Restrictions</Text>
      </Pressable>
      <Pressable
        title="Go to Recipe Search"
        onPress={() => navigation.navigate("RecipeSearchScreen")}
        style={({ pressed }) =>[
          {
            backgroundColor: pressed ? 'white' : mainIndigoButtonBackground,
          },
          styles.goToButton]}
      >
        <Text style={styles.buttonText}>Search Recipes</Text>
      </Pressable>
      <Pressable
        title="Go to Favorites"
        onPress={() => {navigation.navigate("FavoritesScreen");}}
        style={({ pressed }) =>[
          {
            backgroundColor: pressed ? 'white' : mainIndigoButtonBackground,
          },
          styles.goToButton]}
      >
        <Text style={styles.buttonText}>View Favorites</Text>
        </Pressable>
      <Pressable
        title="Go to Upload Recipe"
        onPress={() => {navigation.navigate("UploadRecipeScreen");}}
        style={({ pressed }) =>[
          {
            backgroundColor: pressed ? 'white' : mainIndigoButtonBackground,
          },
          styles.goToButton]}
      >
        <Text style={styles.buttonText}>Upload Recipe</Text>
        </Pressable>
      <Pressable
        title="Logout"
        onPress={() => navigation.navigate("LoginScreen")}
        style={({ pressed }) =>[
          {
            backgroundColor: pressed ? 'white' : mainIndigoButtonBackground,
          },
          styles.goToButton, styles.goToLogin]}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  containerHome: {
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: appBackgroundColor,
    },
    userInfo: {
      fontSize: 40,
      marginTop: -30,
      marginBottom: 15,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    goToButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 5,
        elevation: 3,
        width: 325,
        height: 120,
        margin: 12,        
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: lightSilverText
    },
    logoutText:{
      color: 'white',
    },
    goToLogin: {
        backgroundColor: '#FF0000',
        width: 250,
        height: 80,
    },
    goToDietaryRestrictions: {
      width: 325,
      height: 120,
    },
    buttonTextRestrictions:{
      fontSize: 37,
  },
});