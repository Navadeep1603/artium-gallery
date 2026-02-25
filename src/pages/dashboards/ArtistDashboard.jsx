import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image,
    DollarSign,
    Eye,
    Heart,
    Upload,
    MessageSquare,
    TrendingUp,
    Plus,
    Star,
    BarChart2,
    Calendar,
    Clock,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    ShoppingBag,
    Award,
    Palette,
    Bell,
    Settings,
    ExternalLink,
    Share2,
    Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artworks } from '../../data/mockData';
import './Dashboard.css';

export default function ArtistDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const myArtworks = artworks.slice(0, 8);
    const totalViews = myArtworks.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = myArtworks.reduce((sum, a) => sum + a.likes, 0);

    // Stats
    const stats = [
        {
            label: 'My Artworks',
            value: myArtworks.length,
            icon: Image,
            color: 'gold',
            change: '+2',
            changeType: 'up',
            subtitle: 'this month'
        },
        {
            label: 'Total Views',
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: 'blue',
            change: '+24.5%',
            changeType: 'up',
            subtitle: 'vs last month'
        },
        {
            label: 'Total Likes',
            value: totalLikes.toLocaleString(),
            icon: Heart,
            color: 'purple',
            change: '+18.3%',
            changeType: 'up',
            subtitle: 'vs last month'
        },
        {
            label: 'Earnings',
            value: '$12,840',
            icon: DollarSign,
            color: 'green',
            change: '+32.1%',
            changeType: 'up',
            subtitle: 'this month'
        },
    ];

    // Artwork tabs
    const artworkTabs = [
        { id: 'all', label: 'All Works', count: myArtworks.length },
        { id: 'published', label: 'Published', count: myArtworks.filter(a => a.available).length },
        { id: 'draft', label: 'Drafts', count: 2 },
        { id: 'sold', label: 'Sold', count: 3 },
    ];

    const filteredArtworks = activeTab === 'all'
        ? myArtworks
        : activeTab === 'published'
            ? myArtworks.filter(a => a.available)
            : activeTab === 'sold'
                ? myArtworks.filter(a => !a.available).slice(0, 3)
                : myArtworks.slice(0, 2);

    // Messages
    const messages = [
        { from: 'Isabella Martin', avatar: 'IM', preview: 'Interested in purchasing your latest piece...', time: '2h ago', unread: true },
        { from: 'Gallery Admin', avatar: 'GA', preview: 'Your artwork "Starry Night" has been featured!', time: '5h ago', unread: true },
        { from: 'James Wilson', avatar: 'JW', preview: 'Can you do a commission? Budget around $5k', time: '1d ago', unread: false },
        { from: 'Sarah Chen', avatar: 'SC', preview: 'Beautiful work! Shared it with my collector friends.', time: '2d ago', unread: false },
    ];

    // Recent sales
    const recentSales = [
        { artwork: 'Starry Night Reimagined', buyer: 'Isabella Martin', price: '$8,500', date: 'Feb 22, 2026', status: 'completed' },
        { artwork: 'Golden Serenity', buyer: 'David Park', price: '$5,200', date: 'Feb 18, 2026', status: 'processing' },
        { artwork: 'Urban Symphony', buyer: 'Elena Fischer', price: '$3,400', date: 'Feb 14, 2026', status: 'completed' },
    ];

    // Engagement data
    const weeklyEngagement = [
        { day: 'Mon', views: 65, likes: 42 },
        { day: 'Tue', views: 82, likes: 55 },
        { day: 'Wed', views: 48, likes: 30 },
        { day: 'Thu', views: 90, likes: 68 },
        { day: 'Fri', views: 75, likes: 50 },
        { day: 'Sat', views: 95, likes: 72 },
        { day: 'Sun', views: 60, likes: 38 },
    ];

    // Notifications
    const notifications = [
        { text: 'Your artwork was featured on the homepage', icon: Star, type: 'success', time: '3h ago' },
        { text: 'New commission request from James Wilson', icon: ShoppingBag, type: 'info', time: '1d ago' },
        { text: 'Payout of $5,200 has been processed', icon: DollarSign, type: 'success', time: '2d ago' },
        { text: 'Exhibition submission deadline in 3 days', icon: Calendar, type: 'warning', time: '3d ago' },
    ];

    // Milestones
    const milestones = [
        { label: '1K Views', progress: 85, current: '850', target: '1,000' },
        { label: '100 Followers', progress: 62, current: '62', target: '100' },
        { label: '$10K Earnings', progress: 78, current: '$7,840', target: '$10,000' },
    ];

    return (
        <div className="dashboard artist-dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Palette size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                        Artist Studio
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Welcome back, {user?.name || 'Artist'} — here&apos;s your creative overview
                    </motion.p>
                </div>
                <div className="artist-header-actions">
                    <Link to="/dashboard/artist/settings" className="btn btn-secondary">
                        <Settings size={18} />
                        Settings
                    </Link>
                    <Link to="/dashboard/artist/upload" className="btn btn-primary">
                        <Plus size={18} />
                        Upload Artwork
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard__stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`stat-card stat-card--${stat.color} artist-stat-card`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                    >
                        <div className="stat-card__icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-card__info">
                            <span className="stat-card__value">{stat.value}</span>
                            <span className="stat-card__label">{stat.label}</span>
                        </div>
                        <div className={`stat-card__change stat-card__change--${stat.changeType}`}>
                            {stat.changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard__grid">
                {/* My Artworks — Full width */}
                <motion.div
                    className="dashboard__card dashboard__card--full artist-artworks-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="dashboard__card-header">
                        <h2><Image size={20} /> My Artworks</h2>
                        <div className="artist-artworks-header-actions">
                            <Link to="/dashboard/artist/artworks">View All</Link>
                        </div>
                    </div>
                    {/* Artwork Tabs */}
                    <div className="artist-artwork-tabs">
                        {artworkTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`artist-artwork-tab ${activeTab === tab.id ? 'artist-artwork-tab--active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                                <span className="artist-artwork-tab__count">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="dashboard__card-content">
                        <div className="artist-artwork-grid">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    className="artist-artwork-grid__inner"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {filteredArtworks.map((artwork, index) => (
                                        <motion.div
                                            key={artwork.id}
                                            className="artist-art-card"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.06 }}
                                            whileHover={{ y: -6 }}
                                        >
                                            <Link to={`/artwork/${artwork.id}`}>
                                                <div className="artist-art-card__img-wrap">
                                                    <img src={artwork.thumbnail} alt={artwork.title} />
                                                    <div className="artist-art-card__overlay">
                                                        <div className="artist-art-card__overlay-stats">
                                                            <span><Eye size={14} /> {artwork.views}</span>
                                                            <span><Heart size={14} /> {artwork.likes}</span>
                                                        </div>
                                                        <button className="artist-art-card__share" onClick={e => e.preventDefault()}>
                                                            <Share2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="artist-art-card__info">
                                                    <h4>{artwork.title}</h4>
                                                    <div className="artist-art-card__meta">
                                                        <span className="artist-art-card__medium">{artwork.medium}</span>
                                                        <span className="artist-art-card__price">
                                                            {artwork.currency === 'ETH' ? `${artwork.price} ETH` : `$${artwork.price.toLocaleString()}`}
                                                        </span>
                                                    </div>
                                                    <div className={`artist-art-card__status artist-art-card__status--${artwork.available ? 'available' : 'sold'}`}>
                                                        {artwork.available ? 'Available' : 'Sold'}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Sales */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="dashboard__card-header">
                        <h2><ShoppingBag size={20} /> Recent Sales</h2>
                        <Link to="/dashboard/artist/sales">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {recentSales.map((sale, index) => (
                            <motion.div
                                key={index}
                                className="artist-sale-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.08 }}
                            >
                                <div className="artist-sale-item__info">
                                    <h4>{sale.artwork}</h4>
                                    <p>{sale.buyer} · {sale.date}</p>
                                </div>
                                <div className="artist-sale-item__right">
                                    <span className="artist-sale-item__price">{sale.price}</span>
                                    <span className={`status-badge status-badge--${sale.status}`}>
                                        {sale.status === 'completed' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Messages */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <div className="dashboard__card-header">
                        <h2><MessageSquare size={20} /> Messages</h2>
                        <Link to="/dashboard/artist/messages">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                className={`artist-message-item ${msg.unread ? 'artist-message-item--unread' : ''}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.65 + index * 0.08 }}
                            >
                                <div className="artist-message-item__avatar">{msg.avatar}</div>
                                <div className="artist-message-item__content">
                                    <div className="artist-message-item__header">
                                        <h4>{msg.from}</h4>
                                        <span className="artist-message-item__time">{msg.time}</span>
                                    </div>
                                    <p>{msg.preview}</p>
                                </div>
                                {msg.unread && <div className="artist-message-item__dot" />}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Engagement Chart — Full width */}
                <motion.div
                    className="dashboard__card dashboard__card--full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="dashboard__card-header">
                        <h2><BarChart2 size={20} /> Engagement Overview</h2>
                        <div className="artist-chart-controls">
                            <select
                                className="dashboard__select"
                                value={selectedPeriod}
                                onChange={e => setSelectedPeriod(e.target.value)}
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="dashboard__chart-placeholder artist-engagement-chart">
                        <div className="artist-chart-legend">
                            <span className="artist-chart-legend__item artist-chart-legend__item--views">
                                <span className="artist-chart-legend__dot" /> Views
                            </span>
                            <span className="artist-chart-legend__item artist-chart-legend__item--likes">
                                <span className="artist-chart-legend__dot" /> Likes
                            </span>
                        </div>
                        <div className="chart-bars artist-chart-bars">
                            {weeklyEngagement.map((item, i) => (
                                <div key={i} className="artist-chart-bar-group">
                                    <motion.div
                                        className="chart-bar artist-chart-bar--views"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.views}%` }}
                                        transition={{ delay: 0.7 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                    />
                                    <motion.div
                                        className="chart-bar artist-chart-bar--likes"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.likes}%` }}
                                        transition={{ delay: 0.75 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="chart-labels">
                            {weeklyEngagement.map(item => (
                                <span key={item.day}>{item.day}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                >
                    <div className="dashboard__card-header">
                        <h2><Bell size={20} /> Notifications</h2>
                        <Link to="/dashboard/artist/notifications">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {notifications.map((notif, index) => {
                            const NotifIcon = notif.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className={`artist-notif-item artist-notif-item--${notif.type}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.75 + index * 0.08 }}
                                >
                                    <div className={`artist-notif-item__icon artist-notif-item__icon--${notif.type}`}>
                                        <NotifIcon size={16} />
                                    </div>
                                    <div className="artist-notif-item__info">
                                        <p>{notif.text}</p>
                                        <span>{notif.time}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Milestones */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="dashboard__card-header">
                        <h2><Award size={20} /> Milestones</h2>
                    </div>
                    <div className="dashboard__card-content">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.label}
                                className="artist-milestone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="artist-milestone__header">
                                    <h4>{milestone.label}</h4>
                                    <span className="artist-milestone__progress-text">{milestone.progress}%</span>
                                </div>
                                <div className="artist-milestone__bar">
                                    <motion.div
                                        className="artist-milestone__bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${milestone.progress}%` }}
                                        transition={{ delay: 0.9 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>
                                <div className="artist-milestone__meta">
                                    <span>{milestone.current}</span>
                                    <span>/ {milestone.target}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                className="dashboard__actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
            >
                <Link to="/dashboard/artist/upload" className="quick-action artist-quick-action">
                    <Upload size={24} />
                    <span>Upload Artwork</span>
                </Link>
                <Link to="/dashboard/artist/portfolio" className="quick-action artist-quick-action">
                    <ExternalLink size={24} />
                    <span>My Portfolio</span>
                </Link>
                <Link to="/dashboard/artist/analytics" className="quick-action artist-quick-action">
                    <BarChart2 size={24} />
                    <span>Analytics</span>
                </Link>
                <Link to="/dashboard/artist/commissions" className="quick-action artist-quick-action">
                    <Palette size={24} />
                    <span>Commissions</span>
                </Link>
            </motion.div>
        </div>
    );
}
