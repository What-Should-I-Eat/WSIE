import React, {useState} from 'react';
import { Image, Pressable, Text, TextInput, View, StyleSheet, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { searchForRecipes, initialRecipes } from '../calls/recipeSearchCalls';
import { appBackgroundColor, iconColor, iconHeight, navBarPadding } from "../calls/styleSheets";

export default function RecipeSearchScreen({ navigation }) {

    const [textInput, setInputText] = useState('');
    const [showStuff, setShowStuff] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    initialRecipes(textInput, setShowStuff, navigation, setSearchResults, setNoResults);
    return (
      <SafeAreaView style={RecipeSearchStyles.container}>
        <View style={RecipeSearchStyles.searchArea}>
          <TextInput
              style={RecipeSearchStyles.inputBox}
              placeholder="Search recipe..."
              placeholderTextColor={"#8c8c8c"}
              placeholderFon
              onChangeText={value => setInputText(value)}
              defaultValue={textInput}
          />
          <Pressable style={RecipeSearchStyles.searchButton} 
              onPress={() => {searchForRecipes(textInput, setShowStuff, navigation, setSearchResults, setNoResults)}}
          ><Text><FontAwesome name="search" size={iconHeight+10} color={iconColor}/></Text>
          </Pressable>
        </View>
        {showStuff && <View style={RecipeSearchStyles.resultArea}>
          {noResults && <View style={RecipeSearchStyles.noResultsFound}>
            <Text style={RecipeSearchStyles.noResultsFound}>
              Sorry, based on your dietary restrictions we weren't able to find any results with that search parameter.
            </Text>  
          </View>}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => navigation.navigate("IndividualRecipeScreen", {
                individualRecipe: item
              })}>
              <View style={[RecipeSearchStyles.singleRecipeDiv, RecipeSearchStyles.divider]}>
                <Image 
                  source={ { uri: item.image}} 
                  style={RecipeSearchStyles.images} 
                />
                <View style={RecipeSearchStyles.textResults}>

                  <Text style={RecipeSearchStyles.foodTitle}>
                    {item.name}  
                  </Text>
                  <Text style={RecipeSearchStyles.calories}>
                    Cal: {item.calories}
                  </Text>
                </View>
              </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>}
      </SafeAreaView>
    );
  }
  const RecipeSearchStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
      height: 'max',
      paddingBottom: navBarPadding
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        elevation: 3,
        width: 75,
        height: 75,
        margin: 5,     
        backgroundColor: '#eee', 
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '600',
        color: '#ffffff'
    },
    inputBox: {
      padding: 18,
      margin: 2,
      position: 'relative',
      top: 0,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#404040',
      backgroundColor: '#f9f9f9',
      width: 300,
      height: 75,
      fontSize: 30,
      borderRadius: 5,
    },
    searchArea:{
      alignContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 15
    },
    inputLabel: {
        fontSize: 30,
        fontWeight: '500',
        margin: 10,
        marginTop: 30
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        width: 350,
        marginTop: 15,
        textAlign: 'center'
    },
    noResultsFound: {
      fontSize: 35,
      fontWeight: '400',
      marginTop: 30,
      marginBottom: 5,
      textAlign: 'center',
      marginHorizontal: 15
    },
    resultArea: {
      flex: 1,
      backgroundColor: appBackgroundColor,
      alignItems: 'center',
      justifyContent: 'top',
      height: 'max',
    },
    images: {
      width: 130,
      height: 130,
      resizeMode: 'contain',
      marginRight: 5,
      marginBottom: 10
    },
    foodTitle: {
      fontSize: 27,
      fontWeight: '500',
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    calories: {
      fontSize: 24,
      fontWeight: '400',
      width: 220,
      marginTop: 5,
      marginBottom: 5,
      textAlign: 'center'
    },
    singleRecipeDiv: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: "row",
    },
    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      width: 350,
      marginVertical: 5,
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