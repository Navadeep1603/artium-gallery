import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Calendar, Users, MapPin, Play, Star, Heart,
    Share2, ArrowLeft, Image, ChevronRight, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useArtworks } from '../context/ArtworkContext';
import { exhibitions } from '../data/mockData';
import './Exhibition.css';

export default function ExhibitionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { artworks } = useArtworks();
    const { dispatch: cartDispatch } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [exhibition, setExhibition] = useState(null);
    const [exhibitionArtworks, setExhibitionArtworks] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const inWishlist = exhibition ? isInWishlist(`exh-${exhibition.id}`) : false;

    const handleToggleWishlist = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (exhibition) {
            // Save as an exhibition item
            toggleWishlist({
                id: `exh-${exhibition.id}`,
                title: exhibition.title,
                artist: exhibition.curator,
                price: 0, // Exhibitions don't have a price
                thumbnail: exhibition.image,
                available: true,
                type: 'exhibition'
            });
        }
    };

    // Setup and mock fetch
    useEffect(() => {
        // Find exhibition
        const found = exhibitions.find(e => e.id === parseInt(id));

        if (found) {
            setTimeout(() => setExhibition(found), 0);

            // Mock grabbing random artworks to display in this exhibition
            // In a real app, this would be a proper relationship in the DB
            // We'll deterministically pick artworks based on the ID for consistency
            const startIndex = (parseInt(id) * 3) % (artworks.length - 8);
            setExhibitionArtworks(artworks.slice(startIndex, startIndex + 6));
        } else {
            // Not found
            navigate('/exhibitions');
        }
    }, [id, navigate, artworks]);

    if (!exhibition) return null;

    const handleAddToCart = (artwork) => {
        if (!user) {
            navigate('/login');
            return;
        }

        cartDispatch({
            type: 'ADD_ITEM',
            payload: {
                id: artwork.id,
                title: artwork.title,
                artist: artwork.artist,
                price: artwork.price,
                image: artwork.image,
                quantity: 1
            }
        });

        // Optional tracking or mini-notification here
    };

    return (
        <div className="exhibition-detail-page">
            {/* Header/Hero Section */}
            <div className="exhibition-detail-hero">
                <div className="exhibition-detail-hero__bg">
                    <img src={exhibition.image} alt={exhibition.title} />
                    <div className="exhibition-detail-hero__overlay"></div>
                </div>

                <div className="container">
                    <Link to="/exhibitions" className="btn btn-ghost mb-6">
                        <ArrowLeft size={18} />
                        Back to Exhibitions
                    </Link>

                    <div className="exhibition-detail-hero__content">
                        <span className={`status-badge status-badge--${exhibition.status} mb-4`}>
                            {exhibition.status}
                        </span>

                        <h1 className="exhibition-detail__title text-5xl mb-2 text-white">{exhibition.title}</h1>
                        <p className="exhibition-detail__subtitle text-xl mb-6 text-gold-light italic font-heading">
                            {exhibition.subtitle}
                        </p>

                        <div className="exhibition-detail__meta flex flex-wrap gap-6 mb-8 text-gray-300">
                            <span className="flex items-center gap-2"><Calendar size={18} /> {exhibition.startDate} - {exhibition.endDate}</span>
                            <span className="flex items-center gap-2"><Users size={18} /> Curated by {exhibition.curator}</span>
                            <span className="flex items-center gap-2"><MapPin size={18} /> Gallery & Virtual</span>
                        </div>

                        <div className="exhibition-detail__actions flex gap-4">
                            <Link to="/virtual-tour" className="btn btn-primary btn-lg">
                                <Play size={20} />
                                Enter Virtual Tour
                            </Link>
                            <button
                                className={`btn btn-secondary ${inWishlist ? 'text-gold border-gold' : ''}`}
                                onClick={handleToggleWishlist}
                            >
                                <Heart size={20} className={inWishlist ? 'fill-gold' : ''} />
                                {inWishlist ? 'Saved' : 'Save'}
                            </button>
                            <button className="btn btn-secondary">
                                <Share2 size={20} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container exhibition-detail__body">
                <div className="exhibition-detail__layout">

                    {/* Left Column (Content) */}
                    <div className="exhibition-detail__main">
                        <section className="exhibition-detail__section">
                            <h2 className="exhibition-detail__heading">
                                Overview
                            </h2>
                            <p className="exhibition-detail__desc">
                                {exhibition.description}
                            </p>
                            <div className="exhibition-detail__curator-note">
                                <h4>Curator's Note</h4>
                                <p>
                                    "This exhibition brings together diverse perspectives to challenge our understanding
                                    of the theme. Each piece was selected not just for its individual merit, but for how
                                    it converses with the works around it, creating a dialogue that spans different
                                    mediums and cultural backgrounds."
                                </p>
                                <p className="curator-signature">— {exhibition.curator}</p>
                            </div>
                        </section>

                        <section className="exhibition-detail__section">
                            <h2 className="exhibition-detail__heading">
                                Featured Artworks
                                <span className="exhibition-detail__count">
                                    {exhibitionArtworks.length} items shown
                                </span>
                            </h2>

                            <div className="exhibition-detail__artworks-grid">
                                {exhibitionArtworks.map(artwork => (
                                    <div key={artwork.id} className="exhibition-artwork-card">
                                        <div className="exhibition-artwork-card__image-wrapper group">
                                            <img
                                                src={artwork.image}
                                                alt={artwork.title}
                                            />
                                            {!artwork.available && (
                                                <div className="exhibition-artwork-card__sold">
                                                    Sold
                                                </div>
                                            )}
                                        </div>
                                        <div className="exhibition-artwork-card__content">
                                            <div className="exhibition-artwork-card__header">
                                                <h3>{artwork.title}</h3>
                                                <span>
                                                    ₹{artwork.price.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <Link to={`/artists`} className="exhibition-artwork-card__artist">
                                                {artwork.artist}
                                            </Link>
                                            <p className="exhibition-artwork-card__desc">
                                                {artwork.culturalHistory || artwork.description}
                                            </p>

                                            <div className="exhibition-artwork-card__actions">
                                                <Link to={`/artwork/${artwork.id}`} className="btn btn-secondary flex-1">
                                                    View Item
                                                </Link>
                                                {artwork.available && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleAddToCart(artwork)}
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="exhibition-detail__footer-action">
                                <Link to="/gallery" className="btn btn-secondary">
                                    View Full Collection
                                </Link>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="exhibition-detail__sidebar">
                        <div className="exhibition-detail__sidebar-inner">

                            {/* Meta Info */}
                            <div className="exhibition-sidebar-card">
                                <div className="exhibition-sidebar-card__content">
                                    <h3>Exhibition Info</h3>
                                    <ul>
                                        <li>
                                            <Calendar size={20} />
                                            <div>
                                                <p className="label">Dates</p>
                                                <p className="value">{exhibition.startDate} — {exhibition.endDate}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <MapPin size={20} />
                                            <div>
                                                <p className="label">Location</p>
                                                <p className="value">Main Gallery (Floor 2)<br />Available via Virtual Tour</p>
                                            </div>
                                        </li>
                                        <li>
                                            <Image size={20} />
                                            <div>
                                                <p className="label">Collection Size</p>
                                                <p className="value">{exhibition.artworkCount} Curated Pieces</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Visitor Ratings */}
                            <div className="exhibition-sidebar-card">
                                <div className="exhibition-sidebar-card__content">
                                    <h3>Visitor Ratings</h3>

                                    <div className="exhibition-sidebar-card__rating">
                                        <div className="rating-score">4.8</div>
                                        <div>
                                            <div className="rating-stars">
                                                <Star className="fill-gold" size={16} />
                                                <Star className="fill-gold" size={16} />
                                                <Star className="fill-gold" size={16} />
                                                <Star className="fill-gold" size={16} />
                                                <Star className="fill-gold opacity-50" size={16} />
                                            </div>
                                            <div className="rating-count">Based on 124 reviews</div>
                                        </div>
                                    </div>

                                    <div className="exhibition-sidebar-card__rate-box">
                                        <p>Rate this exhibition</p>
                                        <div className="rate-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setUserRating(star)}
                                                >
                                                    <Star
                                                        size={24}
                                                        className={(hoverRating || userRating) >= star ? 'text-gold fill-gold' : 'text-gray-500'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {userRating > 0 && (
                                            <p className="rate-thanks">Thanks for your rating!</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Event CTA */}
                            {exhibition.status !== 'past' && (
                                <div className="exhibition-sidebar-card exhibition-sidebar-card--gold">
                                    <div className="exhibition-sidebar-card__content">
                                        <h3>Curator Walkthrough</h3>
                                        <p>
                                            Join {exhibition.curator} for a live virtual tour and Q&A session.
                                        </p>
                                        <button className="btn btn-primary btn--full">
                                            RSVP for Event
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
