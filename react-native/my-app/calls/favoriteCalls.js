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
    console.log('53: ' + response.status);
    console.log('54: ' + response.text);
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
    // setIsFavorited(isFavorited);
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

  const getUserFavoritesFromSever = async(setFavoritesResults) => {
    console.log('called');
    let arrayOfResults = [];
    getUserData(loggedInUser)
        .then(async (userData) => {
          console.log(userData);
    
          console.log('Health of user: ', userData.health);
          console.log('Diet of user: ', userData.diet);
          //get strings for health and diet to append to fullLink
          console.log('Favorites: ' + userData.favorites);
          userData.favorites.forEach(async data => {
            console.log('inside 120 ' + data.recipeName);

            var individualRecipe = {
              name: data.recipeName, 
              image: data.recipeImage,
              uri: data.recipeUri,
              // ingredients: ingredientsArray
            }
            if(data.recipeName != undefined){
              console.log('inside 129?');
              arrayOfResults.push(data);
              console.log('after push');
            }
            // arrayOfResults.push(individualRecipe);
            console.log(arrayOfResults[0]);
            // console.log(arrayOfResults[0].name);
            console.log(arrayOfResults.length);
            setFavoritesResults(arrayOfResults);
            return arrayOfResults;
          })
        });
      // const responseMain = await fetch(`${hostForAppCalls}/api/v1/users/getUserFavorites`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       userName: loggedInUser,            
      //     }),
      //   })
      //     .then(response => {
      //       if(response.status != 200){
      //         console.log('Cannot find user');
      //         throw new Error('Cannot find user');
      //       }
      //       console.log('this is response.json ' + response.json());
      //       console.log(response);
      //       // response.hits.forEach(data => {
      //       //   console.log(data);
      //       //   console.log(data.recipeName);
      //       // });
      //       // return response.json();
      //     }).then(favorites => {
      //       console.log('this is favorites ' + favorites);
      //       // console.log(favorites.favorites);
      //       // favorites.hits.forEach(data => {
      //       //   console.log(data);
      //       //   console.log(data.recipeName);
      //       // });
      //         // return favorites;
      //     })
      //     .catch(error => {
      //       console.error('Fetch error:', error);
      //     });
  }

export { addRecipeToFavorites, removeRecipeFromFavorites, isRecipeAlreadyFavorited, getUserFavoritesFromSever };