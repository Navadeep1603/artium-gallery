import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, Shield, CheckSquare, Settings, BarChart2, Megaphone,
    ExternalLink, Search, Plus, Edit2, UserX, UserCheck, X,
    Image as ImageIcon, CheckCircle, XCircle, Clock, Eye,
    DollarSign, TrendingUp, Palette, Layout, Star, Moon, Sun,
    Bell, Send, Trash2, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import { artists } from '../../data/mockData';
import './Dashboard.css';

// ── Mock data ──────────────────────────────────────────────
const allUsers = [
    { id: 1, name: 'Admin User', email: 'admin@gallery.com', role: 'admin', status: 'active', joined: 'Jan 10, 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 2, name: 'Elena Rodriguez', email: 'artist@gallery.com', role: 'artist', status: 'active', joined: 'Feb 15, 2025', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 3, name: 'John Doe', email: 'visitor@gallery.com', role: 'visitor', status: 'active', joined: 'Mar 02, 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 4, name: 'Dr. Sarah Mitchell', email: 'curator@gallery.com', role: 'curator', status: 'active', joined: 'Apr 18, 2025', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    { id: 5, name: 'Marcus Chen', email: 'marcus@gallery.com', role: 'artist', status: 'active', joined: 'May 05, 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 6, name: 'Sophie Laurent', email: 'sophie@gallery.com', role: 'artist', status: 'deactivated', joined: 'Jun 12, 2025', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    { id: 7, name: 'David Park', email: 'david@gallery.com', role: 'visitor', status: 'active', joined: 'Jul 22, 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 8, name: 'Amara Okonkwo', email: 'amara@gallery.com', role: 'artist', status: 'active', joined: 'Aug 30, 2025', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
];

const mockAnnouncements = [
    { id: 1, title: 'Platform Maintenance Scheduled', content: 'The platform will undergo maintenance on March 5th from 2:00 AM to 6:00 AM IST. During this period, some features may be unavailable.', date: 'Feb 25, 2026', priority: 'warning', active: true },
    { id: 2, title: 'New Exhibition Feature Launch', content: 'We are excited to announce our new virtual exhibition feature! Artists can now create immersive 3D exhibitions for their artwork.', date: 'Feb 20, 2026', priority: 'info', active: true },
    { id: 3, title: 'Updated Artist Payout Policy', content: 'Starting March 1st, artist payouts will be processed weekly instead of monthly. Check your dashboard for details.', date: 'Feb 15, 2026', priority: 'important', active: false },
];

export default function AdminDashboard() {
    const { user, allUsers, adminAddUser, adminToggleUserStatus, adminUpdateUserRole } = useAuth();
    const { artworks } = useArtworks();
    const [activeTab, setActiveTab] = useState('users');

    // ── User Management state ──
    const [userSearch, setUserSearch] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'visitor' });

    // ── Content Moderation state ──
    const pendingArtworks = artworks.slice(0, 6).map(a => ({ ...a, moderationStatus: 'pending' }));
    const [moderationList, setModerationList] = useState(pendingArtworks);

    // ── Gallery Settings state ──
    const [gallerySettings, setGallerySettings] = useState({
        layout: 'grid',
        theme: 'dark',
        featuredCount: 6,
        showPrices: true,
        enableVirtualTours: true,
        enableAudioNarration: true,
    });

    // ── Announcements state ──
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'info' });
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

    const navItems = [
        { id: 'users', icon: Users, label: 'User Management' },
        { id: 'roles', icon: Shield, label: 'Role Assignment' },
        { id: 'moderation', icon: CheckSquare, label: 'Content Moderation' },
        { id: 'settings', icon: Settings, label: 'Gallery Settings' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics Overview' },
        { id: 'announcements', icon: Megaphone, label: 'Announcements' },
    ];

    // ── Filtered users ──
    const filteredUsers = (allUsers || []).filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    // ── Handlers ──
    const handleAddUser = (e) => {
        e.preventDefault();
        adminAddUser(newUser);
        setNewUser({ name: '', email: '', role: 'visitor' });
        setShowAddUser(false);
    };

    const toggleUserStatus = (id) => {
        adminToggleUserStatus(id);
    };

    const changeUserRole = (id, newRole) => {
        adminUpdateUserRole(id, newRole);
    };

    const handleModeration = (id, action) => {
        setModerationList(moderationList.map(a => a.id === id ? { ...a, moderationStatus: action } : a));
    };

    const handleAddAnnouncement = (e) => {
        e.preventDefault();
        const added = {
            id: Date.now(),
            ...newAnnouncement,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            active: true,
        };
        setAnnouncements([added, ...announcements]);
        setNewAnnouncement({ title: '', content: '', priority: 'info' });
        setShowAnnouncementForm(false);
    };

    const toggleAnnouncement = (id) => {
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const deleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };

    // ── Analytics data ──
    const totalRevenue = artworks.reduce((sum, a) => sum + a.price, 0);
    const totalViews = artworks.reduce((sum, a) => sum + (a.views || 0), 0);
    const analyticsStats = [
        { label: 'Total Artworks', value: artworks.length, icon: ImageIcon, color: 'gold' },
        { label: 'Active Artists', value: artists.length, icon: Palette, color: 'blue' },
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'green' },
        { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'purple' },
        { label: 'Active Users', value: (allUsers || []).filter(u => u.status === 'active').length, icon: Users, color: 'cyan' },
        { label: 'Virtual Tours', value: '1,240', icon: TrendingUp, color: 'pink' },
    ];

    const monthlyData = [
        { month: 'Sep', sales: 42, revenue: 18500 },
        { month: 'Oct', sales: 58, revenue: 24200 },
        { month: 'Nov', sales: 35, revenue: 15800 },
        { month: 'Dec', sales: 72, revenue: 31400 },
        { month: 'Jan', sales: 65, revenue: 28900 },
        { month: 'Feb', sales: 80, revenue: 35200 },
    ];
    const maxSales = Math.max(...monthlyData.map(d => d.sales));

    const getRoleBadgeClass = (role) => {
        const map = { admin: 'admin-badge--admin', artist: 'admin-badge--artist', visitor: 'admin-badge--visitor', curator: 'admin-badge--curator' };
        return map[role] || '';
    };

    const getPriorityClass = (priority) => {
        const map = { warning: 'admin-announce--warning', info: 'admin-announce--info', important: 'admin-announce--important' };
        return map[priority] || '';
    };

    return (
        <div className="dashboard admin-dashboard-v2">
            {/* ── Sidebar ── */}
            <div className="dashboard__sidebar">
                <div className="sidebar__profile">
                    <div className="sidebar__avatar">
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} alt={user?.name} />
                    </div>
                    <h3>{user?.name}</h3>
                    <p className="sidebar__role">🔐 Administrator</p>
                </div>

                <nav className="sidebar__nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar__nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    <Link to="/" className="sidebar__nav-item text-secondary">
                        <ExternalLink size={18} />
                        View Public Site
                    </Link>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="dashboard__main-content">
                <div className="dashboard__header" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            {navItems.find(i => i.id === activeTab)?.label}
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            Full platform control and management
                        </motion.p>
                    </div>
                </div>

                <div className="dashboard__content-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >

                            {/* ═══════════════════════════════════════
                                USER MANAGEMENT TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'users' && (
                                <div>
                                    <div className="admin-toolbar">
                                        <div className="admin-search">
                                            <Search size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search users by name, email, or role..."
                                                value={userSearch}
                                                onChange={e => setUserSearch(e.target.value)}
                                            />
                                        </div>
                                        <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>
                                            <Plus size={18} /> Add User
                                        </button>
                                    </div>

                                    {/* Add User Modal */}
                                    {showAddUser && (
                                        <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <motion.div className="admin-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                                <div className="admin-modal__header">
                                                    <h3>Add New User</h3>
                                                    <button onClick={() => setShowAddUser(false)}><X size={20} /></button>
                                                </div>
                                                <form onSubmit={handleAddUser} className="admin-modal__body">
                                                    <div className="admin-field">
                                                        <label>Full Name</label>
                                                        <input type="text" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter full name" />
                                                    </div>
                                                    <div className="admin-field">
                                                        <label>Email</label>
                                                        <input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email address" />
                                                    </div>
                                                    <div className="admin-field">
                                                        <label>Role</label>
                                                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                                            <option value="visitor">Visitor</option>
                                                            <option value="artist">Artist</option>
                                                            <option value="curator">Curator</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </div>
                                                    <div className="admin-modal__actions">
                                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
                                                        <button type="submit" className="btn btn-primary">Create User</button>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Users Table */}
                                    <div className="dashboard__card admin-table-wrap">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Joined</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map(u => (
                                                    <tr key={u.id} className={u.status === 'deactivated' ? 'admin-row--deactivated' : ''}>
                                                        <td>
                                                            <div className="admin-user-cell">
                                                                <img src={u.avatar} alt={u.name} className="admin-user-cell__avatar" />
                                                                <span>{u.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-secondary">{u.email}</td>
                                                        <td><span className={`admin-badge ${getRoleBadgeClass(u.role)}`}>{u.role}</span></td>
                                                        <td>
                                                            <span className={`admin-status ${u.status === 'active' ? 'admin-status--active' : 'admin-status--deactivated'}`}>
                                                                {u.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                                                                {u.status}
                                                            </span>
                                                        </td>
                                                        <td className="text-secondary">{u.joined}</td>
                                                        <td>
                                                            <div className="admin-actions">
                                                                <button className="admin-action-btn" title="Edit" onClick={() => setActiveTab('roles')}><Edit2 size={14} /></button>
                                                                <button
                                                                    className={`admin-action-btn ${u.status === 'active' ? 'admin-action-btn--danger' : 'admin-action-btn--success'}`}
                                                                    title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                                                                    onClick={() => toggleUserStatus(u.id)}
                                                                >
                                                                    {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && (
                                            <div className="admin-empty">
                                                <Users size={32} />
                                                <p>No users found matching your search.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════
                                ROLE ASSIGNMENT TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'roles' && (
                                <div>
                                    <div className="admin-info-banner">
                                        <Shield size={20} />
                                        <p>Assign or change user roles. Roles determine what features each user can access on the platform.</p>
                                    </div>

                                    <div className="admin-role-grid">
                                        {(allUsers || []).map(u => (
                                            <motion.div
                                                key={u.id}
                                                className="admin-role-card dashboard__card"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="admin-role-card__header">
                                                    <img src={u.avatar} alt={u.name} className="admin-role-card__avatar" />
                                                    <div>
                                                        <h4>{u.name}</h4>
                                                        <p className="text-secondary text-sm">{u.email}</p>
                                                    </div>
                                                </div>
                                                <div className="admin-role-card__body">
                                                    <label className="text-secondary text-sm">Current Role</label>
                                                    <div className="admin-role-select-wrap">
                                                        <select
                                                            value={u.role}
                                                            onChange={e => changeUserRole(u.id, e.target.value)}
                                                            className="admin-role-select"
                                                        >
                                                            <option value="visitor">👁️ Visitor</option>
                                                            <option value="artist">🎨 Artist</option>
                                                            <option value="curator">🖼️ Curator</option>
                                                            <option value="admin">🔐 Admin</option>
                                                        </select>
                                                        <ChevronDown size={16} className="admin-role-select__icon" />
                                                    </div>
                                                    <div className="admin-role-card__permissions">
                                                        <span className="text-xs text-secondary">Permissions:</span>
                                                        {u.role === 'admin' && <span className="admin-perm">Full Access</span>}
                                                        {u.role === 'artist' && <><span className="admin-perm">Upload</span><span className="admin-perm">Sell</span><span className="admin-perm">Dashboard</span></>}
                                                        {u.role === 'curator' && <><span className="admin-perm">Curate</span><span className="admin-perm">Exhibitions</span></>}
                                                        {u.role === 'visitor' && <><span className="admin-perm">Browse</span><span className="admin-perm">Purchase</span></>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════
                                CONTENT MODERATION TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'moderation' && (
                                <div>
                                    <div className="admin-info-banner">
                                        <CheckSquare size={20} />
                                        <p>Review and approve or reject artwork submissions before they appear publicly in the gallery.</p>
                                    </div>

                                    <div className="admin-mod-grid">
                                        {moderationList.map(artwork => (
                                            <motion.div
                                                key={artwork.id}
                                                className={`admin-mod-card dashboard__card ${artwork.moderationStatus !== 'pending' ? 'admin-mod-card--resolved' : ''}`}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <div className="admin-mod-card__image">
                                                    <img src={artwork.thumbnail} alt={artwork.title} />
                                                    {artwork.moderationStatus !== 'pending' && (
                                                        <div className={`admin-mod-card__stamp ${artwork.moderationStatus === 'approved' ? 'admin-mod-card__stamp--approved' : 'admin-mod-card__stamp--rejected'}`}>
                                                            {artwork.moderationStatus === 'approved' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                                            {artwork.moderationStatus}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="admin-mod-card__content">
                                                    <h4>{artwork.title}</h4>
                                                    <p className="text-secondary text-sm">by {artwork.artist}</p>
                                                    <div className="admin-mod-card__meta">
                                                        <span>{artwork.medium}</span>
                                                        <span>₹{artwork.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    {artwork.moderationStatus === 'pending' && (
                                                        <div className="admin-mod-card__actions">
                                                            <button className="admin-mod-btn admin-mod-btn--approve" onClick={() => handleModeration(artwork.id, 'approved')}>
                                                                <CheckCircle size={16} /> Approve
                                                            </button>
                                                            <button className="admin-mod-btn admin-mod-btn--reject" onClick={() => handleModeration(artwork.id, 'rejected')}>
                                                                <XCircle size={16} /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════
                                GALLERY SETTINGS TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'settings' && (
                                <div className="admin-settings-grid">
                                    {/* Layout Settings */}
                                    <div className="dashboard__card admin-settings-card">
                                        <h3><Layout size={20} /> Layout Configuration</h3>
                                        <div className="admin-settings-card__body">
                                            <div className="admin-field">
                                                <label>Gallery Layout</label>
                                                <div className="admin-radio-group">
                                                    {['grid', 'masonry', 'list'].map(layout => (
                                                        <label key={layout} className={`admin-radio ${gallerySettings.layout === layout ? 'admin-radio--active' : ''}`}>
                                                            <input type="radio" name="layout" value={layout} checked={gallerySettings.layout === layout} onChange={() => setGallerySettings({ ...gallerySettings, layout })} />
                                                            {layout.charAt(0).toUpperCase() + layout.slice(1)}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="admin-field">
                                                <label>Featured Artworks Count</label>
                                                <input
                                                    type="range"
                                                    min="3"
                                                    max="12"
                                                    value={gallerySettings.featuredCount}
                                                    onChange={e => setGallerySettings({ ...gallerySettings, featuredCount: Number(e.target.value) })}
                                                    className="admin-range"
                                                />
                                                <span className="admin-range-value">{gallerySettings.featuredCount} artworks</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Theme Settings */}
                                    <div className="dashboard__card admin-settings-card">
                                        <h3><Palette size={20} /> Theme Configuration</h3>
                                        <div className="admin-settings-card__body">
                                            <div className="admin-field">
                                                <label>Color Theme</label>
                                                <div className="admin-radio-group">
                                                    {[
                                                        { value: 'dark', icon: Moon, label: 'Dark' },
                                                        { value: 'light', icon: Sun, label: 'Light' },
                                                        { value: 'auto', icon: Settings, label: 'Auto' },
                                                    ].map(theme => (
                                                        <label key={theme.value} className={`admin-radio ${gallerySettings.theme === theme.value ? 'admin-radio--active' : ''}`}>
                                                            <input type="radio" name="theme" value={theme.value} checked={gallerySettings.theme === theme.value} onChange={() => setGallerySettings({ ...gallerySettings, theme: theme.value })} />
                                                            <theme.icon size={14} /> {theme.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Toggles */}
                                    <div className="dashboard__card admin-settings-card admin-settings-card--full">
                                        <h3><Star size={20} /> Feature Toggles</h3>
                                        <div className="admin-settings-card__body">
                                            {[
                                                { key: 'showPrices', label: 'Show Prices on Gallery', desc: 'Display artwork prices publicly in the gallery view' },
                                                { key: 'enableVirtualTours', label: 'Enable Virtual Tours', desc: 'Allow visitors to take 3D virtual tours of exhibitions' },
                                                { key: 'enableAudioNarration', label: 'Enable Audio Narration', desc: 'Provide audio descriptions for artworks with narration available' },
                                            ].map(toggle => (
                                                <div key={toggle.key} className="admin-toggle-row">
                                                    <div>
                                                        <span className="admin-toggle-label">{toggle.label}</span>
                                                        <span className="admin-toggle-desc">{toggle.desc}</span>
                                                    </div>
                                                    <label className="admin-switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={gallerySettings[toggle.key]}
                                                            onChange={() => setGallerySettings({ ...gallerySettings, [toggle.key]: !gallerySettings[toggle.key] })}
                                                        />
                                                        <span className="admin-switch__slider" />
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="admin-settings-save">
                                        <button className="btn btn-primary"><CheckCircle size={18} /> Save All Settings</button>
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════
                                ANALYTICS OVERVIEW TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'analytics' && (
                                <div>
                                    <div className="admin-analytics-stats">
                                        {analyticsStats.map((stat, index) => (
                                            <motion.div
                                                key={stat.label}
                                                className={`stat-card stat-card--${stat.color}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.08 }}
                                            >
                                                <div className="stat-card__icon">
                                                    <stat.icon size={24} />
                                                </div>
                                                <div className="stat-card__info">
                                                    <span className="stat-card__value">{stat.value}</span>
                                                    <span className="stat-card__label">{stat.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="admin-analytics-grid">
                                        {/* Monthly Sales Chart */}
                                        <div className="dashboard__card admin-chart-card">
                                            <div className="dashboard__card-header">
                                                <h2><BarChart2 size={20} /> Monthly Sales</h2>
                                            </div>
                                            <div className="admin-chart">
                                                <div className="admin-chart__bars">
                                                    {monthlyData.map((d, i) => (
                                                        <div key={d.month} className="admin-chart__bar-group">
                                                            <motion.div
                                                                className="admin-chart__bar"
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${(d.sales / maxSales) * 100}%` }}
                                                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                                            />
                                                            <span className="admin-chart__bar-label">{d.month}</span>
                                                            <span className="admin-chart__bar-value">{d.sales}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Categories */}
                                        <div className="dashboard__card admin-chart-card">
                                            <div className="dashboard__card-header">
                                                <h2><TrendingUp size={20} /> Top Categories</h2>
                                            </div>
                                            <div className="admin-categories-list">
                                                {[
                                                    { name: 'Digital Art', count: artworks.filter(a => a.category === 'digital').length, color: '#c9a962' },
                                                    { name: 'Painting', count: artworks.filter(a => a.category === 'painting').length, color: '#3b82f6' },
                                                    { name: 'Photography', count: artworks.filter(a => a.category === 'photography').length, color: '#8b5cf6' },
                                                    { name: 'Sculpture', count: artworks.filter(a => a.category === 'sculpture').length, color: '#22c55e' },
                                                    { name: 'NFT', count: artworks.filter(a => a.category === 'nft').length, color: '#ec4899' },
                                                ].map(cat => (
                                                    <div key={cat.name} className="admin-cat-row">
                                                        <div className="admin-cat-row__info">
                                                            <span className="admin-cat-dot" style={{ background: cat.color }} />
                                                            <span>{cat.name}</span>
                                                        </div>
                                                        <div className="admin-cat-row__bar-wrap">
                                                            <motion.div
                                                                className="admin-cat-row__bar"
                                                                style={{ background: cat.color }}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(cat.count / artworks.length) * 100}%` }}
                                                                transition={{ duration: 0.6 }}
                                                            />
                                                        </div>
                                                        <span className="admin-cat-row__count">{cat.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════
                                ANNOUNCEMENTS TAB
                               ═══════════════════════════════════════ */}
                            {activeTab === 'announcements' && (
                                <div>
                                    <div className="admin-toolbar">
                                        <div className="admin-info-banner" style={{ flex: 1, marginBottom: 0 }}>
                                            <Bell size={20} />
                                            <p>Post notices visible to all platform users.</p>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                                            {showAnnouncementForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Announcement</>}
                                        </button>
                                    </div>

                                    {/* New Announcement Form */}
                                    <AnimatePresence>
                                        {showAnnouncementForm && (
                                            <motion.div
                                                className="dashboard__card admin-announce-form"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <form onSubmit={handleAddAnnouncement}>
                                                    <div className="admin-field">
                                                        <label>Title</label>
                                                        <input type="text" required value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} placeholder="Announcement title" />
                                                    </div>
                                                    <div className="admin-field">
                                                        <label>Content</label>
                                                        <textarea rows="3" required value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} placeholder="Write your announcement..." />
                                                    </div>
                                                    <div className="admin-field">
                                                        <label>Priority</label>
                                                        <select value={newAnnouncement.priority} onChange={e => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}>
                                                            <option value="info">ℹ️ Information</option>
                                                            <option value="important">⚡ Important</option>
                                                            <option value="warning">⚠️ Warning</option>
                                                        </select>
                                                    </div>
                                                    <div className="admin-modal__actions">
                                                        <button type="submit" className="btn btn-primary"><Send size={16} /> Publish Announcement</button>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Announcement List */}
                                    <div className="admin-announce-list">
                                        {announcements.map(a => (
                                            <motion.div
                                                key={a.id}
                                                className={`dashboard__card admin-announce-card ${getPriorityClass(a.priority)} ${!a.active ? 'admin-announce-card--inactive' : ''}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="admin-announce-card__header">
                                                    <div>
                                                        <h4>{a.title}</h4>
                                                        <span className="text-xs text-secondary">{a.date}</span>
                                                    </div>
                                                    <div className="admin-announce-card__controls">
                                                        <label className="admin-switch admin-switch--sm">
                                                            <input type="checkbox" checked={a.active} onChange={() => toggleAnnouncement(a.id)} />
                                                            <span className="admin-switch__slider" />
                                                        </label>
                                                        <button className="admin-action-btn admin-action-btn--danger" onClick={() => deleteAnnouncement(a.id)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="admin-announce-card__content">{a.content}</p>
                                                <div className="admin-announce-card__footer">
                                                    <span className={`admin-badge ${a.priority === 'warning' ? 'admin-badge--warning' : a.priority === 'important' ? 'admin-badge--important' : 'admin-badge--info'}`}>
                                                        {a.priority}
                                                    </span>
                                                    <span className={`admin-status ${a.active ? 'admin-status--active' : 'admin-status--deactivated'}`}>
                                                        {a.active ? 'Live' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
