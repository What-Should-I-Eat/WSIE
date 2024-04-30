const ERROR_LOG = "Error: No recipe details found - check the server logs";

class RecipeDetailsView {
  constructor(recipeDetailsData) {
    this.recipeDetailsData = recipeDetailsData;
    this.initialize();
  }

  initialize() {
    if (!this.recipeDetailsData) {
      alert(ERROR_LOG);
      console.error(ERROR_LOG);
    }
  }
}