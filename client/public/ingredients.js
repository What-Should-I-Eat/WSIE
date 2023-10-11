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

  return {
    getIngredients,
    generateAlternatives
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
