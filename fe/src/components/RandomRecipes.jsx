import { useState, useEffect } from "react";
import { Link } from "wouter";
import recipeService from "../services/recipeService";

function RandomRecipes() {
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchRandomRecipes = async () => {
            try {
                const allRecipes = await recipeService.getAllRecipes();
                // Shuffle and get random recipes
                const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
                const randomRecipes = shuffled.slice(0, 3);
                setTrendingRecipes(randomRecipes);
            } catch (error) {
                setError("Failed to load trending recipes");
            }
            setLoading(false);
        };

        fetchRandomRecipes();
    }, []);

    if (loading) {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-[#D2B48C]">Random Recipes</h2>
                <div className="text-center text-[#867257]">Loading recipes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-[#D2B48C]">Random Recipes</h2>
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#D2B48C]">Random Recipes</h2>
            <h3 className="text-1xl font-bold text-[#867257] mb-3">Try your luck with one of these:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingRecipes.map((recipe) => (
                    <Link key={recipe._id} href={`/recipe/${recipe._id}`}>
                        <a className="block bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                            <img
                                src={`${baseUrl}${recipe.photo_path}`}
                                alt={recipe.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-[#D2B48C] mb-2">{recipe.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{recipe.difficulty}</span>
                                    <span className="text-sm text-gray-500">{recipe.time}</span>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RandomRecipes;
