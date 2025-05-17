import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
    const [, setLocation] = useLocation();
    const { isLoggedIn, userRole, isLoading: authLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!isLoggedIn) {
            setLocation('/login');
            return;
        }
        if (userRole !== requiredRole) {
            setLocation('/');
            return;
        }
        setIsAuthorized(true);
        setIsLoading(false);
    }, [isLoggedIn, userRole, requiredRole, setLocation, authLoading]);

    if (isLoading || authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-2xl text-[#D2B48C]">Loading...</div>
            </div>
        );
    }

    return isAuthorized ? children : null;
};

export default ProtectedRoute; 