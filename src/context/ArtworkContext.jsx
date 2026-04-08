import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ArtworkContext = createContext(null);

export function ArtworkProvider({ children }) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Normalize backend response: flatten nested objects to strings
    const normalize = (artwork) => ({
        ...artwork,
        artistName: artwork.artistName || (typeof artwork.artist === 'object' ? artwork.artist?.name : artwork.artist) || 'Unknown',
        artist: artwork.artistName || (typeof artwork.artist === 'object' ? artwork.artist?.name : artwork.artist) || 'Unknown',
        categoryId: artwork.category?.id ?? artwork.category,
        category: artwork.category?.name ?? artwork.category
    });

    // Load artworks from backend on mount
    useEffect(() => {
        api.get('/artworks')
            .then(res => {
                setArtworks(res.data.map(normalize));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load artworks from backend', err);
                setLoading(false);
            });
    }, []);

    const addArtwork = async (newArtwork) => {
        try {
            const res = await api.post('/artworks', {
                ...newArtwork,
                featured: false,
                available: true,
                views: 0,
                likes: 0,
                image: newArtwork.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
                thumbnail: newArtwork.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
            });
            setArtworks(prev => [normalize(res.data), ...prev]);
            return { success: true, data: res.data };
        } catch (err) {
            const errMsg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Unknown error';
            const errCause = err?.response?.data?.cause || '';
            console.error('Failed to add artwork:', errMsg, errCause);
            throw new Error(errMsg);
        }
    };

    const toggleAvailability = async (id) => {
        const artwork = artworks.find(a => a.id === id);
        if (artwork) {
            try {
                const res = await api.put(`/artworks/${id}`, { ...artwork, available: !artwork.available });
                setArtworks(prev => prev.map(a => a.id === id ? normalize(res.data) : a));
            } catch (err) {
                console.error('Failed to toggle availability', err);
            }
        }
    };

    const updateArtwork = async (id, updatedFields) => {
        const artwork = artworks.find(a => a.id === id);
        if (artwork) {
            try {
                const res = await api.put(`/artworks/${id}`, { ...artwork, ...updatedFields });
                setArtworks(prev => prev.map(a => a.id === id ? normalize(res.data) : a));
            } catch (err) {
                console.error('Failed to update artwork', err);
            }
        }
    };

    const deleteArtwork = async (id) => {
        try {
            await api.delete(`/artworks/${id}`);
            setArtworks(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete artwork', err);
        }
    };

    // Filter artworks by user (checks artistId first, then name as fallback)
    const getArtworksByArtist = (artistName, userId) => {
        return artworks.filter(a => {
            // Primary: match by numeric artist ID
            if (userId && (a.artistId === userId || a.artistId === Number(userId))) return true;
            // Secondary: match by name (case-insensitive)
            if (artistName) {
                const name = artistName.toLowerCase();
                if (a.artist && a.artist.toLowerCase() === name) return true;
                if (a.artistName && a.artistName.toLowerCase() === name) return true;
            }
            return false;
        });
    };

    // Get artworks for a specific artist from already-loaded data OR fetch all and filter
    const fetchArtworksByArtistId = async (artistId, artistName) => {
        try {
            // Primary: filter from already-loaded artworks in context
            const contextResults = artworks.filter(a => {
                if (artistName) {
                    const name = artistName.toLowerCase();
                    if (a.artist && a.artist.toLowerCase() === name) return true;
                    if (a.artistName && a.artistName.toLowerCase() === name) return true;
                }
                if (artistId && (a.artistId === artistId || a.artistId === Number(artistId))) return true;
                return false;
            });

            if (contextResults.length > 0) return contextResults;

            // Fallback: fetch all artworks fresh and filter
            const res = await api.get('/artworks');
            const all = res.data.map(normalize);
            return all.filter(a => {
                if (artistName) {
                    const name = artistName.toLowerCase();
                    if (a.artist && a.artist.toLowerCase() === name) return true;
                    if (a.artistName && a.artistName.toLowerCase() === name) return true;
                }
                if (artistId && (a.artistId === artistId || a.artistId === Number(artistId))) return true;
                return false;
            });
        } catch (err) {
            console.error('Failed to fetch artworks', err);
            return [];
        }
    };

    return (
        <ArtworkContext.Provider value={{
            artworks,
            loading,
            addArtwork,
            updateArtwork,
            deleteArtwork,
            toggleAvailability,
            getArtworksByArtist,
            fetchArtworksByArtistId
        }}>
            {children}
        </ArtworkContext.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useArtworks() {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtworks must be used within an ArtworkProvider');
    }
    return context;
}
