import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import SearchBar from "../components/SearchBar";
import recipeService from "../services/recipeService";

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    // Function to perform search
    const performSearch = useCallback(async (query) => {
        try {
            setLoading(true);
            const results = await recipeService.searchRecipes(query);
            setSearchResults(results);
            setLoading(false);
        } catch (err) {
            setError("Failed to search recipes. Please try again later.");
            setLoading(false);
        }
    }, []);

    // Handle search from SearchBar
    const handleSearch = useCallback((query) => {
        performSearch(query);
    }, [performSearch]);

    // Initial search when component mounts
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        performSearch(query);
    }, [performSearch]);

    return (
        <div className="min-h-screen bg-[#FFF8DC]">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-12">
                    <SearchBar onSearch={handleSearch} />
                </div>
                {loading ? (
                    <div className="text-center text-2xl text-[#D2B48C]">Searching recipes...</div>
                ) : error ? (
                    <div className="text-center text-2xl text-red-500">{error}</div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center text-2xl text-[#D2B48C]">No recipes found. Try a different search term.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((recipe) => (
                            <Link key={recipe._id} href={`/recipe/${recipe._id}`}>
                                <a className="block bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                                    <img
                                        src={`${baseUrl}${recipe.photo_path}`}
                                        alt={recipe.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-[#D2B48C] mb-2">
                                            {recipe.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {recipe.ingredients.slice(0, 3).join(", ")}...
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {recipe.difficulty}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {recipe.time}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;