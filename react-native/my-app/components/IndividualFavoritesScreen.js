import React, {useState} from 'react';
import { Image, Pressable, Text, View, StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { addRecipeToFavorites, removeRecipeFromFavorites } from '../calls/favoriteCalls';


export default function IndividualFavoritesScreen({ route, navigation }) {

    const [isFavorited, setIsFavorited] = useState(true);

    const { individualRecipe } = route.params;

    return (
        <SafeAreaView style={IndividualFavoritesStyles.container}>
        <ScrollView>
            <View style={IndividualFavoritesStyles.singleRecipeDiv}>
            <Text style={IndividualFavoritesStyles.foodTitle}>
                {individualRecipe.name}
            </Text>
            <Image 
                source={ { uri: individualRecipe.image}} 
                style={IndividualFavoritesStyles.images} 
            />
            {!isFavorited && <Pressable style={IndividualFavoritesStyles.favoritesButton}  onPress={() => addRecipeToFavorites(individualRecipe, setIsFavorited, individualRecipe.directions, true)}>
                <Text style={IndividualFavoritesStyles.buttonText}>
                    Add to favorites
                </Text>
            </Pressable>}
            {isFavorited && <View>
              <Pressable  style={IndividualFavoritesStyles.unfavoritesButton} onPress={() => removeRecipeFromFavorites(individualRecipe, setIsFavorited, true)}>
                <Text style={IndividualFavoritesStyles.buttonText}>
                    Remove favorite
                </Text>
            </Pressable>
            </View>}
            <View style={IndividualFavoritesStyles.divider}/>
            <Text style={IndividualFavoritesStyles.ingredientsHeader}>
              Ingredients:
            </Text>
            <Text style={IndividualFavoritesStyles.ingredientsDiv}>
              {individualRecipe.ingredients}
            </Text>
            <Text style={IndividualFavoritesStyles.directionsHeader}>
              Directions:
            </Text>
            <Text style={IndividualFavoritesStyles.directionsDiv}>
              {individualRecipe.directions}
            </Text>
            </View>   
      </ScrollView>
      </SafeAreaView>
    );
  }
  const IndividualFavoritesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
      height: 'max'
    },
    favoritesButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 3,
        width: 250,
        height: 75,
        margin: 10,
        marginTop: 20,   
        backgroundColor: '#3cb04c' 
    },
    unfavoritesButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      elevation: 3,
      width: 250,
      height: 75,
      margin: 10,
      marginTop: 20,   
      backgroundColor: 'red' 
  },
    buttonText:{
        fontSize: 30,
        fontWeight: '600',
        color: '#ffffff'
    },
    searchArea:{
      alignContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 15
    },
    ingredientsHeader: {
      fontSize: 28,
      fontWeight: '400',
      color: 'blue',
      width: 220,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center',
      alignContent: "center",
      alignItems: "center",
    },
    ingredientsDiv: {
      fontSize: 26,
      fontWeight: '300',
      color: 'blue',
      width: 350,
      marginBottom: 5,
      textAlign: 'center',
      alignContent: "center",
      alignItems: "center",
    },
    directionsHeader: {
      fontSize: 28,
      fontWeight: '400',
      color: 'red',
      width: 220,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center',
      alignContent: "center",
      alignItems: "center",
    },
    directionsDiv: {
      fontSize: 22,
      fontWeight: '300',
      color: 'red',
      width: 370,
      marginBottom: 5,
      textAlign: 'center',
      alignContent: "center",
      alignItems: "center",
    },
    images: {
      width: 300,
      height: 300,
      resizeMode: 'contain',
      alignContent: "center",
      alignItems: "center",
    },
    currentlyFavorited: {
      alignContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: '#3cb04c',
      fontSize: 35,
      fontWeight: 600,
      marginTop: 10
    },
    foodTitle: {
      fontSize: 40,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center'
    },
    calories: {
      fontSize: 28,
      fontWeight: '400',
      width: 220,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center',
      alignContent: "center",
      alignItems: "center",
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
      marginVertical: 10,
      alignContent: "center",
      alignItems: "center",
    },
    directions: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: 400,
      marginVertical: 10,
      fontSize: 30,
    },
    ingredients: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: 400,
      marginVertical: 10,
      fontSize: 30,
    }
  }
);