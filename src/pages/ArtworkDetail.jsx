import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Heart,
    Share2,
    ShoppingCart,
    ZoomIn,
    Volume2,
    VolumeX,
    MapPin,
    Calendar,
    Palette,
    Info,
    User
} from 'lucide-react';
import { artists } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useArtworks } from '../context/ArtworkContext';
import './ArtworkDetail.css';

export default function ArtworkDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isZoomed, setIsZoomed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState('about');
    const { addToCart, isInCart } = useCart();
    const { user } = useAuth();
    const { artworks } = useArtworks();

    const artwork = artworks.find(a => a.id === parseInt(id));
    const artist = artists.find(a => a.id === artwork?.artistId);
    const relatedArtworks = artworks
        .filter(a => a.category === artwork?.category && a.id !== artwork?.id)
        .slice(0, 4);

    if (!artwork) {
        return (
            <div className="artwork-not-found">
                <h2>Artwork not found</h2>
                <Link to="/gallery" className="btn btn-primary">Back to Gallery</Link>
            </div>
        );
    }

    const inCart = isInCart(artwork.id);

    return (
        <div className="artwork-detail">
            {/* Back Button */}
            <div className="artwork-detail__nav">
                <Link to="/gallery" className="artwork-detail__back">
                    <ArrowLeft size={20} />
                    Back to Gallery
                </Link>
            </div>

            {/* Main Content */}
            <div className="artwork-detail__main">
                {/* Image Section */}
                <motion.div
                    className="artwork-detail__image-section"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div
                        className={`artwork-detail__image-wrapper ${isZoomed ? 'zoomed' : ''}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                    >
                        <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="artwork-detail__image"
                        />
                        <button className="artwork-detail__zoom-btn">
                            <ZoomIn size={20} />
                            {isZoomed ? 'Click to Exit' : 'Click to Zoom'}
                        </button>
                    </div>

                    {/* Audio Narration */}
                    {artwork.audioNarration && (
                        <button
                            className={`artwork-detail__audio-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            {isPlaying ? 'Stop Narration' : 'Listen to Narration'}
                        </button>
                    )}
                </motion.div>

                {/* Info Section */}
                <motion.div
                    className="artwork-detail__info-section"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <span className="artwork-detail__category">{artwork.category}</span>
                    <h1 className="artwork-detail__title">{artwork.title}</h1>

                    {/* Artist */}
                    <Link to={`/artists/${artist?.id}`} className="artwork-detail__artist">
                        <img src={artist?.avatar} alt={artist?.name} />
                        <div>
                            <span className="artwork-detail__artist-label">Artist</span>
                            <span className="artwork-detail__artist-name">{artwork.artist}</span>
                        </div>
                    </Link>

                    {/* Price */}
                    <div className="artwork-detail__price-section">
                        <div className="artwork-detail__price">
                            {`₹${artwork.price.toLocaleString('en-IN')}`}
                        </div>
                        <span className={`artwork-detail__availability ${artwork.available ? '' : 'sold'}`}>
                            {artwork.available ? 'Available' : 'Sold'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="artwork-detail__actions">
                        <button
                            className={`btn btn-primary btn-lg ${inCart ? 'in-cart' : ''}`}
                            onClick={() => {
                                if (!user) { navigate('/login'); return; }
                                if (!inCart && artwork.available) addToCart(artwork);
                            }}
                            disabled={!artwork.available || inCart}
                        >
                            <ShoppingCart size={20} />
                            {inCart ? 'Added to Cart' : artwork.available ? 'Add to Cart' : 'Sold Out'}
                        </button>
                        <button className="btn btn-secondary">
                            <Heart size={20} />
                            Save
                        </button>
                        <button className="btn btn-ghost">
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Meta Info */}
                    <div className="artwork-detail__meta">
                        <div className="artwork-detail__meta-item">
                            <Calendar size={18} />
                            <div>
                                <span className="label">Year</span>
                                <span className="value">{artwork.year}</span>
                            </div>
                        </div>
                        <div className="artwork-detail__meta-item">
                            <Palette size={18} />
                            <div>
                                <span className="label">Medium</span>
                                <span className="value">{artwork.medium}</span>
                            </div>
                        </div>
                        <div className="artwork-detail__meta-item">
                            <Info size={18} />
                            <div>
                                <span className="label">Style</span>
                                <span className="value">{artwork.style}</span>
                            </div>
                        </div>
                        <div className="artwork-detail__meta-item">
                            <MapPin size={18} />
                            <div>
                                <span className="label">Origin</span>
                                <span className="value">{artwork.origin}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="artwork-detail__tabs">
                        <button
                            className={activeTab === 'about' ? 'active' : ''}
                            onClick={() => setActiveTab('about')}
                        >
                            About
                        </button>
                        <button
                            className={activeTab === 'history' ? 'active' : ''}
                            onClick={() => setActiveTab('history')}
                        >
                            Cultural History
                        </button>
                        <button
                            className={activeTab === 'artist' ? 'active' : ''}
                            onClick={() => setActiveTab('artist')}
                        >
                            About Artist
                        </button>
                    </div>

                    <div className="artwork-detail__tab-content">
                        {activeTab === 'about' && (
                            <p>{artwork.description}</p>
                        )}
                        {activeTab === 'history' && (
                            <p>{artwork.culturalHistory}</p>
                        )}
                        {activeTab === 'artist' && (
                            <div className="artist-bio">
                                <img src={artist?.avatar} alt={artist?.name} />
                                <div>
                                    <h4>{artist?.name}</h4>
                                    <p>{artist?.bio}</p>
                                    <Link to={`/artists/${artist?.id}`} className="btn btn-ghost">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Related Artworks */}
            {relatedArtworks.length > 0 && (
                <section className="related-artworks">
                    <div className="container">
                        <h2>Related Artworks</h2>
                        <div className="related-artworks__grid">
                            {relatedArtworks.map(art => (
                                <Link key={art.id} to={`/artwork/${art.id}`} className="related-artwork-card">
                                    <img src={art.thumbnail} alt={art.title} />
                                    <div className="related-artwork-card__info">
                                        <h4>{art.title}</h4>
                                        <span>{art.artist}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
