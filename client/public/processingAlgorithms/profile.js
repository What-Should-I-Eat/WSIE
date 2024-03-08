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
                    const username = getUsername();
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
                return 'gluten-free-1';
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