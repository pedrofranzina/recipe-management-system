import { Link } from "wouter";
import SearchBar from "../components/SearchBar";
import RandomRecipes from "../components/RandomRecipes";
import useAdminStatus from "../hooks/useAdminStatus";

function HomePage() {
    const isAdmin = useAdminStatus();

    return (
        <div className="min-h-screen bg-[#FFF8DC]">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#D2B48C] mb-4">
                        Welcome to Recipe Hub
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Discover, share, and cook amazing recipes
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar />
                    </div>
                </div>

                <RandomRecipes />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-[#D2B48C] mb-4">
                            [ADMIN-ONLY] Share Your Recipes
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Share it with the community and help others discover new dishes.
                        </p>
                        <Link href={isAdmin ? "/create-recipe" : "#"}>
                            <button
                                className={`px-6 py-3 rounded-lg transition-colors ${isAdmin
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-400 text-white cursor-not-allowed'
                                    }`}
                                disabled={!isAdmin}
                            >
                                Create Recipe
                            </button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-[#D2B48C] mb-4">
                            Browse Recipes
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Explore recipes and find exactly what you're looking for.
                        </p>
                        <Link href="/recipes">
                            <span className="inline-block bg-[#D2B48C] text-white px-6 py-2 rounded-full hover:bg-[#C4A484] transition-colors cursor-pointer">
                                View All Recipes
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
