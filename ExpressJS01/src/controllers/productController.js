const { getProductsByCategory, addToFavorites, removeFromFavorites, getFavorites, addToViewed, getViewed, getSimilarProducts, incrementBuyersCount, incrementCommentsCount } = require('../services/productService');
const Product = require('../models/product');

const getProducts = async (req, res) => {
    try {
        const { q: query = '', category, minPrice, maxPrice, hasDiscount, sortBy = 'views', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

        const data = await getProductsByCategory(query, category, minPrice, maxPrice, hasDiscount, sortBy, sortOrder, parseInt(page), parseInt(limit));
        return res.status(200).json({
            EC: 0,
            data: {
                products: data.products,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                totalProducts: data.totalProducts,
            },
        });
    } catch (error) {
        console.error('Error in getProducts:', error.stack);
        return res.status(500).json({
            EC: 1,
            message: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ EC: 1, message: 'Sản phẩm không tìm thấy' });
        }
        return res.status(200).json({ EC: 0, data: product });
    } catch (error) {
        console.error('Error in getProductById:', error.stack);
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

// Favorites
const addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        await addToFavorites(userId, productId);
        return res.status(200).json({ EC: 0, message: 'Đã thêm vào yêu thích' });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        await removeFromFavorites(userId, productId);
        return res.status(200).json({ EC: 0, message: 'Đã xóa khỏi yêu thích' });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await getFavorites(userId);
        return res.status(200).json({ EC: 0, data: favorites });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

// Viewed
const addViewed = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        await addToViewed(userId, productId);
        return res.status(200).json({ EC: 0, message: 'Đã thêm vào đã xem' });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

const getUserViewed = async (req, res) => {
    try {
        const userId = req.user.id;
        const viewed = await getViewed(userId);
        return res.status(200).json({ EC: 0, data: viewed });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

// Similar
const getSimilar = async (req, res) => {
    try {
        const { productId } = req.params;
        const similar = await getSimilarProducts(productId);
        return res.status(200).json({ EC: 0, data: similar });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

// Counters
const buyProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        await incrementBuyersCount(productId);
        return res.status(200).json({ EC: 0, message: 'Ghi nhận mua hàng' });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addFavorite,
    removeFavorite,
    getUserFavorites,
    addViewed,
    getUserViewed,
    getSimilar,
    buyProduct,
};