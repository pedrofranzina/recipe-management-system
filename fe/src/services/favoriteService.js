import apiService from './apiService';

async function checkFavoriteStatus(recipeId) {
    try {
        const data = await apiService.get(`/favorites/check/${recipeId}`, true);
        return data.isFavorited;
    } catch (error) {
        return false;
    }
}

async function toggleFavorite(recipeId) {
    try {
        const data = await apiService.post(`/favorites/toggle/${recipeId}`, {}, true);
        return data;
    } catch (error) {
        throw error;
    }
}

async function getFavorites() {
    try {
        const data = await apiService.get('/favorites', true);
        // Filter out any null or undefined recipes (which would happen if a recipe was deleted)
        return data.filter(recipe => recipe && recipe._id);
    } catch (error) {
        throw error;
    }
}

export default {
    checkFavoriteStatus,
    toggleFavorite,
    getFavorites
}; 