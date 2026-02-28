import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Upload, ArrowLeft, Image as ImageIcon, CheckCircle, AlertCircle,
    FolderOpen, Link2, X, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArtworks } from '../../context/ArtworkContext';
import './Dashboard.css';

const ART_CAPTIONS = [
    {
        quote: '"Every artist dips his brush in his own soul, and paints his own nature into his pictures."',
        author: '— Henry Ward Beecher',
        icon: '🎨',
    },
    {
        quote: '"Art enables us to find ourselves and lose ourselves at the same time."',
        author: '— Thomas Merton',
        icon: '✨',
    },
    {
        quote: '"Creativity takes courage."',
        author: '— Henri Matisse',
        icon: '🦋',
    },
    {
        quote: '"The purpose of art is washing the dust of daily life off our souls."',
        author: '— Pablo Picasso',
        icon: '🌊',
    },
    {
        quote: '"Art is not what you see, but what you make others see."',
        author: '— Edgar Degas',
        icon: '👁️',
    },
];

const UPLOAD_TIPS = [
    { icon: '📐', tip: 'Use high-res images — at least 2000px wide for best print quality.' },
    { icon: '🖼️', tip: 'Upload in natural lighting for accurate color representation.' },
    { icon: '📝', tip: 'A rich description helps collectors connect with your story.' },
    { icon: '💰', tip: 'Research similar artworks to price competitively in the market.' },
];

export default function ArtistUpload() {
    const { user } = useAuth();
    const { addArtwork } = useArtworks();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'
    const [localPreview, setLocalPreview] = useState(null);
    const [localFileName, setLocalFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            setError('File is too large. Max 20MB allowed.');
            return;
        }
        setError('');
        setLocalFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            setLocalPreview(dataUrl);
            setFormData(prev => ({ ...prev, image: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => handleFileSelect(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const clearLocalFile = () => {
        setLocalPreview(null);
        setLocalFileName('');
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
            setTimeout(() => navigate('/dashboard/artist'), 2000);
        } catch {
            setError('Failed to upload artwork. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const previewSrc = localPreview || (imageMode === 'url' && formData.image ? formData.image : null);

    return (
        <div className="dashboard artist-dashboard">
            <div className="dashboard__header">
                <div>
                    <Link to="/dashboard/artist" className="upload-back-btn">
                        <ArrowLeft size={16} /> Back to Studio
                    </Link>
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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

            {/* ── Two-column layout ── */}
            <div className="upload-page-layout">

                {/* ── LEFT: Form card ── */}
                <motion.div
                    className="dashboard__card upload-form-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="dashboard__card-content" style={{ padding: 'var(--space-6)' }}>
                        {success ? (
                            <div className="upload-success">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="upload-success__icon">
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

                                {/* ── Upload Mode Tabs ── */}
                                <div className="upload-mode-tabs">
                                    <button
                                        type="button"
                                        className={`upload-mode-tab ${imageMode === 'file' ? 'active' : ''}`}
                                        onClick={() => setImageMode('file')}
                                    >
                                        <FolderOpen size={16} /> Upload from Device
                                    </button>
                                    <button
                                        type="button"
                                        className={`upload-mode-tab ${imageMode === 'url' ? 'active' : ''}`}
                                        onClick={() => setImageMode('url')}
                                    >
                                        <Link2 size={16} /> Paste URL
                                    </button>
                                </div>

                                {/* ── Dropzone / Preview ── */}
                                {imageMode === 'file' ? (
                                    <div
                                        className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${localPreview ? 'has-preview' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => !localPreview && fileInputRef.current?.click()}
                                    >
                                        {localPreview ? (
                                            <div className="upload-dropzone__preview">
                                                <img src={localPreview} alt="Preview" />
                                                <div className="upload-dropzone__preview-overlay">
                                                    <span className="upload-dropzone__filename">{localFileName}</span>
                                                    <button
                                                        type="button"
                                                        className="upload-dropzone__clear"
                                                        onClick={(e) => { e.stopPropagation(); clearLocalFile(); }}
                                                    >
                                                        <X size={16} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="upload-dropzone__icon">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <h3>Click or drag image to upload</h3>
                                                <p>High-res JPG, PNG, or WebP. Max 20MB.</p>
                                                <button
                                                    type="button"
                                                    className="upload-dropzone__btn"
                                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                >
                                                    <FolderOpen size={16} /> Browse Files
                                                </button>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            style={{ display: 'none' }}
                                            onChange={handleFileInputChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="upload-dropzone upload-dropzone--url">
                                        {formData.image ? (
                                            <div className="upload-dropzone__preview">
                                                <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                                            </div>
                                        ) : (
                                            <div className="upload-dropzone__icon">
                                                <Link2 size={32} />
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            name="image"
                                            placeholder="Paste an image URL here..."
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="upload-dropzone__url-input"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}

                                {/* ── Form Fields ── */}
                                <div className="upload-form__grid">
                                    <div className="upload-form__field">
                                        <label>Artwork Title*</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Echoes of Silence" />
                                    </div>

                                    <div className="upload-form__field">
                                        <label>Price*</label>
                                        <div className="upload-form__price-row">
                                            <select name="currency" value={formData.currency} onChange={handleChange}>
                                                <option value="INR">INR (₹)</option>
                                            </select>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="Amount" />
                                        </div>
                                    </div>

                                    <div className="upload-form__field">
                                        <label>Medium*</label>
                                        <input type="text" name="medium" value={formData.medium} onChange={handleChange} required placeholder="e.g. Oil on Canvas, Digital" />
                                    </div>

                                    <div className="upload-form__field">
                                        <label>Style</label>
                                        <input type="text" name="style" value={formData.style} onChange={handleChange} placeholder="e.g. Abstract, Realism" />
                                    </div>

                                    <div className="upload-form__field upload-form__field--full">
                                        <label>Dimensions</label>
                                        <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g. 120 x 80 cm, 4000 x 3000 px" />
                                    </div>

                                    <div className="upload-form__field upload-form__field--full">
                                        <label>Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Tell the story behind your creation..." />
                                    </div>

                                    <div className="upload-form__field upload-form__field--full">
                                        <label>Cultural History</label>
                                        <textarea name="culturalHistory" value={formData.culturalHistory} onChange={handleChange} rows="3" placeholder="Historical or cultural context behind your artwork..." />
                                    </div>
                                </div>

                                <div className="upload-form__actions">
                                    <Link to="/dashboard/artist" className="btn btn-secondary">Cancel</Link>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Publishing...' : 'Publish to Gallery'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* ── RIGHT: Captions & Tips panel ── */}
                <motion.div
                    className="upload-sidebar"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    {/* Art Quotes */}
                    <div className="upload-sidebar__section">
                        <h3 className="upload-sidebar__heading">
                            <Sparkles size={18} /> Artist Voices
                        </h3>
                        <div className="upload-quotes">
                            {ART_CAPTIONS.map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="upload-quote-card"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                >
                                    <span className="upload-quote-card__icon">{c.icon}</span>
                                    <div>
                                        <p className="upload-quote-card__text">{c.quote}</p>
                                        <span className="upload-quote-card__author">{c.author}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Upload Tips */}
                    <div className="upload-sidebar__section">
                        <h3 className="upload-sidebar__heading">
                            💡 Tips for a Great Listing
                        </h3>
                        <div className="upload-tips">
                            {UPLOAD_TIPS.map((t, i) => (
                                <div key={i} className="upload-tip-item">
                                    <span className="upload-tip-item__icon">{t.icon}</span>
                                    <p>{t.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
