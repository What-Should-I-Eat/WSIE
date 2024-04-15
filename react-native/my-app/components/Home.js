import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.containerHome}>
      <Pressable
        title="Go to Dietary Restrictions"
        onPress={() => navigation.navigate("DietaryRestrictionsScreen")}
        style={[styles.goToButton, styles.goToDietaryRestrictions]}
      >
        <Text style={styles.buttonText}>Dietary Restrictions</Text>
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
      justifyContent: "center"
    },
    goToButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 300,
        height: 100,
        margin: 30,        
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
        backgroundColor: '#d37aff',
    },
    goToLogin: {
        backgroundColor: '#00ff15',
    },
    goToDietaryRestrictions: {
        backgroundColor: '#ff7700',
    }
});