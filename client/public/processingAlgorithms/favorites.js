document.addEventListener('DOMContentLoaded', async () => {
    const username = getUsername('name');
  
    fetch(`http://${host}/api/v1/users/findUser/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Cannot find user');
        }
        return response.json();
      })
      .then(user => {
        console.log('User found: ', user);

        const favoritesContainer = document.getElementById('favorites-container');

        user.favorites.forEach(recipe => {
          console.log(recipe);
           
          //conditional gets rid of undefined
           if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe-item');

            recipeElement.innerHTML = `
                <img src="${recipe.recipeImage}" alt="${recipe.recipeName}">
                <h2>${recipe.recipeName}</h2>
            `;

            favoritesContainer.appendChild(recipeElement);
            const line = document.createElement('hr');
            favoritesContainer.appendChild(line);
          }
          
        });
      })
      .catch(error => {
        console.error('Fetch error: ', error);
      });
});