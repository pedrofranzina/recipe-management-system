import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import favoriteService from '../services/favoriteService';

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await favoriteService.getFavorites();
                setFavorites(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load favorites');
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center">
                <div className="text-2xl text-[#D2B48C]">Loading favorites...</div>
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
                <h1 className="text-4xl font-bold text-[#D2B48C] mb-8 text-center">My Favorites</h1>
                {favorites.length === 0 ? (
                    <div className="text-center text-xl text-gray-600">
                        You haven't added any recipes to your favorites yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((recipe) => (
                            <Link key={recipe._id} href={`/recipe/${recipe._id}`}>
                                <a className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
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
                                </a>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoritesPage; 