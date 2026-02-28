import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Layout, PenTool, Video, Grid, MessageSquare, Plus, Edit2, Eye, Calendar, ExternalLink, CheckCircle, Clock, Star
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
                                    <div className="dashboard__card p-6 flex items-center justify-center border-dashed border-2 cursor-pointer hover:border-gold transition-colors min-h-[250px] group">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-glass border border-glass flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Plus size={24} className="text-gold" />
                                            </div>
                                            <h3 className="text-lg font-bold">Create Exhibition</h3>
                                            <p className="text-sm text-secondary">Group artworks by theme or period</p>
                                        </div>
                                    </div>
                                    {exhibitions.map(ex => (
                                        <div key={ex.id} className="dashboard__card p-0 overflow-hidden exhibit-manage-card">
                                            <div className="h-32 bg-secondary relative">
                                                <img src={ex.image} alt={ex.title} className="w-full h-full object-cover opacity-60" />
                                                <span className={`absolute top-4 right-4 px-2 py-1 flex items-center gap-1 text-xs rounded-full border bg-black/50 backdrop-blur-md ${ex.status === 'upcoming' ? 'text-yellow-400 border-yellow-500/30' : 'text-green-400 border-green-500/30'}`}>
                                                    {ex.status === 'upcoming' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                    {ex.status === 'upcoming' ? 'Upcoming' : 'Active'}
                                                </span>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-primary mb-1">{ex.title}</h3>
                                                <p className="text-sm text-gold mb-3">{ex.subtitle}</p>
                                                <p className="text-sm text-secondary mb-4 line-clamp-2">{ex.description}</p>

                                                <div className="flex justify-between items-center text-sm text-secondary mb-4 pb-4 border-b border-glass">
                                                    <span className="flex items-center gap-1"><Grid size={14} /> {ex.artworkCount} Artworks</span>
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {ex.startDate}</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="btn btn-primary flex-1 py-1.5 text-sm">Edit</button>
                                                    <button className="btn btn-secondary flex-1 py-1.5 text-sm flex items-center justify-center gap-1"><Eye size={14} /> Preview</button>
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
                                        <div className="dashboard__card p-6 edit-insight-form">
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-glass">
                                                <h2 className="text-xl font-bold text-gold">Editing Insights: {editingInsight.title}</h2>
                                                <button onClick={() => setEditingInsight(null)} className="btn btn-ghost text-sm py-1 px-3">Back to List</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="col-span-1 border border-glass rounded-lg overflow-hidden h-64 sticky top-6">
                                                    <img src={editingInsight.image} alt={editingInsight.title} className="w-full h-full object-cover" />
                                                </div>
                                                <form onSubmit={handleSaveInsight} className="col-span-2 space-y-5">
                                                    <div className="form-group">
                                                        <label className="text-sm font-semibold text-primary mb-2 block">Curator's Commentary</label>
                                                        <textarea
                                                            value={editingInsight.description || ''}
                                                            onChange={e => setEditingInsight({ ...editingInsight, description: e.target.value })}
                                                            className="w-full bg-primary border border-glass rounded p-3 text-secondary focus:border-gold outline-none"
                                                            rows="4"
                                                            placeholder="Add professional commentary..."
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="text-sm font-semibold text-primary mb-2 block">Cultural & Historical Context</label>
                                                        <textarea
                                                            value={editingInsight.culturalHistory || ''}
                                                            onChange={e => setEditingInsight({ ...editingInsight, culturalHistory: e.target.value })}
                                                            className="w-full bg-primary border border-glass rounded p-3 text-secondary focus:border-gold outline-none"
                                                            rows="4"
                                                            placeholder="Add historical notes, cultural significance..."
                                                        />
                                                    </div>
                                                    <div className="flex justify-end pt-4">
                                                        <button type="submit" className="btn btn-primary px-8">Publish Insights</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="relative w-full max-w-md">
                                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search artworks to add insights..."
                                                        className="w-full bg-secondary border border-glass rounded-full py-2 pl-10 pr-4 text-sm text-primary focus:border-gold outline-none"
                                                        value={searchQuery}
                                                        onChange={e => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto border border-glass rounded-lg bg-secondary">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-glass bg-black/20 text-xs uppercase text-muted tracking-wider">
                                                            <th className="p-4 font-semibold">Artwork</th>
                                                            <th className="p-4 font-semibold">Artist</th>
                                                            <th className="p-4 font-semibold">Insight Status</th>
                                                            <th className="p-4 font-semibold text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredInsightsArtworks.map(art => (
                                                            <tr key={art.id} className="border-b border-glass/30 hover:bg-white/5 transition-colors">
                                                                <td className="p-4 flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded overflow-hidden shrink-0"><img src={art.thumbnail} alt="" className="w-full h-full object-cover" /></div>
                                                                    <span className="font-medium text-primary">{art.title}</span>
                                                                </td>
                                                                <td className="p-4 text-sm text-secondary">{art.artist}</td>
                                                                <td className="p-4">
                                                                    {art.culturalHistory ?
                                                                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded inline-flex"><CheckCircle size={12} /> Complete</span> :
                                                                        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded inline-flex"><Clock size={12} /> Needs Context</span>
                                                                    }
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <button className="btn btn-secondary py-1 text-xs" onClick={() => setEditingInsight(art)}>
                                                                        <PenTool size={12} className="mr-1" /> Add/Edit
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* 3. VIRTUAL TOUR BUILDER */}
                            {activeTab === 'tours' && (
                                <div className="curator-tours-view">
                                    <div className="mb-6 flex justify-between items-center">
                                        <p className="text-secondary">Design engaging routes and add audio narration to virtual tours.</p>
                                        <button className="btn btn-primary py-1.5"><Plus size={16} className="mr-1" /> New Tour</button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {tourThemes.map(tour => (
                                            <div key={tour.id} className="dashboard__card p-5 flex gap-5 hover:border-gold transition-colors">
                                                <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
                                                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-lg font-bold text-primary">{tour.name}</h3>
                                                        <span className="text-xs text-gold border border-gold/30 px-2 rounded-full">{tour.duration}</span>
                                                    </div>
                                                    <p className="text-sm text-secondary mb-3 line-clamp-2">{tour.description}</p>
                                                    <div className="text-xs text-muted mb-auto">
                                                        <span>{tour.artworkCount} Nodes/Stops in Route</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-4">
                                                        <button className="btn btn-secondary flex-1 py-1.5 text-xs text-center justify-center border-glass">Edit Route</button>
                                                        <button className="btn btn-secondary flex-1 py-1.5 text-xs text-center justify-center border-glass">Add Narration</button>
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
                                    <div className="mb-6 bg-secondary border border-glass rounded-lg p-5 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-primary mb-1">Featured Gallery Content</h3>
                                            <p className="text-sm text-muted">Manage the homepage layout and featured pieces.</p>
                                        </div>
                                        <button className="btn btn-secondary text-sm">Save Display Order</button>
                                    </div>
                                    <h4 className="text-md font-bold mb-4 text-gold flex items-center gap-2"><Star size={16} fill="currentColor" /> Currently Featured (Homepage)</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        {artworks.filter(a => a.featured).map(art => (
                                            <div key={art.id} className="relative group border border-gold/30 rounded-lg overflow-hidden bg-secondary">
                                                <div className="aspect-[4/3]">
                                                    <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <div className="p-3 bg-secondary">
                                                    <h5 className="font-semibold text-primary text-sm truncate">{art.title}</h5>
                                                    <p className="text-xs text-muted truncate">{art.artist}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleFeatured(art)}
                                                    className="absolute top-2 right-2 bg-black/60 backdrop-blur p-1.5 rounded-full text-gold hover:text-white hover:bg-red-500 transition-colors"
                                                    title="Remove from featured"
                                                >
                                                    <Star size={14} fill="currentColor" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-md font-bold mb-4 flex items-center gap-2"><Grid size={16} /> Available Artworks</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        {artworks.filter(a => !a.featured).slice(0, 10).map(art => (
                                            <div key={art.id} className="relative group border border-glass rounded-lg overflow-hidden bg-secondary/50 hover:bg-secondary cursor-pointer" onClick={() => toggleFeatured(art)}>
                                                <div className="aspect-square">
                                                    <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="p-2 text-center absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-sm text-white font-semibold flex items-center gap-1"><Plus size={14} /> Add to Featured</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 5. COLLABORATION TAB */}
                            {activeTab === 'collaboration' && (
                                <div className="dashboard__card p-0 flex h-[600px] border border-glass overflow-hidden">
                                    <div className="w-1/3 border-r border-glass flex flex-col bg-secondary/30">
                                        <div className="p-4 border-b border-glass bg-secondary/50">
                                            <h3 className="font-bold text-primary">Artist Conversations</h3>
                                        </div>
                                        <div className="overflow-y-auto flex-1">
                                            {messages.map((msg, idx) => (
                                                <div key={msg.id} className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${idx !== messages.length - 1 ? 'border-b border-glass/30' : ''} ${msg.unread ? 'bg-white/5 border-l-2 border-l-gold' : 'border-l-2 border-l-transparent'}`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm ${msg.unread ? 'text-primary font-bold' : 'text-primary'}`}>{msg.artist}</h4>
                                                        <span className="text-xs text-muted">{msg.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gold mb-1 truncate">{msg.artwork}</p>
                                                    <p className="text-xs text-secondary line-clamp-1">{msg.preview}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col bg-primary relative">
                                        <div className="p-4 border-b border-glass bg-secondary/50 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-primary">{messages[0].artist}</h3>
                                                <p className="text-xs text-gold">Regarding: {messages[0].artwork}</p>
                                            </div>
                                            <button className="btn btn-ghost py-1 text-xs"><ExternalLink size={12} className="mr-1" /> View Artwork</button>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-end">
                                            {/* Chat bubble placeholder */}
                                            <div className="bg-secondary p-3 rounded-lg rounded-tl-none max-w-[80%] mb-4 self-start border border-glass">
                                                <p className="text-sm text-primary mb-1">Could you provide some cultural context notes for this piece before we feature it?</p>
                                                <span className="text-[10px] text-muted">You • 3 hours ago</span>
                                            </div>
                                            <div className="bg-gold/20 p-3 rounded-lg rounded-tr-none max-w-[80%] mb-4 self-end border border-gold/30">
                                                <p className="text-sm text-primary mb-1">{messages[0].preview}</p>
                                                <span className="text-[10px] text-muted">{messages[0].artist} • {messages[0].time}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-glass bg-secondary/30 flex gap-2">
                                            <input type="text" placeholder="Type a message to the artist..." className="flex-1 bg-primary border border-glass rounded p-2 text-sm text-primary focus:border-gold outline-none" />
                                            <button className="btn btn-primary px-4 py-2 text-sm">Send</button>
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
