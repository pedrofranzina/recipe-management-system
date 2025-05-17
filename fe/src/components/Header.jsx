import React from 'react';
import { Link, useLocation } from 'wouter';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const { isLoggedIn, logout } = useAuth();
    const [, setLocation] = useLocation();

    const handleLogout = () => {
        logout();
        setLocation('/');
    };

    return (
        <header className="sticky opacity-80 top-0 z-10 bg-[#D2B48C] text-white text-hero font-geo shadow-xl lg:h-[100px] md:h-[100px]">
            <nav className="p-4 h-full flex items-center justify-between lg:justify-evenly">
                <div className="flex-1">
                    <p className="pl-20 hidden lg:block text-lg italic text-white/90">
                        "Cooking is like love - it should be entered into with abandon or not at all"
                    </p>
                </div>

                <div className="flex-1 flex justify-center items-center space-x-6">
                    <Link href="/">
                        <span className="hover:text-[#FFF8DC] transition-colors cursor-pointer">Home</span>
                    </Link>
                    <Link href="/recipes">
                        <span className="hover:text-[#FFF8DC] transition-colors cursor-pointer">Recipes</span>
                    </Link>
                    <Link href="/about">
                        <span className="hover:text-[#FFF8DC] transition-colors cursor-pointer">About</span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-end pr-20 items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/favorites">
                                <button className="px-6 py-2 bg-[#FFF8DC] text-[#D2B48C] rounded-full font-semibold border-2 border-white
                                             hover:bg-[#FFF8DC]/90 transition-all duration-300 transform hover:scale-105
                                             shadow-lg hover:shadow-xl cursor-pointer">
                                    Favorites
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-white text-[#D2B48C] rounded-full font-semibold border-2 border-white
                                         hover:bg-white/90 transition-all duration-300 transform hover:scale-105
                                         shadow-lg hover:shadow-xl cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="px-6 py-2 bg-white text-[#D2B48C] rounded-full font-semibold border-2 border-white
                                             hover:bg-white/90 transition-all duration-300 transform hover:scale-105
                                             shadow-lg hover:shadow-xl cursor-pointer">
                                    Login
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="px-6 py-2 bg-[#FFF8DC] text-[#D2B48C] rounded-full font-semibold border-2 border-white
                                             hover:bg-[#FFF8DC]/90 transition-all duration-300 transform hover:scale-105
                                             shadow-lg hover:shadow-xl cursor-pointer">
                                    Register
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;