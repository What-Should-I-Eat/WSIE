var API = (() => {
    const host = 'localhost';
  
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
  
    return {
      getIngredients
    }
  })();
  