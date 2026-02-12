import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Layout,
    Image,
    Star,
    Calendar,
    Plus,
    Edit,
    Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exhibitions, artworks } from '../../data/mockData';
import './Dashboard.css';

export default function CuratorDashboard() {
    const { user } = useAuth();

    const myExhibitions = exhibitions.slice(0, 3);
    const featuredArtworks = artworks.filter(a => a.featured).slice(0, 4);

    const stats = [
        { label: 'Exhibitions', value: myExhibitions.length, icon: Layout, color: 'gold' },
        { label: 'Featured Works', value: featuredArtworks.length, icon: Star, color: 'purple' },
        { label: 'Total Views', value: '45.2K', icon: Eye, color: 'blue' },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <div>
                    <h1>Curator Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
                <Link to="/dashboard/curator/create" className="btn btn-primary">
                    <Plus size={18} />
                    Create Exhibition
                </Link>
            </div>

            {/* Stats */}
            <div className="dashboard__stats dashboard__stats--3">
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
                {/* My Exhibitions */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><Calendar size={20} /> My Exhibitions</h2>
                        <Link to="/dashboard/curator/exhibitions">Manage All</Link>
                    </div>
                    <div className="exhibitions-list">
                        {myExhibitions.map(exhibition => (
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
                                            <span><Calendar size={14} /> {exhibition.startDate} - {exhibition.endDate}</span>
                                        </div>
                                    </div>
                                    <div className="exhibition-manage-card__actions">
                                        <button className="btn btn-ghost"><Edit size={16} /> Edit</button>
                                        <Link to={`/exhibitions/${exhibition.id}`} className="btn btn-secondary">
                                            <Eye size={16} /> Preview
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Artworks */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><Star size={20} /> Featured Artworks</h2>
                        <Link to="/dashboard/curator/featured">Manage Featured</Link>
                    </div>
                    <div className="featured-artworks-grid">
                        {featuredArtworks.map(artwork => (
                            <div key={artwork.id} className="featured-artwork-card">
                                <img src={artwork.thumbnail} alt={artwork.title} />
                                <div className="featured-artwork-card__info">
                                    <h4>{artwork.title}</h4>
                                    <p>{artwork.artist}</p>
                                </div>
                                <button className="featured-artwork-card__remove">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button className="add-featured-card">
                            <Plus size={24} />
                            <span>Add Featured</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
