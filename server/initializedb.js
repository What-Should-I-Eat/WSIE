const mongoose = require('mongoose');
const Ingredient = require('./src/models/ingredients_model.js'); 
const Restriction = require('./src/models/dietaryRestrictions_model.js');

const mongoUrl = 'mongodb://db/WSIE'; // Matches the service name in docker-compose.yml

// Function to insert JSON data into the database
async function insertData() {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    const ingredientData = [
        {
            "name": "milk",
            "tags": [
              {
                "restrictions": ["dairy free", "low sugar", "allergy dairy"],
                "attributes": ["high calorie", "high protein", "gluten free"],
                "alternatives": ["coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "coconut milk",
            "tags": [
              {
                "restrictions": ["allergy tree nut", "low calorie", "allergy coconut"],
                "attributes": ["high calorie", "high fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "almond milk",
            "tags": [
              {
                "restrictions": ["allergy tree nut", "high calorie", "allergy almond"],
                "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "coconut milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "oat milk",
            "tags": [
              {
                "restrictions": ["allergy oat", "high calorie"],
                "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "coconut milk", "almond milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "soy milk",
            "tags": [
              {
                "restrictions": ["allergy soy", "low sugar"],
                "attributes": ["low calorie", "high fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "rice milk",
            "tags": [
              {
                "restrictions": ["allergy rice", "low sugar", "high carb"],
                "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "cashew milk",
            "tags": [
              {
                "restrictions": ["allergy tree nut", "allergy cashew"],
                "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "pea milk"]
              }
            ]
          },
          {
            "name": "pea milk",
            "tags": [
              {
                "restrictions": ["allergy legume", "allergy pea", "high calcium"],
                "attributes": ["low calorie", "low fat", "dairy free", "lactose free", "gluten free", "high protein"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk"]
              }
            ]
          }
        
    ];

    const restrictionData = [
      {
        "name": "lactose intolerance",
        "restrictions": [
          "milk", "yogurt", "greek yogurt", "cheese", "cream", "buttercream", "butter", "whey"
        ]
      },
      {
        "name": "allergy peanut",
        "restrictions": [
          "peanut", "peanut butter", "peanut oil", "peanut chip", "peanut flour", "peanut meal", "peanut sauce", "szechuan sauce"
        ]
      }
    ];

    await Ingredient.insertMany(ingredientData);
    await Restriction.insertMany(restrictionData);

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
