import { useState, useEffect } from "react";
import { Link } from "wouter";
import recipeService from "../services/recipeService";

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: "All",
        difficulty: "All",
        sortBy: "name"
    });
    const [types, setTypes] = useState(["All"]);

    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const sortOptions = [
        { value: "name", label: "Name" },
        { value: "time", label: "Time" }
    ];

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                setLoading(true);
                const allRecipes = await recipeService.getAllRecipes();

                // Extract unique types for filter
                const allTypes = new Set(allRecipes.flatMap(recipe => recipe.type));
                setTypes(["All", ...Array.from(allTypes)]);

                // Apply filters and sorting
                const filteredRecipes = await recipeService.filterAndSortRecipes(allRecipes, filters);
                setRecipes(filteredRecipes);
                setLoading(false);
            } catch (err) {
                setError("Failed to load recipes. Please try again later.");
                setLoading(false);
            }
        };

        loadRecipes();
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-[#D2B48C]">Loading recipes...</div>
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

    return (
        <div className="min-h-screen bg-[#FFF8DC] py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-[#D2B48C] mb-8 text-center">All Recipes</h1>
                <div className="rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Food</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                value={filters.difficulty}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty === "All" ? "All" : difficulty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 pt-4 mb-1">Sort By</label>
                        <select
                            className="w-full md:w-60 p-2 border border-gray-300 rounded-md bg-white"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map(recipe => (
                        <Link key={recipe._id} href={`/recipe/${recipe._id}`}>
                            <article className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                                <img
                                    src={`${baseUrl}${recipe.photo_path}`}
                                    alt={recipe.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-[#D2B48C] mb-2">{recipe.name}</h2>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{recipe.difficulty}</span>
                                        <span className="text-sm text-gray-500">{recipe.time}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {recipes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">
                            No recipes found matching your filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Recipes;