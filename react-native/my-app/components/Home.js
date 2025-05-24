import React from "react";
// import Icon from 'react-native-ico-material-design';
// import Icon from 'react-native-ico-modern-ui';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { View, Text, Pressable, StyleSheet } from "react-native";
import { loggedInUser } from "../calls/loginCalls";
import { searchForRecipes } from '../calls/recipeSearchCalls';
import {getUserFromUsername} from "../calls/utils.js";
import { appBackgroundColor, mainIndigoButtonBackground, blueClicked } from "../calls/colorConstants";
import * as CONST from "../calls/constants.js";

var iconHeight = 26
var iconWidth = 26

// this.load = async (searchParam, apiUrl = null, pageUrl = null, mealTypes = [], dishTypes = [], cuisineTypes = [], dietLabels = [],healthLabels = []) => {
//   const container = $('.recipes-container');
//   const pagination = $("#paginationList");
//   try {
//     // Show publish recipe button
//     // const hidePublicRecipeButton = document.getElementById('togglePublicRecipeShownButton');
//     // if(showPublicRecipes){
//     //   hidePublicRecipeButton.textContent = HIDE_PUBLIC_RECIPES;
//     // }else{
//     //   hidePublicRecipeButton.textContent = SHOW_PUBLIC_RECIPES;
//     // }
//     const url = await this.getApiUrl(searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels);
//     const recipes = await this.getRecipes(url);
//     const publicUserRecipes = showPublicRecipes ? await this.getPublicUserRecipes() : []; // Only fetch if flag is true
//     if (hasRecipeHits(recipes)) {
//       console.log(`Fetched Recipe Results: [${recipes.from}-${recipes.to}]`);
//       this.renderRecipes(recipes, publicUserRecipes, container);
//       this.updatePagination(recipes, url, `${recipes.from}-${recipes.to}`, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels);
//       pagination.show();
//     } else {
//       console.warn(NO_RECIPES_FOUND);
//       container.append(this.getNoRecipesFound());
//       pagination.empty().hide();
//     }
//   } catch (error) {
//     console.error(error);
//     utils.showAjaxAlert("Error", error.message);
//     container.append(this.getNoRecipesFound());
//     pagination.empty().hide();
//   }
// };


// // Getting User Profile Data
// this.getApiUrl = async (searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels) => {
//   if (pageUrl) return pageUrl;

//   let baseUrl = apiUrl || this.initialPageUrl;
//   if (!baseUrl) {
//     baseUrl = this.buildBaseUrl(searchParam, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels);
//     console.log(baseUrl)
//     const username = utils.getUserNameFromCookie();
//     if (username) {
//       try {
//         const userData = await utils.getUserFromUsername(username);
//         const userDietString = getUserDietString(userData.diet);
//         const userHealthString = getUserHealthString(userData.health);

//         if (userDietString) {
//           console.debug(`Added [userDietString] to query: ${userDietString}`);
//           baseUrl += userDietString
//         }

//         if (userHealthString) {
//           console.debug(`Added [userHealthString] to query: ${userHealthString}`);
//           baseUrl += userHealthString
//         }
//       } catch (error) {
//         console.error(CONST.ERROR_UNABLE_TO_GET_USER, error);
//         utils.showAjaxAlert("Error", CONST.ERROR_UNABLE_TO_GET_USER);
//         return;
//       }
//     }

//     this.initialPageUrl = baseUrl;
//   }

//   return baseUrl;
// };

// this.buildBaseUrl = (searchParam, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels) => {
//   const userSelectedMealTypes = mealTypes
//     .filter(mealType => mealType)
//     .map(mealType => `&mealType=${encodeURIComponent(mealType.toLowerCase())}`)
//     .join('');

//   const userSelectedDishTypes = dishTypes
//     .filter(dishType => dishType)
//     .map(dishType => `&dishType=${encodeURIComponent(dishType.toLowerCase())}`)
//     .join('');

//   const userSelectedCuisineTypes = cuisineTypes
//     .filter(cuisineType => cuisineType)
//     .map(cuisineType => `&cuisineType=${encodeURIComponent(cuisineType.toLowerCase())}`)
//     .join('');
//   const userSelectedDietLabels = dietLabels
//     .filter(dietLabel => dietLabel)
//     .map(dietLabel => `&diet=${encodeURIComponent(dietLabel.toLowerCase())}`)
//     .join('');
//   const userSelectedHealthLabels = healthLabels
//     .filter(healthLabel => healthLabel)
//     .map(healthLabel => '&health=' + healthLabel.toLowerCase())
//     .join('');
//   console.debug(`searchParam: ${searchParam}`);
//   let baseUrl = searchParam ? `${CONST.EDAMAM_API_URL}${searchParam}` : CONST.EDAMAM_API_EMPTY_SEARCH_URL;
//   console.log(baseUrl)
//   if (userSelectedMealTypes) {
//     console.debug(`Added [userSelectedMealTypes] to query: ${userSelectedMealTypes}`);
//     baseUrl += userSelectedMealTypes;
//   }

//   if (userSelectedDishTypes) {
//     console.debug(`Added [userSelectedDishTypes] to query: ${userSelectedDishTypes}`);
//     baseUrl += userSelectedDishTypes;
//   }

