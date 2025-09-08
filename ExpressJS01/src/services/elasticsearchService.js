const { Client } = require('@elastic/elasticsearch');
const Product = require('../models/product');
require('dotenv').config();

const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

// Kiểm tra kết nối Elasticsearch
const checkConnection = async () => {
    try {
        await client.ping();
        console.log('Connected to Elasticsearch');
    } catch (error) {
        console.error('Failed to connect to Elasticsearch:', error.message);
        throw new Error('Cannot connect to Elasticsearch. Ensure the server is running at ' + (process.env.ELASTICSEARCH_URL || 'http://localhost:9200'));
    }
};

const INDEX_NAME = 'products';

// Tạo index nếu chưa tồn tại
const createIndex = async () => {
    try {
        const exists = await client.indices.exists({ index: INDEX_NAME });
        if (exists) {
            await client.indices.delete({ index: INDEX_NAME });
            console.log('Existing index products deleted');
        }
        await client.indices.create({
            index: INDEX_NAME,
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text', analyzer: 'standard' },
                        description: { type: 'text', analyzer: 'standard' },
                        category: { type: 'keyword' },
                        price: { type: 'float' },
                        discount: { type: 'float' },
                        views: { type: 'integer' },
                        image: { type: 'keyword' },
                    },
                },
            },
        });
        console.log('Index products created successfully');
    } catch (error) {
        console.error('Error creating index:', error.message);
        throw new Error('Failed to create Elasticsearch index: ' + error.message);
    }
};

// Đồng bộ dữ liệu từ MongoDB sang Elasticsearch
const syncProductsToES = async () => {
    try {
        await checkConnection();
        await createIndex();
        const products = await Product.find({}).lean();
        console.log(`Found ${products.length} products in MongoDB`);
        const body = products.flatMap((doc) => [
            { index: { _index: INDEX_NAME } },
            {
                id: doc._id.toString(),
                name: doc.name,
                description: doc.description,
                category: doc.category.toLowerCase(), // Chuẩn hóa category
                price: doc.price,
                discount: doc.discount,
                views: doc.views,
                image: doc.image,
            },
        ]);
        if (body.length > 0) {
            await client.bulk({ body });
            console.log('Products synced to Elasticsearch');
        } else {
            console.log('No products to sync');
        }
    } catch (error) {
        console.error('Error syncing products:', error.message);
        throw new Error('Failed to sync products to Elasticsearch: ' + error.message);
    }
};

// Fuzzy Search với filters và sort
const searchProducts = async (query, filters = {}, page = 1, limit = 10, sortBy = 'views', sortOrder = 'desc') => {
    try {
        await checkConnection();
        const { category, minPrice, maxPrice, hasDiscount } = filters;
        const from = (page - 1) * limit;

        let searchBody = {
            query: {
                bool: {
                    must: [],
                    filter: [],
                    should: [],
                },
            },
            from,
            size: limit,
            sort: [{ [sortBy]: { order: sortOrder.toLowerCase() } }],
        };

        // Fuzzy search trên name và description
        if (query) {
            searchBody.query.bool.should.push({
                multi_match: {
                    query: query.trim(),
                    fields: ['name^2', 'description'],
                    type: 'best_fields',
                    fuzziness: 'AUTO',
                    prefix_length: 1,
                },
            });
            searchBody.query.bool.minimum_should_match = 1;
        }

        // Filter theo category
        if (category) {
            searchBody.query.bool.filter.push({ term: { category: category.trim().toLowerCase() } });
        }

        // Filter theo giá
        if (minPrice || maxPrice) {
            const priceFilter = {
                range: {
                    price: {},
                },
            };
            if (minPrice) priceFilter.range.price.gte = parseFloat(minPrice);
            if (maxPrice) priceFilter.range.price.lte = parseFloat(maxPrice);
            searchBody.query.bool.filter.push(priceFilter);
        }

        // Filter theo khuyến mãi
        if (hasDiscount === 'true') {
            searchBody.query.bool.filter.push({ range: { discount: { gt: 0 } } });
        }

        console.log('Elasticsearch query:', JSON.stringify(searchBody, null, 2));
        const result = await client.search({ index: INDEX_NAME, body: searchBody });
        console.log('Elasticsearch response:', JSON.stringify(result.hits, null, 2));
        const hits = result.hits || { hits: [], total: { value: 0 } };
        const total = hits.total.value || 0;

        return {
            products: hits.hits.map((hit) => ({ ...hit._source, id: hit._source.id })),
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalProducts: total,
        };
    } catch (error) {
        console.error('Error searching products:', error.message);
        throw new Error('Failed to search products: ' + error.message);
    }
};

module.exports = {
    syncProductsToES,
    searchProducts,
};