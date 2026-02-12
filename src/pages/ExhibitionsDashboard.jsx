import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    MapPin
} from 'lucide-react';
import { exhibitions, artworks } from '../data/mockData';
import './dashboards/Dashboard.css';

export default function ExhibitionsDashboard() {
    // Filter exhibitions by status
    const currentExhibitions = exhibitions.filter(e => e.status === 'current');
    const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming');
    const allExhibitions = exhibitions;

    // Calculate stats
    const totalExhibitions = allExhibitions.length;
    const totalArtworks = allExhibitions.reduce((sum, e) => sum + e.artworkCount, 0);
    const activeVisitors = '2.4K'; // Simulated

    // Top exhibitions by engagement (simulated)
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
