import * as CONST from "../calls/constants.js";
import { loggedInUser } from "./loginCalls";
import { Alert } from "react-native";
import { getUserId } from "./favoriteCalls";

const uploadNewRecipe = async (recipeNameText, recipeCaloriesText, recipeIngredientsText, recipeDirectionsText, selectedImage) => {

    if(recipeNameText.trim() === '' || recipeCaloriesText.trim() === '', recipeIngredientsText.trim() === '' || recipeDirectionsText.trim() === ''){
        Alert.alert("Empty Inputs", "Please ensure all fields are completed before submitting");
        return false;
    } else{
        // random 30 digit string of numbers to set URI since no actual URL exists, needed as unique key for results population on front end
        let randomUri = Math.random().toString().substring(3, 30);

        let defaultImageURL = 'https://www.pdclipart.org/albums/Household_Items/normal_dinner_plate_with_spoon_and_fork.png';
        let chosenImage = !selectedImage ? defaultImageURL : selectedImage;

        console.log("adding new recipe (name): ", recipeNameText);
        console.log("adding new recipe (ingredients): ", recipeIngredientsText);
        console.log("adding new recipe (directions): ", recipeDirectionsText);
        console.log("adding new recipe (image): ", chosenImage);
        console.log("adding new recipe (uri): ", randomUri);
        console.log("adding new recipe (calories): ", recipeCaloriesText);
      try {
        const userId = await getUserId(loggedInUser);
        const response = await fetch(`${CONST.HOST}/api/v1/users/${userId}/create_recipes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            recipeName: recipeNameText,
            recipeIngredients: recipeIngredientsText,
            recipeDirections: recipeDirectionsText,
            recipeImage: chosenImage,
            recipeUri: randomUri,
            recipeCalories: recipeCaloriesText 
          })
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
        Alert.alert("Upload Error", "Sorry, there was a problem uploading your recipe");
      }
    }
}
export { uploadNewRecipe };