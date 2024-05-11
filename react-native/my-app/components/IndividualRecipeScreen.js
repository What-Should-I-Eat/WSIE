import React, {useState} from 'react';
import { Image, Pressable, Text, TextInput, View, StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { searchForRecipes } from '../calls/recipeSearchCalls';

export default function IndividualRecipeScreen({ route, navigation }) {

    const [textInput, setInputText] = useState('');
    const [showStuff, setShowStuff] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { individualItem } = route.params;

    return (
        <SafeAreaView style={IndividualRecipeStyles.container}>
        <ScrollView>
            <View style={IndividualRecipeStyles.singleRecipeDiv}>
            <Text style={IndividualRecipeStyles.foodTitle}>
                {individualItem.name}
            </Text>
            <Image 
                source={ { uri: individualItem.image}} 
                style={IndividualRecipeStyles.images} 
            />
            <Pressable style={IndividualRecipeStyles.favoritesButton}>
                <Text style={IndividualRecipeStyles.buttonText}>
                    Add to favorites
                </Text>
            </Pressable>
            <Text style={IndividualRecipeStyles.calories}>
                Calories: {individualItem.calories}
            </Text>
            </View>   
      </ScrollView>
      </SafeAreaView>
    );
  }
  const IndividualRecipeStyles = StyleSheet.create({
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