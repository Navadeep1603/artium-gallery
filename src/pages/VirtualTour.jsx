import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
    Play, Pause, Volume2, VolumeX, Maximize, Minimize, Maximize2, Minimize2,
    ChevronLeft, ChevronRight, Info, Eye, Camera, Map, Navigation,
    X, ArrowLeft, Heart, Share2, Compass, Sparkles, Users, Headphones, Clock, Layers
} from 'lucide-react';
import { tourThemes } from '../data/mockData';
import './VirtualTour.css';

// ============================================
// ANIMATED BACKGROUND COMPONENTS
// ============================================

function FloatingParticles({ count = 30 }) {
    return (
        <div className="vt-particles">
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    className="vt-particle"
                    style={{
                        '--x': `${Math.random() * 100}%`,
                        '--y': `${Math.random() * 100}%`,
                        '--duration': `${15 + Math.random() * 20}s`,
                        '--delay': `${Math.random() * -20}s`,
                        '--size': `${2 + Math.random() * 4}px`,
                        '--opacity': `${0.2 + Math.random() * 0.5}`,
                    }}
                />
            ))}
        </div>
    );
}

function GlowOrbs() {
    return (
        <div className="vt-glow-orbs">
            <div className="vt-glow-orb vt-glow-orb--1" />
            <div className="vt-glow-orb vt-glow-orb--2" />
            <div className="vt-glow-orb vt-glow-orb--3" />
        </div>
    );
}

// ============================================
// TOUR MODE CARD
// ============================================

function TourModeCard({ mode, isSelected, onClick, index }) {
    const IconComponent = mode.icon;

    return (
        <motion.div
            className={`vt-mode-card ${isSelected ? 'vt-mode-card--selected' : ''}`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClick}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            layout
        >
            <div className="vt-mode-card__glow" />
            <div className="vt-mode-card__icon">
                <IconComponent size={28} />
            </div>
            <h3 className="vt-mode-card__title">{mode.title}</h3>
            <p className="vt-mode-card__desc">{mode.description}</p>
            <div className="vt-mode-card__features">
                {mode.features.map((f, i) => (
                    <span key={i} className="vt-mode-card__tag">{f}</span>
                ))}
            </div>
            {isSelected && (
                <motion.div
                    className="vt-mode-card__check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                >
                    <Star size={16} />
                </motion.div>
            )}
        </motion.div>
    );
}

// ============================================
// THEME SELECTOR CARD
// ============================================

