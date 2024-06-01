import React, {useState, useEffect} from 'react';
import { Image, Text, View, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { getUserFavoritesFromSever } from '../calls/favoriteCalls';
import { appBackgroundColor } from "../calls/colorConstants";

export default function FavoritesScreen({ navigation }) {

  const [favoritesResults, setFavoritesResults] = useState([]);
  const [noCurrentFavorites, setNoCurrentFavorites] = useState(false);

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

        {noCurrentFavorites && <Text style={FavoritesStyles.noRecipeFeedback}>
          Sorry, you have no favorites to show right now.{'\n\n'}Try searching for some new recipes to add!</Text>}

        <FlatList
              data={favoritesResults}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => navigation.navigate("IndividualFavoritesScreen", {
                  individualRecipe: item
                })}>
                <View style={[FavoritesStyles.divider]}>
                  <View style={[FavoritesStyles.textResults, FavoritesStyles.singleRecipeDiv]}>
                    <Text style={FavoritesStyles.foodTitle}>
                      {item.name}
                    </Text>
                    <Image 
                      style={FavoritesStyles.images} 
                      source={ { uri: item.image }} 
                     />
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
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
      paddingBottom: 30,
    },
    noRecipeFeedback: {
        fontSize: 35,
        fontWeight: '600',
        width: 350,
        marginTop: 50,
        marginBottom: 20,
        textAlign: 'center'
    },
    images: {
      width: 300,
      height: 200,
      resizeMode: 'contain',
      marginTop: 10,
      marginBottom: 15,
      alignItems: 'center',
      alignContent: 'center'
    },
    foodTitle: {
      fontSize: 30,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      alignContent: 'center',
      marginTop: 10,
      flex: 1,
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
    }
  }
);