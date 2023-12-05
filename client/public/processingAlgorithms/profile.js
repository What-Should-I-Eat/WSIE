var restrictionsHandler = (() => {
    
    //Going to pass these to the edamam call after we process the arrays
    var dietRestrictions = []; 
    var healthRestrictions = [];

    var handleRestrictions = async () => {
        const username = getUsername();
        console.log("username: ", username);
        const userId = await getUserId(username);
        console.log("userId: ", userId);


        const dietButtons = document.querySelectorAll('.diet-container button');
        const healthButtons1 = document.querySelectorAll('.health-container-1 button');
        const healthButtons2 = document.querySelectorAll('.health-container-2 button');
        const healthButtons = Array.from(healthButtons1).concat(Array.from(healthButtons2));

        dietRestrictions = handleDietButtons(dietButtons, dietRestrictions);
        healthRestrictions = handleDietButtons(healthButtons, healthRestrictions);

        console.log('restrictions: ', dietRestrictions);
        console.log('allergies: ', healthRestrictions);

        //edamam.handleRestrictions(selectedRestrictions, selectedAllergies);
        //PUT to server (need to find id thru username in the endpoint)
        
    }


    //Puts user restrictions into an array and gives the array to edamam.js
    function handleDietButtons(buttonType, array) {
        buttonType.forEach(function (button) {
            button.addEventListener('click', function () {
                button.classList.toggle('selected');
                const sanitizedRestriction = getEdamamNameOfRestriction(button.textContent);
    
                if (button.classList.contains('selected')) {
                    array.push(sanitizedRestriction);
                    console.log('added ', sanitizedRestriction, ' to array');
                    console.log('state of this array: ', array);
                } 
                else {
                    const indexRestrictions = array.indexOf(sanitizedRestriction);
                    if (indexRestrictions !== -1) {
                        array.splice(indexRestrictions, 1);
                        console.log('removed ', sanitizedRestriction, ' from array');
                        console.log('state of this array: ', array);
                    }
                }
                return array;
            });
        });
    }

    function PUTintoDatabase(){

    }

    function getUsername(){
        let username = document.getElementById("user-identification").textContent.trim();
        const endIndex = username.indexOf("'");
        username = username.substring(0, endIndex);
        return username;
    }

    async function getUserId(username){
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/findUserId?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return "";
        }
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

    function getDietRestrictions() {
        return dietRestrictions;
    }

    function getHealthRestrictions(){
        return healthRestrictions;
    }

    return {
        handleRestrictions,
        getDietRestrictions,
        getHealthRestrictions,
        selectedRestrictions: dietRestrictions,
        selectedAllergies: healthRestrictions,
    }
})();
