import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Clock,
    MapPin,
    ArrowRight,
    Palette,
    Users,
    DollarSign,
    Globe,
    Play,
    RotateCcw,
    Trash2,
    Eye,
    Receipt,
    Bell,
    Calendar,
    TrendingDown,
    Star,
    LogIn,
    Lock,
    Filter,
    X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import { exhibitions, tourThemes } from '../../data/mockData';
import './Dashboard.css';

/* ── Mock data for visitor-specific features ── */
// wishlistItems will be derived inside the component after artworks are loaded

const purchaseHistory = [
    { id: 'ORD-2024-001', artwork: { id: 'a1', title: 'Abstract Harmony', artist: 'Elena Petrova', thumbnail: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Artwork1' }, date: '2024-12-15', price: '$2,500', status: 'Delivered' },
    { id: 'ORD-2024-002', artwork: { id: 'a4', title: 'City at Dusk', artist: 'Marcus Thorne', thumbnail: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Artwork4' }, date: '2024-11-28', price: '$8,500', status: 'Delivered' },
    { id: 'ORD-2024-003', artwork: { id: 'a8', title: 'Whispers of the Forest', artist: 'Sophia Lee', thumbnail: 'https://via.placeholder.com/150/5733FF/FFFFFF?text=Artwork8' }, date: '2024-11-10', price: '$950', status: 'In Transit' },
    { id: 'ORD-2024-004', artwork: { id: 'a11', title: 'Cosmic Dance', artist: 'David Chen', thumbnail: 'https://via.placeholder.com/150/FF33A1/FFFFFF?text=Artwork11' }, date: '2024-10-05', price: '$6,800', status: 'Delivered' },
];

const notifications = [
    { id: 1, type: 'exhibition', icon: Calendar, title: 'New Exhibition: Abstract Expressions', description: 'Opens March 1 — explore 52 curated abstract works', time: '2 hours ago', unread: true },
    { id: 2, type: 'price', icon: TrendingDown, title: 'Price Drop on "Neon Nights"', description: 'Now available at $1,440 — 20% off the original price', time: '5 hours ago', unread: true },
    { id: 3, type: 'tour', icon: Play, title: 'Live Tour: Modern Art Journey', description: 'Starts tomorrow at 3:00 PM — reserve your spot now', time: '1 day ago', unread: false },
    { id: 4, type: 'exhibition', icon: Star, title: 'Cultural Crossroads Opening Soon', description: '64 artworks celebrating global artistic traditions', time: '2 days ago', unread: false },
    { id: 5, type: 'price', icon: TrendingDown, title: 'Price Drop on "Zen Garden"', description: 'Installation now at $28,000 — limited-time offer', time: '3 days ago', unread: false },
];

const browseFilters = [
    { id: 'style', icon: Palette, title: 'By Style', description: 'Impressionism, Abstract, Surrealism & more', color: '#c9a962' },
    { id: 'artist', icon: Users, title: 'By Artist', description: 'Discover talented creators worldwide', color: '#6366f1' },
    { id: 'price', icon: DollarSign, title: 'By Price', description: 'Find artworks in your budget', color: '#22c55e' },
    { id: 'culture', icon: Globe, title: 'By Culture', description: 'African, Japanese, European & more', color: '#f43f5e' },
];

/* ── Animation variants ── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

/* ── Login Gate Component ── */
function LoginGate() {
    return (
        <div className="dashboard visitor-login-gate">
            <motion.div
                className="visitor-login-gate__card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="visitor-login-gate__icon">
                    <Lock size={48} />
                </div>
                <h1 className="visitor-login-gate__title">Welcome to Your Dashboard</h1>
                <p className="visitor-login-gate__subtitle">
                    Sign in to access your personal gallery dashboard — browse artworks, manage your wishlist,
                    track orders, and stay updated with the latest exhibitions.
                </p>
                <div className="visitor-login-gate__actions">
                    <Link to="/login" className="visitor-login-gate__btn visitor-login-gate__btn--primary">
                        <LogIn size={20} />
                        Log In
                    </Link>
                    <Link to="/signup" className="visitor-login-gate__btn visitor-login-gate__btn--secondary">
                        Create Account
                    </Link>
                </div>
                <div className="visitor-login-gate__features">
                    <div className="visitor-login-gate__feature">
                        <Heart size={16} />
                        <span>Save favorites</span>
                    </div>
                    <div className="visitor-login-gate__feature">
                        <ShoppingBag size={16} />
                        <span>Track orders</span>
                    </div>
                    <div className="visitor-login-gate__feature">
                        <Play size={16} />
                        <span>Join tours</span>
                    </div>
                    <div className="visitor-login-gate__feature">
                        <Bell size={16} />
                        <span>Get updates</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ── Main Dashboard ── */
export default function VisitorDashboard() {
    const { theme } = useTheme();
    const { user, isAuthenticated } = useAuth();
    const { artworks } = useArtworks();
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]); // Initialize as empty, will be populated after artworks load
    const [activeNotifFilter, setActiveNotifFilter] = useState('all');

    // Populate wishlist once artworks are available
    useEffect(() => {
        if (artworks && artworks.length > 0 && wishlist.length === 0) {
            setWishlist(artworks.slice(0, 4));
        }
    }, [artworks, wishlist.length]);

    if (!isAuthenticated) {
        return <LoginGate />;
    }

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const filteredNotifications = activeNotifFilter === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeNotifFilter);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <h1>My Dashboard</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
                <Link to="/gallery" className="btn btn-primary">
                    Explore Gallery
                    <ArrowRight size={18} />
                </Link>
            </div>

            {/* ── Section 1: Browse Gallery ── */}
            <motion.section
                className="visitor-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="visitor-section__header">
                    <h2><Filter size={20} /> Browse Gallery</h2>
                    <p>Explore artworks with smart filters</p>
                </div>
                <div className="visitor-browse-filters">
                    {browseFilters.map(filter => (
                        <motion.div key={filter.id} variants={itemVariants}>
                            <Link
                                to="/gallery"
                                className="visitor-filter-card"
                                style={{ '--filter-accent': filter.color }}
                            >
                                <div className="visitor-filter-card__icon">
                                    <filter.icon size={28} />
                                </div>
                                <h3>{filter.title}</h3>
                                <p>{filter.description}</p>
                                <ArrowRight size={16} className="visitor-filter-card__arrow" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── Section 2: Virtual Tour Access ── */}
            <motion.section
                className="visitor-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="visitor-section__header">
                    <h2><Play size={20} /> Virtual Tour Access</h2>
                    <p>Join or replay guided gallery tours</p>
                </div>
                <div className="visitor-tour-grid">
                    {tourThemes.map((tour, index) => (
                        <motion.div key={tour.id} variants={itemVariants}>
                            <div className="visitor-tour-card">
                                <div className="visitor-tour-card__image">
                                    <img src={tour.image} alt={tour.name} />
                                    <div className="visitor-tour-card__overlay">
                                        <span className="visitor-tour-card__duration">
                                            <Clock size={14} /> {tour.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="visitor-tour-card__content">
                                    <h3>{tour.name}</h3>
                                    <p>{tour.description}</p>
                                    <div className="visitor-tour-card__meta">
                                        <span><Eye size={14} /> {tour.artworkCount} artworks</span>
                                    </div>
                                    <div className="visitor-tour-card__actions">
                                        <Link to="/virtual-tour" className="visitor-tour-card__btn visitor-tour-card__btn--primary">
                                            <Play size={16} /> Join Tour
                                        </Link>
                                        <Link to="/virtual-tour" className="visitor-tour-card__btn visitor-tour-card__btn--secondary">
                                            <RotateCcw size={16} /> Replay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── Section 3: Wishlist / Saved Items ── */}
            <motion.section
                className="visitor-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="visitor-section__header">
                    <h2><Heart size={20} /> Wishlist / Saved Items</h2>
                    <p>{wishlist.length} items saved for later</p>
                </div>
                <AnimatePresence mode="popLayout">
                    {wishlist.length > 0 ? (
                        <motion.div className="visitor-wishlist-grid" layout>
                            {wishlist.map(artwork => (
                                <motion.div
                                    key={artwork.id}
                                    className="visitor-wishlist-card"
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/ artwork / ${artwork.id} `} className="visitor-wishlist-card__image">
                                        <img src={artwork.thumbnail} alt={artwork.title} />
                                    </Link>
                                    <div className="visitor-wishlist-card__info">
                                        <Link to={`/ artwork / ${artwork.id} `}>
                                            <h4>{artwork.title}</h4>
                                        </Link>
                                        <p className="visitor-wishlist-card__artist">{artwork.artist}</p>
                                        <span className="visitor-wishlist-card__price">
                                            {artwork.currency === 'ETH' ? `Ξ ${artwork.price} ` : `$${artwork.price.toLocaleString()} `}
                                        </span>
                                    </div>
                                    <button
                                        className="visitor-wishlist-card__remove"
                                        onClick={() => removeFromWishlist(artwork.id)}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="visitor-empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Heart size={40} />
                            <p>Your wishlist is empty</p>
                            <Link to="/gallery" className="btn btn-primary">Browse Gallery</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>

            {/* ── Section 4: Purchase History ── */}
            <motion.section
                className="visitor-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="visitor-section__header">
                    <h2><ShoppingBag size={20} /> Purchase History</h2>
                    <p>View past orders and receipts</p>
                </div>
                <div className="visitor-purchase-table-wrapper">
                    <table className="visitor-purchase-table">
                        <thead>
                            <tr>
                                <th>Artwork</th>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseHistory.map(purchase => (
                                <tr key={purchase.id}>
                                    <td>
                                        <div className="visitor-purchase-artwork">
                                            <img src={purchase.artwork.thumbnail} alt={purchase.artwork.title} />
                                            <div>
                                                <h4>{purchase.artwork.title}</h4>
                                                <p>{purchase.artwork.artist}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="visitor-purchase-order-id">{purchase.id}</span></td>
                                    <td>{purchase.date}</td>
                                    <td><span className="visitor-purchase-price">{purchase.price}</span></td>
                                    <td>
                                        <span className={`visitor - purchase - status visitor - purchase - status--${purchase.status.toLowerCase().replace(' ', '-')} `}>
                                            {purchase.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="visitor-receipt-btn">
                                            <Receipt size={16} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>

            {/* ── Section 5: Notifications ── */}
            <motion.section
                className="visitor-section"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="visitor-section__header">
                    <h2>
                        <Bell size={20} /> Notifications
                        {unreadCount > 0 && (
                            <span className="visitor-notif-badge">{unreadCount}</span>
                        )}
                    </h2>
                    <div className="visitor-notif-filters">
                        {['all', 'exhibition', 'tour', 'price'].map(filter => (
                            <button
                                key={filter}
                                className={`visitor - notif - filter ${activeNotifFilter === filter ? 'active' : ''} `}
                                onClick={() => setActiveNotifFilter(filter)}
                            >
                                {filter === 'all' ? 'All' : filter === 'exhibition' ? 'Exhibitions' : filter === 'tour' ? 'Tours' : 'Price Drops'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="visitor-notifications">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map(notif => (
                            <motion.div
                                key={notif.id}
                                className={`visitor - notif - item ${notif.unread ? 'visitor-notif-item--unread' : ''} `}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className={`visitor - notif - item__icon visitor - notif - item__icon--${notif.type} `}>
                                    <notif.icon size={20} />
                                </div>
                                <div className="visitor-notif-item__content">
                                    <h4>{notif.title}</h4>
                                    <p>{notif.description}</p>
                                </div>
                                <span className="visitor-notif-item__time">{notif.time}</span>
                                {notif.unread && <span className="visitor-notif-item__dot" />}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.section>
        </div>
    );
}
