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
    ArrowRight
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

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

    return (
        <footer className="footer">
            {/* Newsletter Section */}
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
                            Subscribe to receive updates on new exhibitions, featured artists, and exclusive offers.
                        </p>
                    </motion.div>
                    <motion.form
                        className="footer__newsletter-form"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="footer__newsletter-input"
                        />
                        <button type="submit" className="footer__newsletter-btn">
                            Subscribe
                            <ArrowRight size={16} />
                        </button>
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
                        <div className="footer__contact-item">
                            <MapPin size={18} />
                            <span>KL University<br />Vaddeswaram, Guntur, AP</span>
                        </div>
                        <div className="footer__contact-item">
                            <Phone size={18} />
                            <span>91439 95577</span>
                        </div>
                        <div className="footer__contact-item">
                            <Mail size={18} />
                            <span>2400030987@kluniversity.in</span>
                        </div>
                        <div className="footer__contact-item">
                            <Mail size={18} />
                            <span>2400030367@kluniversity.in</span>
                        </div>
                        <div className="footer__contact-item">
                            <Mail size={18} />
                            <span>2400030170@kluniversity.in</span>
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
