'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    username: string;
    email?: string;
    plan_id?: string | number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial state from LocalStorage on mount
        const token = localStorage.getItem('vpsphere_token');
        const storedUser = localStorage.getItem('vpsphere_user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('vpsphere_token');
                localStorage.removeItem('vpsphere_user');
            }
        }
        setLoading(false);

        // Listen to global 401 unauth ejects from the api-client interceptor
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener('vpsphere_unauthorized', handleUnauthorized);
        return () => window.removeEventListener('vpsphere_unauthorized', handleUnauthorized);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('vpsphere_token', token);
        localStorage.setItem('vpsphere_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('vpsphere_token');
        localStorage.removeItem('vpsphere_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
