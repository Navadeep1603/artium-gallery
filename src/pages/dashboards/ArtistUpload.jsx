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
        currency: 'USD',
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
                // Mock image or the provided URL from a real uploader
                image: formData.image || '/src/assets/pic3.jpg',
                thumbnail: formData.image || '/src/assets/pic3.jpg'
            };

            // Add the new artwork to the global context
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
                    <Link to="/dashboard/artist" className="btn btn-secondary inline-flex items-center gap-2 mb-4">
                        <ArrowLeft size={16} /> Back to Studio
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Upload size={28} className="mr-3 inline-block" />
                        Upload New Artwork
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-secondary"
                    >
                        Publish your latest creation to the ArtWeb gallery.
                    </motion.p>
                </div>
            </div>

            <div className="dashboard__grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px' }}>
                <motion.div
                    className="dashboard__card dashboard__card--full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="dashboard__card-content p-6">
                        {success ? (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 text-green-500 mb-6"
                                >
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h2 className="text-2xl text-primary mb-2">Artwork Published!</h2>
                                <p className="text-secondary mb-6">Your artwork is now live and available to collectors in the gallery.</p>
                                <p className="text-sm text-muted">Redirecting to your studio...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-900/50 border border-red-500/50 text-white p-4 rounded-lg flex items-center gap-3">
                                        <AlertCircle size={20} />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {/* Image Upload Placeholder */}
                                <div className="border-2 border-dashed border-glass rounded-xl p-8 text-center hover:border-gold transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                                        <ImageIcon size={32} />
                                    </div>
                                    <h3 className="text-lg text-primary mb-1">Click or drag image to upload</h3>
                                    <p className="text-sm text-secondary">High-res JPG, PNG, or WebP. Max 20MB.</p>

                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Or paste an image URL..."
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="mt-6 w-full max-w-md mx-auto text-primary"
                                        style={{ display: 'block' }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group col-span-2 md:col-span-1">
                                        <label className="text-sm text-secondary mb-2 block">Artwork Title*</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="w-full text-primary"
                                            placeholder="e.g. Echoes of Silence"
                                        />
                                    </div>

                                    <div className="form-group col-span-2 md:col-span-1">
                                        <label className="text-sm text-secondary mb-2 block">Price*</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className="w-1/3 text-primary bg-secondary"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="ETH">ETH (Ξ)</option>
                                            </select>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-2/3 text-primary"
                                                placeholder="Amount"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group col-span-2 md:col-span-1">
                                        <label className="text-sm text-secondary mb-2 block">Medium*</label>
                                        <input
                                            type="text"
                                            name="medium"
                                            value={formData.medium}
                                            onChange={handleChange}
                                            required
                                            className="w-full text-primary"
                                            placeholder="e.g. Oil on Canvas, Digital"
                                        />
                                    </div>

                                    <div className="form-group col-span-2 md:col-span-1">
                                        <label className="text-sm text-secondary mb-2 block">Style</label>
                                        <input
                                            type="text"
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            className="w-full text-primary"
                                            placeholder="e.g. Abstract, Realism"
                                        />
                                    </div>

                                    <div className="form-group col-span-2">
                                        <label className="text-sm text-secondary mb-2 block">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full text-primary"
                                            placeholder="Tell the story behind your creation..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-glass flex justify-end gap-4">
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
