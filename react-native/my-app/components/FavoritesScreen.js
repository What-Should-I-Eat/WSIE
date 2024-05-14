import React, {useState, useEffect} from 'react';
import { Image, Pressable, Text, View, StyleSheet, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native';
import { getUserFavoritesFromSever } from '../calls/favoriteCalls';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen({ navigation }) {

  const [favoritesResults, setFavoritesResults] = useState([]);
  const [noCurrentFavorites, setNoCurrentFavorites] = useState(false);
  console.log('newnewnew initially?');

  useEffect(() => { 
    async function getFavoritesForLoad() {
      try{
        const userFavorites = await getUserFavoritesFromSever();
        setFavoritesResults(userFavorites);
        if(userFavorites.length == 0){
          setNoCurrentFavorites(true);
        }
      } catch (error){
        console.error('Error fetching favs: ', error);
      }
    }
    getFavoritesForLoad();
  }, [getUserFavoritesFromSever]);

    return (
        <View style={FavoritesStyles.container}>

        {noCurrentFavorites && <Text style={FavoritesStyles.instructions}>
          Sorry, you have no favorites to show right now.{'\n\n'}Try searching for some new recipes to add!</Text>}

        <FlatList
              data={favoritesResults}
              keyExtractor={(item) => item.name} // Use a unique key for each item
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => navigation.navigate("IndividualFavoritesScreen", {
                  individualRecipe: item
                })}>
                <View style={FavoritesStyles.singleRecipeDiv}>
                  <View style={FavoritesStyles.textResults}>
                    <Text style={FavoritesStyles.foodTitle}>
                      {item.name}
                    </Text>
                    <Image 
                      style={FavoritesStyles.images} 
                      source={ { uri: item.image }} 
                     />
                    {/* <Text style={FavoritesStyles.calories}>
                      Cal: {item.calories}
                    </Text> */}
                  </View>
                </View>
                </TouchableWithoutFeedback>
              )}
              extraData={favoritesResults}
            />
        </View>
    );
  }
  const FavoritesStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd5ad',
      alignItems: 'center',
      justifyContent: 'top',
    },
    instructions: {
        fontSize: 35,
        fontWeight: '600',
        width: 350,
        color: 'red',
        marginTop: 50,
        marginBottom: 20,
        textAlign: 'center'
    },
    images: {
      width: 300,
      height: 200,
      resizeMode: 'contain'
    },
    foodTitle: {
      fontSize: 30,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    foodDescription: {
      fontSize: 20,
      fontWeight: '200',
      width: 300,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 20,
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
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
      marginVertical: 10
    }
  }
);