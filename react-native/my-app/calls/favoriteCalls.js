import * as CONST from "../calls/constants.js";
import { loggedInUser } from "./loginCalls";
import {utils} from "../calls/utils.js";
import { Alert } from "react-native";

const addRecipeToFavorites = async (givenRecipe, setIsFavorited, directionsOfRecipe, isThisComingFromRecipeSearch) => {

    let newFavoritedRecipe = {};
    let addedDirections;
    if(directionsOfRecipe == "Loading..."){
      addedDirections = "N/A";
    } else{
      addedDirections = directionsOfRecipe;
    }
    // accounts for differences in schema between two locations
    if(isThisComingFromRecipeSearch){
      newFavoritedRecipe = {
        recipeName: givenRecipe.name,
        recipeIngredients: givenRecipe.ingredients,
        recipeDirections: addedDirections,
        recipeImage: givenRecipe.image,
        recipeUri: givenRecipe.uri,
        recipeCalories: givenRecipe.calories
      };
    } else {
      newFavoritedRecipe = {
        recipeName: givenRecipe.recipeName,
        recipeIngredients: givenRecipe.recipeIngredients,
        recipeDirections: addedDirections,
        recipeImage: givenRecipe.recipeImage,
        recipeUri: givenRecipe.recipeUri,
        recipeCalories: givenRecipe.recipeCalories
      };
    }
      console.log("adding to favorites (name): ", newFavoritedRecipe.recipeName);
      console.log("adding to favorites (ingredients): ", newFavoritedRecipe.recipeIngredients);
      console.log("adding to favorites (directions): ", newFavoritedRecipe.recipeDirections);
      console.log("adding to favorites (uri): ", newFavoritedRecipe.recipeUri);
      console.log("adding to favorites (image): ", newFavoritedRecipe.recipeImage);
      console.log("adding to favorites (calories): ", newFavoritedRecipe.recipeCalories);
      try {
        const userId = await getUserId(loggedInUser);
        const response = await fetch(`${CONST.HOST}/api/v1/users/${userId}/favorites`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ favorites: newFavoritedRecipe })
        });
        console.log('status: ' + response.status);
        if (!response.ok) {
          throw new Error('There was a problem adding a new recipe to Favorites!');
        }
        const updatedUser = await response.json();
        console.log('Updated user favorites:', updatedUser);
        setIsFavorited(true);
        Alert.alert("Favorite Added", "Recipe has been added to your favorites!");
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
}

const removeRecipeFromFavorites = async (givenRecipe, setIsFavorited, isThisComingFromRecipeSearch) => {

  let recipeToDelete = {};
  // accounts for differences in schema between two locations
  if(isThisComingFromRecipeSearch){
    recipeToDelete = {
      recipeName: givenRecipe.name,
    };
  } else {
    recipeToDelete = {
      recipeName: givenRecipe.recipeName,
    };
  }


  try {
    const userId = await getUserId(loggedInUser);
    const response = await fetch(`${CONST.HOST}/api/v1/users/${userId}/favorites`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favorites: recipeToDelete })
    });

    if (!response.ok) {
      throw new Error('There was a problem deleting a recipie from favorites!');
    }
    const updatedUser = await response.json();
    console.log('Updated user favorites:', updatedUser);
    setIsFavorited(false);
    Alert.alert("Favorite Removed", "Recipe has been removed from your favorites!");
  } catch (error) {
    console.error('There was a problem with the delete operation:', error);
  }
}


const isRecipeAlreadyFavorited = async (givenRecipe) => {
  const user = await utils.getUserIdFromUsername(loggedInUser)
  if(user.favorites.some(e => e.recipeName == givenRecipe.name)) {
    console.log(true);
    return true
  }
  else{
    console.log(false);
    return false
  }
}

async function getUserId(username){
    try {
        const response = await fetch(`${CONST.HOST}/api/v1/users/findUserId?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status != 200) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return "";
    }
  }

  const getUserFavoritesFromSever = async() => {
    try{
      const userData = await utils.getUserFromUsername(loggedInUser);
      console.log('Health of user: ', userData.health);
      console.log('Diet of user: ', userData.diet);

      const arrayOfResults = userData.favorites
      .filter(data => data.recipeName !== undefined)
      .map(data => ({
        name: data.recipeName, 
        image: data.recipeImage,
        uri: data.recipeUri,
        id: data._id,
        ingredients: data.recipeIngredients,
        directions: data.recipeDirections,
        calories: data.recipeCalories
      }));

      console.log('Favorites: ' + arrayOfResults);
      return arrayOfResults;
    } catch (error){
      console.error('Error fetching favorites: ', error);
      throw error;
    }
  }

export { addRecipeToFavorites, removeRecipeFromFavorites, isRecipeAlreadyFavorited, getUserFavoritesFromSever, getUserId };