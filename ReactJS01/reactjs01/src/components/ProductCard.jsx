import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { addFavoriteApi, removeFavoriteApi, getUserApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const navigate = useNavigate();

    console.log('Product image:', product.image); // Debug URL ảnh
    const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
    const imageUrl = product.image || 'https://via.placeholder.com/200x200.png?text=No+Image';

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('access_token'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (!token) {
                setIsFavorite(false); // Không đăng nhập thì không thể là favorite
                return;
            }
            try {
                const response = await getUserApi();
                if (response.EC === 0 && response.data?.favorites) {
                    const productId = product._id || product.id;
                    const isFav = response.data.favorites.some(fav => fav._id.toString() === productId.toString());
                    setIsFavorite(isFav);
                } else {
                    setIsFavorite(false);
                    console.error('Error checking favorite:', response.message || 'No favorites data');
                }
            } catch (error) {
                setIsFavorite(false);
                console.error('Error checking favorite:', error);
            }
        };

        checkIfFavorite();
    }, [token, product._id || product.id]);

    const handleFavorite = async () => {
        if (!token) {
            message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }
        try {
            if (isFavorite) {
                await removeFavoriteApi(product._id || product.id);
                message.success('Đã xóa khỏi yêu thích');
                setIsFavorite(false);
            } else {
                await addFavoriteApi({ productId: product._id || product.id });
                message.success('Đã thêm vào yêu thích');
                setIsFavorite(true);
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật yêu thích');
            console.error('Error updating favorite:', error);
        }
    };

    const handleClick = () => {
        navigate(`/product/${product._id || product.id}`);
    };

    return (
        <Card
            title={product.name}
            style={{ width: 300, margin: '10px', cursor: 'pointer' }}
            cover={<img alt={product.name} src={imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
            onClick={handleClick}
            actions={[
                <Button
                    type="text"
                    icon={isFavorite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn onClick của Card kích hoạt khi nhấn nút favorite
                        handleFavorite();
                    }}
                >
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>,
            ]}
        >
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p>
                <strong>Giá:</strong> ${discountedPrice.toFixed(2)}{' '}
                {product.discount > 0 && (
                    <span style={{ color: 'red', textDecoration: 'line-through' }}>
                        ${product.price.toFixed(2)}
                    </span>
                )}
            </p>
            {product.discount > 0 && <p><strong>Khuyến mãi:</strong> {product.discount}%</p>}
            <p><strong>Lượt xem:</strong> {product.views}</p>
            <p><strong>Khách mua:</strong> {product.buyersCount || 0}</p>
            <p><strong>Bình luận:</strong> {product.commentsCount || 0}</p>
            <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
        </Card>
    );
};

export default ProductCard;