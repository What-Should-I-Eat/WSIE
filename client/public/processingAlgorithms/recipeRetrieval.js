
var Recipe = (() => {

  const host = 'localhost';
  let recipe = [];
  let substitutionArray = [];
  const NUT_BUTTER = ["peanut butter", "almond butter", "hazelnut butter", "coconut butter", "nut butter", "cookie butter"];
  let restrictionList = [];
  const ingredientSubstitutions = {
    substitutionOptions: []
  }; 
  let restrictedIngredientCount = 0;

  var searchRecipe = () => {
    //Hide recipe on new search (if it exists)
    const selectedRecipeDetails = document.getElementById('selected-recipe-details');
    selectedRecipeDetails.style.display = 'none';

    //Show the search results
    const recipeListDiv = document.getElementById('recipe-list');
    recipeListDiv.style.display = 'block';


    const searchParam = document.getElementById("search-input").value;
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
          //clearRecipeDetails();
          results.forEach(data => {
            console.log("AHHHHHHHHHHHHHHHH");
            const recipeName = document.createElement('li');
            const link = document.createElement('a');
            //link.href = data.link; //--> this makes it redirect to the actual page of the webiste so we don't need it
            //But perhaps we'll keep it for now so that the user can go see the original recipe if they want
            link.textContent = data.title;
            link.onclick = () => showRecipe(data.link);
            recipeName.appendChild(link);
            recipeList.appendChild(recipeName);

          });
        });
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  async function showRecipe(link) {

     //Hide search results
     const recipeList = document.getElementById('recipe-list');
     recipeList.style.display = 'none';
 
     //Show recipe
     const selectedRecipeDetails = document.getElementById('selected-recipe-details');
     selectedRecipeDetails.style.display = 'block';

    //HTML stuff - clear it before anything happens (user might have clicked multiple recipes so need it to refresh)
    const recipeTitleHeader = document.getElementById('recipe-name'); //Title of the recipe 
    const ingredientsHeader = document.getElementById('ingredients'); //Name: ingredients
    const ingredientList = document.getElementById('ingredient-list'); //List of ingredients
    const directionsHeader = document.getElementById('directions'); //Name: directions
    const directionsList = document.getElementById('directions-list');//List of directions
    const restriction = document.getElementById('restriction-input').value; //restriction
    recipeTitleHeader.innerHTML = '';
    ingredientsHeader.innerHTML = '';
    ingredientList.innerHTML = '';
    directionsHeader.innerHTML = '';
    directionsList.innerHTML = '';

    //Endpoint works and returns json array of recipe
    try {
      fetch("http://" + host + ":8080/api/v1/scrape-recipe/?recipeLink=" + link, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(async results => {
          //Setting up headers (need to do this here so it doesn't appear before the user selects a recipe)
          recipeTitleHeader.innerHTML = results.title;
          ingredientsHeader.innerHTML = 'Ingredients';
          directionsHeader.innerHTML = 'Directions';
          recipe = results;

          //Actual data
          const updatedRecipe = await parseResults(results, restriction);

          ingredientList.innerHTML = '<ul>' + updatedRecipe.ingredientList.map(item => `<li>${item}</li>`).join('') + '</ul>';
          directionsList.innerHTML = '<ul>' + updatedRecipe.directions.map(item => `<li>${item}</li>`).join('') + '</ul>';
    
        });
      } catch (e) {
        console.log(e);
      }
  return false;
  }

  //Gets restricted ingredients from db based on user's inputted restriction
  //Parameter is full recipe
  async function parseResults(ingredientResults, restriction) {
    console.log("parsing results");
    try {
      const ingredientNames = ingredientResults.ingredientNames;
      let updatedRecipe = [];
      restrictionList.push(restriction);
  
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
  
          console.log("original recipe: ", ingredientResults);
          const badIngredients = getRestrictedIngredientsInRecipe(ingredientNames, restrictedIngredients);
  
          await getSubstitutionsForRecipe(badIngredients);
          console.log('Substitutions:', ingredientSubstitutions);
  
          const handleDifferently = true;
          recipe.ingredientNames = getUpdatedIngredientNames(recipe.ingredientNames, handleDifferently);
          recipe.ingredientList = getUpdatedIngredientNames(recipe.ingredientList, !handleDifferently);
          recipe.directions = getUpdatedIngredientNames(recipe.directions, !handleDifferently);
        }
      }
  
          console.log('--Ingredient names', recipe.ingredientNames);
          console.log('--Ingredient list', recipe.ingredientList);
          console.log('--Recipe Directions', recipe.directions);

      updatedRecipe = recipe;
      console.log("UPDATED RECIPE", updatedRecipe);
      return updatedRecipe;
    } catch (e) {
      console.log(e);
    }
  }
  

