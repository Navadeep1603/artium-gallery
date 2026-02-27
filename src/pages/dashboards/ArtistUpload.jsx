import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, Image as ImageIcon, CheckCircle, AlertCircle, Lightbulb, Quote, Palette, Sparkles, Star, ChevronRight, X, FolderOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import './Dashboard.css';

export default function ArtistUpload() {
    const { user } = useAuth();
    const { addArtwork } = useArtworks();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        medium: '',
        style: '',
        price: '',
        currency: 'INR',
        description: '',
        culturalHistory: '',
        dimensions: '',
        image: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [currentQuote, setCurrentQuote] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const artQuotes = [
        { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson", icon: '🎨' },
        { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas", icon: '👁️' },
        { text: "Creativity takes courage.", author: "Henri Matisse", icon: '🔥' },
        { text: "The purpose of art is washing the dust of daily life off our souls.", author: "Pablo Picasso", icon: '✨' },
        { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "Thomas Merton", icon: '🌊' },
        { text: "Every canvas is a journey all its own.", author: "Helen Frankenthaler", icon: '🗺️' },
        { text: "Color is a power which directly influences the soul.", author: "Wassily Kandinsky", icon: '🎭' },
    ];

    const artistTips = [
        { title: "High-Quality Images", desc: "Use natural lighting and a clean background. Shoot at the highest resolution possible.", icon: <Lightbulb size={16} /> },
        { title: "Tell Your Story", desc: "Buyers connect with the emotion behind the art. Share your inspiration in the description.", icon: <Quote size={16} /> },
        { title: "Price Strategically", desc: "Research similar works. Consider size, medium, and your experience level.", icon: <Star size={16} /> },
        { title: "Use Keywords", desc: "Include style, medium, and mood in your title and description for better discoverability.", icon: <Sparkles size={16} /> },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentQuote(prev => (prev + 1) % artQuotes.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPG, PNG, or WebP image.');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setError('Image must be under 20MB.');
            return;
        }
        setError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        handleFileSelect(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.price || !formData.medium) {
            setError('Please fill in all required fields (Title, Medium, Price).');
            return;
        }

        setIsSubmitting(true);

        try {
            const newArtwork = {
                title: formData.title,
                artist: user?.name || 'Unknown Artist',
                artistId: user?.id || 999,
                year: new Date().getFullYear(),
                medium: formData.medium,
                style: formData.style || 'Contemporary',
                category: formData.medium.toLowerCase().includes('digital') ? 'digital' : 'painting',
                price: parseFloat(formData.price),
                currency: formData.currency,
                description: formData.description,
                culturalHistory: formData.culturalHistory,
                origin: 'Artist Studio',
                dimensions: formData.dimensions || 'Variable',
                image: formData.image || '/src/assets/pic3.jpg',
                thumbnail: formData.image || '/src/assets/pic3.jpg'
            };

            addArtwork(newArtwork);

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/artist');
            }, 2000);
        } catch (err) {
            setError('Failed to upload artwork. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard artist-dashboard">
            <div className="dashboard__header">
                <div>
                    <Link to="/dashboard/artist" className="upload-back-btn">
                        <ArrowLeft size={16} /> Back to Studio
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Upload size={28} style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
                        Upload New Artwork
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Publish your latest creation to the ArtWeb gallery.
                    </motion.p>
                </div>
            </div>

            <div className="upload-page-layout">
                {/* Left: Upload Form */}
                <div className="upload-form-container">
                    <motion.div
                        className="dashboard__card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="dashboard__card-content" style={{ padding: 'var(--space-6)' }}>
                            {success ? (
                                <div className="upload-success">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="upload-success__icon"
                                    >
                                        <CheckCircle size={40} />
                                    </motion.div>
                                    <h2>Artwork Published!</h2>
                                    <p>Your artwork is now live and available to collectors in the gallery.</p>
                                    <span>Redirecting to your studio...</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="upload-form">
                                    {error && (
                                        <div className="upload-error">
                                            <AlertCircle size={20} />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    {/* Image Upload Area */}
                                    {imagePreview ? (
                                        <div className="upload-preview">
                                            <img src={imagePreview} alt="Preview" className="upload-preview__img" />
                                            <button type="button" className="upload-preview__remove" onClick={removeImage}>
                                                <X size={16} />
                                            </button>
                                            <div className="upload-preview__overlay">
                                                <span>✓ Image ready</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`upload-dropzone ${isDragging ? 'upload-dropzone--dragging' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleFileInputChange}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="upload-dropzone__icon">
                                                <ImageIcon size={32} />
                                            </div>
                                            <h3>Click or drag image to upload</h3>
                                            <p>High-res JPG, PNG, or WebP. Max 20MB.</p>
                                            <button
                                                type="button"
                                                className="upload-browse-btn"
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                            >
                                                <FolderOpen size={16} />
                                                Browse from Device
                                            </button>
                                            <div className="upload-dropzone__divider">
                                                <span>OR</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="image"
                                                placeholder="Paste an image URL..."
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="upload-dropzone__url-input"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    )}

                                    {/* Form Fields */}
                                    <div className="upload-form__grid">
                                        <div className="upload-form__field">
                                            <label>Artwork Title*</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. Echoes of Silence"
                                            />
                                        </div>

                                        <div className="upload-form__field">
                                            <label>Price*</label>
                                            <div className="upload-form__price-row">
                                                <select
                                                    name="currency"
                                                    value={formData.currency}
                                                    onChange={handleChange}
                                                >
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Amount"
                                                />
                                            </div>
                                        </div>

                                        <div className="upload-form__field">
                                            <label>Medium*</label>
                                            <input
                                                type="text"
                                                name="medium"
                                                value={formData.medium}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. Oil on Canvas, Digital"
                                            />
                                        </div>

                                        <div className="upload-form__field">
                                            <label>Style</label>
                                            <input
                                                type="text"
                                                name="style"
                                                value={formData.style}
                                                onChange={handleChange}
                                                placeholder="e.g. Abstract, Realism"
                                            />
                                        </div>

                                        <div className="upload-form__field upload-form__field--full">
                                            <label>Dimensions</label>
                                            <input
                                                type="text"
                                                name="dimensions"
                                                value={formData.dimensions}
                                                onChange={handleChange}
                                                placeholder="e.g. 120 x 80 cm, 4000 x 3000 px"
                                            />
                                        </div>

                                        <div className="upload-form__field upload-form__field--full">
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Tell the story behind your creation..."
                                            ></textarea>
                                        </div>

                                        <div className="upload-form__field upload-form__field--full">
                                            <label>Cultural History</label>
                                            <textarea
                                                name="culturalHistory"
                                                value={formData.culturalHistory}
                                                onChange={handleChange}
                                                rows="3"
                                                placeholder="Historical or cultural context behind your artwork..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="upload-form__actions">
                                        <Link to="/dashboard/artist" className="btn btn-secondary">
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Publishing...' : 'Publish to Gallery'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Tips & Quotes Sidebar */}
                <motion.aside
                    className="upload-tips-sidebar"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {/* Rotating Quote Card */}
                    <div className="tips-quote-card">
                        <div className="tips-quote-card__header">
                            <Palette size={18} />
                            <span>Artist Inspiration</span>
                        </div>
                        <div className="tips-quote-card__body">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuote}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="tips-quote-card__content"
                                >
                                    <span className="tips-quote-card__emoji">{artQuotes[currentQuote].icon}</span>
                                    <blockquote className="tips-quote-card__text">
                                        "{artQuotes[currentQuote].text}"
                                    </blockquote>
                                    <cite className="tips-quote-card__author">
                                        — {artQuotes[currentQuote].author}
                                    </cite>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="tips-quote-card__dots">
                            {artQuotes.map((_, i) => (
                                <button
                                    key={i}
                                    className={`tips-quote-dot ${i === currentQuote ? 'active' : ''}`}
                                    onClick={() => setCurrentQuote(i)}
                                    aria-label={`Quote ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Artist Tips */}
                    <div className="tips-section">
                        <div className="tips-section__header">
                            <Lightbulb size={18} />
                            <span>Pro Tips</span>
                        </div>
                        <div className="tips-section__list">
                            {artistTips.map((tip, i) => (
                                <motion.div
                                    key={i}
                                    className="tips-item"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    <div className="tips-item__icon">{tip.icon}</div>
                                    <div className="tips-item__content">
                                        <h4>{tip.title}</h4>
                                        <p>{tip.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Color Palettes */}
                    <div className="tips-palette-card">
                        <div className="tips-section__header">
                            <Sparkles size={18} />
                            <span>Trending Palettes</span>
                        </div>
                        <div className="tips-palette-list">
                            <div className="tips-palette-row">
                                <span className="tips-color-swatch" style={{ background: '#264653' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#2a9d8f' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#e9c46a' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#f4a261' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#e76f51' }}></span>
                                <span className="tips-palette-name">Earthy Sunset</span>
                            </div>
                            <div className="tips-palette-row">
                                <span className="tips-color-swatch" style={{ background: '#6b2fa0' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#9b5de5' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#f15bb5' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#fee440' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#00bbf9' }}></span>
                                <span className="tips-palette-name">Vivid Pop</span>
                            </div>
                            <div className="tips-palette-row">
                                <span className="tips-color-swatch" style={{ background: '#0d1b2a' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#1b263b' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#415a77' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#778da9' }}></span>
                                <span className="tips-color-swatch" style={{ background: '#e0e1dd' }}></span>
                                <span className="tips-palette-name">Midnight Calm</span>
                            </div>
                        </div>
                    </div>

                    {/* Did You Know */}
                    <div className="tips-didyouknow">
                        <span className="tips-didyouknow__badge">💡 Did you know?</span>
                        <p>Artworks with detailed descriptions sell <strong>40% faster</strong> than those without. Take a moment to tell your story!</p>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
}
