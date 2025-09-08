const { getProductsByCategory } = require('../services/productService');

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

module.exports = {
    getProducts,
};