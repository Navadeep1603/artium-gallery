import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    // Load cart from backend when user logs in
    useEffect(() => {
        if (user?.id) {
            api.get(`/cart/${user.id}`)
                .then(res => {
                    // Map backend CartItem objects to artwork objects for frontend compatibility
                    const items = res.data.map(item => item.artwork);
                    setCartItems(items);
                })
                .catch(err => console.error('Failed to load cart', err));
        } else {
            setCartItems([]);
        }
    }, [user]);

    const addToCart = async (artwork) => {
        if (!user?.id) return;
        const exists = cartItems.find(item => item.id === artwork.id);
        if (exists) return;

        try {
            await api.post('/cart', { userId: user.id, artworkId: artwork.id });
            setCartItems(prev => [...prev, artwork]);
        } catch (err) {
            console.error('Failed to add to cart', err);
        }
    };

    const removeFromCart = async (artworkId) => {
        if (!user?.id) return;
        try {
            await api.delete(`/cart/${user.id}/${artworkId}`);
            setCartItems(prev => prev.filter(item => item.id !== artworkId));
        } catch (err) {
            console.error('Failed to remove from cart', err);
        }
    };

    const clearCart = async () => {
        if (!user?.id) return;
        try {
            await api.delete(`/cart/${user.id}`);
            setCartItems([]);
        } catch (err) {
            console.error('Failed to clear cart', err);
        }
    };

    const isInCart = (artworkId) => {
        return cartItems.some(item => item.id === artworkId);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            isInCart,
            getTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