function ThemeCard({ theme, isSelected, onClick, index }) {
    return (
        <motion.div
            className={`vt-theme-card ${isSelected ? 'vt-theme-card--selected' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            onClick={onClick}
            whileHover={{ scale: 1.03 }}
        >
            <div className="vt-theme-card__img-wrap">
                <img src={theme.image} alt={theme.name} className="vt-theme-card__img" />
                <div className="vt-theme-card__img-overlay" />
            </div>
            <div className="vt-theme-card__body">
                <h4 className="vt-theme-card__name">{theme.name}</h4>
                <div className="vt-theme-card__meta">
                    <span><Clock size={12} /> {theme.duration}</span>
                    <span><Layers size={12} /> {theme.artworkCount} works</span>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// ARTWORK VIEWER SLIDE
// ============================================

function ArtworkSlide({ artwork, isActive, direction }) {
    return (
        <motion.div
            className="vt-slide"
            initial={{
                opacity: 0,
                scale: 1.1,
                x: direction > 0 ? 100 : -100,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                x: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.95,
                x: direction > 0 ? -100 : 100,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="vt-slide__image-container">
                <motion.img
                    src={artwork.image}
                    alt={artwork.title}
                    className="vt-slide__image"
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'linear' }}
                    draggable={false}
                />
                <div className="vt-slide__vignette" />
            </div>
        </motion.div>
    );
}

// ============================================
// ARTWORK INFO PANEL
// ============================================

function ArtworkInfoPanel({ artwork, isVisible, onClose }) {
    if (!artwork) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="vt-info-panel"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <button className="vt-info-panel__close" onClick={onClose}>
                        <X size={18} />
                    </button>

                    <div className="vt-info-panel__header">
                        <span className="vt-info-panel__category">{artwork.category}</span>
                        <span className="vt-info-panel__year">{artwork.year}</span>
                    </div>

                    <h2 className="vt-info-panel__title">{artwork.title}</h2>
                    <p className="vt-info-panel__artist">
                        <span className="vt-info-panel__artist-label">by</span> {artwork.artist}
                    </p>

                    <div className="vt-info-panel__divider" />

                    <p className="vt-info-panel__desc">{artwork.description}</p>

                    {artwork.culturalHistory && (
                        <div className="vt-info-panel__cultural">
                            <h4>Cultural Context</h4>
                            <p>{artwork.culturalHistory}</p>
                        </div>
                    )}

                    <div className="vt-info-panel__details">
                        <div className="vt-info-panel__detail">
                            <span className="vt-info-panel__detail-label">Medium</span>
                            <span className="vt-info-panel__detail-value">{artwork.medium}</span>
                        </div>
                        <div className="vt-info-panel__detail">
                            <span className="vt-info-panel__detail-label">Style</span>
                            <span className="vt-info-panel__detail-value">{artwork.style}</span>
                        </div>
                        <div className="vt-info-panel__detail">
                            <span className="vt-info-panel__detail-label">Origin</span>
                            <span className="vt-info-panel__detail-value">{artwork.origin}</span>
                        </div>
                        <div className="vt-info-panel__detail">
                            <span className="vt-info-panel__detail-label">Dimensions</span>
                            <span className="vt-info-panel__detail-value">{artwork.dimensions}</span>
                        </div>
                    </div>

                    <div className="vt-info-panel__stats">
                        <span><Eye size={14} /> {artwork.views?.toLocaleString()}</span>
                        <span><Heart size={14} /> {artwork.likes?.toLocaleString()}</span>
                    </div>

                    <div className="vt-info-panel__actions">
                        <Link to={`/artwork/${artwork.id}`} className="vt-info-panel__btn vt-info-panel__btn--primary">
                            View Full Details
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ============================================
// NAVIGATION MINIMAP
// ============================================

function NavigationMinimap({ artworks, currentIndex, onSelect }) {
    const minimapRef = useRef(null);

    useEffect(() => {
        if (minimapRef.current) {
            const activeThumb = minimapRef.current.querySelector('.vt-minimap__item--active');
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentIndex]);

    return (
        <motion.div
            className="vt-minimap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className="vt-minimap__track" ref={minimapRef}>
                {artworks.map((artwork, i) => (
                    <button
                        key={artwork.id}
                        className={`vt-minimap__item ${i === currentIndex ? 'vt-minimap__item--active' : ''} ${i < currentIndex ? 'vt-minimap__item--visited' : ''}`}
                        onClick={() => onSelect(i)}
                        title={artwork.title}
                    >
                        <img src={artwork.thumbnail || artwork.image} alt="" className="vt-minimap__thumb" />
                        <div className="vt-minimap__item-overlay" />
                        {i === currentIndex && <div className="vt-minimap__item-ring" />}
                    </button>
                ))}
            </div>
            <div className="vt-minimap__progress">
                <div
                    className="vt-minimap__progress-fill"
                    style={{ width: `${((currentIndex + 1) / artworks.length) * 100}%` }}
                />
            </div>
        </motion.div>
    );
}

// ============================================
// LOADING SCREEN
// ============================================

function LoadingScreen({ progress }) {
    return (
        <motion.div
            className="vt-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <GlowOrbs />
            <div className="vt-loading__content">
                <motion.div
                    className="vt-loading__icon"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <Compass size={48} />
                </motion.div>
                <h3 className="vt-loading__title">Preparing Your Experience</h3>
                <p className="vt-loading__subtitle">Curating the perfect gallery for you...</p>
                <div className="vt-loading__bar">
                    <motion.div
                        className="vt-loading__bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="vt-loading__percent">{Math.round(progress)}%</span>
            </div>
        </motion.div>
    );
}

// ============================================
// MAIN VIRTUAL TOUR COMPONENT
// ============================================

export default function VirtualTour() {
    // State
    const [tourMode, setTourMode] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [phase, setPhase] = useState('landing'); // 'landing' | 'loading' | 'tour'
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Tour experience state
    const [currentArtwork, setCurrentArtwork] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [liked, setLiked] = useState(new Set());

    // Refs
    const tourContainerRef = useRef(null);
    const uiTimeoutRef = useRef(null);
    const autoPlayRef = useRef(null);

    // Tour artworks
    const tourArtworks = artworks.slice(0, 9);
    const currentArtworkData = tourArtworks[currentArtwork];

    // Tour modes configuration
    const tourModes = [
        {
            id: 'guided',
            title: 'Guided Tour',
            description: 'Let our AI guide walk you through the gallery with curated narration.',
            icon: Headphones,
            features: ['AI Narration', 'Auto-Walk', 'Spotlight Focus']
        },
        {
            id: 'freeWalk',
            title: 'Free Exploration',
            description: 'Explore at your own pace with full freedom to browse artworks.',
            icon: Navigation,
            features: ['Self-Paced', 'Free Browse', 'No Limits']
        },
        {
            id: 'curator',
            title: 'Curator\'s Pick',
            description: 'Experience themed exhibitions curated by world-class art experts.',
            icon: Users,
            features: ['Expert Picks', 'Themed Path', 'Deep Insights']
        }
    ];

    // ---- HANDLERS ----

    const startTour = useCallback(() => {
        if (!tourMode) return;
        setPhase('loading');
        setLoadingProgress(0);

        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setPhase('tour');
                        setIsPlaying(tourMode === 'guided');
                    }, 400);
                    return 100;
                }
                return prev + Math.random() * 15 + 5;
            });
        }, 200);
    }, [tourMode]);

    const exitTour = useCallback(() => {
        setPhase('landing');
        setTourMode(null);
        setSelectedTheme(null);
        setCurrentArtwork(0);
        setDirection(1);
        setIsPlaying(false);
        setShowInfo(false);
        setIsZoomed(false);
    }, []);

    const goToArtwork = useCallback((index) => {
        if (index === currentArtwork) return;
        setDirection(index > currentArtwork ? 1 : -1);
        setCurrentArtwork(index);
        setIsZoomed(false);
    }, [currentArtwork]);

    const nextArtwork = useCallback(() => {
        if (currentArtwork < tourArtworks.length - 1) {
            setDirection(1);
            setCurrentArtwork(prev => prev + 1);
            setIsZoomed(false);
        }
    }, [currentArtwork, tourArtworks.length]);

    const prevArtwork = useCallback(() => {
        if (currentArtwork > 0) {
            setDirection(-1);
            setCurrentArtwork(prev => prev - 1);
            setIsZoomed(false);
        }
    }, [currentArtwork]);

    const toggleLike = useCallback(() => {
        setLiked(prev => {
            const next = new Set(prev);
            const id = tourArtworks[currentArtwork]?.id;
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, [currentArtwork, tourArtworks]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            tourContainerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // Auto-play for guided tour
    useEffect(() => {
        if (phase === 'tour' && isPlaying && !showInfo) {
            autoPlayRef.current = setTimeout(() => {
                if (currentArtwork < tourArtworks.length - 1) {
                    nextArtwork();
                } else {
                    setIsPlaying(false);
                }
            }, 6000);
            return () => clearTimeout(autoPlayRef.current);
        }
    }, [phase, isPlaying, currentArtwork, tourArtworks.length, nextArtwork, showInfo]);

    // UI auto-hide during tour
    useEffect(() => {
        if (phase !== 'tour') return;

        const handleMouseMove = () => {
            setShowUI(true);
            clearTimeout(uiTimeoutRef.current);
            uiTimeoutRef.current = setTimeout(() => setShowUI(false), 4000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(uiTimeoutRef.current);
        };
    }, [phase]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (phase !== 'tour') return;
            switch (e.key) {
                case 'ArrowRight': case 'd': case 'D': nextArtwork(); break;
                case 'ArrowLeft': case 'a': case 'A': prevArtwork(); break;
                case ' ':
                    e.preventDefault();
                    setIsPlaying(p => !p);
                    break;
                case 'Escape':
                    if (showInfo) setShowInfo(false);
                    else if (isZoomed) setIsZoomed(false);
                    else exitTour();
                    break;
                case 'i': case 'I': setShowInfo(p => !p); break;
                case 'f': case 'F': toggleFullscreen(); break;
                case 'l': case 'L': toggleLike(); break;
                case 'm': case 'M': setIsMuted(p => !p); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [phase, nextArtwork, prevArtwork, exitTour, showInfo, isZoomed, toggleFullscreen, toggleLike]);

    // ---- RENDER ----

    return (
        <div className="vt-page" ref={tourContainerRef}>
            <AnimatePresence mode="wait">

                {/* ========================= LANDING PHASE ========================= */}
                {phase === 'landing' && (
                    <motion.div
                        className="vt-landing"
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="vt-landing__bg" />
                        <FloatingParticles count={40} />
                        <GlowOrbs />

                        <div className="vt-landing__content">
                            {/* Hero */}
                            <motion.div
                                className="vt-landing__hero"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <motion.div
                                    className="vt-landing__eyebrow"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    <Sparkles size={16} />
                                    <span>Immersive Art Experience</span>
                                </motion.div>

                                <motion.h1
                                    className="vt-landing__title"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                    Virtual <span className="vt-landing__title-accent">Gallery</span> Tour
                                </motion.h1>

                                <motion.p
                                    className="vt-landing__subtitle"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    Step into a world-class gallery from anywhere. Explore masterpieces,
                                    hear artist stories, and experience art like never before.
                                </motion.p>

                                {/* Stats Row */}
                                <motion.div
                                    className="vt-landing__stats"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <div className="vt-landing__stat">
                                        <span className="vt-landing__stat-num">9</span>
                                        <span className="vt-landing__stat-label">Artworks</span>
                                    </div>
                                    <div className="vt-landing__stat-divider" />
                                    <div className="vt-landing__stat">
                                        <span className="vt-landing__stat-num">4</span>
                                        <span className="vt-landing__stat-label">Themes</span>
                                    </div>
                                    <div className="vt-landing__stat-divider" />
                                    <div className="vt-landing__stat">
                                        <span className="vt-landing__stat-num">3</span>
                                        <span className="vt-landing__stat-label">Tour Modes</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Tour Mode Selection */}
                            <div className="vt-landing__section">
                                <motion.h2
                                    className="vt-landing__section-title"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    Choose Your Experience
                                </motion.h2>
                                <div className="vt-landing__modes">
                                    {tourModes.map((mode, i) => (
                                        <TourModeCard
                                            key={mode.id}
                                            mode={mode}
                                            isSelected={tourMode === mode.id}
                                            onClick={() => setTourMode(mode.id)}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <AnimatePresence>
                                {tourMode && (
                                    <motion.div
                                        className="vt-landing__section"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <h2 className="vt-landing__section-title">Select a Theme</h2>
                                        <div className="vt-landing__themes">
                                            {tourThemes.map((theme, i) => (
                                                <ThemeCard
                                                    key={theme.id}
                                                    theme={theme}
                                                    isSelected={selectedTheme === theme.id}
                                                    onClick={() => setSelectedTheme(theme.id)}
                                                    index={i}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Start Button */}
                            <AnimatePresence>
                                {tourMode && (
                                    <motion.div
                                        className="vt-landing__start"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <motion.button
                                            className="vt-start-btn"
                                            onClick={startTour}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Play size={22} />
                                            <span>Begin Tour</span>
                                            <ArrowRight size={18} />
                                        </motion.button>
                                        <p className="vt-landing__hint">
                                            Press <kbd>Space</kbd> to play/pause · <kbd>←</kbd><kbd>→</kbd> to navigate · <kbd>Esc</kbd> to exit
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* ========================= LOADING PHASE ========================= */}
                {phase === 'loading' && (
                    <LoadingScreen key="loading" progress={loadingProgress} />
                )}

                {/* ========================= TOUR PHASE ========================= */}
                {phase === 'tour' && (
                    <motion.div
                        className={`vt-experience ${isZoomed ? 'vt-experience--zoomed' : ''}`}
                        key="tour"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Artwork Display */}
                        <div className="vt-canvas">
                            <AnimatePresence mode="wait" custom={direction}>
                                <ArtworkSlide
                                    key={currentArtwork}
                                    artwork={currentArtworkData}
                                    isActive={true}
                                    direction={direction}
                                />
                            </AnimatePresence>

                            {/* Ambient overlay */}
                            <div className="vt-canvas__ambient" />
                        </div>

                        {/* Top Bar */}
                        <motion.div
                            className={`vt-topbar ${showUI ? '' : 'vt-topbar--hidden'}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: showUI ? 1 : 0, y: showUI ? 0 : -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button className="vt-topbar__back" onClick={exitTour}>
                                <X size={20} />
                                <span>Exit Tour</span>
                            </button>

                            <div className="vt-topbar__center">
                                <span className="vt-topbar__counter">
                                    {currentArtwork + 1} / {tourArtworks.length}
                                </span>
                                {isPlaying && (
                                    <motion.span
                                        className="vt-topbar__playing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <span className="vt-topbar__dot" /> Auto-Playing
                                    </motion.span>
                                )}
                            </div>

                            <div className="vt-topbar__actions">
                                <button
                                    className={`vt-icon-btn ${liked.has(currentArtworkData?.id) ? 'vt-icon-btn--liked' : ''}`}
                                    onClick={toggleLike}
                                    title="Like"
                                >
                                    <Heart size={18} fill={liked.has(currentArtworkData?.id) ? 'currentColor' : 'none'} />
                                </button>
                                <button className="vt-icon-btn" onClick={() => setShowInfo(p => !p)} title="Info">
                                    <Info size={18} />
                                </button>
                                <button className="vt-icon-btn" onClick={() => setIsMuted(p => !p)} title="Sound">
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <button className="vt-icon-btn" onClick={toggleFullscreen} title="Fullscreen">
                                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Side Navigation Arrows */}
                        <motion.div
                            className={`vt-nav ${showUI ? '' : 'vt-nav--hidden'}`}
                            animate={{ opacity: showUI ? 1 : 0 }}
                        >
                            <button
                                className="vt-nav__arrow vt-nav__arrow--prev"
                                onClick={prevArtwork}
                                disabled={currentArtwork === 0}
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                className="vt-nav__arrow vt-nav__arrow--next"
                                onClick={nextArtwork}
                                disabled={currentArtwork === tourArtworks.length - 1}
                            >
                                <ChevronRight size={28} />
                            </button>
                        </motion.div>

                        {/* Bottom Artwork Title Overlay */}
                        <motion.div
                            className={`vt-artwork-title ${showUI ? '' : 'vt-artwork-title--hidden'}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: showUI ? 1 : 0, y: showUI ? 0 : 30 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="vt-artwork-title__name">{currentArtworkData?.title}</h2>
                            <p className="vt-artwork-title__artist">
                                {currentArtworkData?.artist} · {currentArtworkData?.year}
                            </p>
                        </motion.div>

                        {/* Playback Controls */}
                        <motion.div
                            className={`vt-controls ${showUI ? '' : 'vt-controls--hidden'}`}
                            animate={{ opacity: showUI ? 1 : 0, y: showUI ? 0 : 20 }}
                        >
                            <div className="vt-controls__group">
                                <button className="vt-controls__btn" onClick={prevArtwork} disabled={currentArtwork === 0}>
                                    <SkipBack size={18} />
                                </button>
                                <button
                                    className="vt-controls__btn vt-controls__btn--play"
                                    onClick={() => setIsPlaying(p => !p)}
                                >
                                    {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                                </button>
                                <button className="vt-controls__btn" onClick={nextArtwork} disabled={currentArtwork === tourArtworks.length - 1}>
                                    <SkipForward size={18} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Navigation Minimap */}
                        <NavigationMinimap
                            artworks={tourArtworks}
                            currentIndex={currentArtwork}
                            onSelect={goToArtwork}
                        />

                        {/* Info Panel */}
                        <ArtworkInfoPanel
                            artwork={currentArtworkData}
                            isVisible={showInfo}
                            onClose={() => setShowInfo(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
