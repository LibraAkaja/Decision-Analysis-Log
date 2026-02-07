import { useContext, createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            console.log("[AuthContext] Init - Token exists:", !!token);
            
            if (token) {
                try {
                    const response = await getCurrentUser();
                    console.log("[AuthContext] Got user:", response.data);
                    setUser(response.data);
                } catch (err) {
                    console.error("[AuthContext] Failed to get current user:", err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userId');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            console.log("[AuthContext] Attempting login for:", email);
            
            const response = await loginUser({ email, password });
            const { access_token, refresh_token, user_id, email: userEmail, role } = response.data;
            
            console.log("[AuthContext] Login successful, storing tokens");
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', user_id);
            
            setUser({
                id: user_id,
                email: userEmail,
                role,
            });
            
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.detail || 'Login failed';
            console.error("[AuthContext] Login error:", {
                status: err.response?.status,
                message,
                data: err.response?.data,
            });
            setError(message);
            return { success: false, error: message };
        }
    };

    const register = async (email, password) => {
        try {
            setError(null);
            console.log("[AuthContext] Attempting register for:", email);
            
            const response = await registerUser({ email, password });
            const { access_token, refresh_token, user_id, email: userEmail, role } = response.data;
            
            console.log("[AuthContext] Register successful, storing tokens");
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', user_id);
            
            setUser({
                id: user_id,
                email: userEmail,
                role,
            });
            
            return { success: true };
        } catch (err) {
            console.error('Register error:', {
                status: err.response?.status,
                data: err.response?.data,
            });
            const message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            console.log("[AuthContext] Attempting logout");
            await logoutUser();
        } catch (err) {
            console.error('[AuthContext] Logout API call failed (continuing with local logout):', err);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