//Finds and returns ingredients in the recipe that are restricted
function getRestrictedIngredientsInRecipe(ingredientsOfRecipe, ingredientsRestrictedForUser){
  console.log("recipe ingredients", ingredientsOfRecipe);
  console.log("restricted ingredients for this user ", ingredientsRestrictedForUser);

  const badIngredientsInRecipe = [];

  for(let i = 0; i < ingredientsOfRecipe.length; i++){
    const ingredientOfRecipe = ingredientsOfRecipe[i];

    let addBadIngredient = handleEdgeCaseBadIngredients(ingredientOfRecipe, ingredientsRestrictedForUser);
    if(addBadIngredient){
      badIngredientsInRecipe.push(ingredientOfRecipe);
    }
  }
  return badIngredientsInRecipe;
}

//Handles cases of ingredients that should or should not be added to badIngredients list
//Currently only handles the nut butter issue but will be expanded
function handleEdgeCaseBadIngredients(ingredientOfRecipe, ingredientsRestrictedForUser){

  //Checks if a portion of the recipe ingredient string is included in ingredientsRestrictedForUser
    if (ingredientsRestrictedForUser.some(restrictedIngredient => ingredientOfRecipe.includes(restrictedIngredient))) {
      
      //check for milk prefix - ex: almond milk should not be flagged as milk and substituted for milk allergy
      if(ingredientOfRecipe.includes('milk') && !ingredientsRestrictedForUser.some(restrictedIngredient => restrictedIngredient.includes('nut')))
      {
        if(ingredientOfRecipe.includes('almond') || ingredientOfRecipe.includes('coconut') || ingredientOfRecipe.includes('soy') || ingredientOfRecipe.includes('oat'))
        {
          return false;
        }
      }
      //Checks if the string includes the word "butter" and is not referring to dairy butter (need to abstract this somehow)
      if (!NUT_BUTTER.some(nutButter => ingredientOfRecipe.toLowerCase().includes(nutButter))) {
        console.log("-- added " + ingredientOfRecipe + " to restricted ingredients ");
        return true;
      }
    }

    return false;
}

//Params are original ingredients and identified bad ingredients
async function getSubstitutionsForRecipe(badIngredients) {

  try {
    const response = await fetch("http://" + host + ":8080/api/v1/ingredients", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const results = await response.json();

    //Iterate through ingredient db: match a badIngredients array element with a substitution from the database
    results.forEach(ingredientDB => {
      //Matches each badIngredient element with an ingriedient in the ingredients database
      if(badIngredients.some(badIngredient => badIngredient.toLowerCase().includes(ingredientDB.name.toLowerCase()))){
        console.log("found bad ingredient: " + " matching db ingredient: " + ingredientDB.name);
        
        const alternativesList = [];
        const alternatives = ingredientDB.tags[0].alternatives;
        alternativesList.push(...alternatives);
        console.log("alternatives to this ingredient: ", alternativesList);

        ingredientSubstitutions.substitutionOptions.push({
          original: ingredientDB.name,
          substitutions: alternatives
        });
        restrictedIngredientCount++;
      }


    });
  } catch (e) {
    console.log(e);
  }
}

//Changes every instance of a restricted ingredient to an alternative ingredient in the various recipe lists
//Parameter is a list of the recipe (ex: ingredientNames)
function getUpdatedIngredientNames(list, handleDifferently) {

  console.log("getUpdated recipe called for " + list);
  
  list.forEach((line, lineIndex) => {
    line = line.toLowerCase();
    console.log("line = " + line);
    for (let i = 0; i < restrictedIngredientCount; i++) {
      let originalIngredient = ingredientSubstitutions.substitutionOptions[i].original;
  
      // Check if the line contains the original ingredient
      if (line.toLowerCase().includes(originalIngredient)) {
        console.log("*FOUND " + originalIngredient + " in the original recipe");
  
        let substitutedIngredient = ingredientSubstitutions.substitutionOptions[i].substitutions[0];
        console.log("substitution for " + originalIngredient + " = " + substitutedIngredient);
        let quantity = line.split(' ')[0]; 
        console.log("quantity = " + quantity);
        
        //Replace restricted ingredient with substitution
        line = line.replace(new RegExp(originalIngredient, 'gi'), substitutedIngredient);
        console.log("NEW LINE WITH SUBS: " + line);
      }
    }
  
    // Update the line in the list
    list[lineIndex] = line;
  });

    console.log("*** new list *** " + list);
    return list;
}

  
  return {
    searchRecipe
  }
})();


