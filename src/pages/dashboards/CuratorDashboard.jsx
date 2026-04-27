import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Layout, PenTool, Video, Grid, MessageSquare, Plus, Edit2, Eye, Calendar, ExternalLink, CheckCircle, Clock, Star, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import { exhibitions, tourThemes } from '../../data/mockData';
import './Dashboard.css';

export default function CuratorDashboard() {
    const { user } = useAuth();
    const { artworks, updateArtwork } = useArtworks();
    const [activeTab, setActiveTab] = useState('exhibitions');

    const [editingInsight, setEditingInsight] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const curatorName = user?.name || 'Curator';

    const navItems = [
        { id: 'exhibitions', icon: Layout, label: 'Exhibition Manager' },
        { id: 'insights', icon: PenTool, label: 'Artwork Insights' },
        { id: 'tours', icon: Video, label: 'Virtual Tour Builder' },
        { id: 'content', icon: Grid, label: 'Gallery Management' },
        { id: 'collaboration', icon: MessageSquare, label: 'Artist Collaboration' },
    ];

    // Mock Data for Collaboration
    const messages = [
        { id: 1, artist: 'Vincent Modern', artwork: 'Starry Night Reimagined', preview: 'I can adjust the vividness for the neon theme.', time: '2 hours ago', unread: true },
        { id: 2, artist: 'Elena Rodriguez', artwork: 'Golden Serenity', preview: 'When is the Mediterranean collection launching?', time: '1 day ago', unread: false },
        { id: 3, artist: 'Marcus Chen', artwork: 'Urban Symphony', preview: 'Attached the high-res version you requested.', time: '3 days ago', unread: false }
    ];

    const handleSaveInsight = (e) => {
        e.preventDefault();
        updateArtwork(editingInsight.id, editingInsight);
        setEditingInsight(null);
    };

    const toggleFeatured = (artwork) => {
        updateArtwork(artwork.id, { ...artwork, featured: !artwork.featured });
    };

    const filteredInsightsArtworks = artworks.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.artist.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="dashboard dashboard--grid curator-dashboard-v2">
            <div className="dashboard__sidebar">
                <div className="sidebar__profile">
                    <div className="sidebar__avatar">
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"} alt={curatorName} />
                    </div>
                    <h3>{curatorName}</h3>
                    <p className="sidebar__role">Chief Curator</p>
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
                            Curate and manage the gallery experience
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
                            {/* 1. EXHIBITION MANAGER */}
                            {activeTab === 'exhibitions' && (
                                <div className="curator-exhibit-grid">
                                    {/* Create Exhibition Card */}
                                    <button className="curator-create-card" onClick={() => {}}>
                                        <div className="curator-create-card__icon">
                                            <Plus size={28} />
                                        </div>
                                        <h3>Create Exhibition</h3>
                                        <p>Group artworks by theme or period</p>
                                    </button>

                                    {/* Exhibition Cards */}
                                    {exhibitions.map(ex => (
                                        <div key={ex.id} className="curator-exhibit-card">
                                            {/* Image */}
                                            <div className="curator-exhibit-card__image">
                                                <img src={ex.image} alt={ex.title} />
                                                <span className={`curator-exhibit-card__badge ${ex.status === 'upcoming' ? 'badge--upcoming' : 'badge--active'}`}>
                                                    {ex.status === 'upcoming' ? <Clock size={11} /> : <CheckCircle size={11} />}
                                                    {ex.status === 'upcoming' ? 'Upcoming' : 'Active'}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="curator-exhibit-card__body">
                                                <h3 className="curator-exhibit-card__title">{ex.title}</h3>
                                                <p className="curator-exhibit-card__subtitle">{ex.subtitle}</p>
                                                <p className="curator-exhibit-card__desc">{ex.description}</p>

                                                <div className="curator-exhibit-card__meta">
                                                    <span><Grid size={13} /> {ex.artworkCount} Artworks</span>
                                                    <span><Calendar size={13} /> {ex.startDate}</span>
                                                </div>

                                                <div className="curator-exhibit-card__actions">
                                                    <button className="curator-exhibit-btn curator-exhibit-btn--edit">
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button className="curator-exhibit-btn curator-exhibit-btn--preview">
                                                        <Eye size={14} /> Preview
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 2. ARTWORK INSIGHTS */}
                            {activeTab === 'insights' && (
                                <div className="curator-insights-view">
                                    {editingInsight ? (
                                        <div className="dashboard__card curator-edit-insight">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="text-gold">Editing Insights: {editingInsight.title}</h2>
                                                <button onClick={() => setEditingInsight(null)} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.9rem' }}>Back to List</button>
                                            </div>

                                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: '1', minWidth: '250px', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={editingInsight.image} alt={editingInsight.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                                </div>
                                                <form onSubmit={handleSaveInsight} style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    <div className="form-group">
                                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Curator's Commentary</label>
                                                        <textarea
                                                            value={editingInsight.description || ''}
                                                            onChange={e => setEditingInsight({ ...editingInsight, description: e.target.value })}
                                                            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '0.75rem', color: 'var(--text-secondary)', outline: 'none' }}
                                                            rows="4"
                                                            placeholder="Add professional commentary..."
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Cultural & Historical Context</label>
                                                        <textarea
                                                            value={editingInsight.culturalHistory || ''}
                                                            onChange={e => setEditingInsight({ ...editingInsight, culturalHistory: e.target.value })}
                                                            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '0.75rem', color: 'var(--text-secondary)', outline: 'none' }}
                                                            rows="4"
                                                            placeholder="Add historical notes, cultural significance..."
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                                                        <button type="submit" className="btn btn-primary">Publish Insights</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="dashboard__search-wrapper" style={{ margin: '0 0 20px 0', maxWidth: '300px' }}>
                                                <div className="admin-search-box">
                                                    <Search size={18} className="search-icon" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search artworks to add insights..."
                                                        value={searchQuery}
                                                        onChange={e => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="dashboard__card admin-table-wrap" style={{ marginTop: '20px' }}>
                                                <table className="admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Artwork</th>
                                                            <th>Artist</th>
                                                            <th>Insight Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredInsightsArtworks.map(art => (
                                                            <tr key={art.id}>
                                                                <td>
                                                                    <div className="admin-user-cell">
                                                                        <img src={art.thumbnail || art.image} alt="" className="admin-user-cell__avatar" style={{ borderRadius: '4px' }} />
                                                                        <span>{art.title}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="text-secondary">{art.artist}</td>
                                                                <td>
                                                                    {art.culturalHistory ?
                                                                        <span className="admin-badge admin-badge--success"><CheckCircle size={12} style={{marginRight: '4px'}}/> Complete</span> :
                                                                        <span className="admin-badge admin-badge--warning"><Clock size={12} style={{marginRight: '4px'}}/> Needs Context</span>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="admin-actions">
                                                                        <button className="admin-action-btn admin-action-btn--primary" onClick={() => setEditingInsight(art)} style={{ fontSize: '12px', padding: '4px 10px', height: 'auto', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                                                            <PenTool size={12} style={{marginRight: '4px'}} /> Add/Edit
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {filteredInsightsArtworks.length === 0 && (
                                                    <div className="admin-empty">
                                                        <Search size={32} />
                                                        <p>No artworks match your search.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* 3. VIRTUAL TOUR BUILDER */}
                            {activeTab === 'tours' && (
                                <div className="curator-tours-view">
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p className="text-secondary">Design engaging routes and add audio narration to virtual tours.</p>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><Plus size={16} style={{marginRight: '4px'}} /> New Tour</button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                        {tourThemes.map(tour => (
                                            <div key={tour.id} className="dashboard__card" style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem' }}>
                                                <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={tour.image} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{tour.name}</h3>
                                                        <span style={{ fontSize: '0.75rem', border: '1px solid var(--gold-color)', color: 'var(--gold-color)', padding: '2px 8px', borderRadius: '99px' }}>{tour.duration}</span>
                                                    </div>
                                                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tour.description}</p>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                                                        <span>{tour.artworkCount} Nodes/Stops in Route</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.375rem', fontSize: '0.75rem' }}>Edit Route</button>
                                                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.375rem', fontSize: '0.75rem' }}>Add Narration</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 4. GALLERY CONTENT MANAGEMENT */}
                            {activeTab === 'content' && (
                                <div className="curator-content-view">
                                    <div className="dashboard__card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Featured Gallery Content</h3>
                                            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Manage the homepage layout and featured pieces.</p>
                                        </div>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>Save Display Order</button>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-color)' }}><Star size={16} fill="currentColor" /> Currently Featured (Homepage)</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        {artworks.filter(a => a.featured).map(art => (
                                            <div key={art.id} className="dashboard__card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
                                                <div style={{ width: '100%', aspectRatio: '4/3' }}>
                                                    <img src={art.thumbnail} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ padding: '0.75rem' }}>
                                                    <h5 style={{ fontWeight: 'bold', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.title}</h5>
                                                    <p className="text-secondary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.artist}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleFeatured(art)}
                                                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px', borderRadius: '50%', color: 'var(--gold-color)', border: 'none', cursor: 'pointer' }}
                                                    title="Remove from featured"
                                                >
                                                    <Star size={14} fill="currentColor" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Grid size={16} /> Available Artworks</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                        {artworks.filter(a => !a.featured).slice(0, 10).map(art => (
                                            <div key={art.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--glass-border)' }} onClick={() => toggleFeatured(art)}>
                                                <div style={{ aspectRatio: '1/1' }}>
                                                    <img src={art.thumbnail} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }} />
                                                </div>
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', padding: '1rem' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                                    <span style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Plus size={14} /> Feature</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 5. COLLABORATION TAB */}
                            {activeTab === 'collaboration' && (
                                <div className="dashboard__card" style={{ padding: 0, display: 'flex', height: '600px', overflow: 'hidden' }}>
                                    <div style={{ width: '33%', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <h3 style={{ fontWeight: 'bold' }}>Artist Conversations</h3>
                                        </div>
                                        <div style={{ overflowY: 'auto', flex: 1 }}>
                                            {messages.map((msg, idx) => (
                                                <div key={msg.id} style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', borderLeft: msg.unread ? '3px solid var(--gold-color)' : '3px solid transparent' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                                        <h4 style={{ fontSize: '0.875rem', fontWeight: msg.unread ? 'bold' : 'normal' }}>{msg.artist}</h4>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--gold-color)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.artwork}</p>
                                                    <p className="text-secondary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 'bold' }}>{messages[0].artist}</h3>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--gold-color)' }}>Regarding: {messages[0].artwork}</p>
                                            </div>
                                            <button className="btn btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}><ExternalLink size={12} style={{marginRight: '4px'}} /> View Artwork</button>
                                        </div>
                                        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '1rem' }}>
                                            {/* Chat bubble placeholder */}
                                            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', borderTopLeftRadius: 0, maxWidth: '80%', alignSelf: 'flex-start', border: '1px solid var(--glass-border)' }}>
                                                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Could you provide some cultural context notes for this piece before we feature it?</p>
                                                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>You • 3 hours ago</span>
                                            </div>
                                            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '8px', borderTopRightRadius: 0, maxWidth: '80%', alignSelf: 'flex-end', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                                                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{messages[0].preview}</p>
                                                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{messages[0].artist} • {messages[0].time}</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                                            <input type="text" placeholder="Type a message to the artist..." style={{ flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.875rem', color: 'inherit', outline: 'none' }} />
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Send</button>
                                        </div>
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
