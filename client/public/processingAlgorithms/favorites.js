document.addEventListener('DOMContentLoaded', async () => {
  const username = getUsername('name');

  fetch(`${host}/api/v1/users/findUser/${username}`, {
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
         
        // conditional gets rid of undefined
        if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
          const favoriteElement = document.createElement('div');
          favoriteElement.classList.add('recipe-item');

          favoriteElement.innerHTML = `
              <img src="${recipe.recipeImage}" alt="${recipe.recipeName}">
              <h2><a href="#" class="recipe-link">${recipe.recipeName}</a></h2>
          `;

          //Render ingredients and directions on click (toggles)
          const ingredientsElement = document.createElement('p');
          ingredientsElement.innerHTML = `<strong>Ingredients:</strong> ${recipe.recipeIngredients.join(', ')}`;
          ingredientsElement.style.display = 'none';

          const directionsElement = document.createElement('p');
          directionsElement.innerHTML = `<strong>Directions:</strong> ${recipe.recipeDirections}`;
          directionsElement.style.display = 'none';

          
          favoriteElement.addEventListener('click', (event) => {

            event.preventDefault();

            ingredientsElement.style.display = ingredientsElement.style.display === 'none' ? 'block' : 'none';
            directionsElement.style.display = directionsElement.style.display === 'none' ? 'block' : 'none';
          });

          favoritesContainer.appendChild(favoriteElement);
          favoritesContainer.appendChild(ingredientsElement);
          favoritesContainer.appendChild(directionsElement);

          const line = document.createElement('hr');
          favoritesContainer.appendChild(line);
        }
      });
    })
    .catch(error => {
      console.error('Fetch error: ', error);
    });
});
