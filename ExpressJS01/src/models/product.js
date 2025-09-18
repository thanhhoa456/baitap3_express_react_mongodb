const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    discount: { type: Number, default: 0 }, // Phần trăm khuyến mãi (0-100)
    views: { type: Number, default: 0 }, // Lượt xem
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Danh sách user yêu thích
    buyersCount: { type: Number, default: 0 }, // Số khách mua
    commentsCount: { type: Number, default: 0 }, // Số khách bình luận
    similarProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Sản phẩm tương tự
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;