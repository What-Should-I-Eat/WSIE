const mongoose = require('mongoose');
const Ingredient = require('./src/models/ingredients_model.js'); // Adjust the path as needed

// MongoDB connection URL
const mongoUrl = 'mongodb://db/ingredients'; // Matches the service name in docker-compose.yml

// Function to insert JSON data into the database
async function insertData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    // JSON data to be inserted 
    const jsonData = [
        {
            "_id": 100,
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
            "_id": 101,
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
            "_id": 102,
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
            "_id": 103,
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
            "_id": 104,
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
            "_id": 105,
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
            "_id": 106,
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
            "_id": 107,
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

    // Insert the JSON data into the "ingredients" collection
    await Ingredient.insertMany(jsonData);

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Call the insertData function to preload data
insertData();
