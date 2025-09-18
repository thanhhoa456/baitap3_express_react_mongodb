const { createComment, getCommentsByProduct, deleteComment } = require('../services/commentService');

const addComment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ EC: 1, message: 'User not authenticated' });
        }
        const { productId, text } = req.body;
        const userId = req.user.id;
        const comment = await createComment(userId, productId, text);
        return res.status(201).json({ EC: 0, data: comment });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await getCommentsByProduct(productId);
        return res.status(200).json({ EC: 0, data: comments });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

const removeComment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ EC: 1, message: 'User not authenticated' });
        }
        const { commentId } = req.params;
        const userId = req.user.id;
        await deleteComment(commentId, userId);
        return res.status(200).json({ EC: 0, message: 'Comment deleted' });
    } catch (error) {
        return res.status(500).json({ EC: 1, message: error.message });
    }
};

module.exports = {
    addComment,
    getComments,
    removeComment,
};
