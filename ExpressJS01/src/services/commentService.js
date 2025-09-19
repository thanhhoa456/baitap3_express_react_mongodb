const Comment = require('../models/comment');
const Product = require('../models/product');

const User = require('../models/user');

const createComment = async (userId, productId, text) => {
    try {
        // Check if user has purchased the product
        const user = await User.findById(userId);
        if (!user.purchases.includes(productId)) {
            throw new Error('User chưa mua sản phẩm này, không được phép bình luận');
        }
        const comment = new Comment({ user: userId, product: productId, text });
        await comment.save();
        await Product.findByIdAndUpdate(productId, { $inc: { commentsCount: 1 } });
        return comment;
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

const getCommentsByProduct = async (productId) => {
    try {
        const comments = await Comment.find({ product: productId }).populate('user', 'name');
        return comments;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

const deleteComment = async (commentId, userId) => {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) throw new Error('Comment not found');
        if (comment.user.toString() !== userId) throw new Error('Unauthorized');
        await Comment.findByIdAndDelete(commentId);
        await Product.findByIdAndUpdate(comment.product, { $inc: { commentsCount: -1 } });
    } catch (error) {
        throw new Error('Error deleting comment: ' + error.message);
    }
};

module.exports = {
    createComment,
    getCommentsByProduct,
    deleteComment,
};
