import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Palette, Image as ImageIcon, DollarSign, MessageSquare,
    User, Calendar, Plus, Edit2, Trash2, CheckCircle, Clock, ExternalLink, Eye, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import './Dashboard.css';

export default function ArtistDashboard() {
    const { user } = useAuth();
    const { getArtworksByArtist, deleteArtwork, updateArtwork } = useArtworks();
    const [activeTab, setActiveTab] = useState('my-artworks');
    const [editingArtwork, setEditingArtwork] = useState(null);

    const artistName = user?.name || '';
    const myArtworks = getArtworksByArtist(artistName);

    const totalRevenue = myArtworks.reduce((sum, a) => sum + (a.price * (a.views > 10000 ? 2 : 1)), 0);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this artwork?')) {
            deleteArtwork(id);
        }
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        updateArtwork(editingArtwork.id, editingArtwork);
        setEditingArtwork(null);
    };

    const navItems = [
        { id: 'my-artworks', icon: ImageIcon, label: 'My Artworks' },
        { id: 'sales', icon: DollarSign, label: 'Sales Tracker' },
        { id: 'messages', icon: MessageSquare, label: 'Buyer Interactions' },
        { id: 'profile', icon: User, label: 'Profile Management' },
        { id: 'exhibitions', icon: Calendar, label: 'Exhibition Requests' },
    ];

    // Mock Data for other sections
    const sales = myArtworks.length > 0 ? [
        { id: 'ORD-2026-001', artwork: 'Starry Night Reimagined', buyer: 'Isabella Martin', amount: 2500, status: 'completed', date: 'Feb 22, 2026' },
        { id: 'ORD-2026-002', artwork: 'Neon Samurai', buyer: 'David Park', amount: 4100, status: 'pending', date: 'Feb 24, 2026' },
        { id: 'ORD-2026-003', artwork: 'Urban Symphony', buyer: 'Sarah Chen', amount: 1800, status: 'completed', date: 'Feb 20, 2026' }
    ] : [];

    const messages = myArtworks.length > 0 ? [
        { id: 1, from: 'Isabella Martin', artwork: 'Starry Night Reimagined', preview: 'I absolutely love this piece. Does it come framed?', time: '2 hours ago', unread: true },
        { id: 2, from: 'Marcus Johnson', artwork: 'Commission Request', preview: 'Would you be open to painting a custom landscape?', time: '1 day ago', unread: false },
        { id: 3, from: 'Gallery Curator', artwork: 'Neon Samurai', preview: 'We would like to feature this in our next digital exhibit.', time: '3 days ago', unread: false }
    ] : [];

    const exhibitionRequests = myArtworks.length > 0 ? [
        { id: 1, title: 'Future Digitalism 2026', curator: 'Dr. Sarah Mitchell', dates: 'Mar 15 - Apr 15, 2026', status: 'pending', artworksRequested: ['Neon Samurai', 'Starry Night Reimagined'] },
        { id: 2, title: 'Modern Masters', curator: 'Elena Rodriguez', dates: 'May 1 - Jun 30, 2026', status: 'approved', artworksRequested: ['Urban Symphony'] }
    ] : [];

    return (
        <div className="dashboard artist-dashboard-v2">
            <div className="dashboard__sidebar">
                <div className="sidebar__profile">
                    <div className="sidebar__avatar">
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} alt={artistName} />
                    </div>
                    <h3>{artistName}</h3>
                    <p className="sidebar__role">Artist</p>
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
                        View Live Public Page
                    </Link>
                </div>
            </div>

            <div className="dashboard__main-content">
                <div className="dashboard__header" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            {navItems.find(i => i.id === activeTab)?.label}
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            Manage your creative business and interactions
                        </motion.p>
                    </div>
                    {activeTab === 'my-artworks' && (
                        <Link to="/dashboard/artist/upload" className="btn btn-primary">
                            <Plus size={18} />
                            Upload New
                        </Link>
                    )}
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
                            {/* MY ARTWORKS TAB */}
                            {activeTab === 'my-artworks' && (
                                <div className="artist-artworks-view">
                                    {editingArtwork ? (
                                        <div className="dashboard__card p-6 edit-artwork-form">
                                            <h2 className="text-xl mb-4 text-primary">Edit Setting: {editingArtwork.title}</h2>
                                            <form onSubmit={handleEditSave} className="space-y-4">
                                                <div className="form-group grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label>Title</label>
                                                        <input
                                                            type="text"
                                                            value={editingArtwork.title}
                                                            onChange={e => setEditingArtwork({ ...editingArtwork, title: e.target.value })}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Price (INR)</label>
                                                        <input
                                                            type="number"
                                                            value={editingArtwork.price}
                                                            onChange={e => setEditingArtwork({ ...editingArtwork, price: Number(e.target.value) })}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea
                                                        value={editingArtwork.description}
                                                        onChange={e => setEditingArtwork({ ...editingArtwork, description: e.target.value })}
                                                        className="w-full"
                                                        rows="3"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Cultural History</label>
                                                    <textarea
                                                        value={editingArtwork.culturalHistory || ''}
                                                        onChange={e => setEditingArtwork({ ...editingArtwork, culturalHistory: e.target.value })}
                                                        className="w-full"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-glass">
                                                    <button type="button" onClick={() => setEditingArtwork(null)} className="btn btn-secondary">Cancel</button>
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="artist-art-grid">
                                            {myArtworks.map(artwork => (
                                                <div key={artwork.id} className="artist-art-card">
                                                    <div className="artist-art-card__image">
                                                        <img src={artwork.thumbnail} alt={artwork.title} loading="lazy" />
                                                        <span className={`artist-art-card__live-badge ${!artwork.available ? 'artist-art-card__live-badge--sold' : ''}`}>
                                                            {artwork.available ? 'Live' : 'Sold'}
                                                        </span>
                                                    </div>
                                                    <div className="artist-art-card__content">
                                                        <h3 className="artist-art-card__title">{artwork.title}</h3>
                                                        <p className="artist-art-card__subtitle">{artwork.medium} &bull; &#8377;{artwork.price.toLocaleString('en-IN')}</p>

                                                        <div className="artist-art-card__stats-row">
                                                            <span className="artist-art-card__stat"><Eye size={13} /> {(artwork.views || 0).toLocaleString()}</span>
                                                            <span className="artist-art-card__stat"><Heart size={13} /> {(artwork.likes || 0).toLocaleString()}</span>
                                                        </div>

                                                        <div className="artist-art-card__actions">
                                                            <button className="artist-art-card__btn artist-art-card__btn--edit" onClick={() => setEditingArtwork(artwork)}>
                                                                <Edit2 size={14} /> Edit
                                                            </button>
                                                            <button className="artist-art-card__btn artist-art-card__btn--delete" onClick={() => handleDelete(artwork.id)}>
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {myArtworks.length === 0 && (
                                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-secondary border-2 border-dashed border-glass rounded-lg">
                                                    <ImageIcon size={32} className="mb-3 opacity-50" />
                                                    <p>You haven't uploaded any artworks yet.</p>
                                                    <Link to="/dashboard/artist/upload" className="text-gold mt-2">Upload your first piece</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SALES TRACKER TAB */}
                            {activeTab === 'sales' && (
                                <div className="dashboard__card sales-card">
                                    <div className="sales-card__header">
                                        <div>
                                            <h2 className="sales-card__title">Recent Orders</h2>
                                            <p className="sales-card__subtitle">Your latest sales and transactions</p>
                                        </div>
                                        <div className="sales-card__revenue">
                                            <span className="sales-card__revenue-label">Total Revenue</span>
                                            <span className="sales-card__revenue-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <div className="sales-table-wrap">
                                        <table className="sales-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Artwork</th>
                                                    <th>Buyer</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales.length > 0 ? (
                                                    sales.map(sale => (
                                                        <tr key={sale.id}>
                                                            <td className="sales-table__id">{sale.id}</td>
                                                            <td className="sales-table__artwork">{sale.artwork}</td>
                                                            <td className="sales-table__buyer">{sale.buyer}</td>
                                                            <td className="sales-table__date">{sale.date}</td>
                                                            <td className="sales-table__amount">₹{sale.amount.toLocaleString('en-IN')}</td>
                                                            <td>
                                                                <span className={`sales-table__status sales-table__status--${sale.status}`}>
                                                                    {sale.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-8 text-secondary">
                                                            No sales transactions yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* BUYER INTERACTIONS TAB */}
                            {activeTab === 'messages' && (
                                <div className="msg-list dashboard__card">
                                    {messages.length > 0 ? (
                                        messages.map((msg, idx) => (
                                            <div
                                                key={msg.id}
                                                className={`msg-item ${msg.unread ? 'msg-item--unread' : ''} ${idx !== messages.length - 1 ? 'msg-item--bordered' : ''}`}
                                            >
                                                <div className="msg-item__avatar">
                                                    {msg.from.charAt(0)}
                                                </div>
                                                <div className="msg-item__body">
                                                    <div className="msg-item__header">
                                                        <div className="msg-item__title">
                                                            <span className="msg-item__sender">{msg.from}</span>
                                                            <span className="msg-item__re">regarding</span>
                                                            <span className="msg-item__artwork">{msg.artwork}</span>
                                                        </div>
                                                        <span className="msg-item__time">{msg.time}</span>
                                                    </div>
                                                    <p className="msg-item__preview">{msg.preview}</p>
                                                </div>
                                                {msg.unread && <span className="msg-item__dot" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-secondary">
                                            <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                                            <p>No messages from buyers yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PROFILE MANAGEMENT TAB */}
                            {activeTab === 'profile' && (
                                <div className="dashboard__card profile-card">
                                    <div className="profile-card__layout">
                                        {/* Avatar column */}
                                        <div className="profile-card__avatar-col">
                                            <div className="profile-avatar-wrap">
                                                <img
                                                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                                                    alt="Profile"
                                                    className="profile-avatar"
                                                />
                                                <div className="profile-avatar__overlay">
                                                    <ImageIcon size={22} />
                                                    <span>Change</span>
                                                </div>
                                            </div>
                                            <p className="profile-avatar__hint">JPG, PNG up to 5MB</p>
                                        </div>

                                        {/* Form column */}
                                        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                                            <div className="profile-form__grid">
                                                <div className="profile-form__field">
                                                    <label>First Name</label>
                                                    <input type="text" defaultValue={artistName.split(' ')[0]} />
                                                </div>
                                                <div className="profile-form__field">
                                                    <label>Last Name</label>
                                                    <input type="text" defaultValue={artistName.split(' ').slice(1).join(' ') || ''} />
                                                </div>
                                            </div>
                                            <div className="profile-form__field">
                                                <label>Bio</label>
                                                <textarea rows="4" defaultValue="A master of contemporary digital art, focusing on the intersection of reality and imagination. Based in San Francisco, CA." />
                                            </div>
                                            <div className="profile-form__field">
                                                <label>Portfolio / Personal Website</label>
                                                <input type="url" defaultValue="https://myartportfolio.com" />
                                            </div>
                                            <div className="profile-form__footer">
                                                <button type="button" className="btn btn-primary">Save Profile Changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* EXHIBITION REQUESTS TAB */}
                            {activeTab === 'exhibitions' && (
                                <div className="exhibit-grid">
                                    {exhibitionRequests.length > 0 ? (
                                        exhibitionRequests.map(req => (
                                            <div key={req.id} className="exhibit-card dashboard__card">
                                                <div className="exhibit-card__header">
                                                    <div>
                                                        <h3 className="exhibit-card__title">{req.title}</h3>
                                                        <p className="exhibit-card__curator">Curated by <strong>{req.curator}</strong></p>
                                                    </div>
                                                    <span className={`exhibit-card__status exhibit-card__status--${req.status}`}>
                                                        {req.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                        {req.status === 'pending' ? 'Pending Review' : 'Approved'}
                                                    </span>
                                                </div>

                                                <p className="exhibit-card__dates">
                                                    <Calendar size={13} /> {req.dates}
                                                </p>

                                                <div className="exhibit-card__artworks">
                                                    <p className="exhibit-card__artworks-heading">Requested Artworks ({req.artworksRequested.length})</p>
                                                    <ul className="exhibit-card__artworks-list">
                                                        {req.artworksRequested.map((art, i) => (
                                                            <li key={i}>{art}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {req.status === 'pending' && (
                                                    <div className="exhibit-card__actions">
                                                        <button className="btn btn-primary">Accept All</button>
                                                        <button className="btn btn-secondary exhibit-card__decline-btn">Decline</button>
                                                    </div>
                                                )}
                                                {req.status === 'approved' && (
                                                    <div className="exhibit-card__approved-banner">
                                                        <CheckCircle size={16} /> You are participating in this exhibition!
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center text-secondary border-2 border-dashed border-glass dashboard__card">
                                            <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                                            <p>You haven't received any exhibition requests yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
