import React, {useState} from 'react';
import { Image, Pressable, Text, View, StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';

export default function IndividualFavoritesScreen({ route, navigation }) {

    const [isFavorited, setIsFavorited] = useState(true);

    const { individualItem } = route.params;

    return (
        <SafeAreaView style={IndividualFavoritesStyles.container}>
        <ScrollView>
            <View style={IndividualFavoritesStyles.singleRecipeDiv}>
            <Text style={IndividualFavoritesStyles.foodTitle}>
                {individualItem.name}
            </Text>
            <Image 
                source={ { uri: individualItem.image}} 
                style={IndividualFavoritesStyles.images} 
            />
            {!isFavorited && <Pressable style={IndividualFavoritesStyles.favoritesButton}>
                <Text style={IndividualFavoritesStyles.buttonText}>
                    Add to favorites
                </Text>
            </Pressable>}
            {isFavorited && <View>
            <Text style={IndividualFavoritesStyles.currentlyFavorited}>
              --- Favorited ---
              </Text>
              <Pressable style={IndividualFavoritesStyles.favoritesButton}>
                <Text style={IndividualFavoritesStyles.buttonText}>
                    Remove favorite
                </Text>
            </Pressable>
            </View>}
            
            <Text style={IndividualFavoritesStyles.calories}>
                Calories: {individualItem.calories}
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
      color: '3cb04c',
      fontSize: 25,
      fontWeight: 300
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
    textResults: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: 200,
      marginLeft: 15
    }
  }
);