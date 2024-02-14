var restrictionsHandler = (() => {
    // Initialize restrictions arrays
    let dietRestrictions = [];
    let healthRestrictions = [];

    // Function to handle restrictions setup and update UI based on user data
    var handleRestrictions = async () => {
        const username = getUsername();
        console.log("username: ", username);
        getUserData(username).then(user => {
            console.log("user: ", user);
            // Select buttons within diet and health containers
            const dietButtons = document.querySelectorAll('.diet-container button');
            const healthButtons = document.querySelectorAll('.health-container-1 button, .health-container-2 button');

            // Update UI and set event listeners
            updateUIAndSetListeners(dietButtons, user.diet, true);
            updateUIAndSetListeners(healthButtons, user.health, false);
        }).catch(error => {
            console.error('Error getting user data:', error);
        });
    };

    // Function to update UI based on user data and set event listeners for real-time updates
    function updateUIAndSetListeners(buttons, userRestrictions, isDiet) {
        buttons.forEach(button => {
            const restrictionName = getEdamamNameOfRestriction(button.textContent);
            if (userRestrictions.includes(restrictionName)) {
                button.classList.add('selected');
                isDiet ? dietRestrictions.push(restrictionName) : healthRestrictions.push(restrictionName);
            }

            button.addEventListener('click', async () => {
                button.classList.toggle('selected');
                const isSelected = button.classList.contains('selected');
                updateRestrictionsArray(isDiet ? dietRestrictions : healthRestrictions, restrictionName, isSelected);
                await updateDatabase(); // Update database on every click
            });
        });
    }

    // Function to update local restrictions array based on selection
    function updateRestrictionsArray(array, restriction, isSelected) {
        const index = array.indexOf(restriction);
        if (isSelected && index === -1) {
            array.push(restriction);
        } else if (!isSelected && index !== -1) {
            array.splice(index, 1);
        }
        console.log('Updated restrictions array: ', array);
    }

    // Function to update database with the current restrictions
    async function updateDatabase() {
        const username = getUsername();
        try {
            await sendDietData({username: username, diet: dietRestrictions});
            await sendHealthData({username: username, health: healthRestrictions});
            console.log('Database updated successfully');
        } catch (error) {
            console.error('Error updating the database:', error);
        }
    }

    // Simplified function to get the username from the DOM
    function getUsername() {
        return document.getElementById("user-identification").textContent.trim().split("'")[0];
    }

    // Function to map button text to restriction names used by the API
    function getEdamamNameOfRestriction(buttonName) {
        const mapping = {
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
            'Gluten Free': 'gluten-free',
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
        return mapping[buttonName] || buttonName.toLowerCase().replace(/\s+/g, '-');
    }

    async function sendDietData(dietData) {

        try {
            await fetch(`http://${host}/api/v1/users/diet`, {
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
            await fetch(`http://${host}/api/v1/users/health`, {
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

    function getHealthRestrictions() {
        console.log("Health restrictions array: ", healthRestrictions);
        return healthRestrictions;
    }

    return {
        handleRestrictions,
        getDietRestrictions,
        getHealthRestrictions,
    }

})();
