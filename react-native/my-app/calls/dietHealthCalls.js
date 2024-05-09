import { loggedInUser } from "./loginCalls";
import { hostForAppCalls } from "./hostCallConst";

const sendDietData = async (dietArrayFromClient) => {
    const dietData = {
        username: loggedInUser,
        diet: convertParameterScreenNameToEdamamName(dietArrayFromClient)
    };

    try {
        await fetch(`${hostForAppCalls}/api/v1/users/diet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dietData),
        });
    } catch (error) {
        console.error('Error sending diet data:', error);
    }
}

const sendHealthData = async (healthArrayFromClient) => {
    const healthData = {
        username: loggedInUser,
        health: convertParameterScreenNameToEdamamName(healthArrayFromClient)
    };

    try {
        await fetch(`${hostForAppCalls}/api/v1/users/health`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(healthData),
        });
    } catch (error) {
        console.error('Error sending health data:', error);
    }
}

function convertParameterScreenNameToEdamamName(inputtedArrayFromClient) {
    let adjustedArray = [];
    for(let i = 0; i < inputtedArrayFromClient.length; i++){
        adjustedArray.push(mapRealRestrictionNameToEdamam(inputtedArrayFromClient[i]));
    }
}

function mapRealRestrictionNameToEdamam(inputtedDiet){
    const restrictionMap = {
        'Balanced': 'balanced',
        'High Fiber': 'high-fiber',
        'High Protein': 'high-protein',
        'Low Carb': 'low-carb',
        'Low Fat': 'low-fat',
        'Low Sodium': 'low-sodium',
        'Vegan': 'vegan',
        'Vegetarian': 'vegetarian',
        'Alcohol Free': 'alcohol-free',
        'Dairy': 'dairy-free',
        'Eggs': 'egg-free',
        'Fish': 'fish-free',
        'Low FODMAP': 'fodmap-free',
        'Gluten': 'gluten-free',
        'Immunity Supporting': 'immuno-supportive',
        'Keto': 'keto-friendly',
        'Kosher': 'kosher',
        'Low Sugar': 'low-sugar',
        'Paleo': 'paleo',
        'Peanuts': 'peanut-free',
        'Pescatarian': 'pescatarian',
        'Halal': 'pork-free',
        'Sesame': 'sesame-free',
        'Red Meat Free': 'red-meat-free',
        'Shellfish': 'shellfish-free',
        'Soy': 'soy-free',
        'Tree Nuts': 'tree-nut-free',
        'Wheat': 'wheat-free'
    };
    return restrictionMap[inputtedDiet] || null;
}

export { sendDietData, sendHealthData };