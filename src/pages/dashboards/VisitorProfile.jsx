import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Package,
    MapPin,
    CreditCard,
    Gift,
    Wallet,
    Tag,
    ChevronRight,
    Edit3,
    Save,
    X,
    LogOut,
    Power,
    Plus,
    MoreVertical,
    Home,
    Briefcase,
    Phone,
    Trash2,
    Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const sidebarSections = [
    {
        title: 'MY ORDERS',
        icon: Package,
        items: [{ label: 'My Orders', section: 'orders' }]
    },
    {
        title: 'ACCOUNT SETTINGS',
        icon: User,
        items: [
            { label: 'Profile Information', section: 'profile' },
            { label: 'Manage Addresses', section: 'addresses' },
            { label: 'PAN Card Information', section: 'pan' }
        ]
    },
    {
        title: 'PAYMENTS',
        icon: CreditCard,
        items: [
            { label: 'Gift Cards', section: 'giftcards', badge: '₹0' },
            { label: 'Saved UPI', section: 'upi' },
            { label: 'Saved Cards', section: 'cards' }
        ]
    },
    {
        title: 'MY STUFF',
        icon: Tag,
        items: [
            { label: 'My Coupons', section: 'coupons' },
            { label: 'My Reviews & Ratings', section: 'reviews' },
            { label: 'All Notifications', section: 'notifications' },
            { label: 'My Wishlist', section: 'wishlist' }
        ]
    }
];

const mockAddresses = [
    {
        id: 1,
        type: 'HOME',
        name: 'Navadeep CH',
        phone: '8328632346',
        address: 'KL university, KL university, Mangalagiri, Andhra Pradesh - 522302'
    },
    {
        id: 2,
        type: 'HOME',
        name: 'Manoj Kumar',
        phone: '9640035030',
        address: 'BEDBOX BOYS HOSTEL, BED BOX, Mangalagiri, Andhra Pradesh - 522302'
    },
    {
        id: 3,
        type: 'WORK',
        name: 'Akshith',
        phone: '9849423827',
        address: 'Aravalli boys hostel, KLuniversity Vaddeswaram guntur district, Mangalagiri, Andhra Pradesh - 522302'
    },
    {
        id: 4,
        type: 'HOME',
        name: 'Navadeep Challa',
        phone: '8328632346',
        address: '5-4-92/1, Opp of union bank, ayyapa swami, Mahabubabad District, Telangana - 506315'
    },
    {
        id: 5,
        type: 'HOME',
        name: 'Thalla Joshitha',
        phone: '8121643978',
        address: '4-114, Abbaipalem rice mill NH 365, Mahabubabad District, Telangana - 506315'
    },
    {
        id: 6,
        type: 'HOME',
        name: 'Srithan',
        phone: '9143995577',
        address: 'Flat no.208, Dwarakamai Residency, VTPS Road, Bhimaraju Gutta, Ibrahimpatnam, Ntr, Andhra Pradesh - 521456'
    },
    {
        id: 7,
        type: 'HOME',
        name: 'M Sai Vinay',
        phone: '7680817651',
        address: 'House no - 3-29, Mukthyala Road, Near Vinayaka temple, Jaggaiahpet, Andhra Pradesh - 521175'
    }
];

const mockUPIs = [
    { id: 1, provider: 'PhonePe', upiId: 'challa.harish781@axl', icon: '📱', color: '#5f259f' },
    { id: 2, provider: 'PhonePe', upiId: 'challausha2@axl', icon: '📱', color: '#5f259f' },
    { id: 3, provider: 'PhonePe', upiId: '9059773056@ybl', icon: '📱', color: '#5f259f' },
    { id: 4, provider: 'Google Pay', upiId: 'challadeepu079@oksbi', icon: '💳', color: '#4285f4' }
];

const mockCards = [
    { id: 1, label: 'Federal Bank Credit Card', last4: '7 7 8 8', hasLabel: true },
    { id: 2, label: '', last4: '1 7 5 9', hasLabel: false },
    { id: 3, label: 'State Bank of India Credit Card', last4: '7 1 1 8', hasLabel: true }
];

