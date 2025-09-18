const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Sản phẩm yêu thích
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Sản phẩm đã xem
});

const User = mongoose.model('user', userSchema);

module.exports = User;