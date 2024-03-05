var profile2 = (() => {

    //TODO - avoid duplication here -------------

    //These are for the diet and health parameters passed to edamam api call
    function getEdamamNameOfRestriction(buttonName){

        switch(buttonName){
            case 'Balanced':
                return 'balanced';
            case 'High Fiber':
                return 'high-fiber';
            case 'High Protein':
                return 'high-protein';
            case 'Low Carb':
                return 'low-carb';
            case 'Low Fat':
                return 'low-fat';
            case 'Low Sodium':
                return 'low-sodium';
            case 'Vegan':
                return 'vegan';
            case 'Vegetarian':
                return 'vegetarian';
            case 'Alcohol Free':
                return 'alcohol-free';
            case 'Dairy':
                return 'dairy-free';
            case 'Eggs':
                return 'egg-free';
            case 'Fish':
                return 'fish-free';
            case 'Low FODMAP':
                return 'fodmap-free';
            case 'Gluten':
                return 'gluten-free';
            case 'Gluten Free':
                return 'gluten-free';
            case 'Immunity Supporting':
                return 'immuno-supportive';
            case 'Keto':
                return 'keto-friendly';
            case 'Kosher':
                return 'kosher';
            case 'Low Sugar':
                return 'low-sugar';
            case 'Paleo':
                return 'paleo';
            case 'Peanuts':
                return 'peanut-free';
            case 'Pescatarian':
                return 'pescatarian';
            case 'Pork Free':
                return 'pork-free';
            case 'Paleo':
                return 'paleo';
            case 'Sesame':
                return 'sesame-free';
            case 'Red Meat Free':
                return 'red-meat-free';
            case 'Shellfish':
                return 'shellfish-free';
            case 'Soy':
                return 'soy-free';
            case 'Tree Nuts':
                return 'tree-nut-free';
            case 'Wheat':
                return 'wheat-free';
        }

    }

    function getUsername(){
        let username = document.getElementById("user-identification").textContent.trim();
        const endIndex = username.indexOf("'");
        username = username.substring(0, endIndex);
        return username;
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
    return {
        getEdamamNameOfRestriction,
        getUsername,
        PUTintoDatabase
    }
})();

if(typeof module === 'object'){
    module.exports = profile2;
}