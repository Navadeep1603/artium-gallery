import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Clock,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { artworks, exhibitions } from '../../data/mockData';
import './Dashboard.css';

export default function VisitorDashboard() {
    const { user } = useAuth();

    const favoriteArtworks = artworks.slice(0, 4);
    const purchaseHistory = [
        { artwork: artworks[0], date: '2024-01-15', price: '$2,500' },
        { artwork: artworks[1], date: '2024-01-10', price: '$8,500' },
    ];
    const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming').slice(0, 2);

    return (
        <div className="dashboard">
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

            <div className="dashboard__grid">
                {/* Favorites */}
                <div className="dashboard__card dashboard__card--full">
                    <div className="dashboard__card-header">
                        <h2><Heart size={20} /> My Favorites</h2>
                        <Link to="/dashboard/visitor/favorites">View All</Link>
                    </div>
                    <div className="favorites-grid">
                        {favoriteArtworks.map(artwork => (
                            <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="favorite-card">
                                <img src={artwork.thumbnail} alt={artwork.title} />
                                <div className="favorite-card__info">
                                    <h4>{artwork.title}</h4>
                                    <p>{artwork.artist}</p>
                                    <span className="favorite-card__price">
                                        {artwork.currency === 'ETH' ? `Ξ ${artwork.price}` : `$${artwork.price.toLocaleString()}`}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Purchase History */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><ShoppingBag size={20} /> Purchase History</h2>
                        <Link to="/dashboard/visitor/purchases">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {purchaseHistory.map((purchase, index) => (
                            <div key={index} className="purchase-item">
                                <img src={purchase.artwork.thumbnail} alt={purchase.artwork.title} />
                                <div className="purchase-item__info">
                                    <h4>{purchase.artwork.title}</h4>
                                    <p>{purchase.artwork.artist}</p>
                                </div>
                                <div className="purchase-item__details">
                                    <span className="purchase-item__price">{purchase.price}</span>
                                    <span className="purchase-item__date">{purchase.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Exhibitions */}
                <div className="dashboard__card">
                    <div className="dashboard__card-header">
                        <h2><Clock size={20} /> Upcoming Exhibitions</h2>
                        <Link to="/exhibitions">View All</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {upcomingExhibitions.map(exhibition => (
                            <Link key={exhibition.id} to={`/exhibitions/${exhibition.id}`} className="exhibition-item">
                                <img src={exhibition.image} alt={exhibition.title} />
                                <div className="exhibition-item__info">
                                    <h4>{exhibition.title}</h4>
                                    <p><MapPin size={12} /> Virtual Gallery</p>
                                    <span>Opens {exhibition.startDate}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="dashboard__quick-links">
                <Link to="/virtual-tour" className="quick-link-card">
                    <span className="quick-link-card__icon">🎨</span>
                    <h4>Start Virtual Tour</h4>
                    <p>Explore our curated exhibitions</p>
                </Link>
                <Link to="/artists" className="quick-link-card">
                    <span className="quick-link-card__icon">👩‍🎨</span>
                    <h4>Discover Artists</h4>
                    <p>Connect with talented creators</p>
                </Link>
                <Link to="/shop" className="quick-link-card">
                    <span className="quick-link-card__icon">🛍️</span>
                    <h4>Shop Artworks</h4>
                    <p>Find your next masterpiece</p>
                </Link>
            </div>
        </div>
    );
}
