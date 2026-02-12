import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Image,
    DollarSign,
    Eye,
    Heart,
    Upload,
    MessageSquare,
    TrendingUp,
    Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artworks } from '../../data/mockData';
import './Dashboard.css';

export default function ArtistDashboard() {
    const { user } = useAuth();

    const myArtworks = artworks.slice(0, 6);
    const totalViews = myArtworks.reduce((sum, a) => sum + a.views, 0);
    const totalLikes = myArtworks.reduce((sum, a) => sum + a.likes, 0);

    const stats = [
        { label: 'My Artworks', value: myArtworks.length, icon: Image, color: 'gold' },
        { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'blue' },
        { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart, color: 'purple' },
        { label: 'Earnings', value: '$8,450', icon: DollarSign, color: 'green' },
    ];

    const messages = [
        { from: 'John Doe', preview: 'Interested in purchasing your latest work...', time: '2h ago' },
        { from: 'Gallery Admin', preview: 'Your artwork has been approved!', time: '1d ago' },
        { from: 'Sarah Wilson', preview: 'Beautiful piece! Can you do a commission?', time: '2d ago' },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <div>
                    <h1>Artist Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
                <Link to="/dashboard/artist/upload" className="btn btn-primary">
                    <Plus size={18} />
                    Upload Artwork
                </Link>
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

            <div className="dashboard__grid">
                {/* My Artworks */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><Image size={20} /> My Artworks</h2>
                        <Link to="/dashboard/artist/artworks">View All</Link>
                    </div>
                    <div className="artwork-grid">
                        {myArtworks.map(artwork => (
                            <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="my-artwork-card">
                                <img src={artwork.thumbnail} alt={artwork.title} />
                                <div className="my-artwork-card__overlay">
                                    <h4>{artwork.title}</h4>
                                    <div className="my-artwork-card__stats">
                                        <span><Eye size={12} /> {artwork.views}</span>
                                        <span><Heart size={12} /> {artwork.likes}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><MessageSquare size={20} /> Messages</h2>
                        <Link to="/dashboard/artist/messages">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {messages.map((msg, index) => (
                            <div key={index} className="message-item">
                                <div className="message-item__avatar">{msg.from[0]}</div>
                                <div className="message-item__content">
                                    <h4>{msg.from}</h4>
                                    <p>{msg.preview}</p>
                                </div>
                                <span className="message-item__time">{msg.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><TrendingUp size={20} /> Performance</h2>
                    </div>
                    <div className="dashboard__card-content">
                        <div className="performance-item">
                            <span>Profile Views</span>
                            <div className="performance-bar">
                                <motion.div
                                    className="performance-bar__fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                />
                            </div>
                            <span>+12%</span>
                        </div>
                        <div className="performance-item">
                            <span>Artwork Saves</span>
                            <div className="performance-bar">
                                <motion.div
                                    className="performance-bar__fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: '60%' }}
                                />
                            </div>
                            <span>+8%</span>
                        </div>
                        <div className="performance-item">
                            <span>Inquiries</span>
                            <div className="performance-bar">
                                <motion.div
                                    className="performance-bar__fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: '45%' }}
                                />
                            </div>
                            <span>+5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
