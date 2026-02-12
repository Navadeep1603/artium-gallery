import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Palette, Globe, ShoppingBag } from 'lucide-react';
import { artworks, artists, exhibitions } from '../data/mockData';
import './Home.css';

export default function Home() {
    const heroRef = useRef(null);
    const featuredRef = useRef(null);
    const { scrollYProgress } = useScroll();

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const featuredArtworks = artworks.filter(a => a.featured).slice(0, 6);
    const featuredArtists = artists.filter(a => a.featured).slice(0, 4);
    const currentExhibitions = exhibitions.filter(e => e.status === 'current').slice(0, 2);

    return (
        <div className="home">
            {/* Grain Overlay */}
            <div className="grain-overlay" />

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                className="hero"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                {/* Floating Gallery Lights */}
                <div className="hero__lights">
                    <div className="hero__light hero__light--1" />
                    <div className="hero__light hero__light--2" />
                    <div className="hero__light hero__light--3" />
                </div>

                {/* Parallax Background Images */}
                <div className="hero__parallax">
                    <motion.div
                        className="hero__parallax-layer hero__parallax-layer--1"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <motion.div
                        className="hero__parallax-layer hero__parallax-layer--2"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
                    />
                </div>

                {/* Hero Content */}
                <div className="hero__content">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="hero__eyebrow"
                    >
                        <Sparkles size={16} />
                        Welcome to the Future of Art
                    </motion.div>

                    <motion.h1
                        className="hero__title"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    >
                        <span className="hero__title-line">Where Art Meets Culture</span>
                        <span className="hero__title-line hero__title-line--accent">
                            in a Living Digital Gallery
                        </span>
                    </motion.h1>

                    <motion.p
                        className="hero__subtitle"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        Experience masterpieces from around the world. Walk through virtual galleries,
                        connect with artists, and own unique pieces of creativity.
                    </motion.p>

                    <motion.div
                        className="hero__cta"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <Link to="/gallery" className="btn btn-primary btn-lg">
                            Enter the Gallery
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/virtual-tour" className="btn btn-secondary btn-lg">
                            <Play size={20} />
                            Start Virtual Tour
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="hero__stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    >
                        <div className="hero__stat">
                            <span className="hero__stat-number">2,500+</span>
                            <span className="hero__stat-label">Artworks</span>
                        </div>
                        <div className="hero__stat">
                            <span className="hero__stat-number">450+</span>
                            <span className="hero__stat-label">Artists</span>
                        </div>
                        <div className="hero__stat">
                            <span className="hero__stat-number">50+</span>
                            <span className="hero__stat-label">Exhibitions</span>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="hero__scroll"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <span>Scroll to Explore</span>
                    <div className="hero__scroll-line" />
                </motion.div>
            </motion.section>

            {/* Featured Artworks Section */}
            <section className="featured section" ref={featuredRef}>
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-eyebrow">Featured Collection</span>
                        <h2 className="section-title">Masterpieces Await</h2>
                        <p className="section-subtitle">
                            Discover our curated selection of extraordinary artworks from talented artists worldwide.
                        </p>
                    </motion.div>

                    <div className="featured__grid">
                        {featuredArtworks.map((artwork, index) => (
                            <motion.div
                                key={artwork.id}
                                className={`featured__item ${index === 0 ? 'featured__item--large' : ''}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/artwork/${artwork.id}`} className="featured__card">
                                    <div className="featured__image-wrapper">
                                        <img
                                            src={artwork.image}
                                            alt={artwork.title}
                                            className="featured__image"
                                            loading="lazy"
                                        />
                                        <div className="featured__overlay">
                                            <span className="featured__category">{artwork.category}</span>
                                        </div>
                                    </div>
                                    <div className="featured__info">
                                        <h3 className="featured__title">{artwork.title}</h3>
                                        <p className="featured__artist">{artwork.artist}</p>
                                        <div className="featured__meta">
                                            <span className="featured__year">{artwork.year}</span>
                                            <span className="featured__price">
                                                {artwork.currency === 'ETH' ? `Ξ ${artwork.price}` : `$${artwork.price.toLocaleString()}`}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="section-cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/gallery" className="btn btn-ghost">
                            View All Artworks
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-us section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-eyebrow">Why Artium</span>
                        <h2 className="section-title">Experience Art Like Never Before</h2>
                    </motion.div>

                    <div className="why-us__grid">
                        <FeatureCard
                            icon={<Palette size={32} />}
                            title="Curated Excellence"
                            description="Every artwork is carefully selected by our expert curators, ensuring only the finest pieces grace our virtual walls."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Globe size={32} />}
                            title="Global Access"
                            description="Connect with artists and artworks from every corner of the world, breaking down traditional gallery barriers."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Play size={32} />}
                            title="Immersive Tours"
                            description="Experience art in stunning 3D virtual galleries with guided narration and interactive exploration."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<ShoppingBag size={32} />}
                            title="Secure Marketplace"
                            description="Buy and sell artworks with confidence through our secure transaction system and verified artists."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Current Exhibitions */}
            <section className="exhibitions-preview section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-eyebrow">Now Showing</span>
                        <h2 className="section-title">Current Exhibitions</h2>
                    </motion.div>

                    <div className="exhibitions-preview__grid">
                        {currentExhibitions.map((exhibition, index) => (
                            <motion.div
                                key={exhibition.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Link to={`/exhibitions/${exhibition.id}`} className="exhibition-card">
                                    <div className="exhibition-card__image-wrapper">
                                        <img
                                            src={exhibition.image}
                                            alt={exhibition.title}
                                            className="exhibition-card__image"
                                            loading="lazy"
                                        />
                                        <div className="exhibition-card__overlay">
                                            <span className="exhibition-card__status">Now Open</span>
                                        </div>
                                    </div>
                                    <div className="exhibition-card__content">
                                        <span className="exhibition-card__subtitle">{exhibition.subtitle}</span>
                                        <h3 className="exhibition-card__title">{exhibition.title}</h3>
                                        <p className="exhibition-card__description">{exhibition.description}</p>
                                        <div className="exhibition-card__meta">
                                            <span>Curated by {exhibition.curator}</span>
                                            <span>{exhibition.artworkCount} Artworks</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="section-cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/exhibitions" className="btn btn-ghost">
                            View All Exhibitions
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Artists */}
            <section className="artists-preview section">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-eyebrow">Meet the Creators</span>
                        <h2 className="section-title">Featured Artists</h2>
                    </motion.div>

                    <div className="artists-preview__grid">
                        {featuredArtists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/artists/${artist.id}`} className="artist-card">
                                    <div className="artist-card__avatar-wrapper">
                                        <img
                                            src={artist.avatar}
                                            alt={artist.name}
                                            className="artist-card__avatar"
                                        />
                                        <div className="artist-card__glow" />
                                    </div>
                                    <h3 className="artist-card__name">{artist.name}</h3>
                                    <p className="artist-card__specialty">{artist.specialty}</p>
                                    <div className="artist-card__stats">
                                        <span>{artist.artworks} Works</span>
                                        <span>{artist.followers.toLocaleString()} Followers</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="section-cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/artists" className="btn btn-ghost">
                            Discover All Artists
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="cta-banner__bg" />
                <div className="container">
                    <motion.div
                        className="cta-banner__content"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="cta-banner__title">
                            Ready to Start Your Art Journey?
                        </h2>
                        <p className="cta-banner__text">
                            Join thousands of art enthusiasts and collectors. Create your account today
                            and get access to exclusive exhibitions, virtual tours, and more.
                        </p>
                        <div className="cta-banner__buttons">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Join the Gallery
                            </Link>
                            <Link to="/about" className="btn btn-secondary btn-lg">
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay }) {
    return (
        <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <div className="feature-card__icon">
                {icon}
            </div>
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__description">{description}</p>
        </motion.div>
    );
}
