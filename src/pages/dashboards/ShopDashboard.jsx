import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    DollarSign,
    Package,
    TrendingUp,
    Eye,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    AlertTriangle,
    BarChart2,
    Tag,
    Users,
    CreditCard,
    Megaphone,
    Star,
    ChevronRight,
    RefreshCw,
    Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useArtworks } from '../../context/ArtworkContext';
import './Dashboard.css';

export default function ShopDashboard() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { artworks } = useArtworks();
    const [activeOrderTab, setActiveOrderTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock stats data
    const stats = [
        {
            label: 'Total Products',
            value: artworks.length,
            icon: ShoppingBag,
            color: 'gold',
            change: '+3',
            changeType: 'up',
            subtitle: 'this month'
        },
        {
            label: 'Total Revenue',
            value: '$187,430',
            icon: DollarSign,
            color: 'green',
            change: '+18.2%',
            changeType: 'up',
            subtitle: 'vs last month'
        },
        {
            label: 'Orders This Month',
            value: '284',
            icon: Package,
            color: 'blue',
            change: '+12.5%',
            changeType: 'up',
            subtitle: 'vs last month'
        },
        {
            label: 'Conversion Rate',
            value: '4.8%',
            icon: TrendingUp,
            color: 'purple',
            change: '-0.3%',
            changeType: 'down',
            subtitle: 'vs last month'
        },
    ];

    // Mock orders data
    const orders = [
        {
            id: 'ORD-2024-001',
            customer: 'Isabella Martin',
            customerAvatar: 'IM',
            items: 2,
            total: '$11,000',
            status: 'completed',
            date: 'Feb 12, 2026',
            artwork: 'Starry Night Reimagined'
        },
        {
            id: 'ORD-2024-002',
            customer: 'James Wilson',
            customerAvatar: 'JW',
            items: 1,
            total: '$8,500',
            status: 'processing',
            date: 'Feb 11, 2026',
            artwork: 'Golden Serenity'
        },
        {
            id: 'ORD-2024-003',
            customer: 'Elena Fischer',
            customerAvatar: 'EF',
            items: 3,
            total: '$15,200',
            status: 'shipped',
            date: 'Feb 10, 2026',
            artwork: 'Eternal Form'
        },
        {
            id: 'ORD-2024-004',
            customer: 'David Park',
            customerAvatar: 'DP',
            items: 1,
            total: '$1,200',
            status: 'completed',
            date: 'Feb 09, 2026',
            artwork: 'Urban Symphony'
        },
        {
            id: 'ORD-2024-005',
            customer: 'Sarah Chen',
            customerAvatar: 'SC',
            items: 1,
            total: '$4,200',
            status: 'cancelled',
            date: 'Feb 08, 2026',
            artwork: 'Whispers of Autumn'
        },
    ];

    // Top selling artworks
    const topSelling = artworks
        .filter(a => a.available)
        .slice(0, 5)
        .map((artwork, i) => ({
            ...artwork,
            rank: i + 1,
            soldCount: Math.floor(Math.random() * 50) + 10,
            revenue: `$${((Math.random() * 50000) + 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
        }));

    // Inventory alerts
    const inventoryAlerts = [
        { artwork: 'Golden Serenity', type: 'low', remaining: 2, icon: AlertTriangle },
        { artwork: 'Abstract Harmony', type: 'out', remaining: 0, icon: XCircle },
        { artwork: 'Cultural Threads', type: 'low', remaining: 3, icon: AlertTriangle },
        { artwork: 'Digital Dreams #42', type: 'restock', remaining: 15, icon: RefreshCw },
    ];

    // Weekly revenue data for chart
    const weeklyRevenue = [
        { day: 'Mon', value: 72, amount: '$12,400' },
        { day: 'Tue', value: 88, amount: '$15,200' },
        { day: 'Wed', value: 55, amount: '$9,500' },
        { day: 'Thu', value: 95, amount: '$16,800' },
        { day: 'Fri', value: 68, amount: '$11,700' },
        { day: 'Sat', value: 82, amount: '$14,100' },
        { day: 'Sun', value: 60, amount: '$10,300' },
    ];

    // Customer insights mini-data
    const customerInsights = [
        { label: 'New Customers', value: '48', change: '+12%' },
        { label: 'Returning', value: '156', change: '+8%' },
        { label: 'Avg. Order Value', value: '$2,840', change: '+5%' },
    ];

    const orderTabs = [
        { id: 'all', label: 'All Orders', count: orders.length },
        { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
        { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
        { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    ];

    const filteredOrders = activeOrderTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeOrderTab);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed': return { icon: CheckCircle, class: 'status-badge--completed', label: 'Completed' };
            case 'processing': return { icon: Clock, class: 'status-badge--processing', label: 'Processing' };
            case 'shipped': return { icon: Truck, class: 'status-badge--shipped', label: 'Shipped' };
            case 'cancelled': return { icon: XCircle, class: 'status-badge--cancelled', label: 'Cancelled' };
            default: return { icon: Clock, class: '', label: status };
        }
    };

    return (
        <div className="dashboard shop-dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Shop Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Welcome back, {user?.name || 'Shop Owner'} — here's your store overview
                    </motion.p>
                </div>
                <div className="shop-header-actions">
                    <Link to="/dashboard/shop/products" className="btn btn-secondary">
                        <Package size={18} />
                        Products
                    </Link>
                    <Link to="/dashboard/shop/add" className="btn btn-primary">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard__stats">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`stat-card stat-card--${stat.color} shop-stat-card`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                    >
                        <div className="stat-card__icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-card__info">
                            <span className="stat-card__value">{stat.value}</span>
                            <span className="stat-card__label">{stat.label}</span>
                        </div>
                        <div className={`stat-card__change stat-card__change--${stat.changeType}`}>
                            {stat.changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard__grid">
                {/* Recent Orders — Full width */}
                <motion.div
                    className="dashboard__card dashboard__card--full shop-orders-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="dashboard__card-header">
                        <h2><Package size={20} /> Recent Orders</h2>
                        <div className="shop-orders-header-actions">
                            <div className="shop-search-mini">
                                <Search size={14} />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Link to="/dashboard/shop/orders">View All</Link>
                        </div>
                    </div>
                    {/* Order Tabs */}
                    <div className="shop-order-tabs">
                        {orderTabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`shop-order-tab ${activeOrderTab === tab.id ? 'shop-order-tab--active' : ''}`}
                                onClick={() => setActiveOrderTab(tab.id)}
                            >
                                {tab.label}
                                <span className="shop-order-tab__count">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="dashboard__card-content shop-orders-list">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeOrderTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {filteredOrders.map(order => {
                                    const statusConfig = getStatusConfig(order.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <div key={order.id} className="shop-order-item">
                                            <div className="shop-order-item__avatar">
                                                {order.customerAvatar}
                                            </div>
                                            <div className="shop-order-item__info">
                                                <h4>{order.customer}</h4>
                                                <p>{order.id} · {order.artwork}</p>
                                            </div>
                                            <div className="shop-order-item__meta">
                                                <span className="shop-order-item__items">{order.items} item{order.items > 1 ? 's' : ''}</span>
                                                <span className="shop-order-item__date">{order.date}</span>
                                            </div>
                                            <div className="shop-order-item__total">{order.total}</div>
                                            <span className={`status-badge ${statusConfig.class}`}>
                                                <StatusIcon size={12} />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Top Selling Artworks */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="dashboard__card-header">
                        <h2><Star size={20} /> Top Selling</h2>
                        <Link to="/dashboard/shop/analytics">Details</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {topSelling.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="shop-top-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.08 }}
                            >
                                <span className={`shop-top-item__rank shop-top-item__rank--${index < 3 ? 'top' : 'normal'}`}>
                                    #{item.rank}
                                </span>
                                <img src={item.thumbnail} alt={item.title} className="shop-top-item__img" />
                                <div className="shop-top-item__info">
                                    <h4>{item.title}</h4>
                                    <p>{item.artist}</p>
                                </div>
                                <div className="shop-top-item__stats">
                                    <span className="shop-top-item__sold">{item.soldCount} sold</span>
                                    <span className="shop-top-item__revenue">{item.revenue}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Inventory Alerts */}
                <motion.div
                    className="dashboard__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <div className="dashboard__card-header">
                        <h2><AlertTriangle size={20} /> Inventory Alerts</h2>
                        <Link to="/dashboard/shop/inventory">Manage</Link>
                    </div>
                    <div className="dashboard__card-content">
                        {inventoryAlerts.map((alert, index) => {
                            const AlertIcon = alert.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className={`shop-alert-item shop-alert-item--${alert.type}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.65 + index * 0.08 }}
                                >
                                    <div className={`shop-alert-item__icon shop-alert-item__icon--${alert.type}`}>
                                        <AlertIcon size={16} />
                                    </div>
                                    <div className="shop-alert-item__info">
                                        <h4>{alert.artwork}</h4>
                                        <p>
                                            {alert.type === 'out' && 'Out of stock'}
                                            {alert.type === 'low' && `${alert.remaining} remaining`}
                                            {alert.type === 'restock' && `Restocked to ${alert.remaining}`}
                                        </p>
                                    </div>
                                    <button className="shop-alert-item__action">
                                        {alert.type === 'restock' ? 'View' : 'Restock'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Revenue Chart — Full width */}
                <motion.div
                    className="dashboard__card dashboard__card--full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="dashboard__card-header">
                        <h2><BarChart2 size={20} /> Weekly Revenue</h2>
                        <div className="shop-chart-controls">
                            <select className="dashboard__select">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                    </div>
                    <div className="dashboard__chart-placeholder shop-revenue-chart">
                        <div className="shop-chart-summary">
                            {customerInsights.map((insight, i) => (
                                <motion.div
                                    key={insight.label}
                                    className="shop-chart-summary__item"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                >
                                    <span className="shop-chart-summary__value">{insight.value}</span>
                                    <span className="shop-chart-summary__label">{insight.label}</span>
                                    <span className="shop-chart-summary__change">{insight.change}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="chart-bars shop-chart-bars">
                            {weeklyRevenue.map((item, i) => (
                                <div key={i} className="shop-chart-bar-wrapper">
                                    <motion.div
                                        className="chart-bar shop-chart-bar"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.value}%` }}
                                        transition={{ delay: 0.7 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                        whileHover={{ scale: 1.08 }}
                                    />
                                    <span className="shop-chart-bar__amount">{item.amount}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chart-labels">
                            {weeklyRevenue.map(item => (
                                <span key={item.day}>{item.day}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                className="dashboard__actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Link to="/dashboard/shop/products" className="quick-action shop-quick-action">
                    <ShoppingBag size={24} />
                    <span>Manage Products</span>
                </Link>
                <Link to="/dashboard/shop/orders" className="quick-action shop-quick-action">
                    <Package size={24} />
                    <span>View Orders</span>
                </Link>
                <Link to="/dashboard/shop/analytics" className="quick-action shop-quick-action">
                    <BarChart2 size={24} />
                    <span>Analytics</span>
                </Link>
                <Link to="/dashboard/shop/promotions" className="quick-action shop-quick-action">
                    <Megaphone size={24} />
                    <span>Promotions</span>
                </Link>
            </motion.div>
        </div>
    );
}
