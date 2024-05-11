import { hostForAppCalls } from "./hostCallConst";
import { loggedInUser } from "./loginCalls";

const addRecipeToFavorites = async (givenRecipe, setIsFavorited) => {
    const newFavoritedRecipe = {
        recipeName: givenRecipe.name,
        recipeIngredients: 'ingredients lists',
        recipeDirections: 'directions of recipe',
        recipeUri: givenRecipe,
        recipeImage: givenRecipe.image,
      };
      console.log("adding to favorites: ", newFavoritedRecipe.recipeName);
      try {
        const userId = getUserId(loggedInUser);
        const response = await fetch(`${hostForAppCalls}/api/v1/users/${userId}/favorites`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ favorites: newFavoritedRecipe })
        });
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

const removeRecipeFromFavorites = async (givenRecipe, setIsFavorited) => {
  const recipeToDelete = {
    recipeName: givenRecipe.name,
  };
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

export { addRecipeToFavorites, removeRecipeFromFavorites, isRecipeAlreadyFavorited };