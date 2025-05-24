import { loggedInUser } from "./loginCalls";
import * as CONST from "../calls/constants.js";
import {getUserFromUsername} from "../calls/utils.js";
import { Alert } from "react-native";

const sendDietData = async (dietArrayFromClient) => {
    console.log("this is call function: " + dietArrayFromClient);
    const dietData = {
        username: loggedInUser,
        diet: convertParameterScreenNameToEdamamName(dietArrayFromClient)
    };
    console.log(dietData);

    try {
        await fetch(`${CONST.HOST}/api/v1/users/diet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dietData),
        });
        Alert.alert('Success', "Diet info has been updated on your profile");
    } catch (error) {
        console.error('Error sending diet data:', error);
    }
}

const sendHealthData = async (healthArrayFromClient) => {
    const healthData = {
        username: loggedInUser,
        health: convertParameterScreenNameToEdamamName(healthArrayFromClient)
    };
    console.log(healthData);

    try {
        await fetch(`${CONST.HOST}/api/v1/users/health`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(healthData),
        });
        Alert.alert('Success', "Health info has been updated on your profile");
    } catch (error) {
        console.error('Error sending health data:', error);
    }
}

function convertParameterScreenNameToEdamamName(inputtedArrayFromClient) {
    let adjustedArray = [];
    for(let i = 0; i < inputtedArrayFromClient.length; i++){
        adjustedArray.push(mapRealRestrictionNameToEdamam(inputtedArrayFromClient[i]));
    }
    return adjustedArray;
}

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

function mapRealRestrictionNameToEdamam(inputtedDiet){
    return restrictionMap[inputtedDiet] || null;
}

const getDietaryArray = async() => {
    try{
        const userData = await getUserFromUsername(loggedInUser);
        let dietaryArray = [];
        console.log('Diet of user: ', userData.diet);
        const serverSideDiets = userData.diet;
  
        const invertedArray = inverseMappingOfNames(restrictionMap);

        for(let i = 0; i < serverSideDiets.length; i++){
            dietaryArray.push(invertedArray[serverSideDiets[i]]);
        }
        
        return dietaryArray;
      } catch (error){
        console.error('Error fetching diets: ', error);
        throw error;
      }
}

const getHealthArray = async() => {
    try{
        const userData = await getUserFromUsername(loggedInUser);
        let healthArray = [];
        console.log('Health of user: ', userData.health);
        const serverSideHealth = userData.health;
  
        const invertedArray = inverseMappingOfNames(restrictionMap);

        for(let i = 0; i < serverSideHealth.length; i++){
            healthArray.push(invertedArray[serverSideHealth[i]]);
        }
        
        return healthArray;
      } catch (error){
        console.error('Error fetching diets: ', error);
        throw error;
      }
}

function inverseMappingOfNames(inputtedArray){
    const inverted = {};
    for(const key in inputtedArray){
        if(inputtedArray.hasOwnProperty(key)){
            inverted[inputtedArray[key]] = key;
        }
    }
    return inverted;
}

export { sendDietData, sendHealthData, getDietaryArray, getHealthArray };