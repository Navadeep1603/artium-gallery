import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { user } = useAuth();

    // Load wishlist from backend when user logs in
    useEffect(() => {
        if (user?.id) {
            api.get(`/wishlist/${user.id}`)
                .then(res => {
                    // Map backend WishlistItem objects to artwork objects for frontend compatibility and normalize
                    const items = res.data.map(item => ({
                        ...item.artwork,
                        artist: item.artwork.artistName || (typeof item.artwork.artist === 'object' ? item.artwork.artist?.name : item.artwork.artist) || 'Unknown',
                        category: typeof item.artwork.category === 'object' ? item.artwork.category?.name : item.artwork.category
                    }));
                    setWishlistItems(items);
                })
                .catch(err => console.error('Failed to load wishlist', err));
        } else {
            setWishlistItems([]);
        }
    }, [user]);

    const addToWishlist = async (artwork) => {
        if (!user?.id) return;
        if (wishlistItems.find(item => String(item.id) === String(artwork.id))) return;

        try {
            await api.post('/wishlist', { userId: user.id, artworkId: artwork.id });
            setWishlistItems(prev => [...prev, artwork]);
        } catch (err) {
            console.error('Failed to add to wishlist', err);
        }
    };

    const removeFromWishlist = async (id) => {
        if (!user?.id) return;
        try {
            await api.delete(`/wishlist/${user.id}/${id}`);
            setWishlistItems(prev => prev.filter(item => String(item.id) !== String(id)));
        } catch (err) {
            console.error('Failed to remove from wishlist', err);
        }
    };

    const toggleWishlist = (artwork) => {
        if (isInWishlist(artwork.id)) {
            removeFromWishlist(artwork.id);
        } else {
            addToWishlist(artwork);
        }
    };

    const isInWishlist = (id) => {
        return wishlistItems.some(item => String(item.id) === String(id));
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
            wishlistCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
