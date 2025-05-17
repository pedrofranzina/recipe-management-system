import { useState, useEffect } from 'react';
import storeService from '../services/storeService';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => {
        const token = storeService.getToken();

        if (!token) {
            setIsLoggedIn(false);
            setUserRole(null);
            setIsLoading(false);
            return;
        }

        try {
            // Decode the JWT token
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);

            // Check if token has expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                storeService.deleteToken();
                setIsLoggedIn(false);
                setUserRole(null);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);
            setUserRole(decodedToken.role);
            setIsLoading(false);
        } catch (error) {
            storeService.deleteToken();
            setIsLoggedIn(false);
            setUserRole(null);
            setIsLoading(false);
        }
    };

    const logout = () => {
        storeService.deleteToken();
        setIsLoggedIn(false);
        setUserRole(null);
        window.dispatchEvent(new Event('authChange'));
    };

    useEffect(() => {
        checkAuth();

        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    return {
        isLoggedIn,
        userRole,
        logout,
        isLoading
    };
};

export default useAuth; 