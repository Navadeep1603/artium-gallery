import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('gallery-wishlist');
        if (savedWishlist) {
            try {
                setTimeout(() => setWishlistItems(JSON.parse(savedWishlist)), 0);
            } catch (e) {
                console.error("Error parsing wishlist from local storage", e);
            }
        }
    }, []);

    // Save to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('gallery-wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (artwork) => {
        setWishlistItems(prev => {
            if (prev.find(item => String(item.id) === String(artwork.id))) return prev;
            return [...prev, artwork];
        });
    };

    const removeFromWishlist = (id) => {
        // Use loose comparison to handle string/number ID mismatches after localStorage
        setWishlistItems(prev => prev.filter(item => String(item.id) !== String(id)));
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
