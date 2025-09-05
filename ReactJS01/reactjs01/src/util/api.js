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

const fetchProducts = async (category, page, limit) => {
    const URL_API = '/v1/api/products';
    try {
        const response = await axios.get(URL_API, {
            params: { category, page, limit },
        });
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { EC: 1, data: null };
    }
};

export { createUserApi, loginApi, getUserApi, fetchProducts };