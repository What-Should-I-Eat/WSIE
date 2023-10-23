var Recipe = (() => {

  let recipe = [];
  let subArray = [];

  var searchRecipe = () => {
    console.log("called search recipe");
    const searchParam = document.getElementById("search-input").value;
    console.log("searching for " + searchParam);
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    try {
      fetch("http://" + host + ":8080/api/v1/search-simply-recipes/" + searchParam, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(results => {
          results.forEach(data => {
            const recipeName = document.createElement('li');
            const link = document.createElement('a');
            link.href = data.link;
            link.textContent = data.title;
            link.onclick = () => showRecipe(data.link);
            recipeName.appendChild(link);
            recipeList.appendChild(recipeName);
          });
        });
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }
    return false;
  }

  async function showRecipe(link) {
    //HTML stuff - clear it before anything happens (user might have clicked multiple recipes so need it to refresh)
    const recipeTitleHeader = document.getElementById('recipe-name'); //Title of the recipe 
    const ingredientsHeader = document.getElementById('ingredients'); //Name: ingredients
    const ingredientList = document.getElementById('ingredient-list'); //List of ingredients
    const directionsHeader = document.getElementById('directions'); //Name: directions
    const directionsList = document.getElementById('directions-list');//List of directions
    recipeTitleHeader.innerHTML = '';
    ingredientsHeader.innerHTML = '';
    ingredientList.innerHTML = '';
    directionsHeader.innerHTML = '';
    directionsList.innerHTML = '';

    //Endpoint works and returns json array
    try {
      fetch("http://" + host + ":8080/api/v1/scrape-recipe/?recipeLink=" + link, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
      .then(results => {
        //Setting up headers (need to do this here so it doesn't appear before the user selects a recipe)
        recipeTitleHeader.innerHTML = results.title;
        ingredientsHeader.innerHTML = 'Ingredients';
        directionsHeader.innerHTML = 'Directions';

        recipe = results;
        res = results;
        //Actual data
        parseResults(results);


        ingredientList.innerHTML = recipe.ingredientNames;
        directionsList.innerHTML = recipe.directions;

        //finish this - get return value from parse results then populate lists

      
      });
  } catch (e) {
    console.log(e);
    console.log('________________________________');
  }



  //REDIRECT USER TO DIFFERENT PAGE
  //window.location.href = link;
  return false;
  }

  //Gets restricted ingredients from db based on user's inputted restriction
  //Parameter is full recipe
  async function parseResults(ingredientResults) {
    try {
      const restriction = document.getElementById('restriction-input').value;
      const ingredientNames = ingredientResults.ingredientNames;
      let updatedRecipe = [];
  
      const response = await fetch("http://" + host + ":8080/api/v1/restrictions", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  
      const results = await response.json();
  
      for (const data of results) {
        if (data.name === restriction) {
          const restrictedIngredients = data.tags;
          console.log("found", data.name);
          console.log(restrictedIngredients);
  
          const badIngredients = getRestrictedIngredientsInRecipe(ingredientNames, restrictedIngredients);
          console.log("Back to parseResults()", badIngredients);
  
          subArray = await getSubstitutionsForRecipe(ingredientResults, badIngredients);
          console.log("back in original method"); //works up until here
  
          recipe.ingredientNames = getUpdatedRecipe(recipe.ingredientNames);
          recipe.ingredientList = getUpdatedRecipe(recipe.ingredientList);
          recipe.directions = getUpdatedRecipe(recipe.directions);

        }
      }
  
      console.log("UPDATED RECIPE", updatedRecipe);
      return updatedRecipe;
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }
  }
  

//Finds and returns ingredients in the recipe that are restricted
function getRestrictedIngredientsInRecipe(ingredientsOfRecipe, ingredientsRestrictedForUser){
  console.log('made it to before we call ingredients endpoint');
  console.log("recipe ingredients", ingredientsOfRecipe);
  console.log("restricted ingredients", ingredientsRestrictedForUser);

  const badIngredientsInRecipe = [];

  for(let i = 0; i < ingredientsOfRecipe.length; i++){
    const ingredient = ingredientsOfRecipe[i];

    if(ingredientsRestrictedForUser.some(restrictedIngredient => ingredient.includes(restrictedIngredient))){
      badIngredientsInRecipe.push(ingredient);
    }
  }

  return badIngredientsInRecipe;
}


async function getSubstitutionsForRecipe(ingredientArray, badIngredients) {
  const ingredientSubs = [];

  try {
    const response = await fetch("http://" + host + ":8080/api/v1/ingredients", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const results = await response.json();

    for (const data of results) {
      if (badIngredients.some(badIngredient => badIngredient.toLowerCase() === data.name.toLowerCase())) {
        console.log('Found bad ingredient:', data.name);
        const alternatives = data.tags[0].alternatives;
        if (alternatives.length > 0) {
          const badIngredientName = data.name;
          alternatives.forEach(substitution => {
            const isAlternativeRestricted = badIngredients.includes(substitution.toLowerCase());
            if (!isAlternativeRestricted) {
              ingredientSubs.push({ original: badIngredientName, substitution:substitution });
            }
          });
        }
      }
    }

    console.log('Substitutions:', ingredientSubs);
  } catch (e) {
    console.log(e);
    console.log('________________________________');
  }
  return ingredientSubs;
}

function getUpdatedRecipe(list) {

    for (let i = 0; i < list.length; i++) {
      for (const item of subArray) {

        // if (list[i].toLowerCase().includes(item.original.toLowerCase())) {
        //   list[i] = item.substitution;
        //   break; // Once we find a match, no need to continue searching
        // }
        

        if (list[i].toLowerCase().includes(item.original.toLowerCase())) {
          const lowercaseOriginal = item.original.toLowerCase();
          const index = list[i].toLowerCase().indexOf(lowercaseOriginal);
          
          if (index !== -1) {
            const before = list[i].slice(0, index); // Portion before the match
            const after = list[i].slice(index + lowercaseOriginal.length); // Portion after the match
            
            list[i] = before + item.substitution + after; // Combine the parts with the substitution
          }
        }
      }
    }

    console.log(list);
    console.log('----------new', recipe);
}


  
  return {
    searchRecipe
  }
})();


