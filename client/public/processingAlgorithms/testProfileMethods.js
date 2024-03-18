var profile2 = (() => {

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