//   if (userSelectedCuisineTypes) {
//     console.debug(`Added [userSelectedCuisineTypes] to query: ${userSelectedCuisineTypes}`);
//     baseUrl += userSelectedCuisineTypes;
//   }

//   if (userSelectedDietLabels) {
//     console.debug(`Added [userSelectedDietLabels] to query: ${userSelectedDietLabels}`);
//     baseUrl += userSelectedDietLabels;
//   }

//   if (userSelectedHealthLabels) {
//     console.debug(`Added [userSelectedHealthLabels] to query: ${userSelectedHealthLabels}`);
//     baseUrl += userSelectedHealthLabels;
//   }

//   // If the user did not provide a search parameter or filters, show the user meals based on the current time
//   if (!searchParam && !userSelectedMealTypes && !userSelectedDishTypes && !userSelectedCuisineTypes && !userSelectedDietLabels && !userSelectedHealthLabels) {
//     baseUrl += `${getCurrentTimeMealType()}`;
//   }
//   return baseUrl;
// };

// function getCurrentTimeMealType() {
//   const hours = new Date().getHours();

//   if (hours < 5 || hours > 21) {
//     return "&mealType=snack";
//   } else if (hours <= 10) {
//     return "&mealType=breakfast";
//   } else if (hours <= 15) {
//     return "&mealType=lunch";
//   } else {
//     return "&mealType=dinner";
//   }
// }


export default function Home({ navigation }) {
  state = {
    screenText: 'Press a Button!'
  }

  changeText = (text) => {
    console.log(text + ' has been pressed!')
    this.setState({
      screenText: text
    })
  }
  // console.log("User_Data")
  // userData = getUserFromUsername(loggedInUser)
  // console.log(userData)
  // console.log('Health of user: ', userData.health);
  // console.log('Diet of user: ', userData.diet);
  // const recipes = this.getPublicUserRecipes()

    return(
      <View style={styles.containerHome}>
        
        <View>
          <Text style={{fontSize:30, color:'Black'}}>{this.state.screenText}</Text>
        </View>
        
        <View style={styles.NavContainer}>
          <View style={styles.NavBar}>
            <Pressable
              title="Go to Recipe Search"
              onPress={() => navigation.navigate("RecipeSearchScreen")}
              style={styles.IconBehave}
              android_ripple={{borderless:true, radius:50}}
            >
              <FontAwesome name="search" size={iconHeight} color='#448aff'/>
            </Pressable>
            <Pressable
              title="Dietary Restrictions"
              onPress={() => navigation.navigate("DietaryRestrictionsScreen")}
              style={styles.IconBehave}
              android_ripple={{borderless:true, radius:50}}
            >
              <FontAwesome6 name="bowl-food" size={iconHeight} color='#448aff'/>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
  // export default function Home({ navigation }) {
  // return (
  //   <View style={styles.containerHome}>
  //     <Text style={styles.userInfo}>Welcome,{"\n"}{loggedInUser}!</Text>
  //     <Pressable
  //       title="Go to Dietary Restrictions"
  //       onPress={() => {navigation.navigate("DietaryRestrictionsScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //       styles.goToButton, styles.goToDietaryRestrictions]}
  //     >
  //       <Text style={[styles.buttonText, styles.buttonTextRestrictions]}
  //         >Update Dietary Restrictions</Text>
  //     </Pressable>
  //     <Pressable
  //       title="Go to Recipe Search"
  //       onPress={() => navigation.navigate("RecipeSearchScreen")}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>Search Recipes</Text>
  //     </Pressable>
  //     <Pressable
  //       title="Go to Favorites"
  //       onPress={() => {navigation.navigate("FavoritesScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>View Favorites</Text>
  //       </Pressable>
  //     <Pressable
  //       title="Go to Upload Recipe"
  //       onPress={() => {navigation.navigate("UploadRecipeScreen");}}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? blueClicked : mainIndigoButtonBackground,
  //         },
  //         styles.goToButton]}
  //     >
  //       <Text style={styles.buttonText}>Upload Recipe</Text>
  //       </Pressable>
  //     <Pressable
  //       title="Logout"
  //       onPress={() => navigation.navigate("LoginScreen")}
  //       style={({ pressed }) =>[
  //         {
  //           backgroundColor: pressed ? '#FF0000' : 'black',
  //         },
  //         styles.goToButton, styles.goToLogin]}
  //     >
  //       <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
  //       </Pressable>
  //   </View>
  // );
// }
const styles = StyleSheet.create({
  containerHome: {
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: appBackgroundColor,
    },
    NavContainer: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 20,
    },
    NavBar: {
      flexDirection:'row',
      backgroundColor: '#eee',
      width: '90%',
      justifyContent: 'space-evenly',
      borderRadius: 40
    },
    IconBehave: {
      padding: 14
    },
    userInfo: {
      fontSize: 40,
      marginTop: -20,
      marginBottom: 15,
      fontWeight: '600',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    goToButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        elevation: 3,
        width: 325,
        height: 120,
        margin: 12,        
    },
    buttonText:{
        fontSize: 40,
        fontWeight: '500',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
    },
    logoutText:{
      color: 'white',
    },
    goToLogin: {
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