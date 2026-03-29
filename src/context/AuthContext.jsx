import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        // Restore session from localStorage
        const savedUser = localStorage.getItem('gallery-user');
        if (savedUser) {
            try {
                setTimeout(() => setUser(JSON.parse(savedUser)), 0);
            } catch (e) {
                console.error('Failed to restore session', e);
            }
        }
        setLoading(false);

        // Load all users from backend (for admin features)
        api.get('/users')
            .then(res => setAllUsers(res.data))
            .catch(err => console.error('Failed to load users', err));
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/users/login', { email, password });
            const data = res.data;

            if (!data.success) {
                return { success: false, error: data.error || 'Invalid email or password' };
            }

            const loggedInUser = data.user;

            // If user must change password, don't store session yet
            if (data.mustChangePassword) {
                return { success: true, mustChangePassword: true, user: loggedInUser };
            }

            setUser(loggedInUser);
            localStorage.setItem('gallery-user', JSON.stringify(loggedInUser));
            return { success: true, user: loggedInUser };
        } catch (err) {
            return { success: false, error: 'Server error. Please try again.' };
        }
    };

    const signup = async (name, email, password, role = 'visitor') => {
        try {
            const res = await api.post('/users/signup', { name, email, password, role });
            const data = res.data;

            if (!data.success) {
                return { success: false, error: data.error || 'Signup failed' };
            }

            const newUser = data.user;
            setUser(newUser);
            localStorage.setItem('gallery-user', JSON.stringify(newUser));
            setAllUsers(prev => [...prev, newUser]);
            return { success: true, user: newUser };
        } catch (err) {
            return { success: false, error: 'Server error. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gallery-user');
    };

    const updateProfile = async (updates) => {
        try {
            const res = await api.put(`/users/${user.id}`, { ...user, ...updates });
            const updatedUser = res.data;
            setUser(updatedUser);
            localStorage.setItem('gallery-user', JSON.stringify(updatedUser));
            setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to update profile' };
        }
    };

    const adminAddUser = async (newUserData) => {
        try {
            const res = await api.post('/users/signup', {
                ...newUserData,
                password: 'defaultPassword123'
            });
            const data = res.data;
            if (data.success) {
                setAllUsers(prev => [data.user, ...prev]);
                return data.user;
            }
            return null;
        } catch (err) {
            return null;
        }
    };

    const adminUpdateUserRole = async (id, newRole) => {
        try {
            const userToUpdate = allUsers.find(u => u.id === id);
            if (userToUpdate) {
                await api.put(`/users/${id}`, { ...userToUpdate, role: newRole });
                setAllUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
            }
        } catch (err) {
            console.error('Failed to update user role', err);
        }
    };

    const adminToggleUserStatus = async (id) => {
        try {
            const userToUpdate = allUsers.find(u => u.id === id);
            if (userToUpdate) {
                const newStatus = userToUpdate.status === 'active' ? 'deactivated' : 'active';
                await api.put(`/users/${id}`, { ...userToUpdate, status: newStatus });
                setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
            }
        } catch (err) {
            console.error('Failed to toggle user status', err);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            allUsers,
            loading,
            login,
            signup,
            logout,
            updateProfile,
            adminAddUser,
            adminUpdateUserRole,
            adminToggleUserStatus,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
