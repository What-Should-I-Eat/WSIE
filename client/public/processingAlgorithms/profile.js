var restrictionsHandler = (() => {
    
    //Going to pass these to the edamam call after we process the arrays
    let dietRestrictions = []; 
    let healthRestrictions = [];

    var handleRestrictions = async () => {
        const username = getUserNameFromCookie(); 
        console.log("username: ", username);
        getUserData(username)
            .then(user=> {
                console.log("user: ", user);
                const dietButtons = document.querySelectorAll('.diet-container button');
                const healthButtons1 = document.querySelectorAll('.health-container-1 button');
                const healthButtons2 = document.querySelectorAll('.health-container-2 button');
                const healthButtons = Array.from(healthButtons1).concat(Array.from(healthButtons2));

                showArrays(dietButtons, healthButtons, user.health, user.diet);
            })
            .catch(error => {
                console.error('Error getting user ID:', error);
            });
    }

    async function showArrays(dietButtons, healthButtons, healthArray, dietArray){
        dietRestrictions = handleDietButtons(dietButtons, dietRestrictions, dietArray);
        healthRestrictions = handleDietButtons(healthButtons, healthRestrictions, healthArray);
        console.log('restrictions: ', dietRestrictions);
        console.log('allergies: ', healthRestrictions);
    }

    //Puts user restrictions into an array and gives the array to edamam.js
    function handleDietButtons(buttonType, array, healthOrDietArray) {
        buttonType.forEach(function (button) {
            const sanitizedRestriction = getEdamamNameOfRestriction(button.textContent);
            const userPreviouslySelected = healthOrDietArray.includes(sanitizedRestriction);
    
            if (userPreviouslySelected) {
                button.classList.add('selected');
                array.push(sanitizedRestriction);
            }
    
            button.addEventListener('click', function () {
                button.classList.toggle('selected');
                if (button.classList.contains('selected')) {
                    array.push(sanitizedRestriction);
                    console.log('added ', sanitizedRestriction, ' to array');
                    console.log('state of this array: ', array);
                } else {
                    const indexRestrictions = array.indexOf(sanitizedRestriction);
                    if (indexRestrictions !== -1) {
                        array.splice(indexRestrictions, 1);
                        console.log('removed ', sanitizedRestriction, ' from array');
                        console.log('state of this array: ', array);
                    }
                }
                try {
                    console.log("inside submitRestrictions(): ");
                    const username = getUserNameFromCookie();
                    console.log("username: ", username);
                    getUserId(username)
                        .then(userId => {
                            console.log("userId: ", userId);
                            console.log("diet restrictions: ", dietRestrictions);
                            console.log("health restrictions: ", healthRestrictions);

                            if (userId) {
                                PUTintoDatabase(username);
                            }
                        })
                        .catch(error => {
                            console.error('Error getting user ID:', error);
                        });
                }
                catch (error) {
                    console.error('Error while submitting restrictions:', error);
                }
                return array;
            });
        });
        return array;
    }

    
    function getEdamamNameOfRestriction(buttonName) {
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
            'Wheat': 'wheat-free'
        };
        return restrictionMap[buttonName] || null;
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

    function getDietRestrictions() {
        console.log("Diet restrictions array: ", dietRestrictions);
        return dietRestrictions;
    }

    function getHealthRestrictions(){
        console.log("Health restrictions array: ", healthRestrictions);
        return healthRestrictions;
    }

    return {
        handleRestrictions,
        getDietRestrictions,
        getHealthRestrictions,
    }
})();