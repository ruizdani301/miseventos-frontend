import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserAuthResponse } from '../types';
import { loginUser, logout as logoutSrv, validateSession } from '../services/authService';

interface AuthContextType {
    user: UserAuthResponse | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserAuthResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const response = await validateSession();
            if (response.success && response.user) {
                setUser(response.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password?: string) => {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            // Assuming the login response contains the user object or we need to fetch it
            if (response.success) {
                await checkAuth(); // Re-validate session to get user data
            }
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutSrv();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
