var profile2 = (() => {

    //TODO - avoid duplication here -------------

    //These are for the diet and health parameters passed to edamam api call
    // function getEdamamNameOfRestriction(buttonName){
    //
    //     switch(buttonName){
    //         case 'Balanced':
    //             return 'balanced';
    //         case 'High Fiber':
    //             return 'high-fiber';
    //         case 'High Protein':
    //             return 'high-protein';
    //         case 'Low Carb':
    //             return 'low-carb';
    //         case 'Low Fat':
    //             return 'low-fat';
    //         case 'Low Sodium':
    //             return 'low-sodium';
    //         case 'Vegan':
    //             return 'vegan';
    //         case 'Vegetarian':
    //             return 'vegetarian';
    //         case 'Alcohol Free':
    //             return 'alcohol-free';
    //         case 'Dairy':
    //             return 'dairy-free';
    //         case 'Eggs':
    //             return 'egg-free';
    //         case 'Fish':
    //             return 'fish-free';
    //         case 'Low FODMAP':
    //             return 'fodmap-free';
    //         case 'Gluten':
    //             return 'gluten-free';
    //         case 'Gluten Free':
    //             return 'gluten-free';
    //         case 'Immunity Supporting':
    //             return 'immuno-supportive';
    //         case 'Keto':
    //             return 'keto-friendly';
    //         case 'Kosher':
    //             return 'kosher';
    //         case 'Low Sugar':
    //             return 'low-sugar';
    //         case 'Paleo':
    //             return 'paleo';
    //         case 'Peanuts':
    //             return 'peanut-free';
    //         case 'Pescatarian':
    //             return 'pescatarian';
    //         case 'Pork Free':
    //             return 'pork-free';
    //         case 'Paleo':
    //             return 'paleo';
    //         case 'Sesame':
    //             return 'sesame-free';
    //         case 'Red Meat Free':
    //             return 'red-meat-free';
    //         case 'Shellfish':
    //             return 'shellfish-free';
    //         case 'Soy':
    //             return 'soy-free';
    //         case 'Tree Nuts':
    //             return 'tree-nut-free';
    //         case 'Wheat':
    //             return 'wheat-free';
    //     }
    //
    // }
    function getEdamamNameOfRestriction(buttonName) {
        const nameMap = {
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
            'Gluten Free': 'gluten-free-1',
            'Immunity Supporting': 'immuno-supportive',
            'Keto': 'keto-friendly',
            'Kosher': 'kosher',
            'Low Sugar': 'low-sugar',
            'Paleo': 'paleo',
            'Peanuts': 'peanut-free',
            'Pescatarian': 'pescatarian',
            'Pork Free': 'pork-free',
            'Sesame': 'sesame-free',
            'Red Meat Free': 'red-meat-free',
            'Shellfish': 'shellfish-free',
            'Soy': 'soy-free',
            'Tree Nuts': 'tree-nut-free',
            'Wheat': 'wheat-free',
        };
        return nameMap[buttonName]
    }

    async function PUTintoDatabase(username) {
        try {
            if (username) {
                const dietData = {
                    username: username,
                    diet: getDietRestrictions()
                };
                const healthData = {
                    username: username,
                    health: getHealthRestrictions()
                };

                await sendDietData(dietData);
                await sendHealthData(healthData);
            }
        }
        catch (error) {
            console.error('Error during beforeunload event:', error);
        }
    }

    async function sendDietData(dietData) {

        try {
            await fetch(`${host}/api/v1/users/diet`, {
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
    async function sendHealthData(healthData) {
        try {
            await fetch(`${host}/api/v1/users/health`, {
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

    return {
        getEdamamNameOfRestriction,
        PUTintoDatabase,
        sendDietData,
        sendHealthData
    }
})();

if(typeof module === 'object'){
    module.exports = profile2;
}