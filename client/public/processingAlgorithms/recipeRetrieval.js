var Recipe = (() => {

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

  function showRecipe(link) {

    try {
      fetch("http://" + host + ":8080/api/v1/scrape-recipe/?recipeLink=" + link, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())
        .then(results => {
          const recipeContent = document.getElementById('recipe-content'); 
          recipeContent.textContent = JSON.stringify(results, null, 2);
        });
    } catch (e) {
      console.log(e);
      console.log('________________________________');
    }


    //REDIRECT USER TO DIFFERENT PAGE
    //window.location.href = link;
    return false;
  }

  
  return {
    //generateAlternatives,
    searchRecipe
  }
})();


