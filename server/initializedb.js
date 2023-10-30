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
                "restrictions": ["a-milk", "low sugar"],
                "alternatives": ["coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "coconut milk",
            "tags": [
              {
                "restrictions": ["a-treenut", "low calorie"],
                "alternatives": ["milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "almond milk",
            "tags": [
              {
                "restrictions": ["a-treenut", "high calorie", "a-almond"],
                "alternatives": ["milk", "coconut milk", "oat milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "oat milk",
            "tags": [
              {
                "restrictions": ["a-oat", "high calorie"],
                "alternatives": ["milk", "coconut milk", "almond milk", "soy milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "soy milk",
            "tags": [
              {
                "restrictions": ["a-soy", "low sugar"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "rice milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "rice milk",
            "tags": [
              {
                "restrictions": ["low sugar", "high carb"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "cashew milk", "pea milk"]
              }
            ]
          },
          {
            "name": "cashew milk",
            "tags": [
              {
                "restrictions": ["a-treenut", "a-cashew"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "pea milk"]
              }
            ]
          },
          {
            "name": "pea milk",
            "tags": [
              {
                "restrictions": ["a-legume", "a-pea", "high calcium"],
                "alternatives": ["milk", "coconut milk", "almond milk", "oat milk", "soy milk", "rice milk", "cashew milk"]
              }
            ]
          },
          {
            "name": "greek yogurt",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["coconut cream", "silken tofu"]
              }
            ]
          },
          {
            "name": "yogurt",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["coconut cream", "silken tofu"]
              }
            ]
          },
          {
            "name": "beer",
            "tags": [
              {
                "restrictions": ["a-wheat"],
                "alternatives": ["chicken broth"]
              }
            ]
          },
          {
            "name": "bread crumbs",
            "tags": [
              {
                "restrictions": ["a-wheat"],
                "alternatives": ["ground oats"]
              }
            ]
          },
          {
            "name": "butter",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["margarine", "shortening"]
              }
            ]
          },
          {
            "name": "buttermilk",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["lemon juice and unsweetened dairy-free milk beverage"]
              }
            ]
          },
          {
            "name": "chocolate",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["unsweetened cocoa with shortening"]
              }
            ]
          },
          {
            "name": "cottage cheese",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["dairy free cottage cheese"]
              }
            ]
          },
          {
            "name": "cream",
            "tags": [
              {
                "restrictions": ["a-milk"],
                "alternatives": ["coconut cream"]
              }
            ]
          },
          {
            "name": "egg",
            "tags": [
              {
                "restrictions": ["a-egg"],
                "alternatives": ["pureed silken tofu"]
              }
            ]
          },
          {
            "name": "cashew",
            "tags": [
              {
                "restrictions": ["a-treenut"],
                "alternatives": ["silken tofu"]
              }
            ]
          },
          {
            "name": "almond",
            "tags": [
              {
                "restrictions": ["a-treenut"],
                "alternatives": ["pumpkin seeds"]
              }
            ]
          },
          {
            "name": "hazlenut",
            "tags": [
              {
                "restrictions": ["a-treenut"],
                "alternatives": ["pumpkin seeds"]
              }
            ]
          },
          {
            "name": "pistachio",
            "tags": [
              {
                "restrictions": ["a-treenut"],
                "alternatives": ["pumpkin seeds"]
              }
            ]
          },
          {
            "name": "peanut butter",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["cookie butter", "sunflower seed butter", "tahini"]
              }
            ]
          },
          {
            "name": "peanut",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["sunflower seeds", "chickpeas"]
              }
            ]
          },
          {
            "name": "peanut oil",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["vegetable oil"]
              }
            ]
          },
          {
            "name": "peanut chip",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["chocolate chips"]
              }
            ]
          },
          {
            "name": "peanut flour",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["flour"]
              }
            ]
          },
          {
            "name": "peanut sauce",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["tahini"]
              }
            ]
          },
          {
            "name": "szechuan sauce",
            "tags": [
              {
                "restrictions": ["a-peanut"],
                "alternatives": ["sriracha sauce with 1 tbsp sugar"]
              }
            ]
          },

        
    ];

    const restrictionData = [
      {
        "name": "a-peanut",
        "tags": [
          "peanut", "peanut butter", "peanut oil", "peanut chip", "peanut flour", "peanut meal", "peanut sauce", "szechuan sauce"
        ]
      },
      {
        "name": "a-milk",
        "tags": [
          "milk", "yogurt", "greek yogurt", "cheese", "cream", "buttercream", "butter", "whey", "buttermilk", "chocolate", "cottage cheese"
        ]
      },
      {
        "name": "a-eggs",
        "tags": ["egg"]
      },
      {
        "name": "a-fish",
        "tags": [
          "fish", "cod", "salmon", "tuna", "trout", "mahi", "sardines", "bass", "sea bass", "pollock", "char", "tilapia", 
          "snapper", "anchovies", "haddock", "flounder", "catfish", "halibut", "swordfish", "branzino"
        ]
      },
      {
        "name": "a-shellfish",
        "tags": [
          "shrimp", "prawn", "crab", "lobster", "clam", "mussels", "oyster", "scallop", "octopus", 
          "squid", "abalone", "snail", "escargot"
        ]
      },
      {
        "name": "a-treenut",
        "tags": [
          "almond", "Brazil nut", "cashew", "hazelnut", "pistachio", "pecan", "walnut", "macadamia", "pine nut"
        ]
      },
      {
        "name": "a-wheat",
        "tags": [
          "wheat", "wheat flour", "bread crumbs", "bulgur", "couscous", "farina", "pasta", "semolina",
           "wheat bran", "wheat protein", "wheat flour", "whole wheat", "glucose syrup", "tortilla", 
           "dough", "soy sauce", "cereal"
        ]
      },
      {
        "name": "a-soy",
        "tags": [
          "soy", "edamame", "soybean", "soymilk", "miso", "natto", "soy sauce", "tamari", "tempeh", "teriyaki", "tofu"
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
