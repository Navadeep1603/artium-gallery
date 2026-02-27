import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('gallery-cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('gallery-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (artwork) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.id === artwork.id);
            if (exists) {
                return prev; // Artworks are unique, no quantity
            }
            return [...prev, artwork];
        });
    };

    const removeFromCart = (artworkId) => {
        setCartItems(prev => prev.filter(item => item.id !== artworkId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const isInCart = (artworkId) => {
        return cartItems.some(item => item.id === artworkId);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price;
        }, 0);
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
