import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedOrders = localStorage.getItem('gallery-orders');
        if (savedOrders) {
            try {
                setTimeout(() => setOrders(JSON.parse(savedOrders)), 0);
            } catch (e) {
                console.error("Error parsing orders from local storage", e);
            }
        }
    }, []);

    // Save to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('gallery-orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order) => {
        setOrders(prev => [order, ...prev]);
    };

    const addOrders = (newOrders) => {
        setOrders(prev => [...newOrders, ...prev]);
    };

    const getOrder = (id) => {
        return orders.find(order => order.id === id);
    };

    return (
        <OrderContext.Provider value={{
            orders,
            addOrder,
            addOrders,
            getOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
