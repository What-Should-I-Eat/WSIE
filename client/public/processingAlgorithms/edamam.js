const edamamLink = "https://api.edamam.com/api/recipes/v2?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9&q=";
const host = 'localhost';
//IDEA: filter from one recipe website and build a scraper for the directions for that website

var restrictionObject = {
  selectedRestrictions: [],
  selectedAllergies: [],
};

var edamam = (() => {

  var handleRestrictions = () => {
    console.log('handling restrictions in edamam.js');
    console.log('selected allergies in edamam: ', restrictionObject.selectedAllergies);
    console.log('selected Restrictions in edamam: ', restrictionObject.selectedRestrictions);
  }


    var searchRecipe = () => {

      console.log('Restictions of user: ', restrictionObject.selectedRestrictions);
      console.log('Allergies of user: ', restrictionObject.selectedAllergies);

        const restrictionsArray = restrictionsHandler.selectedRestrictions;
        const allergiesArray = restrictionsHandler.selectedAllergies;

        console.log('EDAMAM restrictions', restrictionsArray);
        console.log('EDAMAM allergies', allergiesArray);


        //Hide recipe on new search (if it exists)
        const selectedRecipeDetails = document.getElementById('selected-recipe-details');
        selectedRecipeDetails.style.display = 'none';

        //Show the search results
        const recipeListDiv = document.getElementById('recipe-list');
        recipeListDiv.style.display = 'block';

        const recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        const searchParam = document.getElementById('search-input').value;

        //Call restricitons file to get array HERE
        const fullLink = edamamLink + searchParam;
        console.log(fullLink);

        try {
            fetch(fullLink, { //RESTRICTIONS MUST BE ADDED TO THIS FULLLINK
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }).then(resp => resp.json())
              .then(results => {
                results.hits.forEach(data => {
                  const source = data.recipe.source;
                  const viableSource = sourceIsViable(source);
                  if(viableSource)
                  {
                    console.log(source, " - ", data.recipe.label);
                    const recipeName = document.createElement('li');
                    const link = document.createElement('a');
                    link.textContent = data.recipe.label;
                    recipeName.appendChild(link);
                    recipeList.appendChild(recipeName);
                    link.onclick = () => showRecipe(data, data.recipe.source);
                  }
                });
            });
        } catch (e) {
          console.log(e);
        }
        return false;
    }
    

    function sourceIsViable(source){
      switch(source) {
        case 'Food52':
          return true;
        case 'Martha Stewart':
          return true;
        case 'BBC Good Food':
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

    function showRecipe(json, source) {
      console.log('recipe: ', json);

      setupRecipe(json); //Recipe name and ingredients 
      const directionsList = document.getElementById('directions-list'); // List of directions
      directionsList.innerHTML = '';
      const link = json.recipe.url;
  
      // Create the URL with the recipeLink and source parameters
      const recipeSiteEndpoint = `http://${host}:8080/api/v1/scrape-recipe/?recipeLink=${link}&source=${source}`;
  
      try {
          fetch(recipeSiteEndpoint, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          })
          .then((resp) => resp.json())
          .then((results) => {
              console.log("results: ", results);
              directionsList.innerHTML = '<ul>' + results.map(item => `<li>${item[0]}</li>`).join('') + '</ul>';
          });
      } catch (e) {
        console.log(e);
      }
    return false;
  }
    
  function setupRecipe(json){
    // Hide search results
    const recipeList = document.getElementById('recipe-list');
    recipeList.style.display = 'none';

    // Show recipe
    const selectedRecipeDetails = document.getElementById('selected-recipe-details');
    selectedRecipeDetails.style.display = 'block';

    const recipeTitleHeader = document.getElementById('recipe-name'); // Title of the recipe
    const ingredientsHeader = document.getElementById('ingredients'); // Name: ingredients
    const ingredientList = document.getElementById('ingredient-list'); // List of ingredients
    const directionsHeader = document.getElementById('directions'); // Name: directions
    recipeTitleHeader.innerHTML = '';
    ingredientsHeader.innerHTML = '';
    ingredientList.innerHTML = '';
    directionsHeader.innerHTML = '';

    const ingredients = [];
    //Get ingredients from edamam response and add to ingredients array
    json.recipe.ingredientLines.forEach(ingredient => {
      ingredients.push(ingredient);
    });

    recipeTitleHeader.innerHTML = json.recipe.label;
    ingredientsHeader.innerHTML = 'Ingredients';
    ingredientList.innerHTML = `<ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>`;
    directionsHeader.innerHTML = 'Directions';
  }

  document.addEventListener('DOMContentLoaded', function () {
    restrictionsHandler.handleRestrictions();
  });
  
  return {
    searchRecipe,
    handleRestrictions
  }
})();