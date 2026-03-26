import axios from 'axios';

// Use environment variable for API URL, fallback to local proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── User Service ────────────────────────────────────────────────
export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

// ── Artist Service ──────────────────────────────────────────────
export const artistService = {
    getAll: async () => (await api.get('/artists')).data,
    getById: async (id) => (await api.get(`/artists/${id}`)).data,
    getFeatured: async () => (await api.get('/artists/featured')).data,
    search: async (name) => (await api.get(`/artists/search?name=${name}`)).data,
    create: async (data) => (await api.post('/artists', data)).data,
    update: async (id, data) => (await api.put(`/artists/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/artists/${id}`)).data,
};

// ── Artwork Service ─────────────────────────────────────────────
export const artworkService = {
    getAll: async () => (await api.get('/artworks')).data,
    getById: async (id) => (await api.get(`/artworks/${id}`)).data,
    getByCategory: async (category) => (await api.get(`/artworks/category/${category}`)).data,
    getFeatured: async () => (await api.get('/artworks/featured')).data,
    getByArtist: async (artistId) => (await api.get(`/artworks/artist/${artistId}`)).data,
    getAvailable: async () => (await api.get('/artworks/available')).data,
    search: async (title) => (await api.get(`/artworks/search?title=${title}`)).data,
    create: async (data) => (await api.post('/artworks', data)).data,
    update: async (id, data) => (await api.put(`/artworks/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/artworks/${id}`)).data,
};

// ── Exhibition Service ──────────────────────────────────────────
export const exhibitionService = {
    getAll: async () => (await api.get('/exhibitions')).data,
    getById: async (id) => (await api.get(`/exhibitions/${id}`)).data,
    getByStatus: async (status) => (await api.get(`/exhibitions/status/${status}`)).data,
    getFeatured: async () => (await api.get('/exhibitions/featured')).data,
    create: async (data) => (await api.post('/exhibitions', data)).data,
    update: async (id, data) => (await api.put(`/exhibitions/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/exhibitions/${id}`)).data,
};

// ── Category Service ────────────────────────────────────────────
export const categoryService = {
    getAll: async () => (await api.get('/categories')).data,
    getById: async (id) => (await api.get(`/categories/${id}`)).data,
    create: async (data) => (await api.post('/categories', data)).data,
    delete: async (id) => (await api.delete(`/categories/${id}`)).data,
};

// ── Order Service ───────────────────────────────────────────────
export const orderService = {
    getAll: async () => (await api.get('/orders')).data,
    getById: async (id) => (await api.get(`/orders/${id}`)).data,
    getByUser: async (userId) => (await api.get(`/orders/user/${userId}`)).data,
    getByStatus: async (status) => (await api.get(`/orders/status/${status}`)).data,
    create: async (data) => (await api.post('/orders', data)).data,
    updateStatus: async (id, status) => (await api.patch(`/orders/${id}/status`, { status })).data,
    delete: async (id) => (await api.delete(`/orders/${id}`)).data,
};

// ── Cart Service ────────────────────────────────────────────────
export const cartService = {
    getCart: async (userId) => (await api.get(`/cart/${userId}`)).data,
    addToCart: async (userId, artworkId) => (await api.post('/cart', { userId, artworkId })).data,
    removeFromCart: async (userId, artworkId) => (await api.delete(`/cart/${userId}/${artworkId}`)).data,
    clearCart: async (userId) => (await api.delete(`/cart/${userId}`)).data,
};

// ── Wishlist Service ────────────────────────────────────────────
export const wishlistService = {
    getWishlist: async (userId) => (await api.get(`/wishlist/${userId}`)).data,
    addToWishlist: async (userId, artworkId) => (await api.post('/wishlist', { userId, artworkId })).data,
    removeFromWishlist: async (userId, artworkId) => (await api.delete(`/wishlist/${userId}/${artworkId}`)).data,
    isInWishlist: async (userId, artworkId) => (await api.get(`/wishlist/${userId}/${artworkId}/check`)).data,
};

export default api;
