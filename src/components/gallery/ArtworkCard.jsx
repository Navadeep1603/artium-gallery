import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, ExternalLink, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import './ArtworkCard.css';

export default function ArtworkCard({ artwork, viewMode = 'grid' }) {
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const inCart = isInCart(artwork.id);
    const inWishlist = isInWishlist(artwork.id);

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        toggleWishlist(artwork);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!inCart && artwork.available) {
            addToCart(artwork);
        }
    };

    if (viewMode === 'list') {
        return (
            <Link to={`/artwork/${artwork.id}`} className="artwork-card artwork-card--list">
                <div className="artwork-card__image-wrapper">
                    <img
                        src={artwork.thumbnail}
                        alt={artwork.title}
                        className="artwork-card__image"
                        loading="lazy"
                    />
                </div>
                <div className="artwork-card__content">
                    <div className="artwork-card__main">
                        <span className="artwork-card__category">{artwork.category}</span>
                        <h3 className="artwork-card__title">{artwork.title}</h3>
                        <p className="artwork-card__artist">by {artwork.artist}</p>
                        <p className="artwork-card__description">{artwork.description}</p>
                    </div>
                    <div className="artwork-card__details">
                        <div className="artwork-card__meta">
                            <span>{artwork.year}</span>
                            <span>{artwork.medium}</span>
                        </div>
                        <div className="artwork-card__stats">
                            <span><Eye size={14} /> {artwork.views.toLocaleString()}</span>
                            <span><Heart size={14} /> {artwork.likes.toLocaleString()}</span>
                        </div>
                        <div className="artwork-card__price">
                            {`₹${artwork.price.toLocaleString('en-IN')}`}
                        </div>
                        <button
                            className={`artwork-card__cart-btn ${inCart ? 'in-cart' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!artwork.available || inCart}
                        >
                            {inCart ? 'In Cart' : artwork.available ? 'Add to Cart' : 'Sold'}
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/artwork/${artwork.id}`} className="artwork-card">
            <div className="artwork-card__image-wrapper">
                <img
                    src={artwork.thumbnail}
                    alt={artwork.title}
                    className="artwork-card__image"
                    loading="lazy"
                />

                {/* Overlay */}
                <div className="artwork-card__overlay">
                    <div className="artwork-card__actions">
                        <button
                            className={`artwork-card__action ${inWishlist ? 'active' : ''}`}
                            onClick={handleToggleWishlist}
                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} color={inWishlist ? "#e74c3c" : "currentColor"} />
                        </button>
                        <button className="artwork-card__action" aria-label="Quick view">
                            <ExternalLink size={18} />
                        </button>
                        <button
                            className={`artwork-card__action ${inCart ? 'active' : ''}`}
                            onClick={handleAddToCart}
                            aria-label="Add to cart"
                            disabled={!artwork.available}
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>

                {/* Badges */}
                <div className="artwork-card__badges">
                    {artwork.featured && (
                        <span className="artwork-card__badge">Featured</span>
                    )}
                    {!artwork.available && (
                        <span className="artwork-card__badge artwork-card__badge--sold">Sold</span>
                    )}
                </div>
            </div>

            <div className="artwork-card__content">
                <span className="artwork-card__category">{artwork.category}</span>
                <h3 className="artwork-card__title">{artwork.title}</h3>
                <p className="artwork-card__artist">{artwork.artist}</p>

                <div className="artwork-card__footer">
                    <div className="artwork-card__stats">
                        <span><Eye size={12} /> {artwork.views.toLocaleString()}</span>
                        <span><Heart size={12} /> {artwork.likes.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            className={`artwork-card__wishlist-btn ${inWishlist ? 'active' : ''}`}
                            onClick={handleToggleWishlist}
                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                        >
                            <Heart
                                size={15}
                                fill={inWishlist ? "#e74c3c" : "none"}
                                color={inWishlist ? "#e74c3c" : "currentColor"}
                            />
                        </button>
                        <span className="artwork-card__price">
                            {`₹${artwork.price.toLocaleString('en-IN')}`}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
