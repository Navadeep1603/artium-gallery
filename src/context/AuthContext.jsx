import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock users for demo
const initialMockUsers = [
    { id: 1, email: 'admin@gallery.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 2, email: 'artist@gallery.com', password: 'artist123', name: 'Elena Rodriguez', role: 'artist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 3, email: 'visitor@gallery.com', password: 'visitor123', name: 'John Doe', role: 'visitor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 4, email: 'curator@gallery.com', password: 'curator123', name: 'Dr. Sarah Mitchell', role: 'curator', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
];

let mockUsers = [...initialMockUsers];
try {
    const storedUsers = localStorage.getItem('gallery-users-db');
    if (storedUsers) {
        mockUsers = JSON.parse(storedUsers);
    }
} catch (e) {
    console.error('Failed to load users from local storage', e);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState({});
    const [allUsers, setAllUsers] = useState(mockUsers);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('gallery-user');
        if (savedUser) {
            // We just update the initial state instead of setting it here, but to avoid complex refactoring
            // setting it in a timeout prevents the synchronous cascading render warning from eslint
            setTimeout(() => setUser(JSON.parse(savedUser)), 0);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const attemptsInfo = loginAttempts[email] || { count: 0, lockedUntil: null };

        // Check if account is locked
        if (attemptsInfo.lockedUntil && Date.now() < attemptsInfo.lockedUntil) {
            const remaining = Math.ceil((attemptsInfo.lockedUntil - Date.now()) / 1000);
            return { success: false, error: `Account temporarily locked due to too many failed attempts. Try again in ${remaining} seconds.` };
        }

        const foundUser = allUsers.find(u => u.email === email);

        if (!foundUser) {
            return { success: false, error: 'Invalid email or password' };
        }

        if (foundUser.password !== password) {
            // Increment failed attempts
            const newCount = attemptsInfo.count + 1;
            const updates = { count: newCount, lockedUntil: null };

            let errorMsg = 'Invalid email or password';

            // Lock out after 3 failed attempts for 60 seconds
            if (newCount >= 3) {
                updates.lockedUntil = Date.now() + 60 * 1000;
                errorMsg = 'Too many failed login attempts. Account locked for 60 seconds.';
                updates.count = 0; // Reset count for when lock expires
            } else {
                errorMsg = `Invalid email or password. ${3 - newCount} attempts remaining.`;
            }

            setLoginAttempts(prev => ({ ...prev, [email]: updates }));
            return { success: false, error: errorMsg };
        }

        if (foundUser.status === 'deactivated') {
            return { success: false, error: 'This account has been deactivated by an administrator.' };
        }

        // Successful login
        // Clear previous attempts
        setLoginAttempts(prev => {
            const next = { ...prev };
            delete next[email];
            return next;
        });

        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('gallery-user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
    };

    const signup = async (name, email, password, role = 'visitor') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if email already exists
        if (allUsers.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            email,
            password, // Store password in mock implementation so the user can log in later
            name,
            role,
            status: 'active',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        };

        const updatedUsers = [...allUsers, newUser];
        setAllUsers(updatedUsers);
        localStorage.setItem('gallery-users-db', JSON.stringify(updatedUsers));

        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('gallery-user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
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

        // Also update in allUsers
        const updatedUsers = allUsers.map(u => u.id === user.id ? { ...u, ...updates } : u);
        setAllUsers(updatedUsers);
        localStorage.setItem('gallery-users-db', JSON.stringify(updatedUsers));

        return { success: true };
    };

    const adminAddUser = (newUser) => {
        const userToAdd = {
            id: Date.now(),
            ...newUser,
            password: 'defaultPassword123', // Hardcoded for newly added users by admin
            status: 'active',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        };
        const updatedUsers = [userToAdd, ...allUsers];
        setAllUsers(updatedUsers);
        localStorage.setItem('gallery-users-db', JSON.stringify(updatedUsers));
        return userToAdd;
    };

    const adminUpdateUserRole = (id, newRole) => {
        const updatedUsers = allUsers.map(u => u.id === id ? { ...u, role: newRole } : u);
        setAllUsers(updatedUsers);
        localStorage.setItem('gallery-users-db', JSON.stringify(updatedUsers));
    };

    const adminToggleUserStatus = (id) => {
        const updatedUsers = allUsers.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'deactivated' : 'active' } : u);
        setAllUsers(updatedUsers);
        localStorage.setItem('gallery-users-db', JSON.stringify(updatedUsers));
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
