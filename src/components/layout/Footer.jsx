import { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    User,
    Palette,
    Users,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { userService } from '../../services/api';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [subName, setSubName] = useState('');
    const [subEmail, setSubEmail] = useState('');
    const [subRole, setSubRole] = useState('artist');
    const [subGender, setSubGender] = useState('');
    const [subLoading, setSubLoading] = useState(false);
    const [subStatus, setSubStatus] = useState(null); // { type: 'success'|'error', msg: '' }

    const footerLinks = {
        explore: [
            { label: 'Gallery', path: '/gallery' },
            { label: 'Exhibitions', path: '/exhibitions' },
            { label: 'Virtual Tours', path: '/virtual-tour' },
        ],
        information: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'FAQ', path: '/faq' },
            { label: 'Terms of Service', path: '/terms' },
            { label: 'Privacy Policy', path: '/privacy' },
        ],
        artists: [
            { label: 'Submit Artwork', path: '/signup' },
            { label: 'Artist Guidelines', path: '/artists/guidelines' },
            { label: 'Success Stories', path: '/artists/stories' },
            { label: 'Resources', path: '/artists/resources' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', url: '#' },
        { icon: Twitter, label: 'Twitter', url: '#' },
        { icon: Instagram, label: 'Instagram', url: '#' },
        { icon: Youtube, label: 'YouTube', url: '#' },
    ];

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subEmail.trim() || !subName.trim()) {
            setSubStatus({ type: 'error', msg: 'Please fill in your name and email.' });
            return;
        }

        setSubLoading(true);
        setSubStatus(null);

        try {
            const result = await userService.subscribe({
                name: subName,
                email: subEmail,
                role: subRole,
                gender: subGender
            });

            if (result.success) {
                setSubStatus({ type: 'success', msg: result.message || 'Request submitted! We\'ll review and get back to you.' });
                setSubName('');
                setSubEmail('');
                setSubRole('artist');
                setSubGender('');
            } else {
                setSubStatus({ type: 'error', msg: result.error || 'Something went wrong.' });
            }
        } catch {
            setSubStatus({ type: 'error', msg: 'Server error. Please try again later.' });
        }

        setSubLoading(false);
    };

    return (
        <footer className="footer">
            {/* Subscribe / Access Request Section */}
            <div className="footer__newsletter">
                <div className="footer__newsletter-container">
                    <motion.div
                        className="footer__newsletter-content"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="footer__newsletter-title">
                            Stay Connected with Art
                        </h3>
                        <p className="footer__newsletter-text">
                            Want to join as an <strong>Artist</strong> or <strong>Curator</strong>? Submit your request below and our team will review your application.
                        </p>
                    </motion.div>
                    <motion.form
                        className="footer__subscribe-form"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubscribe}
                    >
                        <div className="footer__subscribe-row">
                            <div className="footer__subscribe-field">
                                <User size={16} />
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={subName}
                                    onChange={(e) => setSubName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="footer__subscribe-field">
                                <Mail size={16} />
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={subEmail}
                                    onChange={(e) => setSubEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="footer__subscribe-row">
                            <div className="footer__subscribe-field footer__subscribe-select">
                                <Palette size={16} />
                                <select
                                    value={subRole}
                                    onChange={(e) => setSubRole(e.target.value)}
                                >
                                    <option value="artist">Artist</option>
                                    <option value="curator">Curator</option>
                                </select>
                            </div>
                            <div className="footer__subscribe-field footer__subscribe-select">
                                <Users size={16} />
                                <select
                                    value={subGender}
                                    onChange={(e) => setSubGender(e.target.value)}
                                >
                                    <option value="">Gender (optional)</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                            <button type="submit" className="footer__newsletter-btn" disabled={subLoading}>
                                {subLoading ? 'Submitting...' : 'Subscribe'}
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {subStatus && (
                            <div className={`footer__subscribe-status footer__subscribe-status--${subStatus.type}`}>
                                {subStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                {subStatus.msg}
                            </div>
                        )}
                    </motion.form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer__main">
                <div className="footer__container">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-text">ARTIUM</span>
                            <span className="footer__logo-tagline">Virtual Gallery</span>
                        </Link>
                        <p className="footer__description">
                            Where art meets culture in a living digital gallery. Experience masterpieces
                            from around the world, connect with artists, and own unique pieces.
                        </p>
                        <div className="footer__social">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    className="footer__social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="footer__links">
                        <div className="footer__links-column">
                            <h4 className="footer__links-title">Explore</h4>
                            <ul className="footer__links-list">
                                {footerLinks.explore.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.path} className="footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer__links-column">
                            <h4 className="footer__links-title">Information</h4>
                            <ul className="footer__links-list">
                                {footerLinks.information.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.path} className="footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer__links-column">
                            <h4 className="footer__links-title">For Artists</h4>
                            <ul className="footer__links-list">
                                {footerLinks.artists.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.path} className="footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="footer__contact">
                        <h4 className="footer__links-title">Contact Us</h4>

                        {/* Address */}
                        <div className="footer__contact-item">
                            <MapPin size={18} />
                            <span>KL University<br />Vaddeswaram, Guntur, AP</span>
                        </div>

                        {/* Phone */}
                        <div className="footer__contact-item">
                            <Phone size={18} />
                            <a href="tel:+919143995577" className="footer__contact-link">
                                91439 95577
                            </a>
                        </div>

                        {/* Gallery email */}
                        <div className="footer__contact-item">
                            <Mail size={18} />
                            <a href="mailto:artiumvirtualgallery@gmail.com" className="footer__contact-link">
                                artiumvirtualgallery@gmail.com
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="footer__container footer__bottom-content">
                    <p className="footer__copyright">
                        © {currentYear} ARTIUM Virtual Gallery. All rights reserved.
                    </p>
                    <div className="footer__bottom-links">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
