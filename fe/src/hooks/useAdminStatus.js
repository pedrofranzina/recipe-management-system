import { useState, useEffect } from 'react';
import storeService from '../services/storeService';

function useAdminStatus() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function checkAdminStatus() {
            const token = storeService.getToken();
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setIsAdmin(payload.role === 'admin');
                } catch (err) {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        }

        checkAdminStatus();

        // Listen for auth changes
        const handleAuthChange = () => {
            checkAdminStatus();
        };

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    return isAdmin;
}

export default useAdminStatus; 