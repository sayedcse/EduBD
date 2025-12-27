import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await api.get('auth/profile/');
                setUser(response.data);
            }
        } catch (error) {
            console.error("Not logged in");
            localStorage.removeItem('access_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('auth/login/', { username, password });
        localStorage.setItem('access_token', response.data.access);
        await checkUserLoggedIn();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
