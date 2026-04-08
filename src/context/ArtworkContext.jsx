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
        } catch (err) {
            console.error('Failed to add artwork', err);
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

    const getArtworksByArtist = (artistName) => {
        if (!artistName) return [];
        const name = artistName.toLowerCase();
        return artworks.filter(a =>
            (a.artist && a.artist.toLowerCase() === name) ||
            (a.artistName && a.artistName.toLowerCase() === name)
        );
    };

    return (
        <ArtworkContext.Provider value={{
            artworks,
            loading,
            addArtwork,
            updateArtwork,
            deleteArtwork,
            toggleAvailability,
            getArtworksByArtist
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
