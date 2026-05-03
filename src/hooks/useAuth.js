import { useState, useEffect, useCallback } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tokenExpired, setTokenExpired] = useState(false);

    /**
     * Valida el token llamando al endpoint /auth/profile del backend
     * Si el token es válido, devuelve 200 con los datos del usuario
     * Si el token expiró o es inválido, devuelve 401
     */
    const validateToken = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return false;
        }

        try {
            const response = await fetch('http://localhost:3001/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Token válido
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
                setTokenExpired(false);
                localStorage.setItem('user', JSON.stringify(userData));
                setLoading(false);
                return true;
            } else if (response.status === 401) {
                // Token expirado o inválido
                setTokenExpired(true);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
                return false;
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return false;
        }
    }, []);

    /**
     * Se ejecuta al montar el componente para validar si hay token
     */
    useEffect(() => {
        validateToken();
    }, [validateToken]);

    /**
     * Limpia la autenticación (logout)
     */
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setTokenExpired(false);
    }, []);

    /**
     * Guarda los datos de login
     */
    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setTokenExpired(false);
    }, []);

    return {
        user,
        isAuthenticated,
        loading,
        tokenExpired,
        validateToken,
        logout,
        login
    };
};

export default useAuth;
