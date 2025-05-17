const { ObjectId } = require('mongodb');
const { getCollection } = require('../db/mongodb');

const addFavorite = async (userId, recipeId) => {
    try {
        const collection = await getCollection('favorites');
        // Add new favorite
        const result = await collection.insertOne({
            userId: new ObjectId(userId),
            recipeId: new ObjectId(recipeId),
            createdAt: new Date()
        });
        return result.insertedId;
    } catch (error) {
        throw error;
    }
};

const removeFavorite = async (userId, recipeId) => {
    try {
        const collection = await getCollection('favorites');
        const result = await collection.deleteOne({
            userId: new ObjectId(userId),
            recipeId: new ObjectId(recipeId)
        });
        return result.deletedCount > 0;
    } catch (error) {
        throw error;
    }
};

const getFavorites = async (userId) => {
    try {
        const favoritesCollection = await getCollection('favorites');
        const recipesCollection = await getCollection('recipes');

        // Get all favorites for the user
        const favorites = await favoritesCollection.find({ userId: new ObjectId(userId) }).toArray();

        // Get the full recipe details for each favorite
        const favoriteRecipes = await Promise.all(
            favorites.map(async (favorite) => {
                const recipe = await recipesCollection.findOne({ _id: new ObjectId(favorite.recipeId) });
                return {
                    ...recipe,
                    favoriteId: favorite._id
                };
            })
        );

        return favoriteRecipes;
    } catch (error) {
        throw error;
    }
};

const isFavorite = async (userId, recipeId) => {
    try {
        const collection = await getCollection('favorites');

        let userIdObj, recipeIdObj;
        try {
            userIdObj = new ObjectId(userId);
            recipeIdObj = new ObjectId(recipeId);
        } catch (err) {
            return false;
        }

        const favorite = await collection.findOne({
            userId: userIdObj,
            recipeId: recipeIdObj
        });

        return !!favorite;
    } catch (error) {
        return false;
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
    isFavorite
}; 