import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = '/v1/api/register';
    const data = {
        name, email, password
    };

    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = '/v1/api/login';
    const data = {
        email, password
    };

    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = '/v1/api/user';
    return axios.get(URL_API);
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

export { createUserApi, loginApi, getUserApi, fetchProducts };