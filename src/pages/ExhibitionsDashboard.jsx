import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Image,
    Users,
    Star,
    TrendingUp,
    Plus,
    Eye,
    BarChart3,
    Clock,
    MapPin,
    Search,
    ChevronRight,
    Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exhibitions } from '../data/mockData';
import './dashboards/Dashboard.css';
import './Exhibition.css';

/* ── ADMIN / CURATOR VIEW ── */
function AdminCuratorExhibition() {
    const currentExhibitions = exhibitions.filter(e => e.status === 'current');
    const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming');
    const allExhibitions = exhibitions;

    const totalExhibitions = allExhibitions.length;
    const totalArtworks = allExhibitions.reduce((sum, e) => sum + e.artworkCount, 0);
    const activeVisitors = '2.4K';

    const topExhibitions = [
        { name: 'Modern Masters', engagement: 85 },
        { name: 'Abstract Dreams', engagement: 72 },
        { name: 'Classical Beauty', engagement: 68 },
        { name: 'Digital Art', engagement: 55 },
        { name: 'Photography', engagement: 45 }
    ];

    const stats = [
        { label: 'Total Exhibitions', value: totalExhibitions, icon: Calendar, color: 'gold' },
        { label: 'Active Visitors', value: activeVisitors, icon: Users, color: 'blue' },
        { label: 'Total Artworks', value: totalArtworks, icon: Image, color: 'green' },
        { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'purple' }
    ];

    const quickActions = [
        { label: 'Create Exhibition', icon: Plus, link: '/dashboard/curator/create' },
        { label: 'Browse All', icon: Eye, link: '/gallery' },
        { label: 'Calendar View', icon: Calendar, link: '/exhibitions/calendar' },
        { label: 'Analytics', icon: BarChart3, link: '/exhibitions/analytics' }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <div>
                    <h1>Exhibitions Dashboard</h1>
                    <p>Manage and monitor all gallery exhibitions</p>
                </div>
            </div>

            {/* Stats */}
            <div className="dashboard__stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`stat-card stat-card--${stat.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
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

            {/* Quick Actions */}
            <div className="dashboard__actions">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                    >
                        <Link to={action.link} className="quick-action">
                            <action.icon size={28} />
                            <span>{action.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard__grid">
                {/* Current Exhibitions */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><Calendar size={20} /> Current Exhibitions</h2>
                        <span>{currentExhibitions.length} Active</span>
                    </div>
                    <div className="exhibitions-list">
                        {currentExhibitions.map(exhibition => (
                            <div key={exhibition.id} className="exhibition-manage-card">
                                <img src={exhibition.image} alt={exhibition.title} />
                                <div className="exhibition-manage-card__content">
                                    <div className="exhibition-manage-card__info">
                                        <span className={`status-badge status-badge--${exhibition.status}`}>
                                            {exhibition.status}
                                        </span>
                                        <h3>{exhibition.title}</h3>
                                        <p>{exhibition.description}</p>
                                        <div className="exhibition-manage-card__meta">
                                            <span><Image size={14} /> {exhibition.artworkCount} artworks</span>
                                            <span><Users size={14} /> {Math.floor(Math.random() * 500 + 200)} visitors</span>
                                            <span><Calendar size={14} /> {exhibition.startDate} - {exhibition.endDate}</span>
                                        </div>
                                    </div>
                                    <div className="exhibition-manage-card__actions">
                                        <Link to={`/exhibitions/${exhibition.id}`} className="btn btn-secondary">
                                            <Eye size={16} /> View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Exhibitions */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><Clock size={20} /> Upcoming Exhibitions</h2>
                        <span>{upcomingExhibitions.length} Scheduled</span>
                    </div>
                    <div className="dashboard__card-content">
                        {upcomingExhibitions.map(exhibition => (
                            <div key={exhibition.id} className="exhibition-item">
                                <img src={exhibition.image} alt={exhibition.title} />
                                <div className="exhibition-item__info">
                                    <h4>{exhibition.title}</h4>
                                    <p>
                                        <MapPin size={12} />
                                        Gallery Hall {Math.floor(Math.random() * 3 + 1)}
                                    </p>
                                    <span>Starts: {exhibition.startDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Exhibitions Chart */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><TrendingUp size={20} /> Visitor Engagement</h2>
                        <select className="dashboard__select">
                            <option>This Month</option>
                            <option>Last 3 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="dashboard__chart-placeholder">
                        <div className="chart-bars">
                            {topExhibitions.map(exhibition => (
                                <div
                                    key={exhibition.name}
                                    className="chart-bar"
                                    style={{ height: `${exhibition.engagement}%` }}
                                />
                            ))}
                        </div>
                        <div className="chart-labels">
                            {topExhibitions.map(exhibition => (
                                <span key={exhibition.name}>
                                    {exhibition.name.split(' ')[0]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── VISITOR VIEW ── */
function VisitorExhibition() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const featuredExhibition = exhibitions.find(e => e.featured && e.status === 'current') || exhibitions[0];

    const filteredExhibitions = exhibitions.filter(e => {
        // Tab filter
        if (activeTab !== 'all' && e.status !== activeTab) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query) ||
                e.curator.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="exhibitions-page">
            <div className="container">
                {/* Hero Feature */}
                {featuredExhibition && (
                    <motion.div
                        className="exhibition-hero"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="exhibition-hero__bg">
                            <img src={featuredExhibition.image} alt={featuredExhibition.title} />
                        </div>
                        <div className="exhibition-hero__content">
                            <span className="exhibition-hero__badge">Featured Exhibition</span>
                            <h1 className="exhibition-hero__title">{featuredExhibition.title}</h1>
                            <p className="exhibition-hero__subtitle">{featuredExhibition.subtitle}</p>
                            <p className="exhibition-hero__desc">{featuredExhibition.description}</p>

                            <div className="exhibition-hero__meta">
                                <span><Calendar size={16} /> {featuredExhibition.startDate} - {featuredExhibition.endDate}</span>
                                <span><Image size={16} /> {featuredExhibition.artworkCount} Artworks</span>
                                <span><Users size={16} /> Curated by {featuredExhibition.curator}</span>
                            </div>

                            <Link to={`/exhibitions/${featuredExhibition.id}`} className="btn btn-primary btn-lg">
                                Enter Exhibition
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Filters */}
                <div className="exhibition-filters">
                    <div className="exhibition-tabs">
                        {['all', 'current', 'upcoming', 'past'].map(tab => (
                            <button
                                key={tab}
                                className={`exhibition-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="exhibition-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search exhibitions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="exhibition-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredExhibitions.map((exhibition, index) => (
                            <motion.div
                                key={exhibition.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="exhibition-card">
                                    <div className="exhibition-card__image">
                                        <img src={exhibition.image} alt={exhibition.title} />
                                        <span className={`exhibition-card__status exhibition-card__status--${exhibition.status}`}>
                                            {exhibition.status}
                                        </span>
                                    </div>
                                    <div className="exhibition-card__content">
                                        <h3 className="exhibition-card__title">{exhibition.title}</h3>
                                        <p className="exhibition-card__subtitle">{exhibition.subtitle}</p>
                                        <p className="exhibition-card__desc">{exhibition.description}</p>

                                        <div className="exhibition-card__meta">
                                            <span>
                                                <Calendar size={14} />
                                                {new Date(exhibition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(exhibition.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span>
                                                <Users size={14} />
                                                Curated by {exhibition.curator}
                                            </span>
                                        </div>

                                        <div className="exhibition-card__footer">
                                            <Link to={`/exhibitions/${exhibition.id}`} className="btn btn-secondary exhibition-card__btn">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredExhibitions.length === 0 && (
                    <div className="text-center section">
                        <h3 style={{ color: 'var(--text-muted)' }}>No exhibitions found matching your criteria.</h3>
                        <button
                            className="btn btn-ghost mt-4"
                            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── MAIN COMPONENT (ROUTER) ── */
export default function ExhibitionsDashboard() {
    const { user } = useAuth();

    // Visitors and non-logged in users see the public view
    if (!user || user.role === 'visitor') {
        return <VisitorExhibition />;
    }

    // Admins and Curators see the dashboard view
    return <AdminCuratorExhibition />;
}
