const { searchProducts } = require('../services/elasticsearchService');

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

module.exports = {
    getProductsByCategory,
};