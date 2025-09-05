const Product = require('../models/product');

const getProductsByCategory = async (category, page = 1, limit = 10) => {
    try {
        const query = category ? { category } : {};
        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalProducts = await Product.countDocuments(query);

        return {
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts,
        };
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

module.exports = {
    getProductsByCategory,
};