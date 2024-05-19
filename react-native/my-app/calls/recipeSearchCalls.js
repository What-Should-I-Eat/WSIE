import { Alert, Text } from "react-native";
import { hostForAppCalls } from "./hostCallConst";
import { loggedInUser } from "./loginCalls";
import React from "react";

const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";

const searchForRecipes = async (inputtedSearch, setShowStuff, navigation, setSearchResults, setNoResults) => {

    if (inputtedSearch.trim() === '') {
        Alert.alert("Empty Input", "Please enter a search paramter.");
        return false;
    } else {

        getUserData(loggedInUser)
        .then(async (userData) => {
          console.log(userData);
    
          console.log('Health of user: ', userData.health);
          console.log('Diet of user: ', userData.diet);
          //get strings for health and diet to append to fullLink
          var healthString = getHealthString(userData.health);
          console.log("HEALTH STRING: ", healthString);
  
          var dietString = getDietString(userData.diet);
          console.log("DIET STRING: ", dietString);
  
          //Show the search results
          setShowStuff(true);
  
          //Call restricitons file to get array HERE
          const fullLink = edamamLink + inputtedSearch + dietString + healthString;
          console.log(fullLink);
  
          try {
              fetch(fullLink, { 
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }).then(resp => resp.json())
                .then(results => {
                  if (results.hits == undefined) {                            
                    setNoResults(true);
                  } else {
                    setNoResults(false);
                    let arrayOfResults = [];
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

                    results.hits.forEach(async data => {
                      const source = data.recipe.source;
                      const sourceURL = data.recipe.url;
                      const viableSource = sourceIsViable(source, sourceURL);
                      if(viableSource)
                      {
                        let imageURL;
                        // console.log(data);
                        console.log(data.recipe.ingredientLines);

                        // console.log(data.recipe);
                        // console.log(data.recipe.image.url);
                        // console.log(data.recipe);
                        // let lowerCaseSource = source.toLowerCase().trim();
                        // const recipeSiteEndpoint = `${hostForAppCalls}/api/v1/scrape-recipe/?recipeLink=${sourceURL}&source=${lowerCaseSource}`;
                        // console.log("recipe endpoint: ", recipeSiteEndpoint);
                        
                        // const resp = await fetch(recipeSiteEndpoint, {
                        //     method: 'GET',
                        //     headers: {
                        //         'Accept': 'application/json',
                        //         'Content-Type': 'application/json'
                        //     }
                        // });
                        
                        // if (!resp.ok) {
                        //     throw new Error('Failed to fetch recipe directions');
                        // }

                        if (data.recipe.images && data.recipe.images.LARGE && data.recipe.images.LARGE.url) {
                          imageURL = data.recipe.images.LARGE.url;
                        } else {
                            // add default image if not found
                            imageURL = '../assets/emptyPlate.jpeg';
                            imageURL = 'https://www.pdclipart.org/albums/Household_Items/normal_dinner_plate_with_spoon_and_fork.png';
                        }
                        let caloriesAsWholeNumber = Math.round(data.recipe.calories);

                        let ingredientsString = "";

                        for(var i = 0; i < data.recipe.ingredientLines.length; i++){
                          ingredientsString += data.recipe.ingredientLines[i];
                          if(i < (data.recipe.ingredientLines.length - 1)){
                            ingredientsString += ", ";
                          }
                        }
                        console.log(ingredientsString);

                        var individualRecipe = {
                            name: data.recipe.label,
                            image: imageURL,
                            uri: data.recipe.uri,
                            calories: caloriesAsWholeNumber,
                            ingredients: ingredientsString,
                            source: source,
                            sourceURL: sourceURL
                            // ingredients: ingredientsArray
                        }
                        // console.log('individual recipe\n' + individualRecipe.name + ', ' + individualRecipe.image + ', ' + individualRecipe.calories + '\n-----------\n');

                        // ensures no two recipes are added twice
                        if(!(arrayOfResults.some(thisRecipe => thisRecipe.uri === data.recipe.uri))){
                          arrayOfResults.push(individualRecipe);
                          console.log("individual recipe: ",individualRecipe);
                        }

                        // link.onclick = () => showRecipe(data, data.recipe.source);
                      }
                    });
                    setSearchResults(arrayOfResults);
                    console.log('#################################');
                  }
              });
          } catch (e) {
            console.log(e);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
}


function sourceIsViable(source, sourceURL){
    switch(source) {
      case 'BBC Good Food':
        if(sourceURLIsViable(sourceURL)){
          return true;
        }
        return false;
      case 'Martha Stewart':
        return true;
      case 'Food Network':
        return true;
      case 'Simply Recipes':
        return true;
      case 'Delish':
        return true;
      case 'EatingWell':
        return true;
      default:
        return false;
    }
  }
      //this is to see if bbc good food link actually works
function sourceURLIsViable(sourceURL){
    const penultimateChar = sourceURL.charAt(sourceURL.length - 2);
    // console.log("penultimate char: ", penultimateChar);
    if (penultimateChar >= '0' && penultimateChar <= '9') {
        return false;
    }
    else {return true;}
}


function getHealthString(healthArray) {
    if (!healthArray.length) {
      return "";
    }
    const healthString = healthArray.map(healthItem => `&health=${healthItem}`).join('');
    return healthString;
}
  
function getDietString(dietArray) {
    if (!dietArray.length) {
      return "";
    }
    const dietString = dietArray.map(dietItem => `&diet=${dietItem}`).join('');
    return dietString;
}

async function getUserData(username){
    try {
        const response = await fetch(`${hostForAppCalls}/api/v1/users/findUserData?username=${username}`, {
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

const getRecipeDirections = async (source, sourceURL) => {
  let lowerCaseSource = source.toLowerCase().trim();
  const recipeSiteEndpoint = `${hostForAppCalls}/api/v1/scrape-recipe/?recipeLink=${sourceURL}&source=${lowerCaseSource}`;
  console.log("recipe endpoint: ", recipeSiteEndpoint);
  
  const resp = await fetch(recipeSiteEndpoint, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  });
  
  if (!resp.ok) {
      throw new Error('Failed to fetch recipe directions');
  }
  // console.log(resp);
  const realDirections = await resp.json();
  console.log(realDirections);
  let directionString = "";
  for(var i = 0; i < realDirections.length; i++){
    directionString += realDirections[i];
    if(i < (realDirections.length - 1)){
      // directionString += "\n";
    }
  }
  console.log(directionString);
  return(directionString);
}

export { searchForRecipes, getUserData, getRecipeDirections };