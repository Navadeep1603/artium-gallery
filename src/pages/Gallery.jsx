import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, X } from 'lucide-react';
import { categories } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useArtworks } from '../context/ArtworkContext';
import ArtworkCard from '../components/gallery/ArtworkCard';
import './Gallery.css';

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedMediums, setSelectedMediums] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const { addToCart } = useCart();
    const { artworks } = useArtworks();

    const handleCheckboxChange = (setter, value) => {
        setter(prev =>
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const filteredArtworks = artworks.filter(artwork => {
        if (activeCategory !== 'all' && artwork.category !== activeCategory) return false;

        if (selectedPriceRanges.length > 0) {
            const matchesPrice = selectedPriceRanges.some(range => {
                if (range === 'under-1k') return artwork.price < 1000;
                if (range === '1k-5k') return artwork.price >= 1000 && artwork.price <= 5000;
                if (range === '5k-10k') return artwork.price > 5000 && artwork.price <= 10000;
                if (range === 'over-10k') return artwork.price > 10000;
                return false;
            });
            if (!matchesPrice) return false;
        }

        if (selectedMediums.length > 0) {
            const matchesMedium = selectedMediums.some(m => artwork.medium.includes(m));
            if (!matchesMedium) return false;
        }

        if (selectedStyles.length > 0) {
            const matchesStyle = selectedStyles.some(s => artwork.style.includes(s));
            if (!matchesStyle) return false;
        }

        return true;
    });

    const sortedArtworks = [...filteredArtworks].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'newest': return b.year - a.year;
            case 'popular': return b.views - a.views;
            default: return b.featured - a.featured;
        }
    });

    return (
        <div className="gallery-page">
            {/* Hero */}
            <section className="gallery-hero">
                <div className="gallery-hero__bg" />
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="gallery-hero__content"
                    >
                        <h1 className="gallery-hero__title">Explore Our Collection</h1>
                        <p className="gallery-hero__subtitle">
                            Discover extraordinary artworks from talented artists around the world
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Controls */}
            <section className="gallery-controls">
                <div className="container">
                    <div className="gallery-controls__wrapper">
                        {/* Categories */}
                        <div className="gallery-categories">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`gallery-category ${activeCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="gallery-actions">
                            <button
                                className="gallery-filter-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Filters
                            </button>

                            <select
                                className="gallery-sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>

                            <div className="gallery-view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        className="filter-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="container">
                            <div className="filter-panel__content">
                                <div className="filter-group">
                                    <h4>Price Range</h4>
                                    <div className="filter-options">
                                        <label><input type="checkbox" checked={selectedPriceRanges.includes('under-1k')} onChange={() => handleCheckboxChange(setSelectedPriceRanges, 'under-1k')} /> Under ₹1,000</label>
                                        <label><input type="checkbox" checked={selectedPriceRanges.includes('1k-5k')} onChange={() => handleCheckboxChange(setSelectedPriceRanges, '1k-5k')} /> ₹1,000 - ₹5,000</label>
                                        <label><input type="checkbox" checked={selectedPriceRanges.includes('5k-10k')} onChange={() => handleCheckboxChange(setSelectedPriceRanges, '5k-10k')} /> ₹5,000 - ₹10,000</label>
                                        <label><input type="checkbox" checked={selectedPriceRanges.includes('over-10k')} onChange={() => handleCheckboxChange(setSelectedPriceRanges, 'over-10k')} /> Over ₹10,000</label>
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h4>Medium</h4>
                                    <div className="filter-options">
                                        <label><input type="checkbox" checked={selectedMediums.includes('Oil')} onChange={() => handleCheckboxChange(setSelectedMediums, 'Oil')} /> Oil on Canvas</label>
                                        <label><input type="checkbox" checked={selectedMediums.includes('Digital')} onChange={() => handleCheckboxChange(setSelectedMediums, 'Digital')} /> Digital Art</label>
                                        <label><input type="checkbox" checked={selectedMediums.includes('Photography')} onChange={() => handleCheckboxChange(setSelectedMediums, 'Photography')} /> Photography</label>
                                        <label><input type="checkbox" checked={selectedMediums.includes('Sculpture')} onChange={() => handleCheckboxChange(setSelectedMediums, 'Sculpture')} /> Sculpture</label>
                                    </div>
                                </div>
                                <div className="filter-group">
                                    <h4>Style</h4>
                                    <div className="filter-options">
                                        <label><input type="checkbox" checked={selectedStyles.includes('Contemporary')} onChange={() => handleCheckboxChange(setSelectedStyles, 'Contemporary')} /> Contemporary</label>
                                        <label><input type="checkbox" checked={selectedStyles.includes('Abstract')} onChange={() => handleCheckboxChange(setSelectedStyles, 'Abstract')} /> Abstract</label>
                                        <label><input type="checkbox" checked={selectedStyles.includes('Impressionism')} onChange={() => handleCheckboxChange(setSelectedStyles, 'Impressionism')} /> Impressionism</label>
                                        <label><input type="checkbox" checked={selectedStyles.includes('Minimalism')} onChange={() => handleCheckboxChange(setSelectedStyles, 'Minimalism')} /> Minimalism</label>
                                    </div>
                                </div>
                                <button
                                    className="filter-close"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Artworks Grid */}
            <section className="gallery-grid-section">
                <div className="container">
                    <div className="gallery-results">
                        <span>{sortedArtworks.length} artworks found</span>
                    </div>

                    <motion.div
                        className={`gallery-grid ${viewMode === 'list' ? 'gallery-grid--list' : ''}`}
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedArtworks.map((artwork, index) => (
                                <motion.div
                                    key={artwork.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ArtworkCard artwork={artwork} viewMode={viewMode} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
