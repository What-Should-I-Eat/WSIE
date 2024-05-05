import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { loggedInUser } from "../calls/loginCalls";

export default function Home({ navigation }) {
  return (
    <View style={styles.containerHome}>
      <Text style={styles.userInfo}>Welcome,{"\n"}{loggedInUser}!</Text>
      <Pressable
        title="Go to Dietary Restrictions"
        onPress={() => navigation.navigate("DietaryRestrictionsScreen")}
        style={[styles.goToButton, styles.goToDietaryRestrictions]}
      >
        <Text style={styles.buttonTextRestrictions}>Update Dietary Restrictions</Text>
      </Pressable>
      <Pressable
        title="Go to Recipe Search"
        onPress={() => navigation.navigate("RecipeSearchScreen")}
        style={[styles.goToButton, styles.goToRecipeSearch]}
      >
        <Text style={styles.buttonText}>Search Recipes</Text>
      </Pressable>
      <Pressable
        title="Go to Favorites"
        onPress={() => navigation.navigate("FavoritesScreen")}
        style={[styles.goToButton, styles.goToFavorites]}
      >
        <Text style={styles.buttonText}>View Favorites</Text>
        </Pressable>
      <Pressable
        title="Logout"
        onPress={() => navigation.navigate("LoginScreen")}
        style={[styles.goToButton, styles.goToLogin]}
      >
        <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  containerHome: {
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: '#ffd5ad',
    },
    userInfo: {
      fontSize: 40,
      marginTop: -30,
      marginBottom: 30,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    goToButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 120,
        margin: 20,        
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    goToRecipeSearch: {
        backgroundColor: '#3cdfff',
    },
    goToFavorites: {
        backgroundColor: '#00ff15',
    },
    goToLogin: {
        backgroundColor: '#ff7700',
    },
    goToDietaryRestrictions: {
      width: 300,
      height: 120,
      backgroundColor: '#d37aff',
    },
    buttonTextRestrictions:{
      fontSize: 37,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
  },
});