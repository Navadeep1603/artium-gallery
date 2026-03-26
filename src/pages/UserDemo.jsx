import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import './UserDemo.css';

export default function UserDemo() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'visitor'
    });

    // Fetch data from Spring Boot API on load
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users from backend. Is Spring Boot running?");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.createUser(formData);
            // Refresh the list after successful creation
            fetchUsers();
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'visitor'
            });
        } catch (err) {
            console.error("Error creating user:", err);
            setError("Failed to create user. Check backend logs.");
        }
    };

    return (
        <div className="user-demo-container">
            <h1>Spring Boot MySQL Integration Demo</h1>
            
            {error && <div className="demo-error">{error}</div>}
            
            <div className="demo-grid">
                {/* Section 1: Fetch and display data */}
                <div className="demo-section">
                    <h2>Users from Database</h2>
                    {loading ? (
                        <p>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p>No users found in database.</p>
                    ) : (
                        <ul className="user-list">
                            {users.map(user => (
                                <li key={user.id} className="user-card">
                                    <div className="user-info">
                                        <strong>{user.name}</strong> ({user.role})
                                        <span>{user.email}</span>
                                    </div>
                                    <span className={`status-badge ${user.status}`}>
                                        {user.status || 'active'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Section 2: Form to POST new data */}
                <div className="demo-section">
                    <h2>Create New User</h2>
                    <form onSubmit={handleSubmit} className="demo-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleInputChange}>
                                <option value="visitor">Visitor</option>
                                <option value="artist">Artist</option>
                                <option value="curator">Curator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Add User to Database</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
