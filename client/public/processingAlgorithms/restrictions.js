var restrictions = (() => {
    var selectedRestrictions = []; //this is what we want to pass to edamam

    var handleRestrictions = () => {
        const restrictionButtons = document.querySelectorAll('.restrictions-container button, .allergies-container button');
        restrictionButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                
                button.classList.toggle('selected');
                const sanitizedRestriction = getEdamamNameOfRestriction(button.textContent);
                if (button.classList.contains('selected')) {
                    selectedRestrictions.push(sanitizedRestriction);
                    console.log('added ', sanitizedRestriction, ' to restrictions');
                } else 
                {
                    const index = selectedRestrictions.indexOf(sanitizedRestriction);
                    if (index !== -1) {
                        selectedRestrictions.splice(index, 1);
                        console.log('removed ', sanitizedRestriction, ' from restrictions');
                    }
                }
                console.log('Selected Restrictions:', selectedRestrictions);
                edamam.handleRestrictions(selectedRestrictions); //passing everything off to edamam.js
            });
        });
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

    var getSelectedRestrictions = () => {
        return selectedRestrictions;
    }
    return {
        handleRestrictions,
        getSelectedRestrictions,
        selectedRestrictions,
    }
})();
