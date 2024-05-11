import { hostForAppCalls } from "./hostCallConst";
import { loggedInUser } from "./loginCalls";

const addRecipeToFavorites = async (givenRecipe) => {

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
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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

export { addRecipeToFavorites };