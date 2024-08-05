$(document).ready(function () {
  const favoriteRecipesArray = [];

  document.getElementById('export-pdf').addEventListener('click', async function () {
    const data = favoriteRecipesArray;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    async function getImageDimensions(imageBase64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageBase64;
      });
    }

    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    }

    function addTextWithWrap(doc, text, x, y, maxWidth, lineHeight) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        doc.text(line, x, y);
        y += lineHeight;
        if (y > 280) { // Check if text exceeds the page height
          doc.addPage();
          y = 10;
        }
      });
      return y;
    }

    const username = utils.getUserNameFromCookie(); // Fetch the username from cookies
    const date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    for (const [index, item] of data.entries()) {
      if (index > 0) {
        doc.addPage(); // Add a new page for each item except the first
      }

      const imageBase64 = item.recipeImage;
      const imageType = item.imageType;

      const { width, height } = await getImageDimensions(imageBase64);
      const { width: fitWidth, height: fitHeight } = calculateAspectRatioFit(width, height, 60, 60);

      // Add image
      doc.addImage(imageBase64, imageType, 10, 10, fitWidth, fitHeight);

      // Recipe name
      doc.setFontSize(20);
      doc.text(item.recipeName, 80, 20, { maxWidth: 120 });

      let currentY = fitHeight + 20;

      // Ingredients
      doc.setFontSize(14);
      doc.text('Ingredients', 10, currentY);
      currentY += 10;
      doc.setFontSize(12);
      currentY = addTextWithWrap(doc, item.ingredients.join('\n'), 10, currentY, 180, 7.5);

      // Preparation
      doc.setFontSize(14);
      currentY += 10;
      doc.text('Preparation', 10, currentY);
      currentY += 10;
      doc.setFontSize(12);
      currentY = addTextWithWrap(doc, item.instructions.join('\n'), 10, currentY, 180, 7.5);

      // Nutritional Facts
      doc.setFontSize(14);
      currentY += 10;
      doc.text('Nutritional Facts', 10, currentY);
      currentY += 5; // Reduce the space here
      doc.setFontSize(12);
      const nutritionFacts = `
            Servings: ${Math.round(item.nutrition.servings)}
            Calories: ${Math.round(item.nutrition.calories)}
            Fats: ${Math.round(item.nutrition.fats)}
            Carbohydrates: ${Math.round(item.nutrition.carbs)}
            Protein: ${Math.round(item.nutrition.protein)}`;
      currentY = addTextWithWrap(doc, nutritionFacts, 10, currentY, 180, 7.5);
    }

    doc.save(`${date}-${username}-recipes.pdf`);
  });

  function MyRecipesView() {
    const container = $('.my-recipes-container');

    this.load = async () => {
      try {
        const username = utils.getUserNameFromCookie();

        if (!username) {
          console.error(INTERNAL_SERVER_ERROR_OCCURRED);
          utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
          return;
        }

        const userData = await utils.getUserFromUsername(username);

        if (!userData) {
          console.error(INTERNAL_SERVER_ERROR_OCCURRED);
          utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
          return;
        }

        this.renderMyRecipes(userData);
      } catch (error) {
        console.error(INTERNAL_SERVER_ERROR_OCCURRED);
        utils.showAjaxAlert("Error", INTERNAL_SERVER_ERROR_OCCURRED);
      }
    };

    this.renderMyRecipes = (userData) => {
      container.empty();

      const favoriteRecipes = userData.favorites;

      if (!favoriteRecipes || favoriteRecipes.length === 0) {
        container.append(this.getNoSavedRecipes());
        return;
      }

      console.log(`About to iterate through: ${favoriteRecipes.length} favorite recipes`);
      favoriteRecipes.forEach(async recipe => {
        if (isValidRecipe(recipe)) {
          const source = recipe.recipeSource;
          const sourceUrl = recipe.recipeSourceUrl;

          const recipeSource = encodeURIComponent(source);
          const recipeSourceUrl = encodeURIComponent(sourceUrl);
          const recipeName = recipe.recipeName;
          const recipeUri = encodeURIComponent(recipe.recipeUri);
          const recipeImage = hasValidImage(recipe) ? recipe.recipeImage : NO_IMAGE_AVAILABLE;

          const recipeHtml = `
                      <div class="box box-shadow-custom">
                          <a href="/recipes/recipe_details?source=${recipeSource}&sourceUrl=${recipeSourceUrl}&uri=${recipeUri}">
                              <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
                          </a>
                          <h4>${recipeName}</h4>
                      </div>`;

          console.debug(`Adding [${recipeName}] from source: [${source}], sourceUrl: [${sourceUrl}]`);
          container.append(recipeHtml);

          // Add to array for export
          addToFavoritesArray(recipe, recipeName, recipeImage, "JPEG");
        } else if (recipe.userCreated) {
          const recipeName = recipe.recipeName;
          const recipeImage = await utils.getUserRecipeImage(recipe);

          const recipeHtml = `
                      <div class="box box-shadow-custom">
                          <a href="/recipes/recipe_details?userRecipeName=${encodeURIComponent(recipeName)}">
                              <img src="${recipeImage}" alt="${recipeName}" title="View more about ${recipeName}">
                          </a>
                          <div class="user-icon">
                              <i class="fas fa-user"></i>
                          </div>
                          <h3>${recipeName}</h3>
                      </div>`;

          console.debug(`Adding user created recipe: [${recipeName}]`);
          container.append(recipeHtml);

          // Add to array for export
          addToFavoritesArray(recipe, recipeName, recipeImage, recipe.userRecipeImage.recipeImageType.split('/')[1].toUpperCase());
        }
      });
    };

    this.getNoSavedRecipes = () => {
      return `
              <div>
                  <h2>${NO_SAVED_RECIPES}</h2>
              </div>`;
    }
  }

  function isValidRecipe(recipe) {
    return recipe && recipe.recipeName && recipe.recipeUri && recipe.recipeSource && recipe.recipeSourceUrl;
  }

  function hasValidImage(recipe) {
    return recipe.recipeImage && recipe.recipeImage !== "";
  }

  function addToFavoritesArray(recipe, recipeName, recipeImage, imageType) {
    favoriteRecipesArray.push({
      recipeName,
      instructions: recipe.recipeDirections || "",
      ingredients: recipe.recipeIngredients || "",
      nutrition: {
        servings: recipe.recipeServings || 0,
        calories: recipe.recipeCalories || 0,
        carbs: recipe.recipeCarbs || 0,
        fats: recipe.recipeFats || 0,
        protein: recipe.recipeProtein || 0
      },
      recipeImage,
      imageType: imageType
    });
  }

  const myRecipesView = new MyRecipesView();
  myRecipesView.load();
});
