import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Trash2,
    X,
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    Truck,
    Gift,
    Package,
    Sparkles,
    ChevronRight,
    Tag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';

export default function CartDashboard() {
    const { cartItems, removeFromCart, clearCart, getTotal, cartCount } = useCart();
    const [removingId, setRemovingId] = useState(null);

    const subtotal = getTotal();
    const shipping = subtotal > 5000 ? 0 : 150;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemovingId(null);
        }, 300);
    };

    const formatPrice = (item) => {
        return `₹${item.price.toLocaleString('en-IN')}`;
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="dashboard cart-dashboard">
                <div className="cart-empty">
                    <motion.div
                        className="cart-empty__icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                    >
                        <ShoppingCart size={72} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your Cart is Empty
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Discover extraordinary artworks from world-class artists and add them to your collection.
                    </motion.p>
                    <motion.div
                        className="cart-empty__actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/gallery" className="btn btn-primary cart-empty__cta">
                            <Sparkles size={18} />
                            Browse Gallery
                        </Link>
                        <Link to="/shop" className="btn btn-secondary cart-empty__cta">
                            <Package size={18} />
                            Visit Shop
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard cart-dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <ShoppingCart size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                        Your Cart
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {cartCount} {cartCount === 1 ? 'artwork' : 'artworks'} in your collection
                    </motion.p>
                </div>
                <div className="cart-header-actions">
                    <Link to="/gallery" className="btn btn-secondary">
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                    <button onClick={clearCart} className="btn btn-outline-danger cart-clear-btn">
                        <Trash2 size={18} />
                        Clear Cart
                    </button>
                </div>
            </div>

            {/* Main Grid: Cart Items + Summary */}
            <div className="cart-layout">
                {/* Cart Items */}
                <motion.div
                    className="cart-items-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="dashboard__card">
                        <div className="dashboard__card-header">
                            <h2><Package size={20} /> Items</h2>
                            <span className="cart-items-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="dashboard__card-content cart-items-list">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        className={`cart-item ${removingId === item.id ? 'cart-item--removing' : ''}`}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        layout
                                    >
                                        <img
                                            src={item.thumbnail || item.image}
                                            alt={item.title}
                                            className="cart-item__img"
                                        />
                                        <div className="cart-item__details">
                                            <h4 className="cart-item__title">{item.title}</h4>
                                            <p className="cart-item__artist">{item.artist}</p>
                                            <div className="cart-item__meta">
                                                <span className="cart-item__medium">{item.medium}</span>
                                                {item.dimensions && (
                                                    <span className="cart-item__dimensions">{item.dimensions}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="cart-item__price-section">
                                            <span className="cart-item__price">{formatPrice(item)}</span>
                                        </div>
                                        <button
                                            className="cart-item__remove"
                                            onClick={() => handleRemove(item.id)}
                                            aria-label={`Remove ${item.title}`}
                                        >
                                            <X size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Order Summary Sidebar */}
                <motion.div
                    className="cart-summary-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="dashboard__card cart-summary-card">
                        <div className="dashboard__card-header">
                            <h2><CreditCard size={20} /> Order Summary</h2>
                        </div>
                        <div className="dashboard__card-content">
                            <div className="cart-summary__rows">
                                <div className="cart-summary__row">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'cart-summary__free' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Estimated Tax</span>
                                    <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cart-summary__divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn btn-primary cart-checkout-btn">
                                <CreditCard size={18} />
                                Proceed to Checkout
                                <ChevronRight size={16} />
                            </Link>

                            {/* Promo Code */}
                            <div className="cart-promo">
                                <Tag size={16} />
                                <input
                                    type="text"
                                    placeholder="Enter promo code"
                                    className="cart-promo__input"
                                />
                                <button className="cart-promo__apply">Apply</button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        className="cart-trust-badges"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="cart-trust-badge">
                            <ShieldCheck size={20} />
                            <div>
                                <h4>Secure Payment</h4>
                                <p>256-bit SSL encryption</p>
                            </div>
                        </div>
                        <div className="cart-trust-badge">
                            <Truck size={20} />
                            <div>
                                <h4>Insured Shipping</h4>
                                <p>Free over ₹5,000</p>
                            </div>
                        </div>
                        <div className="cart-trust-badge">
                            <Gift size={20} />
                            <div>
                                <h4>Certificate of Authenticity</h4>
                                <p>Included with every piece</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
