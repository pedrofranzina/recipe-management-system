const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const url = apiUrl;

async function getAllRecipes() {
    try {
        const response = await fetch(`${url}/recipes`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
}

async function getRecipeById(id) {
    try {
        const response = await fetch(`${url}/recipes/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

async function filterAndSortRecipes(recipes, filters = {}) {
    let filteredRecipes = [...recipes];

    // Apply type filter
    if (filters.type && filters.type !== 'All') {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.type.includes(filters.type)
        );
    }

    // Apply difficulty filter
    if (filters.difficulty && filters.difficulty !== 'All') {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.difficulty === filters.difficulty
        );
    }

    // Apply sorting
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'name':
                filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'time':
                filteredRecipes.sort((a, b) => {
                    const timeA = parseInt(a.time.split(" ")[0]);
                    const timeB = parseInt(b.time.split(" ")[0]);
                    return timeA - timeB;
                });
                break;
        }
    }

    return filteredRecipes;
}

async function searchRecipes(query) {
    try {
        const allRecipes = await getAllRecipes();
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerms = query.toLowerCase().split(/[,\s]+/).filter(term => term.length > 0);
        return allRecipes.filter(recipe => {
            return searchTerms.every(term => {
                if (recipe.name.toLowerCase().includes(term)) return true;
                if (recipe.ingredients.some(ingredient =>
                    ingredient.toLowerCase().includes(term)
                )) return true;
                if (recipe.type.some(type =>
                    type.toLowerCase().includes(term)
                )) return true;
                return false;
            });
        });
    } catch (error) {
        return [];
    }
}

async function getRelatedRecipes(recipeId, limit = 3) {
    try {
        const currentRecipe = await getRecipeById(recipeId);
        if (!currentRecipe) return [];

        const allRecipes = await getAllRecipes();
        const otherRecipes = allRecipes.filter(recipe => recipe._id !== recipeId);

        const scoredRecipes = otherRecipes.map(recipe => {
            let score = 0;

            // Score based on shared ingredients
            const sharedIngredients = currentRecipe.ingredients.filter(ingredient =>
                recipe.ingredients.some(recipeIngredient =>
                    recipeIngredient.includes(ingredient) ||
                    ingredient.includes(recipeIngredient)
                )
            );
            score += sharedIngredients.length;

            // Score based on shared types
            const sharedTypes = currentRecipe.type.filter(type =>
                recipe.type.includes(type)
            );
            score += sharedTypes.length;

            return { ...recipe, score };
        });

        return scoredRecipes
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    } catch (error) {
        return [];
    }
}

export default {
    getAllRecipes,
    getRecipeById,
    filterAndSortRecipes,
    searchRecipes,
    getRelatedRecipes
};