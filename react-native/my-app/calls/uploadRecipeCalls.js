import { hostForAppCalls } from "./hostCallConst";
import { loggedInUser } from "./loginCalls";
import { Alert } from "react-native";
import { getUserId } from "./favoriteCalls";

const uploadNewRecipe = async (recipeNameText, recipeCaloriesText, recipeIngredientsText, recipeDirectionsText) => {

    if(recipeNameText.trim() === '' || recipeCaloriesText.trim() === '', recipeIngredientsText.trim() === '' || recipeDirectionsText.trim() === ''){
        Alert.alert("Empty Inputs", "Please ensure all fields are completed before submitting");
        return false;
    } else{

        let defaultImageURL = 'https://www.pdclipart.org/albums/Household_Items/normal_dinner_plate_with_spoon_and_fork.png';

        // random 30 digit string of numbers to set URI since no actual URL exists, needed as unique key for results population on front end
        let randomUri = Math.random().toString().substring(3, 30);

        let newRecipeUpload = {
            recipeName: recipeNameText,
            recipeIngredients: recipeIngredientsText,
            recipeDirections: recipeDirectionsText,
            recipeImage: defaultImageURL,
            recipeUri: randomUri,
            recipeCalories: recipeCaloriesText
        }

        console.log("adding new recipe (name): ", newRecipeUpload.recipeName);
        console.log("adding new recipe (ingredients): ", newRecipeUpload.recipeIngredients);
        console.log("adding new recipe (directions): ", newRecipeUpload.recipeDirections);
        console.log("adding new recipe (image): ", newRecipeUpload.recipeImage);
        console.log("adding new recipe (uri): ", newRecipeUpload.recipeUri);
        console.log("adding new recipe (calories): ", newRecipeUpload.recipeCalories);
      try {
        const userId = await getUserId(loggedInUser);
        const response = await fetch(`${hostForAppCalls}/api/v1/users/${userId}/recipe/create_recipe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ recipe: newRecipeUpload })
        });
        console.log('status: ' + response.status);
        if (!response.ok) {
          throw new Error('There was a problem uploading the new recipe!');
        }
        const updatedUser = await response.json();
        console.log('Updated new recipe for user:', updatedUser);
        Alert.alert("Recipe Uploaded", "Recipe has been uploaded to the platform!");
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
}
export { uploadNewRecipe };