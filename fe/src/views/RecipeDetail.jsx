import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import recipeService from "../services/recipeService";
import favoriteService from "../services/favoriteService";
import recipeManagementService from "../services/recipeManagementService";
import useAdminStatus from "../hooks/useAdminStatus";

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

function RecipeDetail() {
    const [match, params] = useRoute("/recipe/:id");
    const [, setLocation] = useLocation();
    const [recipe, setRecipe] = useState(null);
    const [relatedRecipes, setRelatedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const isAdmin = useAdminStatus();

    useEffect(() => {
        let isMounted = true;

        async function fetchRecipe() {
            if (!match || !params?.id) {
                setError("Invalid recipe ID");
                setLoading(false);
                return;
            }

            try {

                // Fetch recipe and favorite status in parallel
                const [recipeData, favoriteStatus] = await Promise.all([
                    recipeService.getRecipeById(params.id),
                    favoriteService.checkFavoriteStatus(params.id)
                ]);

                if (!recipeData) {
                    throw new Error("Recipe not found");
                }

                if (isMounted) {
                    setRecipe(recipeData);
                    // Ensure favoriteStatus is a boolean
                    setIsFavorite(!!favoriteStatus);

                    const related = await recipeService.getRelatedRecipes(params.id);
                    setRelatedRecipes(related);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to load recipe details.");
                    setLoading(false);
                }
            }
        }

        fetchRecipe();

        return () => {
            isMounted = false;
        };
    }, [match, params?.id]);

    async function handleToggleFavorite() {
        if (!match || !params?.id) return;

        try {
            const result = await favoriteService.toggleFavorite(params.id);
            // Use the result from the backend to update the state
            setIsFavorite(result.isFavorited);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete() {
        if (!match || !params?.id) return;

        if (!window.confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            await recipeManagementService.deleteRecipe(params.id);
            setLocation('/');
        } catch (err) {
            setError(err.message);
        }
    }

    const handleEdit = () => {
        if (!match || !params?.id) return;
        setLocation(`/edit-recipe/${params.id}`);
    };

    if (!match) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-red-500">Invalid recipe URL</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-[#D2B48C]">Loading recipe...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-red-500">{error}</div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-red-500">Recipe not found</div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#FFF8DC] py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img
                            src={`${baseUrl}${recipe.photo_path}`}
                            alt={recipe.name}
                            className="w-full h-96 object-cover"
                        />
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-[#D2B48C] mb-6">{recipe.name}</h1>
                            <div className="flex items-center justify-end space-x-4 mb-4">
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="px-6 py-2 rounded-full font-semibold border-2 border-[#D2B48C] text-[#D2B48C] hover:bg-[#D2B48C] hover:text-white transition-all duration-300"
                                        >
                                            Edit Recipe
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-6 py-2 rounded-full font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                                        >
                                            Delete Recipe
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-300 transform hover:scale-105
                                              ${isFavorite
                                            ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                            : 'bg-[#D2B48C] text-white border-[#D2B48C] hover:bg-[#C4A484]'}`}
                                >
                                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                </button>
                            </div>
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-gray-600 px-4 py-2 border border-[#D2B48C] rounded-full">{recipe.difficulty}</span>
                                <span className="text-gray-600 px-4 py-2 border border-[#D2B48C] rounded-full">{recipe.time}</span>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-[#D2B48C] mb-2">Type</h2>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.type.map((type, index) => (
                                        <span key={index} className="px-3 py-1 bg-[#FFF8DC] text-[#D2B48C] rounded-full text-sm">{type}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 text-[#D2B48C]">Ingredients</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index} className="text-gray-600">
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 text-[#D2B48C]">Instructions</h2>
                                <ol className="list-decimal pl-6 space-y-4">
                                    {recipe.steps.map((step, index) => (
                                        <li key={index} className="text-gray-600">
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    {relatedRecipes.length > 0 && (
                        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden p-6">
                            <h2 className="text-2xl font-bold mb-4 text-[#D2B48C]">Recipes You May Also Like</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedRecipes.map((relatedRecipe) => (
                                    <article
                                        href={`/recipe/${relatedRecipe._id}`}
                                        key={relatedRecipe._id}
                                        className="block bg-[#FFF8DC] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={`${baseUrl}${relatedRecipe.photo_path}`}
                                                alt={relatedRecipe.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-[#D2B48C]">{relatedRecipe.name}</h3>
                                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                                <span>{relatedRecipe.difficulty}</span>
                                                <span className="mx-2">•</span>
                                                <span>{relatedRecipe.time}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default RecipeDetail;
