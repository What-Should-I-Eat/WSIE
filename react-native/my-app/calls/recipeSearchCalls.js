import { Alert } from "react-native";
import * as CONST from "../calls/constants.js";
import {utils} from "../calls/utils.js";
import { loggedInUser } from "./loginCalls";

// const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";
// console.log("EDAMAM")
// console.log(CONST.EDAMAM_API_EMPTY_SEARCH_URL)

const nameTypLabs = ["diet","health"]
this.buildBaseUrl = (searchParam,dietLabels,healthLabels) => { 
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
  if (!searchParam && !userSelectedMealTypes && !userSelectedDishTypes && !userSelectedCuisineTypes && !userSelectedDietLabels && !userSelectedHealthLabels) {
    baseUrl += `${getCurrentTimeMealType()}`;
  }
  return baseUrl;
};


this.getPublicUserRecipes = async () => {
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

const searchForRecipes = async (inputtedSearch, setShowStuff, navigation, setSearchResults, setNoResults) => {

    if (inputtedSearch.trim() === '') {
        Alert.alert("Empty Input", "Please enter a search paramter.");
        return false;
    } else {
        utils.getUserIdFromUsername(loggedInUser)
        .then(async (userData) => {
          const fullLink = buildBaseUrl(inputtedSearch,userData.diet,userData.health)  
          //Show the search results
          console.log(userData)
          setShowStuff(true);
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
                    results.hits.forEach(async data => {
                      const source = data.recipe.source;
                      console.log(source)
                      const sourceURL = data.recipe.url;
                      let imageURL;
                      if (data.recipe.images && data.recipe.images.LARGE && data.recipe.images.LARGE.url) {
                        imageURL = data.recipe.images.LARGE.url;
                      } else if (data.recipe.images && data.recipe.images.REGULAR && data.recipe.images.REGULAR.url) {
                        imageURL = data.recipe.images.REGULAR.url;
                      } else if (data.recipe.images && data.recipe.images.SMALL && data.recipe.images.SMALL.url) {
                        imageURL = data.recipe.images.SMALL.url;
                      } else {
                          // add default image if not found
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
                        console.log("individual recipe: ", individualRecipe);
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
}

this.renderRecipes = (recipes, publicUserRecipes, container) => {
  container.empty();
  addedRecipesSet.clear();
  let dropDownIndex = 0;
  const fromTo = `${recipes.from}-${recipes.to}`;
  console.log(recipes.hits)
  recipes.hits.forEach(async data => {
    const recipe = data.recipe;
    const recipeUri = recipe.uri;
    const recipeUrl = recipe.url;
    const recipeSource = recipe.source;
    const recipeName = recipe.label;
    const identifier = `${recipe.label}-${recipe.source}`;
    const username = utils.getUserNameFromCookie();
    const isFavorite = await utils.checkIfFavorite(username, recipeName);

    if (!addedRecipesSet.has(identifier)) {
      console.log("Hello")
      addedRecipesSet.add(identifier);

      var individualRecipe = {
        name: recipe.label,
        image: utils.hasValidImage(recipe) ? recipe.images.REGULAR.url : NO_IMAGE_AVAILABLE,
        uri: recipe.uri,
        calories: Math.round(recipe.calories),
        ingredients: await utils.getRecipeDetails(data.recipe.uri),
        source: recipe.source,
        sourceURL: recipe.url
      }
      container.append(individualRecipe);
    } 
    else {
      console.debug(`Skipping duplicate recipe: [${recipe.label}] from source: [${recipe.source}], sourceUrl: [${recipe.url}]`);
    }
    dropDownIndex++;
  });
// Only render publicUserRecipes if showPublicRecipes is true
console.log(showPublicRecipes && publicUserRecipes == true)
if (showPublicRecipes && publicUserRecipes) {
    pubRecipesTo = (recipes.to/5);
    pubRecipesFrom = pubRecipesTo-4;
    userRecipesToShow = publicUserRecipes.slice(pubRecipesFrom,pubRecipesTo);
    userRecipesToShow.forEach(async recipe => {
      console.log(recipe.recipeName)
      const recipeName = recipe.recipeName;
      const recipeImage = hasValidUserCreatedImage(recipe) ? recipe.recipeImage : NO_IMAGE_AVAILABLE;

      const username = utils.getUserNameFromCookie();
      const isOwner = username && username === recipe.usernameCreator;
      const icon = isOwner ? PUBLIC_RECIPE_OWNER_ICON : PUBLIC_RECIPE_ICON;
      const parameter = isOwner ? PUBLIC_RECIPE_OWNER_URL_PARAMETER : PUBLIC_RECIPE_URL_PARAMETER;
      const recipeType = isOwner ? "user" : "public user";
      const isFavorite = await utils.checkIfFavorite(username, recipeName);

      console.debug(`Adding ${recipeType} created recipe: [${recipeName}]`);
      container.append(recipeHtml);
      dropDownIndex++;
    });
  }
};




// function sourceIsViable(source, sourceURL){
//     switch(source) {
//       case 'BBC Good Food':
//         if(sourceURLIsViable(sourceURL)){
//           return true;
//         }
//         return false;
//       case 'Martha Stewart':
//         return true;
//       case 'Food Network':
//         return true;
//       case 'Simply Recipes':
//         return true;
//       case 'Delish':
//         return true;
//       case 'EatingWell':
//         return true;
//       default:
//         return false;
//     }
//   }
// //this is to see if bbc good food link actually works
// function sourceURLIsViable(sourceURL){
//     const penultimateChar = sourceURL.charAt(sourceURL.length - 2);
//     if (penultimateChar >= '0' && penultimateChar <= '9') {
//         return false;
//     }
//     else {return true;}
// }


// function getHealthString(healthArray) {
//     if (!healthArray.length) {
//       return "";
//     }
//     const healthString = healthArray.map(healthItem => `&health=${encodeURIComponent(healthItem)}`).join('');
//     return healthString;
// }
  
// function getDietString(dietArray) {
//     if (!dietArray.length) {
//       return "";
//     }
//     const dietString = dietArray.map(dietItem => `&diet=${encodeURIComponent(dietItem)}`).join('');
//     return dietString;
// }

// async function getUserFromUsername(username){
//     try {
//         const response = await fetch(`${CONST.GET_USER_DATA_URL}=${username}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         if (response.status != 200) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         return data;
//     } 
//     catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//         return "";
//     }
// }

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

export { searchForRecipes, getRecipeDirections };