export default function VisitorProfile() {
    const { user, updateProfile, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Read section from URL param (e.g. ?section=orders)
    const searchParams = new URLSearchParams(location.search);
    const sectionFromUrl = searchParams.get('section');

    const [activeSection, setActiveSection] = useState(sectionFromUrl || 'profile');

    // Sync section when URL param changes (from header dropdown navigation)
    useEffect(() => {
        if (sectionFromUrl) setActiveSection(sectionFromUrl);
    }, [sectionFromUrl]);

    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingMobile, setEditingMobile] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addresses, setAddresses] = useState(mockAddresses);

    const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
    const [gender, setGender] = useState('male');
    const [email, setEmail] = useState(user?.email || '');
    const [mobile, setMobile] = useState('+91 9876543210');

    // New address form state
    const [newAddress, setNewAddress] = useState({
        name: '', phone: '', address: '', type: 'HOME'
    });

    // UPI state
    const [savedUPIs, setSavedUPIs] = useState(mockUPIs);

    // Cards state
    const [savedCards, setSavedCards] = useState(mockCards);

    // Gift card state
    const [gcTab, setGcTab] = useState('personal');
    const [gcCardValue, setGcCardValue] = useState('');
    const [gcNumCards, setGcNumCards] = useState(1);
    const [gcTotal, setGcTotal] = useState(0);

    const handleSavePersonal = () => {
        updateProfile({ name: `${firstName} ${lastName}`.trim() });
        setEditingPersonal(false);
    };

    const handleSaveEmail = () => {
        updateProfile({ email });
        setEditingEmail(false);
    };

    const handleDeleteAddress = (id) => {
        setAddresses(prev => prev.filter(a => a.id !== id));
        setOpenMenu(null);
    };

    const handleAddAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address) return;
        setAddresses(prev => [...prev, { ...newAddress, id: Date.now() }]);
        setNewAddress({ name: '', phone: '', address: '', type: 'HOME' });
        setShowAddForm(false);
    };

    /* ── RENDER: Profile Information ── */
    const renderProfile = () => (
        <>
            {/* Personal Information */}
            <section className="vp-form-section">
                <div className="vp-form-section__header">
                    <h2>Personal Information</h2>
                    {!editingPersonal ? (
                        <button className="vp-edit-btn" onClick={() => setEditingPersonal(true)}>Edit</button>
                    ) : (
                        <div className="vp-edit-actions">
                            <button className="vp-save-btn" onClick={handleSavePersonal}>
                                <Save size={14} /> Save
                            </button>
                            <button className="vp-cancel-btn" onClick={() => setEditingPersonal(false)}>Cancel</button>
                        </div>
                    )}
                </div>
                <div className="vp-form-row">
                    <div className="vp-form-group">
                        <input type="text" className="vp-input" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!editingPersonal} placeholder="First Name" />
                    </div>
                    <div className="vp-form-group">
                        <input type="text" className="vp-input" value={lastName} onChange={e => setLastName(e.target.value)} disabled={!editingPersonal} placeholder="Last Name" />
                    </div>
                </div>
                <div className="vp-gender-section">
                    <span className="vp-gender-label">Your Gender</span>
                    <div className="vp-gender-options">
                        <label className={`vp-gender-option ${gender === 'male' ? 'vp-gender-option--active' : ''}`}>
                            <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} disabled={!editingPersonal} />
                            <span>Male</span>
                        </label>
                        <label className={`vp-gender-option ${gender === 'female' ? 'vp-gender-option--active' : ''}`}>
                            <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} disabled={!editingPersonal} />
                            <span>Female</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Email Address */}
            <section className="vp-form-section">
                <div className="vp-form-section__header">
                    <h2>Email Address</h2>
                    {!editingEmail ? (
                        <button className="vp-edit-btn" onClick={() => setEditingEmail(true)}>Edit</button>
                    ) : (
                        <div className="vp-edit-actions">
                            <button className="vp-save-btn" onClick={handleSaveEmail}><Save size={14} /> Save</button>
                            <button className="vp-cancel-btn" onClick={() => setEditingEmail(false)}>Cancel</button>
                        </div>
                    )}
                </div>
                <div className="vp-form-group">
                    <input type="email" className="vp-input" value={email} onChange={e => setEmail(e.target.value)} disabled={!editingEmail} placeholder="Email Address" />
                </div>
            </section>

            {/* Mobile Number */}
            <section className="vp-form-section">
                <div className="vp-form-section__header">
                    <h2>Mobile Number</h2>
                    {!editingMobile ? (
                        <button className="vp-edit-btn" onClick={() => setEditingMobile(true)}>Edit</button>
                    ) : (
                        <div className="vp-edit-actions">
                            <button className="vp-save-btn" onClick={() => setEditingMobile(false)}><Save size={14} /> Save</button>
                            <button className="vp-cancel-btn" onClick={() => setEditingMobile(false)}>Cancel</button>
                        </div>
                    )}
                </div>
                <div className="vp-form-group">
                    <input type="tel" className="vp-input" value={mobile} onChange={e => setMobile(e.target.value)} disabled={!editingMobile} placeholder="Mobile Number" />
                </div>
            </section>

            {/* FAQs */}
            <section className="vp-form-section">
                <h2 className="vp-faq-title">FAQs</h2>
                <div className="vp-faq-list">
                    <div className="vp-faq-item">
                        <h4>What happens when I update my email address (or mobile number)?</h4>
                        <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>When will my Artium account be updated with the new email address (or mobile number)?</h4>
                        <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>What happens to my existing Artium account when I update my email address (or mobile number)?</h4>
                        <p>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Does my Artist account get affected when I update my email address?</h4>
                        <p>Artium has a 'single sign-on' policy. Any changes will reflect in your Artist account also.</p>
                    </div>
                </div>
            </section>

            {/* Account Actions */}
            <div className="vp-account-actions">
                <button className="vp-account-action vp-account-action--deactivate">Deactivate Account</button>
                <button className="vp-account-action vp-account-action--delete">Delete Account</button>
            </div>
        </>
    );

    /* ── RENDER: Manage Addresses ── */
    const renderAddresses = () => (
        <>
            <div className="vp-form-section">
                <h2 className="vp-addresses-title">Manage Addresses</h2>
            </div>

            {/* Add New Address Button */}
            <button
                className="vp-add-address-btn"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                <Plus size={18} />
                <span>ADD A NEW ADDRESS</span>
            </button>

            {/* Add Address Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        className="vp-form-section vp-add-address-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="vp-address-type-toggle">
                            <button
                                className={`vp-address-type-btn ${newAddress.type === 'HOME' ? 'active' : ''}`}
                                onClick={() => setNewAddress(p => ({ ...p, type: 'HOME' }))}
                            >
                                <Home size={14} /> Home
                            </button>
                            <button
                                className={`vp-address-type-btn ${newAddress.type === 'WORK' ? 'active' : ''}`}
                                onClick={() => setNewAddress(p => ({ ...p, type: 'WORK' }))}
                            >
                                <Briefcase size={14} /> Work
                            </button>
                        </div>
                        <div className="vp-form-row">
                            <div className="vp-form-group">
                                <input type="text" className="vp-input" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="vp-form-group">
                                <input type="tel" className="vp-input" placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                        </div>
                        <div className="vp-form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <textarea className="vp-input vp-textarea" placeholder="Full Address (House no, Street, City, State - Pincode)" rows={3} value={newAddress.address} onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))} />
                        </div>
                        <div className="vp-edit-actions">
                            <button className="vp-save-btn" onClick={handleAddAddress}>
                                <Save size={14} /> Save Address
                            </button>
                            <button className="vp-cancel-btn" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Address Cards */}
            <div className="vp-address-list">
                <AnimatePresence>
                    {addresses.map(addr => (
                        <motion.div
                            key={addr.id}
                            className="vp-address-card"
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <div className="vp-address-card__content">
                                <span className={`vp-address-badge vp-address-badge--${addr.type.toLowerCase()}`}>
                                    {addr.type}
                                </span>
                                <div className="vp-address-card__name-row">
                                    <span className="vp-address-card__name">{addr.name}</span>
                                    <span className="vp-address-card__phone">{addr.phone}</span>
                                </div>
                                <p className="vp-address-card__address">{addr.address}</p>
                            </div>
                            <div className="vp-address-card__actions">
                                <button
                                    className="vp-address-menu-btn"
                                    onClick={() => setOpenMenu(openMenu === addr.id ? null : addr.id)}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                <AnimatePresence>
                                    {openMenu === addr.id && (
                                        <motion.div
                                            className="vp-address-menu"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <button className="vp-address-menu__item" onClick={() => setOpenMenu(null)}>
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button className="vp-address-menu__item vp-address-menu__item--delete" onClick={() => handleDeleteAddress(addr.id)}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );

    /* ── RENDER: PAN Card Information ── */
    const renderPanCard = () => (
        <>
            <section className="vp-form-section">
                <h2 className="vp-addresses-title">PAN Card Information</h2>

                <div className="vp-pan-form">
                    <div className="vp-form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <input
                            type="text"
                            className="vp-input"
                            placeholder="PAN Card Number"
                            maxLength={10}
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>

                    <div className="vp-form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <input
                            type="text"
                            className="vp-input"
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="vp-form-group" style={{ marginBottom: 'var(--space-5)' }}>
                        <label className="vp-pan-upload-label">Upload PAN Card (Only JPEG file is allowed)</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg"
                            className="vp-pan-file-input"
                        />
                    </div>

                    <label className="vp-pan-declaration">
                        <input type="checkbox" className="vp-pan-checkbox" />
                        <span>
                            I do hereby declare that PAN furnished/stated above is correct and belongs to me, registered as an account holder with www.artium.com. I further declare that I shall solely be held responsible for the consequences, in case of any false PAN declaration.
                        </span>
                    </label>

                    <button className="vp-pan-upload-btn">
                        UPLOAD
                    </button>

                    <a href="#" className="vp-pan-terms-link">
                        Read Terms & Conditions of PAN Card Information
                    </a>
                </div>
            </section>
        </>
    );

    /* ── RENDER: Gift Cards ── */
    const renderGiftCards = () => (
        <>
            {/* Header */}
            <div className="vp-form-section">
                <div className="vp-gc-header">
                    <h2>Artium Gift Card</h2>
                    <div className="vp-gc-header-links">
                        <a href="#">Buy a Gift Card</a>
                        <a href="#">Check Gift Card Balance</a>
                    </div>
                </div>
            </div>

            {/* Add Gift Card */}
            <button className="vp-add-address-btn">
                <Plus size={18} />
                <span>ADD A GIFT CARD</span>
            </button>

            {/* Buy Gift Card Form */}
            <div className="vp-form-section">
                <h3 className="vp-gc-buy-title">Buy an Artium Gift Card</h3>

                {/* Tabs */}
                <div className="vp-gc-tabs">
                    <button
                        className={`vp-gc-tab ${gcTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setGcTab('personal')}
                    >
                        PERSONAL GIFT CARDS
                    </button>
                    <button
                        className={`vp-gc-tab ${gcTab === 'corporate' ? 'active' : ''}`}
                        onClick={() => setGcTab('corporate')}
                    >
                        CORPORATE REQUIREMENTS
                    </button>
                </div>

                <div className="vp-gc-form-layout">
                    {/* Form */}
                    <div className="vp-gc-form">
                        <div className="vp-form-group" style={{ marginBottom: 'var(--space-3)' }}>
                            <input type="email" className="vp-input" placeholder="Receiver's Email ID *" />
                        </div>
                        <div className="vp-form-group" style={{ marginBottom: 'var(--space-3)' }}>
                            <input type="text" className="vp-input" placeholder="Receiver's Name *" />
                        </div>
                        <div className="vp-gc-value-row">
                            <div className="vp-form-group">
                                <label className="vp-pan-upload-label">Card Value in ₹</label>
                                <select
                                    className="vp-input vp-select"
                                    value={gcCardValue}
                                    onChange={e => {
                                        setGcCardValue(e.target.value);
                                        setGcTotal(Number(e.target.value) * gcNumCards);
                                    }}
                                >
                                    <option value="">Select</option>
                                    <option value="500">₹500</option>
                                    <option value="1000">₹1,000</option>
                                    <option value="2000">₹2,000</option>
                                    <option value="5000">₹5,000</option>
                                    <option value="10000">₹10,000</option>
                                </select>
                            </div>
                            <div className="vp-form-group">
                                <label className="vp-pan-upload-label">No of Cards</label>
                                <input
                                    type="number"
                                    className="vp-input"
                                    value={gcNumCards}
                                    min={1}
                                    max={10}
                                    onChange={e => {
                                        setGcNumCards(Number(e.target.value));
                                        setGcTotal(Number(gcCardValue) * Number(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                        <div className="vp-form-group" style={{ marginBottom: 'var(--space-3)' }}>
                            <input type="text" className="vp-input" placeholder="Gifter's Name (Optional)" />
                        </div>
                        <div className="vp-form-group" style={{ marginBottom: 'var(--space-3)' }}>
                            <textarea className="vp-input vp-textarea" placeholder="Write a message (Optional, 100 characters)" maxLength={100} rows={3} />
                        </div>
                        <button className="vp-gc-add-another">
                            <Plus size={14} /> Buy Another Gift Card
                        </button>
                    </div>

                    {/* Card Preview */}
                    <div className="vp-gc-preview">
                        <div className="vp-gc-preview-card">
                            <div className="vp-gc-preview-header">
                                <span className="vp-gc-preview-label">Gift Card Value</span>
                                <span className="vp-gc-preview-logo">ARTIUM 🎨</span>
                            </div>
                            <span className="vp-gc-preview-amount">₹{gcTotal.toLocaleString()}</span>
                            <div className="vp-gc-preview-gifts">
                                🎁 🎄 🎁 🎀 🎁 🎄
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Button */}
            <button className="vp-gc-buy-btn">
                BUY GIFT CARD FOR  ₹{gcTotal.toLocaleString()}
            </button>

            {/* FAQs */}
            <div className="vp-form-section">
                <h2 className="vp-faq-title">FAQs</h2>
                <div className="vp-faq-list">
                    <div className="vp-faq-item">
                        <h4>How do I buy / gift an Artium Gift Card?</h4>
                        <ul className="vp-gc-faq-list">
                            <li>Enter the name and email address of the person you want to send the Artium Gift Card to.</li>
                            <li>Select the value of the card you would like to purchase, then click 'Proceed To Pay'.</li>
                            <li>You'll now see the payment options. You can pay by Credit Card / Debit Card / ATM Card / Netbanking. Proceed to pay using your preferred choice.</li>
                            <li>Complete the checkout process to receive an email with the Gift Card details.</li>
                        </ul>
                    </div>
                    <div className="vp-faq-item">
                        <h4>How do I pay with an Artium Gift Card?</h4>
                        <ul className="vp-gc-faq-list">
                            <li>Go to artium.com and select the items you want to purchase. When you are ready to checkout, click 'Proceed To Pay'.</li>
                            <li>Select the 'Pay By Gift Card' option.</li>
                            <li>Enter your 16-digit gift card number and the corresponding 6-digit PIN number when prompted.</li>
                            <li>If the Gift Card value doesn't cover your Order total, you will be prompted to select an additional payment method.</li>
                        </ul>
                        <p style={{ marginTop: 'var(--space-2)' }}><strong>NOTE:</strong> Funds will be deducted from your Artium Gift Card when you place your order. In case of any adjustment or cancellation at a later stage, we will credit the refund back to your Gift Card.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Does my Artium Gift Card expire?</h4>
                        <p>All Artium Gift Cards expire 1 year from the date of their creation.</p>
                    </div>
                </div>
                <a href="#" className="vp-pan-terms-link" style={{ marginTop: 'var(--space-4)' }}>View all FAQs  ›</a>
            </div>

            {/* Terms & Conditions */}
            <div className="vp-form-section">
                <h2 className="vp-faq-title">Terms & Conditions</h2>
                <ul className="vp-gc-terms-list">
                    <li>Artium Gift Cards ("GCs" or "Gift Cards") are issued by Artium Solutions Pvt. Ltd. which is a private limited company incorporated under the laws of India.</li>
                    <li>The Gift Cards can be redeemed online against artwork listed on artium.com or the Artium Mobile App only.</li>
                    <li>Gift Cards can be purchased on www.artium.com using the following payment modes only – Credit Card, Debit Card and Net Banking.</li>
                    <li>Gift Cards can be redeemed by selecting the payment mode as Gift Card.</li>
                    <li>Gift Cards cannot be used to purchase other Artium Gift Cards or Artium subscriptions.</li>
                    <li>Gift Cards cannot be used to make bulk purchases on the Platform.</li>
                    <li>If the order value exceeds the Gift Card amount, the balance must be paid by Credit Card/Debit Card/Internet Banking. The Cash on Delivery payment option cannot be used to pay the balance amount.</li>
                </ul>
                <a href="#" className="vp-pan-terms-link" style={{ marginTop: 'var(--space-4)' }}>View all T&Cs  ›</a>
            </div>
        </>
    );

    /* ── RENDER: Saved UPI ── */
    const renderSavedUPI = () => (
        <>
            <div className="vp-form-section">
                <h2 className="vp-addresses-title">Manage Saved UPI</h2>
            </div>

            {/* UPI List */}
            <div className="vp-address-list">
                <AnimatePresence>
                    {savedUPIs.map(upi => (
                        <motion.div
                            key={upi.id}
                            className="vp-upi-card"
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <div className="vp-upi-card__info">
                                <span className="vp-upi-provider">{upi.provider} UPI</span>
                                <div className="vp-upi-card__id-row">
                                    <span className="vp-upi-icon" style={{ background: upi.color }}>{upi.icon}</span>
                                    <span className="vp-upi-id">{upi.upiId}</span>
                                </div>
                            </div>
                            <button
                                className="vp-upi-delete-btn"
                                onClick={() => setSavedUPIs(prev => prev.filter(u => u.id !== upi.id))}
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* FAQs */}
            <div className="vp-form-section">
                <h2 className="vp-faq-title">FAQs</h2>
                <div className="vp-faq-list">
                    <div className="vp-faq-item">
                        <h4>Why is my UPI being saved on Artium?</h4>
                        <p>It's quicker. You can save the hassle of typing in the complete UPI information every time you shop at Artium by saving your UPI details. You can make your payment by selecting the saved UPI ID of your choice at checkout. While this is obviously faster, it is also very secure.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Is it safe to save my UPI on Artium?</h4>
                        <p>Absolutely. Your UPI ID information is 100 percent safe with us. UPI ID details are non PCI compliant and are non confidential data.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>What all UPI information does Artium store?</h4>
                        <p>Artium only stores UPI ID and payment provider details. We do not store UPI PIN/MPIN.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Can I delete my saved UPI?</h4>
                        <p>Yes, you can delete your UPI ID at any given time.</p>
                    </div>
                </div>
                <a href="#" className="vp-pan-terms-link" style={{ marginTop: 'var(--space-4)' }}>View all FAQs  ›</a>
            </div>
        </>
    );

    /* ── RENDER: Saved Cards ── */
    const renderSavedCards = () => (
        <>
            <div className="vp-form-section">
                <h2 className="vp-addresses-title">Manage Saved Cards</h2>
            </div>

            {/* Cards List */}
            <div className="vp-address-list">
                <AnimatePresence>
                    {savedCards.map(card => (
                        <motion.div
                            key={card.id}
                            className="vp-card-item"
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <div className="vp-card-item__info">
                                <div className="vp-card-item__header">
                                    {card.hasLabel ? (
                                        <span className="vp-card-item__label">{card.label}</span>
                                    ) : (
                                        <span className="vp-card-item__label-cta">LABEL THIS CARD</span>
                                    )}
                                    {card.hasLabel && <span className="vp-card-item__edit">EDIT</span>}
                                </div>
                                <span className="vp-card-item__number">••••  ••••  ••••  {card.last4}</span>
                            </div>
                            <button
                                className="vp-upi-delete-btn"
                                onClick={() => setSavedCards(prev => prev.filter(c => c.id !== card.id))}
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* FAQs */}
            <div className="vp-form-section">
                <h2 className="vp-faq-title">FAQs</h2>
                <div className="vp-faq-list">
                    <div className="vp-faq-item">
                        <h4>Why is my card being tokenised?</h4>
                        <p>As per the new RBI guidelines to make card data more secure, merchants like Artium cannot store the card details of users. As an alternative, RBI has authorised card networks and card issuers to offer card tokenisation services, which means the replacement of actual credit and debit card details with an alternate code called "token". The user can either choose to tokenise their card by giving consent for future transactions or choose to continue without tokenisation.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>What is a token?</h4>
                        <p>A token is generated when a user gives consent to Artium to tokenise their card. A token is a unique value for a combination of card, token requestor (Artium is a token requestor & accepts request from the customer for tokenisation of a card and passes it onto the card network to issue a corresponding token) and device. The token does not contain any personal information linked to your card and is generated only when a customer uses a new card for a successful transaction on Artium.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Is it safe to tokenise my card?</h4>
                        <p>Yes. A tokenised card transaction is considered safer as the actual card details are not shared with Artium during transaction processing. Card information is stored with the authorised card networks or card issuers only and Artium does not store your 16-digit card number.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>Is tokenisation of card mandatory?</h4>
                        <p>No, customer can choose whether or not to tokenise their card.</p>
                    </div>
                    <div className="vp-faq-item">
                        <h4>What happens if I don't give consent to secure my card?</h4>
                        <p>If you don't give consent to tokenise your card, you need to enter your card details for every transaction as stipulated under the RBI guidelines.</p>
                    </div>
                </div>
                <a href="#" className="vp-pan-terms-link" style={{ marginTop: 'var(--space-4)' }}>View all FAQs  ›</a>
            </div>
        </>
    );

    /* ── RENDER: My Coupons ── */
    const renderCoupons = () => {
        const availableCoupons = [
            { id: 1, title: 'Get artworks at Re.1', desc: 'Get artworks at Re.1 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 2, title: 'Get artworks at Re.1', desc: 'Get artworks at Re.1 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 3, title: 'Get artworks at Re.1', desc: 'Get artworks at Re.1 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 4, title: 'Get artworks at Re.1', desc: 'Get artworks at Re.1 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 5, title: 'Get artworks at Re.1', desc: 'Get artworks at Re.1 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 6, title: 'Additional 5% OFF on Sculptures', desc: 'Additional 5% OFF on Sculpture Artworks (Valid till: 11:59 PM, 10 Mar)', validTill: 'Valid till 10 Mar, 2026' },
            { id: 7, title: 'Additional 10% OFF on Paintings', desc: 'Additional 10% OFF on Painting Artworks (Valid till: 11:59 PM, 10 Mar)', validTill: 'Valid till 10 Mar, 2026' },
            { id: 8, title: 'Flat Rs.75 off', desc: 'On Orders Above Rs.499 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' },
            { id: 9, title: 'Flat Rs.50 off', desc: 'On Orders Above Rs.599 (Valid till: 11:59 PM, 31 Mar)', validTill: 'Valid till 31 Mar, 2026' }
        ];
        const upcomingCoupons = [
            { id: 10, title: '10% off on Oil Paintings', desc: '10% off on Oil Paintings (Valid till: 11:59 PM, 20 Jan)', validTill: 'Valid till 20 Jan, 2024' },
            { id: 11, title: '5% Off on Watercolors', desc: '5% Off on Watercolor Art (Valid till: 11:59 PM, 20 Jan)', validTill: 'Valid till 20 Jan, 2024' },
            { id: 12, title: '5% off on Digital Art', desc: '5% off on Digital Art (Valid till: 11:59 PM, 20 Jan)', validTill: 'Valid till 20 Jan, 2024' },
            { id: 13, title: '10% Off on Abstract Art', desc: '10% Off on Abstract Art (Valid till: 11:59 PM, 20 Jan)', validTill: 'Valid till 20 Jan, 2024' }
        ];
        const expiredCoupons = [
            { id: 14, title: 'Plus Discount Upto ₹250', desc: 'Plus Discount Upto ₹250 (Valid till: 11:59 PM, 30 Apr)', validTill: 'Valid till 30 Apr, 2026' }
        ];

        const CouponCard = ({ coupon }) => (
            <div className="vp-coupon-card">
                <div className="vp-coupon-card__main">
                    <span className="vp-coupon-card__title">{coupon.title}</span>
                    <span className="vp-coupon-card__desc">{coupon.desc}</span>
                </div>
                <div className="vp-coupon-card__right">
                    <span className="vp-coupon-card__valid">{coupon.validTill}</span>
                    <a href="#" className="vp-coupon-card__tc">View T&C</a>
                </div>
            </div>
        );

        return (
            <>
                {/* Available */}
                <div className="vp-form-section">
                    <h2 className="vp-addresses-title">Available Coupons</h2>
                </div>
                <div className="vp-address-list">
                    {availableCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
                </div>
                <button className="vp-coupon-view-more">VIEW MORE</button>

                {/* Upcoming */}
                <h3 className="vp-coupon-section-title">Upcoming Coupons</h3>
                <div className="vp-address-list">
                    {upcomingCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
                </div>

                {/* Expired */}
                <h3 className="vp-coupon-section-title">Expired Coupons</h3>
                <div className="vp-address-list">
                    {expiredCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
                </div>
            </>
        );
    };

    /* ── RENDER: Placeholder for other sections ── */
    const renderPlaceholder = (title) => (
        <div className="vp-form-section" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>{title}</h2>
            <p style={{ color: 'var(--text-muted)' }}>This section is coming soon.</p>
        </div>
    );

    /* ── RENDER: My Orders ── */
    const renderOrders = () => {
        const orders = [
            { id: 'OD1001', name: 'Abstract Harmony - Oil on Canvas by Priya Sharma', variant: 'Size: 24x36 inches', price: '₹12,500', status: 'Delivered', date: 'Feb 15', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=120&h=120&fit=crop' },
            { id: 'OD1002', name: 'Bronze Dancing Nataraja Sculpture', variant: 'Material: Bronze, Antique Finish', price: '₹8,999', status: 'Delivered', date: 'Feb 10', img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=120&h=120&fit=crop' },
            { id: 'OD1003', name: 'Watercolor Landscape - Misty Mountains', variant: 'Size: 18x24 inches, Framed', price: '₹6,750', status: 'Delivered', date: 'Jan 27', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=120&h=120&fit=crop' },
            { id: 'OD1004', name: 'Digital Art Print - Cosmic Dreams Collection', variant: 'Size: A3, Premium Matte Paper', price: '₹2,499', status: 'On the way', date: 'Feb 25', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=120&h=120&fit=crop' },
            { id: 'OD1005', name: 'Handcrafted Ceramic Vase - Ocean Blue', variant: 'Color: Ocean Blue, Height: 12 inches', price: '₹3,200', status: 'Delivered', date: 'Jan 18', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=120&h=120&fit=crop' },
            { id: 'OD1006', name: 'Traditional Madhubani Painting', variant: 'Size: 16x20 inches, Unframed', price: '₹4,500', status: 'Cancelled', date: 'Jan 10', img: 'https://images.unsplash.com/photo-1582738412874-7acf55854e53?w=120&h=120&fit=crop' }
        ];

        return (
            <>
                {/* Breadcrumb */}
                <div className="vp-orders-breadcrumb">
                    <span>Home</span> › <span>My Account</span> › <span className="vp-orders-breadcrumb--active">My Orders</span>
                </div>

                {/* Search Bar */}
                <div className="vp-orders-search">
                    <input type="text" className="vp-input vp-orders-search__input" placeholder="Search your orders here" />
                    <button className="vp-orders-search__btn">🔍 Search Orders</button>
                </div>

                {/* Filters + Orders Layout */}
                <div className="vp-orders-layout">
                    {/* Filters */}
                    <aside className="vp-orders-filters">
                        <h3 className="vp-orders-filters__title">Filters</h3>

                        <div className="vp-orders-filter-group">
                            <h4 className="vp-orders-filter-group__title">ORDER STATUS</h4>
                            {['On the way', 'Delivered', 'Cancelled', 'Returned'].map(s => (
                                <label key={s} className="vp-orders-filter-check">
                                    <input type="checkbox" />
                                    <span>{s}</span>
                                </label>
                            ))}
                        </div>

                        <div className="vp-orders-filter-group">
                            <h4 className="vp-orders-filter-group__title">ORDER TIME</h4>
                            {['Last 30 days', '2024', '2023', 'Older'].map(t => (
                                <label key={t} className="vp-orders-filter-check">
                                    <input type="checkbox" />
                                    <span>{t}</span>
                                </label>
                            ))}
                        </div>
                    </aside>

                    {/* Order List */}
                    <div className="vp-orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="vp-order-card">
                                <img src={order.img} alt={order.name} className="vp-order-card__img" />
                                <div className="vp-order-card__info">
                                    <span className="vp-order-card__name">{order.name}</span>
                                    <span className="vp-order-card__variant">{order.variant}</span>
                                </div>
                                <span className="vp-order-card__price">{order.price}</span>
                                <div className="vp-order-card__status">
                                    <span className={`vp-order-status-dot vp-order-status-dot--${order.status === 'Delivered' ? 'delivered' : order.status === 'On the way' ? 'transit' : 'cancelled'}`} />
                                    <div className="vp-order-card__status-text">
                                        <span className="vp-order-card__status-title">
                                            {order.status === 'Delivered' ? `Delivered on ${order.date}` : order.status === 'On the way' ? `Expected by ${order.date}` : `Cancelled on ${order.date}`}
                                        </span>
                                        <span className="vp-order-card__status-desc">
                                            {order.status === 'Delivered' ? 'Your item has been delivered' : order.status === 'On the way' ? 'Your item is on the way' : 'Your order has been cancelled'}
                                        </span>
                                    </div>
                                </div>
                                {order.status === 'Delivered' && (
                                    <a href="#" className="vp-order-card__review">★ Rate & Review Product</a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    /* ── RENDER: My Reviews & Ratings ── */
    const renderReviews = () => {
        const reviews = [
            { id: 1, product: 'Abstract Harmony - Oil on Canvas', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=80&h=80&fit=crop', rating: 5, date: 'Feb 16, 2026', text: 'Absolutely stunning piece! The colors are vibrant and the texture is incredible. It looks even better in person than in the photos.', helpful: 12 },
            { id: 2, product: 'Bronze Dancing Nataraja Sculpture', img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=80&h=80&fit=crop', rating: 4, date: 'Feb 11, 2026', text: 'Beautiful craftsmanship and great attention to detail. The antique finish gives it a premium look. Slightly smaller than expected.', helpful: 8 },
            { id: 3, product: 'Watercolor Landscape - Misty Mountains', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=80&h=80&fit=crop', rating: 5, date: 'Jan 28, 2026', text: 'The misty effect in this watercolor is breathtaking. Perfect for my living room. The framing quality is also excellent.', helpful: 15 },
            { id: 4, product: 'Handcrafted Ceramic Vase - Ocean Blue', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&h=80&fit=crop', rating: 4, date: 'Jan 20, 2026', text: 'Lovely ocean blue color and smooth finish. Great addition to my art collection. Packaging was very secure.', helpful: 6 }
        ];

        return (
            <>
                <div className="vp-form-section">
                    <h2 className="vp-addresses-title">My Reviews & Ratings</h2>
                </div>
                <div className="vp-address-list">
                    {reviews.map(r => (
                        <div key={r.id} className="vp-review-card">
                            <img src={r.img} alt={r.product} className="vp-review-card__img" />
                            <div className="vp-review-card__content">
                                <span className="vp-review-card__product">{r.product}</span>
                                <div className="vp-review-card__rating-row">
                                    <span className="vp-review-card__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    <span className="vp-review-card__date">{r.date}</span>
                                </div>
                                <p className="vp-review-card__text">{r.text}</p>
                                <span className="vp-review-card__helpful">👍 {r.helpful} people found this helpful</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    /* ── RENDER: All Notifications ── */
    const renderNotifications = () => {
        const notifications = [
            { id: 1, type: 'order', title: 'Order Delivered', desc: 'Your order "Abstract Harmony - Oil on Canvas" has been delivered successfully.', time: '2 hours ago', read: false },
            { id: 2, type: 'exhibition', title: 'New Exhibition: Modern Impressions', desc: 'A new exhibition featuring contemporary impressionist artworks is now live. Explore 50+ new pieces!', time: '5 hours ago', read: false },
            { id: 3, type: 'pricedrop', title: 'Price Drop Alert!', desc: '"Sunset over Ganges" by Rajesh Kumar is now ₹3,500 (was ₹5,000). Limited time offer!', time: '1 day ago', read: true },
            { id: 4, type: 'tour', title: 'Virtual Tour: Renaissance Masterpieces', desc: 'Join us for a guided virtual tour through Renaissance masterpieces this Saturday at 4 PM IST.', time: '2 days ago', read: true },
            { id: 5, type: 'order', title: 'Order Shipped', desc: 'Your order "Digital Art Print - Cosmic Dreams" has been shipped and is on its way!', time: '3 days ago', read: true },
            { id: 6, type: 'pricedrop', title: 'Wishlist Item on Sale!', desc: '"Ceramic Goddess Sculpture" from your wishlist is now 20% off. Don\'t miss out!', time: '4 days ago', read: true },
            { id: 7, type: 'exhibition', title: 'Exhibition Ending Soon', desc: '"Colors of India" exhibition ends in 3 days. Visit now to see 100+ traditional artworks.', time: '5 days ago', read: true },
            { id: 8, type: 'order', title: 'Refund Processed', desc: 'Your refund for "Traditional Madhubani Painting" (₹4,500) has been processed successfully.', time: '1 week ago', read: true }
        ];

        const typeIcons = { order: '📦', exhibition: '🎨', pricedrop: '💰', tour: '🏛️' };

        return (
            <>
                <div className="vp-form-section">
                    <div className="vp-gc-header">
                        <h2>All Notifications</h2>
                        <button className="vp-gc-add-another" style={{ padding: 0 }}>Mark all as read</button>
                    </div>
                </div>
                <div className="vp-address-list">
                    {notifications.map(n => (
                        <div key={n.id} className={`vp-notif-card ${!n.read ? 'vp-notif-card--unread' : ''}`}>
                            <span className="vp-notif-card__icon">{typeIcons[n.type]}</span>
                            <div className="vp-notif-card__content">
                                <span className="vp-notif-card__title">{n.title}</span>
                                <p className="vp-notif-card__desc">{n.desc}</p>
                            </div>
                            <span className="vp-notif-card__time">{n.time}</span>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    /* ── RENDER: My Wishlist ── */
    const renderWishlist = () => {
        const wishlistItems = [
            { id: 1, name: 'Sunset over Ganges', artist: 'Rajesh Kumar', price: '₹5,000', img: 'https://images.unsplash.com/photo-1578301978693-85fa9fd0c5c9?w=120&h=120&fit=crop' },
            { id: 2, name: 'Ceramic Goddess Sculpture', artist: 'Meera Patel', price: '₹7,800', img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=120&h=120&fit=crop' },
            { id: 3, name: 'Digital Dreams - Neon City', artist: 'Arjun Reddy', price: '₹2,200', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=120&h=120&fit=crop' },
            { id: 4, name: 'Hand-Painted Silk Saree Art', artist: 'Lakshmi Devi', price: '₹15,000', img: 'https://images.unsplash.com/photo-1582738412874-7acf55854e53?w=120&h=120&fit=crop' },
            { id: 5, name: 'Marble Inlay Decorative Plate', artist: 'Ahmed Khan', price: '₹4,500', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=120&h=120&fit=crop' }
        ];

        return (
            <>
                <div className="vp-form-section">
                    <div className="vp-gc-header">
                        <h2>My Wishlist ({wishlistItems.length})</h2>
                    </div>
                </div>
                <div className="vp-address-list">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="vp-wishlist-card">
                            <img src={item.img} alt={item.name} className="vp-order-card__img" />
                            <div className="vp-wishlist-card__info">
                                <span className="vp-order-card__name">{item.name}</span>
                                <span className="vp-order-card__variant">by {item.artist}</span>
                                <span className="vp-wishlist-card__price">{item.price}</span>
                            </div>
                            <div className="vp-wishlist-card__actions">
                                <button className="vp-wishlist-card__cart-btn">Add to Cart</button>
                                <button className="vp-upi-delete-btn"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'profile': return renderProfile();
            case 'addresses': return renderAddresses();
            case 'pan': return renderPanCard();
            case 'giftcards': return renderGiftCards();
            case 'upi': return renderSavedUPI();
            case 'cards': return renderSavedCards();
            case 'coupons': return renderCoupons();
            case 'orders': return renderOrders();
            case 'reviews': return renderReviews();
            case 'notifications': return renderNotifications();
            case 'wishlist': return renderWishlist();
            default: return renderProfile();
        }
    };

    return (
        <div className="dashboard">
            <motion.div
                className="vp-layout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* ── Sidebar ── */}
                <aside className="vp-sidebar">
                    {/* User Greeting */}
                    <div className="vp-sidebar__greeting">
                        <img src={user?.avatar} alt={user?.name} className="vp-sidebar__avatar" />
                        <div>
                            <span className="vp-sidebar__hello">Hello,</span>
                            <h3 className="vp-sidebar__name">{user?.name}</h3>
                        </div>
                    </div>

                    {/* Sidebar Sections */}
                    <nav className="vp-sidebar__nav">
                        {sidebarSections.map(section => (
                            <div key={section.title} className="vp-sidebar__section">
                                <div
                                    className="vp-sidebar__section-header"
                                    onClick={section.items.length === 1 ? () => setActiveSection(section.items[0].section) : undefined}
                                    style={section.items.length === 1 ? { cursor: 'pointer' } : {}}
                                >
                                    <section.icon size={18} />
                                    <span>{section.title}</span>
                                    {section.items.length === 1 && <ChevronRight size={16} />}
                                </div>
                                {section.items.length > 1 && (
                                    <div className="vp-sidebar__items">
                                        {section.items.map(item => (
                                            <button
                                                key={item.label}
                                                onClick={() => setActiveSection(item.section)}
                                                className={`vp-sidebar__item ${activeSection === item.section ? 'vp-sidebar__item--active' : ''}`}
                                            >
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <span className="vp-sidebar__badge">{item.badge}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="vp-sidebar__section vp-sidebar__logout-section">
                        <button className="vp-sidebar__logout-btn" onClick={handleLogout}>
                            <Power size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Frequently Visited */}
                    <div className="vp-sidebar__frequently">
                        <span className="vp-sidebar__frequently-title">Frequently Visited:</span>
                        <div className="vp-sidebar__frequently-links">
                            <Link to="/dashboard/visitor">Track Order</Link>
                            <Link to="/dashboard/visitor">Help Center</Link>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="vp-content">
                    {renderContent()}
                </main>
            </motion.div>
        </div>
    );
}
