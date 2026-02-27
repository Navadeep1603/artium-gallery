import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                                <div className="upload-dropzone">
                                    <div className="upload-dropzone__icon">
                                        <ImageIcon size={32} />
                                    </div>
                                    <h3>Click or drag image to upload</h3>
                                    <p>High-res JPG, PNG, or WebP. Max 20MB.</p>
                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Or paste an image URL..."
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="upload-dropzone__url-input"
                                    />
                                </div>

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
        </div>
    );
}
