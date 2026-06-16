import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, isAdmin = false) => {
        try {
            if (isAdmin) {
                if (email === 'admin@sportswear.com' && password === 'admin123') {
                    const adminUser = {
                        id: 'admin-1',
                        email: 'admin@sportswear.com',
                        name: 'Admin User',
                        role: 'admin'
                    };
                    setUser(adminUser);
                    localStorage.setItem('user', JSON.stringify(adminUser));
                    return { success: true };
                } else {
                    return { success: false, error: 'Invalid admin credentials' };
                }
            } else {
                const mockUser = {
                    id: 'user-' + Date.now(),
                    email,
                    name: email.split('@')[0],
                    role: 'customer'
                };
                setUser(mockUser);
                localStorage.setItem('user', JSON.stringify(mockUser));
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const newUser = {
                id: 'user-' + Date.now(),
                email,
                name,
                role: 'customer'
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Signup failed. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
