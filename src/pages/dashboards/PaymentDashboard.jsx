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
    Award,
    Package,
    Sparkles,
    CheckCircle,
    X,
    Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import './Dashboard.css';

const STEPS = [
    { id: 1, label: 'Shipping', icon: Truck },
    { id: 2, label: 'Review & Pay', icon: CreditCard },
];

const mockAddresses = [
    { id: 1, name: 'John Doe', phone: '+91 9876543210', address: '123 Art Gallery Lane, Kala Ghoda, Mumbai - 400001, Maharashtra', type: 'HOME' },
    { id: 2, name: 'John Doe', phone: '+91 9876543210', address: '456 Studio Apartment, Whitefield, Bangalore - 560066, Karnataka', type: 'WORK' }
];

// Razorpay Key ID (read from env in production, fallback for dev)
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SSFFNn34IoJThv';

export default function PaymentDashboard() {
    const { cartItems, clearCart, getTotal, cartCount } = useCart();
    const { user } = useAuth();
    const { addOrders } = useOrder();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [razorpayPaymentId, setRazorpayPaymentId] = useState(null);

    // Check if the user is the demo user to decide whether to populate mock info
    const isDemoUser = user?.email === 'visitor@gallery.com';
    const savedAddresses = isDemoUser ? mockAddresses : [];

    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // Form state
    const [shippingInfo, setShippingInfo] = useState({
        firstName: isDemoUser ? user?.name?.split(' ')[0] : '',
        lastName: isDemoUser ? user?.name?.split(' ').slice(1).join(' ') : '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
    });

    const [shippingMethod, setShippingMethod] = useState('standard');

    const subtotal = getTotal();
    const shippingCost = 0;
    const tax = 0;
    const grandTotal = subtotal;

    const shippingMethods = [
        { id: 'standard', label: 'Standard Shipping', time: '7–14 business days', price: 0 },
        { id: 'express', label: 'Express Shipping', time: '3–5 business days', price: 0 },
        { id: 'premium', label: 'Premium White Glove', time: '1–3 business days', price: 0 },
    ];

    const updateShipping = (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectSavedAddress = (addr) => {
        if (selectedAddressId === addr.id) {
            // Deselect and clear
            setSelectedAddressId(null);
            setShippingInfo(prev => ({
                ...prev,
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: ''
            }));
            return;
        }

        setSelectedAddressId(addr.id);

        // Simple parsing of mock addresses into fields
        const addrParts = addr.address.split(', ');

        let address1 = addr.address;

        let cityStateZip = '';
        if (addrParts.length >= 3) {
            address1 = addrParts.slice(0, -2).join(', ');
            cityStateZip = addrParts.slice(-2).join(', ');
        }

        let parsedCity = '';
        let parsedState = '';
        let parsedZip = '';

        if (cityStateZip) {
            const stateSplit = cityStateZip.split(', ');
            if (stateSplit.length === 2) {
                parsedState = stateSplit[1];
                const cityZip = stateSplit[0].split(' - ');
                if (cityZip.length === 2) {
                    parsedCity = cityZip[0];
                    parsedZip = cityZip[1];
                }
            }
        }

        setShippingInfo(prev => ({
            ...prev,
            firstName: addr.name.split(' ')[0],
            lastName: addr.name.split(' ').slice(1).join(' '),
            phone: addr.phone,
            address: address1,
            city: parsedCity,
            state: parsedState,
            zip: parsedZip,
        }));
    };

    const handleNext = () => {
        if (currentStep === 1) {
            const { firstName, lastName, email, phone, address, city, state, zip } = shippingInfo;
            if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
                alert('Please fill in all required shipping information.');
                return;
            }
        }

        if (currentStep < 2) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // ─── Razorpay Integration (Server-side order + verification) ────────
    const handlePayWithRazorpay = async () => {
        const amountInPaise = Math.round(grandTotal * 100);

        setIsProcessing(true);

        try {
            // Step 1: Create order on the server
            const orderRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInPaise, currency: 'INR' }),
            });

            if (!orderRes.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderRes.json();

            setIsProcessing(false);

            // Step 2: Open Razorpay checkout with server-generated order_id
            const options = {
                key: RAZORPAY_KEY,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Artium Gallery',
                description: `Payment for ${cartCount} artwork${cartCount > 1 ? 's' : ''}`,
                image: '/vite.svg',
                order_id: orderData.orderId, // Server-generated order ID
                prefill: {
                    name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
                    email: shippingInfo.email,
                    contact: shippingInfo.phone,
                },
                theme: {
                    color: '#D4AF37',
                },
                handler: async function (response) {
                    // Step 3: Verify payment signature on the server
                    setIsProcessing(true);

                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.verified) {
                            // Payment verified — create orders
                            setRazorpayPaymentId(response.razorpay_payment_id);

                            const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const newOrders = cartItems.map(item => ({
                                id: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`,
                                name: item.title || item.name,
                                variant: `by ${item.artist}`,
                                price: `₹${item.price.toLocaleString('en-IN')}`,
                                status: 'On the way',
                                date: date,
                                img: item.image || item.thumbnail,
                                artwork: item
                            }));
                            addOrders(newOrders);

                            setTimeout(() => {
                                setIsProcessing(false);
                                setOrderPlaced(true);
                                clearCart();
                            }, 1200);
                        } else {
                            setIsProcessing(false);
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch {
                        setIsProcessing(false);
                        alert('Payment verification error. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        alert('Payment was cancelled. Your order has not been placed.');
                    },
                    escape: true,
                    confirm_close: true,
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            setIsProcessing(false);
            alert('Could not initiate payment. Please try again later.');
        }
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
                        Payment Successful!
                    </motion.h1>
                    <motion.p
                        className="pay-success__subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Thank you for your purchase. Your order has been placed and payment confirmed via Razorpay.
                    </motion.p>

                    {razorpayPaymentId && (
                        <motion.div
                            className="pay-success__payment-id"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                        >
                            <span>Razorpay Payment ID</span>
                            <strong>{razorpayPaymentId}</strong>
                        </motion.div>
                    )}

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
                        Complete your purchase securely with Razorpay
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
                                    {/* Saved Addresses Section */}
                                    {savedAddresses.length > 0 && (
                                        <div className="pay-saved-addresses" style={{ marginBottom: 'var(--space-6)' }}>
                                            <h3 className="pay-section-title" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                                Select a Saved Address
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                                {savedAddresses.map(addr => (
                                                    <div
                                                        key={addr.id}
                                                        onClick={() => handleSelectSavedAddress(addr)}
                                                        style={{
                                                            padding: 'var(--space-4)',
                                                            border: `1px solid ${selectedAddressId === addr.id ? 'var(--gold)' : 'var(--glass-border)'}`,
                                                            borderRadius: 'var(--radius-md)',
                                                            background: selectedAddressId === addr.id ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: 'var(--space-3)',
                                                            transition: 'all var(--transition-fast)'
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            border: `2px solid ${selectedAddressId === addr.id ? 'var(--gold)' : 'var(--glass-border)'}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginTop: '2px'
                                                        }}>
                                                            {selectedAddressId === addr.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gold)' }} />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                                                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{addr.name}</strong>
                                                                <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)' }}>{addr.type}</span>
                                                            </div>
                                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{addr.address}</p>
                                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>{addr.phone}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedAddressId && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedAddressId(null);
                                                        setShippingInfo({
                                                            firstName: isDemoUser ? user?.name?.split(' ')[0] : '',
                                                            lastName: isDemoUser ? user?.name?.split(' ').slice(1).join(' ') : '',
                                                            email: user?.email || '',
                                                            phone: '',
                                                            address: '',
                                                            city: '',
                                                            state: '',
                                                            zip: '',
                                                            country: 'India',
                                                        });
                                                    }}
                                                    style={{
                                                        marginTop: 'var(--space-3)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--text-muted)',
                                                        fontSize: 'var(--text-sm)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-2)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <X size={14} /> Clear selection and enter manually
                                                </button>
                                            )}

                                            <div style={{ margin: 'var(--space-6) 0', borderTop: '1px dashed var(--glass-border)', position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-secondary)', padding: '0 var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>OR</span>
                                            </div>
                                        </div>
                                    )}

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

                        {/* Step 2: Review & Pay */}
                        {currentStep === 2 && (
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

                                    {/* Payment Method */}
                                    <div className="pay-review-section">
                                        <div className="pay-review-header">
                                            <h3><CreditCard size={16} /> Payment Method</h3>
                                        </div>
                                        <div className="pay-razorpay-info">
                                            <div className="pay-razorpay-badge">
                                                <ShieldCheck size={20} />
                                                <div>
                                                    <h4>Powered by Razorpay</h4>
                                                    <p>UPI · Cards · Net Banking · Wallets</p>
                                                </div>
                                            </div>
                                            <p className="pay-razorpay-note">
                                                You'll be redirected to Razorpay's secure payment page when you click "Pay Now".
                                            </p>
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
                        {currentStep < 2 ? (
                            <button className="btn btn-primary pay-next-btn" onClick={handleNext}>
                                Continue
                                <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                className={`btn pay-razorpay-btn ${isProcessing ? 'pay-razorpay-btn--processing' : ''}`}
                                onClick={handlePayWithRazorpay}
                                disabled={isProcessing}
                                id="razorpay-pay-button"
                            >
                                {isProcessing ? (
                                    <>
                                        <motion.div
                                            className="pay-spinner"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        Pay ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with Razorpay
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
                                <h4>Razorpay Secured</h4>
                                <p>PCI DSS compliant payments</p>
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
