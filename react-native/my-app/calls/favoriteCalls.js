import { hostForAppCalls } from "./hostCallConst";
import { loggedInUser } from "./loginCalls";
import { getUserData } from "./recipeSearchCalls";

const addRecipeToFavorites = async (givenRecipe, setIsFavorited, isThisComingFromRecipeSearch) => {

    let newFavoritedRecipe = {};
    // accounts for differences in schema between two locations
    if(isThisComingFromRecipeSearch){
      newFavoritedRecipe = {
        // recipeId: givenRecipe.name,
        recipeName: givenRecipe.name,
        recipeIngredients: 'ingredients lists',
        recipeDirections: 'directions of recipe',
        recipeImage: givenRecipe.image,
        recipeUri: givenRecipe.uri,
      };
    } else {
      newFavoritedRecipe = {
        // recipeId: givenRecipe.recipeName,
        recipeName: givenRecipe.recipeName,
        recipeIngredients: 'ingredients lists',
        recipeDirections: 'directions of recipe',
        recipeImage: givenRecipe.recipeImage,
        recipeUri: givenRecipe.recipeUri,
      };
    }

      console.log("adding to favorites (name): ", newFavoritedRecipe.recipeName);
      console.log("adding to favorites (ingredients): ", newFavoritedRecipe.recipeIngredients);
      console.log("adding to favorites (directions): ", newFavoritedRecipe.recipeDirections);
      console.log("adding to favorites (uri): ", newFavoritedRecipe.recipeUri);
      console.log("adding to favorites (image): ", newFavoritedRecipe.recipeImage);
      try {
        const userId = await getUserId(loggedInUser);
        const response = await fetch(`${hostForAppCalls}/api/v1/users/${userId}/favorites`, {
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
    const response = await fetch(`${hostForAppCalls}/api/v1/users/${userId}/favorites`, {
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
  } catch (error) {
    console.error('There was a problem with the delete operation:', error);
  }
}


const isRecipeAlreadyFavorited = async (givenRecipe) => {
  const recipeToGet = {
    recipeName: givenRecipe.name,
  };
  try {
    const userId = await getUserId(loggedInUser);
    const response = await fetch(`${hostForAppCalls}/api/v1/users/${userId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favorites: recipeToGet })
    });
    if (!response.ok) {
      throw new Error('There was a problem checking if recipe is favorited!');
    }
    const isFavorited = await response.json();
    return isFavorited;
  } catch (error) {
    console.error('There was a problem with the isFavorited operation:', error);
  }

}

async function getUserId(username){
    try {
        const response = await fetch(`${hostForAppCalls}/api/v1/users/findUserId?username=${username}`, {
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
      const userData = await getUserData(loggedInUser);
      console.log('Health of user: ', userData.health);
      console.log('Diet of user: ', userData.diet);

      const arrayOfResults = userData.favorites
      .filter(data => data.recipeName !== undefined)
      .map(data => ({
        name: data.recipeName, 
        image: data.recipeImage,
        uri: data.recipeUri,
        id: data._id
        // ingredients: ingredientsArray
      }));

      console.log('Favorites: ' + arrayOfResults);
      return arrayOfResults;
    } catch (error){
      console.error('Error fetching favorites: ', error);
      throw error;
    }
  }

export { addRecipeToFavorites, removeRecipeFromFavorites, isRecipeAlreadyFavorited, getUserFavoritesFromSever };