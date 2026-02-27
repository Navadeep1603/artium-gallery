import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ExternalLink, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ArtworkCard.css';

export default function ArtworkCard({ artwork, viewMode = 'grid' }) {
    const { addToCart, isInCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const inCart = isInCart(artwork.id);

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
                        <button className="artwork-card__action" aria-label="Like">
                            <Heart size={18} />
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

                {/* Badge */}
                {artwork.featured && (
                    <span className="artwork-card__badge">Featured</span>
                )}
                {!artwork.available && (
                    <span className="artwork-card__badge artwork-card__badge--sold">Sold</span>
                )}
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
                    <span className="artwork-card__price">
                        {`₹${artwork.price.toLocaleString('en-IN')}`}
                    </span>
                </div>
            </div>
        </Link>
    );
}
