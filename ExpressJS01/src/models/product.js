const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    discount: { type: Number, default: 0 }, // Phần trăm khuyến mãi (0-100)
    views: { type: Number, default: 0 }, // Lượt xem
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;