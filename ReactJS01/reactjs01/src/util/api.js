import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = '/v1/api/register';
    const data = { name, email, password };
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = '/v1/api/login';
    const data = { email, password };
    return axios.post(URL_API, data);
};

const getUserApi = async () => {
    const URL_API = '/v1/api/user';
    try {
        const response = await axios.get(URL_API);
        return response;
    } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) {
            return { EC: 1, message: 'Không được phép: Token không hợp lệ hoặc đã hết hạn' };
        }
        return { EC: 1, message: error.message || 'Lỗi không xác định khi lấy thông tin người dùng' };
    }
};

const getProductByIdApi = async (productId) => {
    const URL_API = `/v1/api/product/${productId}`;
    try {
        const response = await axios.get(URL_API);
        return response;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return { EC: 1, data: null, message: error.message };
    }
};

const fetchProducts = async (searchQuery = '', filters = {}, page = 1, limit = 10) => {
    const URL_API = '/v1/api/products';
    const params = {
        q: searchQuery,
        ...filters, // category, minPrice, maxPrice, hasDiscount, sortBy, sortOrder
        page,
        limit,
    };
    try {
        const response = await axios.get(URL_API, { params });
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { EC: 1, data: null };
    }
};

const addFavoriteApi = async (data) => {
    const URL_API = '/v1/api/favorites';
    return axios.post(URL_API, data);
};

const removeFavoriteApi = async (productId) => {
    const URL_API = `/v1/api/favorites/${productId}`;
    return axios.delete(URL_API);
};

const getFavoritesApi = async () => {
    const URL_API = '/v1/api/favorites';
    return axios.get(URL_API);
};

const addViewedApi = async (data) => {
    const URL_API = '/v1/api/viewed';
    return axios.post(URL_API, data);
};

const getViewedApi = async () => {
    const URL_API = '/v1/api/viewed';
    return axios.get(URL_API);
};

const getSimilarApi = async (productId) => {
    const URL_API = `/v1/api/similar/${productId}`;
    return axios.get(URL_API);
};

const addCommentApi = async (data) => {
    const URL_API = '/v1/api/comments';
    return axios.post(URL_API, data);
};

const getCommentsApi = async (productId) => {
    const URL_API = `/v1/api/comments/${productId}`;
    return axios.get(URL_API);
};

const buyProductApi = async (data) => {
    const URL_API = '/v1/api/buy';
    return axios.post(URL_API, data);
};

export {
    createUserApi,
    loginApi,
    getUserApi,
    getProductByIdApi,
    fetchProducts,
    addFavoriteApi,
    removeFavoriteApi,
    getFavoritesApi,
    addViewedApi,
    getViewedApi,
    getSimilarApi,
    addCommentApi,
    getCommentsApi,
    buyProductApi,
};