import React, { createContext, useContext, useState } from 'react';
import { artworks as initialArtworks } from '../data/mockData';

const ArtworkContext = createContext(null);

export function ArtworkProvider({ children }) {
    const [artworks, setArtworks] = useState(initialArtworks);

    const addArtwork = (newArtwork) => {
        // Generate a temporary ID (in a real app, this comes from the backend)
        const id = Math.max(...artworks.map(a => a.id), 0) + 1;

        const artworkWithDefaults = {
            ...newArtwork,
            id,
            featured: false,
            available: true,
            views: 0,
            likes: 0,
            // For images, if none provided or it's a file, we'll placeholder it for now
            // In a real app we'd upload the file and get a URL
            image: newArtwork.image || '/src/assets/pic1.jpg',
            thumbnail: newArtwork.image || '/src/assets/pic1.jpg'
        };

        setArtworks(prev => [artworkWithDefaults, ...prev]);
    };

    const toggleAvailability = (id) => {
        setArtworks(prev => prev.map(a =>
            a.id === id ? { ...a, available: !a.available } : a
        ));
    };

    const getArtworksByArtist = (artistName) => {
        return artworks.filter(a => a.artist === artistName);
    };

    return (
        <ArtworkContext.Provider value={{
            artworks,
            addArtwork,
            toggleAvailability,
            getArtworksByArtist
        }}>
            {children}
        </ArtworkContext.Provider>
    );
}

export function useArtworks() {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtworks must be used within an ArtworkProvider');
    }
    return context;
}
