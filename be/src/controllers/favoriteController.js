const { addFavorite, removeFavorite, getFavorites, isFavorite } = require('../models/Favorite');

async function toggleFavorite(req, res) {
    try {
        const { recipeId } = req.params;
        const userId = req.user.userId;

        // Check if recipe is already favorited
        const isFavorited = await isFavorite(userId, recipeId);

        if (isFavorited) {
            // Remove from favorites
            await removeFavorite(userId, recipeId);
            res.json({ message: 'Recipe removed from favorites', isFavorited: false });
        } else {
            // Add to favorites
            await addFavorite(userId, recipeId);
            res.json({ message: 'Recipe added to favorites', isFavorited: true });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error updating favorites',
            error: error.message
        });
    }
}

async function getUserFavorites(req, res) {
    try {
        const userId = req.user.userId;

        const favorites = await getFavorites(userId);

        res.json(favorites);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving favorites',
            error: error.message
        });
    }
}

async function checkFavoriteStatus(req, res) {
    try {
        const { recipeId } = req.params;
        const userId = req.user.userId;

        const isFavorited = await isFavorite(userId, recipeId);

        res.json({ isFavorited });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking favorite status',
            error: error.message
        });
    }
}

module.exports = {
    toggleFavorite,
    getUserFavorites,
    checkFavoriteStatus
}; 