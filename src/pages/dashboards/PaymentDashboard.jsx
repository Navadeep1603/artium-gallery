import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    ShieldCheck,
    Truck,
    Gift,
    ArrowLeft,
    Check,
    ChevronRight,
    Lock,
    MapPin,
    User,
    Mail,
    Phone,
    Home,
    Globe,
    Calendar,
    Award,
    Package,
    Sparkles,
    CheckCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';

const STEPS = [
    { id: 1, label: 'Shipping', icon: Truck },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: CheckCircle },
];

export default function PaymentDashboard() {
    const { cartItems, clearCart, getTotal, cartCount } = useCart();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Form state
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        saveCard: false,
    });

    const [shippingMethod, setShippingMethod] = useState('standard');

    const subtotal = getTotal();
    const shippingCost = subtotal > 5000 ? 0 : shippingMethod === 'express' ? 350 : 150;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shippingCost + tax;

    const shippingMethods = [
        { id: 'standard', label: 'Standard Shipping', time: '7–14 business days', price: subtotal > 5000 ? 0 : 150 },
        { id: 'express', label: 'Express Shipping', time: '3–5 business days', price: subtotal > 5000 ? 0 : 350 },
        { id: 'premium', label: 'Premium White Glove', time: '1–3 business days', price: subtotal > 5000 ? 0 : 750 },
    ];

    const updateShipping = (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const updatePayment = (field, value) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setOrderPlaced(true);
            clearCart();
        }, 2500);
    };

    const formatPrice = (item) => {
        return `₹${item.price.toLocaleString('en-IN')}`;
    };

    // Order confirmation screen
    if (orderPlaced) {
        return (
            <div className="dashboard pay-dashboard">
                <div className="pay-success">
                    <motion.div
                        className="pay-success__icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                    >
                        <CheckCircle size={80} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Order Confirmed!
                    </motion.h1>
                    <motion.p
                        className="pay-success__subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Thank you for your purchase. Your order has been placed successfully.
                    </motion.p>
                    <motion.div
                        className="pay-success__order-id"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <span>Order ID</span>
                        <strong>ORD-{Date.now().toString().slice(-8)}</strong>
                    </motion.div>
                    <motion.div
                        className="pay-success__details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="pay-success__detail">
                            <Mail size={18} />
                            <span>Confirmation sent to {shippingInfo.email || 'your email'}</span>
                        </div>
                        <div className="pay-success__detail">
                            <Truck size={18} />
                            <span>Estimated delivery: {shippingMethod === 'express' ? '3–5' : shippingMethod === 'premium' ? '1–3' : '7–14'} business days</span>
                        </div>
                        <div className="pay-success__detail">
                            <Award size={18} />
                            <span>Certificate of Authenticity included</span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="pay-success__actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link to="/gallery" className="btn btn-primary">
                            <Sparkles size={18} />
                            Continue Browsing
                        </Link>
                        <Link to="/" className="btn btn-secondary">
                            <Home size={18} />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Empty cart redirect
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="dashboard pay-dashboard">
                <div className="cart-empty">
                    <motion.div
                        className="cart-empty__icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120 }}
                    >
                        <Package size={72} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Nothing to Checkout
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Add some artworks to your cart before proceeding to checkout.
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
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard pay-dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Lock size={26} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                        Secure Checkout
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Complete your purchase securely
                    </motion.p>
                </div>
                <Link to="/cart" className="btn btn-secondary">
                    <ArrowLeft size={18} />
                    Back to Cart
                </Link>
            </div>

            {/* Progress Steps */}
            <motion.div
                className="pay-steps"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                {STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                        <div key={step.id} className="pay-step-wrapper">
                            <div
                                className={`pay-step ${isActive ? 'pay-step--active' : ''} ${isCompleted ? 'pay-step--completed' : ''}`}
                                onClick={() => isCompleted && setCurrentStep(step.id)}
                            >
                                <div className="pay-step__circle">
                                    {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
                                </div>
                                <span className="pay-step__label">{step.label}</span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`pay-step__connector ${isCompleted ? 'pay-step__connector--active' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </motion.div>

            {/* Main Layout */}
            <div className="pay-layout">
                {/* Form Section */}
                <div className="pay-form-section">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Shipping */}
                        {currentStep === 1 && (
                            <motion.div
                                key="shipping"
                                className="dashboard__card pay-form-card"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="dashboard__card-header">
                                    <h2><MapPin size={20} /> Shipping Information</h2>
                                </div>
                                <div className="dashboard__card-content">
                                    <div className="pay-form-grid">
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <User size={14} /> First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="John"
                                                value={shippingInfo.firstName}
                                                onChange={e => updateShipping('firstName', e.target.value)}
                                            />
                                        </div>
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <User size={14} /> Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="Doe"
                                                value={shippingInfo.lastName}
                                                onChange={e => updateShipping('lastName', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="pay-form-grid">
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <Mail size={14} /> Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className="pay-input"
                                                placeholder="john@example.com"
                                                value={shippingInfo.email}
                                                onChange={e => updateShipping('email', e.target.value)}
                                            />
                                        </div>
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <Phone size={14} /> Phone
                                            </label>
                                            <input
                                                type="tel"
                                                className="pay-input"
                                                placeholder="+91 98765 43210"
                                                value={shippingInfo.phone}
                                                onChange={e => updateShipping('phone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="pay-form-group pay-form-group--full">
                                        <label className="pay-label">
                                            <Home size={14} /> Street Address
                                        </label>
                                        <input
                                            type="text"
                                            className="pay-input"
                                            placeholder="123 Art Gallery Lane"
                                            value={shippingInfo.address}
                                            onChange={e => updateShipping('address', e.target.value)}
                                        />
                                    </div>
                                    <div className="pay-form-grid pay-form-grid--3">
                                        <div className="pay-form-group">
                                            <label className="pay-label">City</label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="New York"
                                                value={shippingInfo.city}
                                                onChange={e => updateShipping('city', e.target.value)}
                                            />
                                        </div>
                                        <div className="pay-form-group">
                                            <label className="pay-label">State</label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="NY"
                                                value={shippingInfo.state}
                                                onChange={e => updateShipping('state', e.target.value)}
                                            />
                                        </div>
                                        <div className="pay-form-group">
                                            <label className="pay-label">ZIP Code</label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="10001"
                                                value={shippingInfo.zip}
                                                onChange={e => updateShipping('zip', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="pay-form-group pay-form-group--full">
                                        <label className="pay-label">
                                            <Globe size={14} /> Country
                                        </label>
                                        <select
                                            className="pay-input pay-select"
                                            value={shippingInfo.country}
                                            onChange={e => updateShipping('country', e.target.value)}
                                        >
                                            <option>India</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Germany</option>
                                            <option>France</option>
                                            <option>Japan</option>
                                            <option>Australia</option>

                                        </select>
                                    </div>

                                    {/* Shipping Method */}
                                    <h3 className="pay-section-title">
                                        <Truck size={18} /> Shipping Method
                                    </h3>
                                    <div className="pay-shipping-methods">
                                        {shippingMethods.map(method => (
                                            <div
                                                key={method.id}
                                                className={`pay-shipping-option ${shippingMethod === method.id ? 'pay-shipping-option--active' : ''}`}
                                                onClick={() => setShippingMethod(method.id)}
                                            >
                                                <div className="pay-shipping-option__radio">
                                                    <div className="pay-shipping-option__dot" />
                                                </div>
                                                <div className="pay-shipping-option__info">
                                                    <h4>{method.label}</h4>
                                                    <p>{method.time}</p>
                                                </div>
                                                <span className="pay-shipping-option__price">
                                                    {method.price === 0 ? 'FREE' : `₹${method.price}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === 2 && (
                            <motion.div
                                key="payment"
                                className="dashboard__card pay-form-card"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="dashboard__card-header">
                                    <h2><CreditCard size={20} /> Payment Details</h2>
                                    <div className="pay-card-brands">
                                        <span className="pay-card-brand">VISA</span>
                                        <span className="pay-card-brand">MC</span>
                                        <span className="pay-card-brand">AMEX</span>
                                    </div>
                                </div>
                                <div className="dashboard__card-content">
                                    <div className="pay-form-group pay-form-group--full">
                                        <label className="pay-label">
                                            <CreditCard size={14} /> Card Number
                                        </label>
                                        <input
                                            type="text"
                                            className="pay-input pay-input--card"
                                            placeholder="4242 4242 4242 4242"
                                            maxLength={19}
                                            value={paymentInfo.cardNumber}
                                            onChange={e => updatePayment('cardNumber', formatCardNumber(e.target.value))}
                                        />
                                    </div>
                                    <div className="pay-form-group pay-form-group--full">
                                        <label className="pay-label">
                                            <User size={14} /> Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            className="pay-input"
                                            placeholder="John Doe"
                                            value={paymentInfo.cardName}
                                            onChange={e => updatePayment('cardName', e.target.value)}
                                        />
                                    </div>
                                    <div className="pay-form-grid">
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <Calendar size={14} /> Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                className="pay-input"
                                                placeholder="MM / YY"
                                                maxLength={7}
                                                value={paymentInfo.expiry}
                                                onChange={e => updatePayment('expiry', e.target.value)}
                                            />
                                        </div>
                                        <div className="pay-form-group">
                                            <label className="pay-label">
                                                <Lock size={14} /> CVV
                                            </label>
                                            <input
                                                type="password"
                                                className="pay-input"
                                                placeholder="•••"
                                                maxLength={4}
                                                value={paymentInfo.cvv}
                                                onChange={e => updatePayment('cvv', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <label className="pay-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={paymentInfo.saveCard}
                                            onChange={e => updatePayment('saveCard', e.target.checked)}
                                        />
                                        <span className="pay-checkbox__box" />
                                        <span>Save this card for future purchases</span>
                                    </label>

                                    <div className="pay-security-notice">
                                        <ShieldCheck size={18} />
                                        <p>Your payment information is encrypted with 256-bit SSL encryption and never stored on our servers.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <motion.div
                                key="review"
                                className="dashboard__card pay-form-card"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="dashboard__card-header">
                                    <h2><CheckCircle size={20} /> Review Your Order</h2>
                                </div>
                                <div className="dashboard__card-content">
                                    {/* Shipping Review */}
                                    <div className="pay-review-section">
                                        <div className="pay-review-header">
                                            <h3><MapPin size={16} /> Shipping To</h3>
                                            <button className="pay-review-edit" onClick={() => setCurrentStep(1)}>Edit</button>
                                        </div>
                                        <div className="pay-review-details">
                                            <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                                            <p>{shippingInfo.address}</p>
                                            <p>{shippingInfo.city}{shippingInfo.state ? `, ${shippingInfo.state}` : ''} {shippingInfo.zip}</p>
                                            <p>{shippingInfo.country}</p>
                                            {shippingInfo.email && <p>{shippingInfo.email}</p>}
                                        </div>
                                    </div>

                                    {/* Payment Review */}
                                    <div className="pay-review-section">
                                        <div className="pay-review-header">
                                            <h3><CreditCard size={16} /> Payment Method</h3>
                                            <button className="pay-review-edit" onClick={() => setCurrentStep(2)}>Edit</button>
                                        </div>
                                        <div className="pay-review-details">
                                            <p>
                                                <strong>Card ending in {paymentInfo.cardNumber.slice(-4) || '••••'}</strong>
                                            </p>
                                            <p>{paymentInfo.cardName || 'Cardholder'}</p>
                                        </div>
                                    </div>

                                    {/* Items Review */}
                                    <div className="pay-review-section">
                                        <div className="pay-review-header">
                                            <h3><Package size={16} /> Items ({cartCount})</h3>
                                        </div>
                                        <div className="pay-review-items">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="pay-review-item">
                                                    <img src={item.thumbnail || item.image} alt={item.title} />
                                                    <div className="pay-review-item__info">
                                                        <h4>{item.title}</h4>
                                                        <p>{item.artist}</p>
                                                    </div>
                                                    <span className="pay-review-item__price">{formatPrice(item)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <motion.div
                        className="pay-nav-buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {currentStep > 1 && (
                            <button className="btn btn-secondary" onClick={handleBack}>
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {currentStep < 3 ? (
                            <button className="btn btn-primary pay-next-btn" onClick={handleNext}>
                                Continue
                                <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                className={`btn btn-primary pay-place-order-btn ${isProcessing ? 'pay-place-order-btn--processing' : ''}`}
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <motion.div
                                            className="pay-spinner"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        Place Order — ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </>
                                )}
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Order Summary Sidebar */}
                <motion.div
                    className="pay-summary-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="dashboard__card cart-summary-card">
                        <div className="dashboard__card-header">
                            <h2><Package size={20} /> Order Summary</h2>
                        </div>
                        <div className="dashboard__card-content">
                            {/* Mini cart items */}
                            <div className="pay-mini-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="pay-mini-item">
                                        <img src={item.thumbnail || item.image} alt={item.title} className="pay-mini-item__img" />
                                        <div className="pay-mini-item__info">
                                            <h4>{item.title}</h4>
                                            <p>{item.artist}</p>
                                        </div>
                                        <span className="pay-mini-item__price">{formatPrice(item)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary__divider" />

                            <div className="cart-summary__rows">
                                <div className="cart-summary__row">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'cart-summary__free' : ''}>
                                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Tax</span>
                                    <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cart-summary__divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="cart-trust-badges">
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
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
