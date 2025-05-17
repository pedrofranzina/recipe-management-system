import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [, setLocation] = useLocation();

    // Update search term when URL changes
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        setSearchTerm(query || "");
    }, [window.location.search]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            const searchUrl = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
            setLocation(searchUrl);
            onSearch(searchTerm.trim());
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search for ingredients, recipes, or types..."
                    className="w-full px-6 py-4 text-lg rounded-full border-2 border-[#D2B48C] focus:outline-none focus:ring-2 focus:ring-[#D2B48C] focus:border-transparent"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#D2B48C] text-white px-6 py-2 rounded-full hover:bg-[#C4A484] transition-colors"
                >
                    Search
                </button>
            </div>
        </form>
    );
} 