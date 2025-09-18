import React, { useState, useEffect } from 'react';
import { List, Input, Button, message, Spin, Alert } from 'antd';
import { getCommentsApi, addCommentApi } from '../util/api';

const { TextArea } = Input;

const CommentSection = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            loadComments();
        }
    }, [productId]);

    const loadComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCommentsApi(productId);
            if (response.EC === 0) {
                setComments(response.data);
            } else {
                setError(response.message || 'Failed to load comments');
            }
        } catch (error) {
            setError(error.message || 'Unknown error occurred while fetching comments');
        }
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await addCommentApi({ productId, text: newComment });
            if (response.EC === 0) {
                setComments([...comments, response.data]);
                setNewComment('');
                message.success('Comment added');
            } else {
                message.error('Failed to add comment');
            }
        } catch (error) {
            message.error('Error adding comment');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Bình luận</h3>
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            <List
                dataSource={comments}
                renderItem={(comment) => (
                    <List.Item>
                        <List.Item.Meta
                            title={comment.user.name}
                            description={comment.text}
                        />
                        <div>{new Date(comment.createdAt).toLocaleString()}</div>
                    </List.Item>
                )}
            />
            <TextArea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Thêm bình luận..."
            />
            <Button type="primary" onClick={handleAddComment} style={{ marginTop: '10px' }}>
                Gửi bình luận
            </Button>
        </div>
    );
};

export default CommentSection;
