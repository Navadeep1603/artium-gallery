import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Sun,
    Moon,
    ShoppingCart,
    User,
    Search,
    ChevronDown,
    Package,
    Heart,
    MapPin,
    Bell,
    Gift,
    CreditCard,
    LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setTimeout(() => setIsMobileMenuOpen(false), 0);
    }, [location]);

    const allNavLinks = [
        { path: '/gallery', label: 'Gallery' },
        { path: '/exhibitions', label: 'Exhibitions' },
        { path: '/virtual-tour', label: 'Virtual Tour' },
    ];

    // Hide all public links for artists, admins, and curators
    let navLinks = allNavLinks;
    if (isAuthenticated) {
        if (user?.role === 'artist' || user?.role === 'admin' || user?.role === 'curator') {
            navLinks = [];
        }
    }

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/dashboard/admin';
            case 'artist': return '/dashboard/artist';
            case 'curator': return '/dashboard/curator';
            default: return '/dashboard/visitor/profile';
        }
    };

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="header__container">
                {/* Logo */}
                <Link to="/" className="header__logo">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header__logo-text"
                    >
                        ARTIUM
                    </motion.span>
                    <span className="header__logo-tagline">Virtual Gallery</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header__nav hide-mobile">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.path}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={link.path}
                                className={`header__nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Actions */}
                <div className="header__actions">
                    {/* Search */}
                    <button
                        className="header__action-btn"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Search"
                    >
                        <Search size={20} />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        className="header__action-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.div>
                    </button>

                    {/* Cart */}
                    <Link to="/cart" className="header__action-btn header__cart-btn">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <motion.span
                                className="header__cart-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={cartCount}
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="header__user-menu">
                            <button
                                className="header__user-btn"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="header__user-avatar"
                                />
                                <span className="header__user-name hide-mobile">{user.name.split(' ')[0]}</span>
                                <ChevronDown size={16} className="hide-mobile" />
                            </button>

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {isUserDropdownOpen && (
                                    <motion.div
                                        className="header__user-dropdown"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {user?.role === 'visitor' ? (
                                            <>
                                                <div className="header__dropdown-header">
                                                    Your Account
                                                </div>
                                                <Link
                                                    to="/dashboard/visitor/profile"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <User size={18} />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/visitor/profile?section=orders"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <Package size={18} />
                                                    <span>Orders</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/visitor/profile?section=wishlist"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <Heart size={18} />
                                                    <span>Wishlist</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/visitor/profile?section=cards"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <CreditCard size={18} />
                                                    <span>Saved Cards & Wallet</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/visitor/profile?section=addresses"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <MapPin size={18} />
                                                    <span>Saved Addresses</span>
                                                </Link>
                                                <Link
                                                    to="/dashboard/visitor/profile?section=notifications"
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <Bell size={18} />
                                                    <span>Notifications</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsUserDropdownOpen(false);
                                                        navigate('/');
                                                    }}
                                                    className="header__dropdown-item header__dropdown-logout"
                                                >
                                                    <LogOut size={18} />
                                                    <span>Logout</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to={getDashboardLink()}
                                                    className="header__dropdown-item"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <User size={18} />
                                                    <span>Dashboard</span>
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsUserDropdownOpen(false);
                                                        navigate('/');
                                                    }}
                                                    className="header__dropdown-item header__dropdown-logout"
                                                >
                                                    <LogOut size={18} />
                                                    <span>Logout</span>
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="header__action-btn header__login-btn hide-mobile">
                            <User size={20} />
                            <span>Login</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="header__mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        className="header__search-bar"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="header__search-container">
                            <Search size={20} className="header__search-icon" />
                            <input
                                type="text"
                                placeholder="Search artworks, artists, exhibitions..."
                                className="header__search-input"
                                autoFocus
                            />
                            <button
                                className="header__search-close"
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="header__mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <nav className="header__mobile-nav">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`header__mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="header__mobile-divider" />

                            {isAuthenticated ? (
                                <>
                                    {user?.role === 'visitor' ? (
                                        <Link to="/dashboard/visitor/profile" className="header__mobile-link">
                                            My Profile
                                        </Link>
                                    ) : (
                                        <Link to={getDashboardLink()} className="header__mobile-link">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); navigate('/'); }} className="header__mobile-link header__mobile-logout">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="header__mobile-link">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="header__mobile-link">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
