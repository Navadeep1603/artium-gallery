import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock users for demo
const mockUsers = [
    { id: 1, email: 'admin@gallery.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 2, email: 'artist@gallery.com', password: 'artist123', name: 'Elena Rodriguez', role: 'artist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 3, email: 'visitor@gallery.com', password: 'visitor123', name: 'John Doe', role: 'visitor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 4, email: 'curator@gallery.com', password: 'curator123', name: 'Dr. Sarah Mitchell', role: 'curator', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('gallery-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = mockUsers.find(
            u => u.email === email && u.password === password
        );

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('gallery-user', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const signup = async (name, email, password, role = 'visitor') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if email already exists
        if (mockUsers.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: mockUsers.length + 1,
            email,
            name,
            role,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        };

        setUser(newUser);
        localStorage.setItem('gallery-user', JSON.stringify(newUser));
        return { success: true, user: newUser };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gallery-user');
    };

    const updateProfile = async (updates) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('gallery-user', JSON.stringify(updatedUser));
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            updateProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
