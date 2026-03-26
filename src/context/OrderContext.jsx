import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    // Load orders from backend when user logs in
    useEffect(() => {
        if (user?.id) {
            api.get(`/orders/user/${user.id}`)
                .then(res => setOrders(res.data))
                .catch(err => console.error('Failed to load orders', err));
        } else {
            setOrders([]);
        }
    }, [user]);

    const addOrder = async (order) => {
        try {
            const res = await api.post('/orders', order);
            setOrders(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) {
            console.error('Failed to create order', err);
            // Fallback: add locally if backend fails
            setOrders(prev => [order, ...prev]);
            return order;
        }
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
