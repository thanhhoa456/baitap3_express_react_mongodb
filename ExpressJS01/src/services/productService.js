const { searchProducts } = require('../services/elasticsearchService');
const Product = require('../models/product');
const User = require('../models/user');

const getProductsByCategory = async (query, category, minPrice, maxPrice, hasDiscount, sortBy = 'views', sortOrder = 'desc', page = 1, limit = 10) => {
    try {
        const filters = {
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            hasDiscount: hasDiscount || undefined,
        };
        return await searchProducts(query, filters, page, limit, sortBy, sortOrder);
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

// Favorites
const addToFavorites = async (userId, productId) => {
    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { favorites: productId } });
        await Product.findByIdAndUpdate(productId, { $addToSet: { favorites: userId } });
    } catch (error) {
        throw new Error('Error adding to favorites: ' + error.message);
    }
};

const removeFromFavorites = async (userId, productId) => {
    try {
        await User.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
        await Product.findByIdAndUpdate(productId, { $pull: { favorites: userId } });
    } catch (error) {
        throw new Error('Error removing from favorites: ' + error.message);
    }
};

const getFavorites = async (userId) => {
    try {
        const user = await User.findById(userId).populate('favorites');
        return user.favorites;
    } catch (error) {
        throw new Error('Error fetching favorites: ' + error.message);
    }
};

// Viewed
const addToViewed = async (userId, productId) => {
    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { viewedProducts: productId } });
        await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
    } catch (error) {
        throw new Error('Error adding to viewed: ' + error.message);
    }
};

const getViewed = async (userId) => {
    try {
        const user = await User.findById(userId).populate('viewedProducts');
        return user.viewedProducts;
    } catch (error) {
        throw new Error('Error fetching viewed products: ' + error.message);
    }
};

// Similar Products
const getSimilarProducts = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Product not found');
        const similar = await Product.find({ category: product.category, _id: { $ne: productId } }).limit(5);
        return similar;
    } catch (error) {
        throw new Error('Error fetching similar products: ' + error.message);
    }
};

// Counters
const incrementBuyersCount = async (productId) => {
    try {
        await Product.findByIdAndUpdate(productId, { $inc: { buyersCount: 1 } });
    } catch (error) {
        throw new Error('Error incrementing buyers count: ' + error.message);
    }
};

const recordPurchase = async (userId, productId) => {
    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { purchases: productId } });
    } catch (error) {
        throw new Error('Error recording purchase: ' + error.message);
    }
};

const incrementCommentsCount = async (productId) => {
    try {
        await Product.findByIdAndUpdate(productId, { $inc: { commentsCount: 1 } });
    } catch (error) {
        throw new Error('Error incrementing comments count: ' + error.message);
    }
};

module.exports = {
    getProductsByCategory,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    addToViewed,
    getViewed,
    getSimilarProducts,
    incrementBuyersCount,
    recordPurchase,
    incrementCommentsCount,
};
