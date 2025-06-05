import { Alert } from "react-native";
import * as CONST from "../calls/constants.js";
import {utils} from "../calls/utils.js";
import { loggedInUser } from "./loginCalls";
import { useEffect } from "react";




// const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";
// console.log("EDAMAM")
// console.log(CONST.EDAMAM_API_EMPTY_SEARCH_URL)


this.buildBaseUrl = (searchParam,dietLabels,healthLabels) => { 
  const nameTypLabs = ["diet","health"]
  console.debug(`searchParam: ${searchParam}`);
  let baseUrl = searchParam ? `${CONST.EDAMAM_API_URL}${searchParam}` : CONST.EDAMAM_API_EMPTY_SEARCH_URL;
  var varTypLabs = [dietLabels,healthLabels]
  for (const i in nameTypLabs)  {
    temp=
      varTypLabs[i]
      .filter(TypLab => TypLab)
      .map(TypLab => `&${nameTypLabs[i]}=${encodeURIComponent(TypLab.toLowerCase())}` )
      .join('')
      //Appending filter to URL
      baseUrl += temp
      console.debug(`Added [${nameTypLabs[i]}] to query: ${temp}`);
      ;
  };
  // If the user did not provide a search parameter or filters, show the user meals based on the current time
  if (!searchParam) {
    baseUrl += `${getCurrentTimeMealType()}`;
  }
  return baseUrl;
};


const getPublicUserRecipes = async () => {
  console.log(`Querying Server for Public User Recipes at: [${CONST.PUBLIC_USER_RECIPES_URL}]`)

  try {
    const response = await fetch(CONST.PUBLIC_USER_RECIPES_URL, {
      method: CONST.GET_ACTION,
      headers: {
        'Accept': CONST.DEFAULT_DATA_TYPE,
        'Content-Type': CONST.DEFAULT_DATA_TYPE
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error()
      throw new Error(CONST.ERROR_GETTING_PUBLIC_USER_RECIPES);
    }
  } catch (error) {
    // Log the error here but don't flash user with error
    console.error(CONST.ERROR_GETTING_PUBLIC_USER_RECIPES);
  }
}

  // Getting User Profile Data
  this.getApiUrl = async (searchParam, apiUrl, pageUrl, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels) => {
    if (pageUrl) return pageUrl;

    let baseUrl = apiUrl || this.initialPageUrl;
    if (!baseUrl) {
      baseUrl = this.buildBaseUrl(searchParam, mealTypes, dishTypes, cuisineTypes,dietLabels,healthLabels);
      console.log(baseUrl)
      const username = utils.getUserNameFromCookie();
      if (username) {
        try {
          const userData = await utils.getUserFromUsername(username);
          const userDietString = getUserDietString(userData.diet);
          const userHealthString = getUserHealthString(userData.health);

          if (userDietString) {
            console.debug(`Added [userDietString] to query: ${userDietString}`);
            baseUrl += userDietString
          }

          if (userHealthString) {
            console.debug(`Added [userHealthString] to query: ${userHealthString}`);
            baseUrl += userHealthString
          }
        } catch (error) {
          console.error(ERROR_UNABLE_TO_GET_USER, error);
          utils.showAjaxAlert("Error", ERROR_UNABLE_TO_GET_USER);
          return;
        }
      }

      this.initialPageUrl = baseUrl;
    }

    return baseUrl;
  };

// Main Function fo rsearchiing for recipes
  async function searchForRecipes(inputtedSearch, setShowStuff, navigation, setSearchResults, setNoResults) {
    utils.getUserIdFromUsername(loggedInUser)
    .then(async (userData) => {
      const fullLink = buildBaseUrl(inputtedSearch,userData.diet,userData.health)  
      //Show the search results
      setShowStuff(true);
      // console.log(fullLink);
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
                results.hits.forEach(async data => {
                  const source = data.recipe.source;
                  const sourceURL = data.recipe.url;
                  imageURL = utils.hasValidImage(data.recipe) ? data.recipe.images.REGULAR.url : CONST.NO_IMAGE_AVAILABLE;

                  let caloriesAsWholeNumber = Math.round(data.recipe.calories);

                  let ingredientsString = "";
                  for(var i = 0; i < data.recipe.ingredientLines.length; i++){
                    ingredientsString += data.recipe.ingredientLines[i];
                    if(i < (data.recipe.ingredientLines.length - 1)){
                      ingredientsString += ", ";
                    }
                  }

                  var individualRecipe = {
                    name: data.recipe.label,
                    image: imageURL,
                    uri: data.recipe.uri,
                    calories: caloriesAsWholeNumber,
                    ingredients: ingredientsString,
                    source: source,
                    sourceURL: sourceURL
                  }

                  // ensures no two recipes are added twice
                  if(!(arrayOfResults.some(thisRecipe => thisRecipe.uri === data.recipe.uri))){
                    arrayOfResults.push(individualRecipe);
                  }
                }
              );
                  setSearchResults(arrayOfResults);                   
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

// Load effect to display recipes for initial load
async function initialRecipes(inputtedSearch, setShowStuff, navigation, setSearchResults, setNoResults){
  useEffect(() =>{ searchForRecipes(inputtedSearch, setShowStuff, navigation, setSearchResults, setNoResults)},[])
}


function getCurrentTimeMealType() {
  const hours = new Date().getHours();

  if (hours < 5 || hours > 21) {
    return "&mealType=snack";
  } else if (hours <= 10) {
    return "&mealType=breakfast";
  } else if (hours <= 15) {
    return "&mealType=lunch";
  } else {
    return "&mealType=dinner";
  }
}

const getRecipeDirections = async (source, sourceURL) => {
  let lowerCaseSource = source.toLowerCase().trim();
  const recipeSiteEndpoint = `${CONST.HOST}/api/v1/scrape-recipe/?recipeLink=${sourceURL}&source=${lowerCaseSource}`;
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
  const realDirections = await resp.json();

  let directionString = "";
  let entryLines = 1;
  if(!realDirections || realDirections.length == 0){
    directionString = "N/A";
  } else{
    for(var i = 0; i < realDirections.length; i++){
      if(realDirections[i] != "Rachel Marek"){
        directionString += entryLines + ") ";
        directionString += realDirections[i];
        if(i < (realDirections.length - 1)){
          directionString += "\n";
        }
        entryLines++;
      }
    }
  }
  console.log(directionString);
  return(directionString);
}

export { searchForRecipes,initialRecipes, getPublicUserRecipes, getRecipeDirections };


