$(document).ready(function () {
  const favoriteRecipesArray = [];

  document.getElementById('export-pdf').addEventListener('click', async function () {
    const data = favoriteRecipesArray;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const FONT_TYPE = "Helvetica";
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const MAX_IMAGE_WIDTH = 120;
    const MAX_IMAGE_HEIGHT = 90;

    const RECIPE_NAME_FONT_SIZE = 24;
    const SECTION_FONT_SIZE = 16;
    const CONTENT_FONT_SIZE = 12;

    async function getImageDimensions(imageBase64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageBase64;
      });
    }

    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    }

    async function convertSvgToPng(svgBase64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = svgBase64;
      });
    }

    async function processImage(imageBase64, imageType) {
      if (imageType.toLowerCase() === 'svg') {
        return await convertSvgToPng(imageBase64);
      }
      return imageBase64;
    }

    function addBulletPoints(doc, items, x, y, maxWidth, lineHeight) {
      items.forEach(item => {
        const bulletPoint = `• ${item}`;
        const lines = doc.splitTextToSize(bulletPoint, maxWidth);
        lines.forEach(line => {
          if (y > PAGE_HEIGHT - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, x, y);
          y += lineHeight;
        });
      });
      return y;
    }

    function addTextWithWrap(doc, text, x, y, maxWidth, lineHeight) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (y > PAGE_HEIGHT - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, x, y);
        y += lineHeight;
      });
      return y;
    }

    function addHeaderFooter(doc, pageNumber, totalPages) {
      doc.setFontSize(8);
      doc.text(`Page ${pageNumber} of ${totalPages}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
      doc.text(`${username} - ${fullDate}`, 10, doc.internal.pageSize.getHeight() - 10);
    }

    const username = utils.getUserNameFromCookie();
    const fullDate = new Date().toISOString();
    const date = fullDate.split('T')[0];
    const totalPages = data.length;

    doc.setFont(FONT_TYPE, "normal");

    for (const [index, item] of data.entries()) {
      if (index > 0) doc.addPage();
      addHeaderFooter(doc, index + 1, totalPages);

      doc.setFontSize(RECIPE_NAME_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(item.recipeName);
      const textX = (pageWidth - textWidth) / 2;
      doc.text(item.recipeName, textX, 25);

      let imageBase64 = await processImage(item.recipeImage, item.imageType);
      const { width, height } = await getImageDimensions(imageBase64);
      const { width: fitWidth, height: fitHeight } = calculateAspectRatioFit(width, height, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT);

      const imageX = (pageWidth - fitWidth) / 2;
      doc.addImage(imageBase64, 'PNG', imageX, 35, fitWidth, fitHeight);

      let currentY = fitHeight + 50;

      if (currentY + 40 > PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(SECTION_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");
      doc.text('Ingredients', 10, currentY);
      currentY += 10;
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");

      currentY = item.ingredients?.length > 0
        ? addBulletPoints(doc, item.ingredients, 20, currentY, 170, 6)
        : addTextWithWrap(doc, 'No ingredients available.', 20, currentY, 170, 6);

      currentY += 10;

      if (currentY + 40 > PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(SECTION_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");
      doc.text('Preparation', 10, currentY);
      currentY += 10;
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");

      if (item.instructions?.length > 0) {
        currentY = addBulletPoints(doc, item.instructions, 20, currentY, 170, 6);
      } else {
        currentY = addTextWithWrap(doc, 'No instructions were able to be migrated.', 20, currentY, 170, 6);
        currentY += 10;
        const sourceWithUrl = `View full instructions and more at: ${item.source}`;
        doc.textWithLink(sourceWithUrl, 20, currentY, { url: item.url });
      }

      currentY += 10;

      if (currentY + 40 > PAGE_HEIGHT - 30) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(SECTION_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");
      doc.text('Nutritional Facts', 10, currentY);
      currentY += 10;
      doc.setFontSize(CONTENT_FONT_SIZE);
      doc.setFont(FONT_TYPE, "normal");

      const nutritionFacts = [
        `Servings: ${Math.round(item.nutrition.servings)}`,
        `Calories: ${Math.round(item.nutrition.calories)} ${item.nutrition.caloriesUnits}`,
        `Fats: ${Math.round(item.nutrition.fats)} ${item.nutrition.fatsUnits}`,
        `Carbohydrates: ${Math.round(item.nutrition.carbs)} ${item.nutrition.carbsUnits}`,
        `Protein: ${Math.round(item.nutrition.protein)} ${item.nutrition.proteinUnits}`
      ];

      currentY = addBulletPoints(doc, nutritionFacts, 20, currentY, 170, 6);
    }

    doc.save(`${date}-${username}-recipes.pdf`);
  });

  function MyRecipesView() {
    const container = $('.my-recipes-container');
    const exportButton = document.getElementById('export-pdf');

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
        // Disable export if there are no recipes
        exportButton.disabled = true;
        return;
      }

      // Enable export if there are recipes
      exportButton.disabled = false;

      console.log(`About to iterate through: ${favoriteRecipes.length} favorite recipes`);
      favoriteRecipes.forEach(async recipe => {
        if (isValidRecipe(recipe)) {
          const source = recipe.recipeSource;
          const sourceUrl = recipe.recipeSourceUrl;

          const recipeSource = encodeURIComponent(source);
          const recipeSourceUrl = encodeURIComponent(sourceUrl);
          const recipeName = recipe.recipeName;
          const recipeUri = encodeURIComponent(recipe.recipeUri);

          let recipeImage = "";
          let recipeImageType = "";

          if (hasValidImage(recipe)) {
            recipeImage = recipe.recipeImage;
            recipeImageType = getImageType(recipeImage);
          } else {
            recipeImage = NO_IMAGE_AVAILABLE;
            recipeImageType = "SVG";
          }

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
          addToFavoritesArray(recipe, recipeImage, recipeImageType);
        } else if (recipe.userCreated) {
          const recipeName = recipe.recipeName;
          let recipeImage = "";
          let recipeImageType = "";

          if (hasValidImage(recipe)) {
            recipeImage = recipe.recipeImage;
            recipeImageType = getImageType(recipeImage);
          } else {
            recipeImage = NO_IMAGE_AVAILABLE;
            recipeImageType = "SVG";
          }

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
          addToFavoritesArray(recipe, recipeImage, recipeImageType);
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

  function getImageType(recipeImage) {
    return recipeImage.match(/data:image\/(.*);/)[1].toUpperCase();
  }

  function addToFavoritesArray(recipe, recipeImage, imageType) {
    favoriteRecipesArray.push({
      recipeName: recipe.recipeName,
      instructions: recipe.recipeDirections || "",
      ingredients: recipe.recipeIngredients || "",
      nutrition: {
        servings: recipe.recipeServings || 0,
        calories: recipe.recipeCalories || 0,
        caloriesUnits: recipe.recipeCaloriesUnits || "kcal",
        carbs: recipe.recipeCarbs || 0,
        carbsUnits: recipe.recipeCarbsUnits || "g",
        fats: recipe.recipeFats || 0,
        fatsUnits: recipe.recipeFatsUnits || "g",
        protein: recipe.recipeProtein || 0,
        proteinUnits: recipe.recipeProteinUnits || "g",
      },
      recipeImage,
      imageType: imageType,
      source: recipe.recipeSource,
      url: recipe.recipeSourceUrl
    });
  }

  const myRecipesView = new MyRecipesView();
  myRecipesView.load();
});
