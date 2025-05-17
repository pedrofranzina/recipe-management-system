import apiService from './apiService';

async function createRecipe(formData) {
    try {
        const response = await apiService.post('/recipes', formData, true);
        return response;
    } catch (error) {
        throw error;
    }
}

async function updateRecipe(recipeId, formData) {
    try {
        const dataToSend = new FormData();

        for (let [key, value] of formData.entries()) {
            if (key === 'ingredients' || key === 'steps' || key === 'type') {
                try {
                    const arrayData = JSON.parse(value);
                    const filteredArray = arrayData.filter(item => item.trim() !== '');
                    if (filteredArray.length === 0) {
                        throw new Error(`${key} cannot be empty`);
                    }
                    dataToSend.append(key, JSON.stringify(filteredArray));
                } catch (e) {
                    throw new Error(`Invalid ${key} data: ${e.message}`);
                }
            } else if (key === 'difficulty') {
                dataToSend.append(key, value.toLowerCase());
            } else if (key === 'photo') {
                dataToSend.append(key, value);
            } else if (key !== 'photo_path') {
                if (!value || value.trim() === '') {
                    throw new Error(`${key} cannot be empty`);
                }
                dataToSend.append(key, value);
            }
        }

        const response = await apiService.put(`/recipes/${recipeId}`, dataToSend, true);
        return response;
    } catch (error) {
        throw new Error(error.message || 'Failed to update recipe. Please try again.');
    }
}

async function deleteRecipe(recipeId) {
    try {
        await apiService.delete(`/recipes/${recipeId}`, true);
    } catch (error) {
        throw error;
    }
}

export default {
    createRecipe,
    updateRecipe,
    deleteRecipe
}; 