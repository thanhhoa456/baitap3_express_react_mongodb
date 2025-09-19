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

        // Tạo custom analyzer cho fuzzy search
        await client.indices.create({
            index: INDEX_NAME,
            body: {
                settings: {
                    index: {
                        max_ngram_diff: 10
                    },
                    analysis: {
                        analyzer: {
                            fuzzy_analyzer: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: ['lowercase', 'asciifolding', 'ngram_filter']
                            }
                        },
                        filter: {
                            ngram_filter: {
                                type: 'ngram',
                                min_gram: 2,
                                max_gram: 10
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        name: {
                            type: 'text',
                            analyzer: 'fuzzy_analyzer',
                            search_analyzer: 'standard',
                            fields: {
                                keyword: { type: 'keyword' }
                            }
                        },
                        description: {
                            type: 'text',
                            analyzer: 'fuzzy_analyzer',
                            search_analyzer: 'standard'
                        },
                        category: {
                            type: 'keyword',
                            fields: {
                                text: {
                                    type: 'text',
                                    analyzer: 'fuzzy_analyzer',
                                    search_analyzer: 'standard'
                                }
                            }
                        },
                        price: { type: 'float' },
                        discount: { type: 'float' },
                        views: { type: 'integer' },
                        buyersCount: { type: 'integer' },
                        commentsCount: { type: 'integer' },
                        image: { type: 'keyword' },
                    },
                },
            },
        });
        console.log('Index products created successfully with enhanced fuzzy search support');
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
                buyersCount: doc.buyersCount || 0,
                commentsCount: doc.commentsCount || 0,
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

        // Ensure index exists before searching
        const indexExists = await client.indices.exists({ index: INDEX_NAME });
        if (!indexExists) {
            console.log('Index does not exist, creating it...');
            await createIndex();
            // Try to sync products if index was just created
            try {
                await syncProductsToES();
            } catch (syncError) {
                console.warn('Could not sync products during search:', syncError.message);
            }
        }

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

        // Enhanced fuzzy search trên name, description và category
        if (query) {
            const searchQuery = query.trim();

            // 1. Exact phrase match (highest priority)
            searchBody.query.bool.should.push({
                multi_match: {
                    query: searchQuery,
                    fields: ['name^3', 'description^2', 'category.text^1'],
                    type: 'phrase',
                    boost: 10,
                },
            });

            // 2. Fuzzy match with better configuration
            searchBody.query.bool.should.push({
                multi_match: {
                    query: searchQuery,
                    fields: ['name^3', 'description^2', 'category.text^1'],
                    type: 'best_fields',
                    fuzziness: 'AUTO',
                    prefix_length: 2,
                    max_expansions: 50,
                    boost: 5,
                },
            });

            // 3. Wildcard search for partial matches
            searchBody.query.bool.should.push({
                wildcard: {
                    name: {
                        value: `*${searchQuery}*`,
                        boost: 3,
                    },
                },
            });

            // 4. Fuzzy search on individual terms
            const terms = searchQuery.split(/\s+/);
            terms.forEach(term => {
                if (term.length > 2) {
                    searchBody.query.bool.should.push({
                        fuzzy: {
                            name: {
                                value: term,
                                fuzziness: 'AUTO',
                                prefix_length: 1,
                                boost: 2,
                            },
                        },
                    });
                }
            });

            // Set minimum should match to ensure at least one condition matches
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