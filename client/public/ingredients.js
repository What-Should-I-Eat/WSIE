const host = 'localhost';

var API = (() => {
  

  var getIngredients = () => {
    console.log("getIngredients function called");
    try {
      fetch("http://" + host + ":8080/api/v1/ingredients", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(results => {
          results.forEach(data => {
            showRow(data);
          });
        });
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }
    return false;
  }

  function showRow(data) {
    var ingredientTableEntries = document.getElementById('ingredients-table-entries');
    var newIngredientRow = document.createElement('tr');

    // Ingredient name
    var ingredientCell = document.createElement('td');
    ingredientCell.textContent = data.name;
    newIngredientRow.appendChild(ingredientCell);

    // Tags
    var tagsCell = document.createElement('td');
    tagsCell.textContent = data.tags.map(tag => tag.restrictions.join(", ")).join("\n");
    newIngredientRow.appendChild(tagsCell);

    ingredientTableEntries.appendChild(newIngredientRow);
  }

  var generateAlternatives = () => {
    const restriction = document.getElementById("restriction-input").value;
    const ingredient = document.getElementById("ingredient-input").value;
    console.log(restriction);
    console.log(ingredient);

    try {
      fetch("http://" + host + ":8080/api/v1/ingredients", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(results => {
          results.forEach(data => {
            if (data.name == ingredient) {
              console.log(data.tags[0].alternatives);
            }
          });
        });
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }

    return false;
  }

  var searchRecipe = () => {
    console.log("called search recipe");
    const searchParam = document.getElementById("search-input").value;
    console.log("searching for " + searchParam);

    try {
      fetch("http://" + host + ":8080/api/v1/search-simply-recipes/" + searchParam, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(results => {
          clearTable();
          showTableHeaders();
          results.forEach(data => {
            showRow(data.title, data.link);
          });
        });
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }


    return false;
  }

  function showTableHeaders() {
    var recipeResultsHeader = document.getElementById('search-results-header');
    var headerRow = document.createElement('tr');
    var recipeNameHeader = document.createElement('th');
    var recipeLinkHeader = document.createElement('th');

    recipeNameHeader.textContent = 'Recipe';
    recipeLinkHeader.textContent = 'Link';

    headerRow.appendChild(recipeNameHeader);
    headerRow.appendChild(recipeLinkHeader);
    recipeResultsHeader.appendChild(headerRow);
}

function showRow(title, link) {

  var recipeItem = document.getElementById('recipe-items');
  var newRecipeRow = document.createElement('tr');

  //recipe title
  var titleCell = document.createElement('td');
  titleCell.textContent = title;
  newRecipeRow.appendChild(titleCell);

  //recipe link
  var linkCell = document.createElement('td');
  linkCell.textContent = link;
  newRecipeRow.appendChild(linkCell);

  recipeItem.appendChild(newRecipeRow);

}

function clearTable() {
  var recipeItems = document.getElementById('recipe-items');
  var recipeResultsHeader = document.getElementById('search-results-header');

  //Clear rows
  while (recipeItems.rows.length > 0) {
    recipeItems.deleteRow(0);
  }

  //Clear headers
  while (recipeResultsHeader.firstChild) {
    recipeResultsHeader.removeChild(recipeResultsHeader.firstChild);
  }
}


  
  return {
    //getIngredients,
    generateAlternatives,
    searchRecipe
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  // Call the getIngredients function when the page finishes loading
  API.getIngredients();

  // Add event listener for form submission
  const form = document.getElementById('restriction-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
      API.generateAlternatives();
    });
  }
});
