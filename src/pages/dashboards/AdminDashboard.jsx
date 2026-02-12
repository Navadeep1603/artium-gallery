import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Image,
    DollarSign,
    TrendingUp,
    Eye,
    ShoppingCart,
    Calendar,
    Settings,
    BarChart2,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artworks, artists } from '../../data/mockData';
import './Dashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Artworks', value: artworks.length, icon: Image, color: 'gold' },
        { label: 'Active Artists', value: artists.length, icon: Users, color: 'blue' },
        { label: 'Total Revenue', value: '$124,500', icon: DollarSign, color: 'green' },
        { label: 'Monthly Visitors', value: '12.4K', icon: Eye, color: 'purple' },
    ];

    const pendingArtworks = artworks.slice(0, 3).map(a => ({ ...a, status: 'pending' }));
    const recentActivity = [
        { action: 'New artwork submitted', user: 'Elena Rodriguez', time: '2 hours ago' },
        { action: 'Purchase completed', user: 'John Doe', time: '4 hours ago' },
        { action: 'New user registered', user: 'Sarah Connor', time: '5 hours ago' },
        { action: 'Exhibition created', user: 'Dr. Mitchell', time: '1 day ago' },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
                <Link to="/settings" className="btn btn-secondary">
                    <Settings size={18} />
                    Settings
                </Link>
            </div>

            {/* Stats Grid */}
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

            <div className="dashboard__grid">
                {/* Pending Approvals */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><Clock size={20} /> Pending Approvals</h2>
                        <Link to="/admin/approvals">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {pendingArtworks.map(artwork => (
                            <div key={artwork.id} className="approval-item">
                                <img src={artwork.thumbnail} alt={artwork.title} />
                                <div className="approval-item__info">
                                    <h4>{artwork.title}</h4>
                                    <p>{artwork.artist}</p>
                                </div>
                                <div className="approval-item__actions">
                                    <button className="approve-btn"><CheckCircle size={18} /></button>
                                    <button className="reject-btn"><XCircle size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><TrendingUp size={20} /> Recent Activity</h2>
                    </div>
                    <div className="dashboard__card-content">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-item__dot" />
                                <div className="activity-item__info">
                                    <p>{activity.action}</p>
                                    <span>{activity.user} • {activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><BarChart2 size={20} /> Revenue Overview</h2>
                        <select className="dashboard__select">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <div className="dashboard__chart-placeholder">
                        <div className="chart-bars">
                            {[65, 85, 45, 95, 75, 55, 80].map((height, i) => (
                                <motion.div
                                    key={i}
                                    className="chart-bar"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                />
                            ))}
                        </div>
                        <div className="chart-labels">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <span key={day}>{day}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard__actions">
                <Link to="/admin/users" className="quick-action">
                    <Users size={24} />
                    <span>Manage Users</span>
                </Link>
                <Link to="/admin/artworks" className="quick-action">
                    <Image size={24} />
                    <span>Manage Artworks</span>
                </Link>
                <Link to="/admin/exhibitions" className="quick-action">
                    <Calendar size={24} />
                    <span>Manage Exhibitions</span>
                </Link>
                <Link to="/admin/orders" className="quick-action">
                    <ShoppingCart size={24} />
                    <span>View Orders</span>
                </Link>
            </div>
        </div>
    );
}
