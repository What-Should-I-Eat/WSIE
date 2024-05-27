var submitRecipeHandler = (() => {

    const gatherRecipeData = () => {
        const form = document.getElementById('recipeForm');
        return new FormData(form);
    };

    const sendRecipeData = async (formData) => {
        try {
            console.log("name: " + formData.get('name'));
            console.log("ingredients: " + formData.get('ingredients'));
            console.log("steps: " + formData.get('steps'));
            console.log("photo: " + formData.get('photo'));
            const response = await fetch(`/api/v1/create-recipe`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    ingredients: formData.get('ingredients'),
                    steps: formData.get('steps'),
                    photo: formData.get('photo')
                })
            });
            const data = await response.json();
            console.log('Server response:', data);
        } catch (error) {
            console.error('Error submitting recipe:', error);
            alert('Error submitting recipe.');
        }
    };

    const handleFormSubmission = () => {
        const form = document.getElementById('recipeForm');
        form.addEventListener('submit', (event) => {
            event.preventDefault();  
            const formData = gatherRecipeData();
            sendRecipeData(formData);
        });
    };

    return {
        handleFormSubmission
    };
})();

document.addEventListener('DOMContentLoaded', submitRecipeHandler.handleFormSubmission);
