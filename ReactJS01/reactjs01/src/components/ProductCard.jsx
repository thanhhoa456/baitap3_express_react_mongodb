import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingOutlined } from '@ant-design/icons';
import { addFavoriteApi, removeFavoriteApi, getUserApi } from '../util/api';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const navigate = useNavigate();
    const location = useLocation();

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
                setIsFavorite(false);
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

    const handleBuyNow = (e) => {
        e.stopPropagation();
        navigate(`/payment/${product._id || product.id}`);
    };

    // Only show views, buyersCount, commentsCount if on product detail page
    const isProductDetailPage = location.pathname.startsWith(`/product/${product._id || product.id}`);

    return (
        <Card
            title={product.name}
            style={{
                width: 300,
                height: 500,
                margin: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            cover={
                <img
                    alt={product.name}
                    src={imageUrl}
                    style={{ height: 200, objectFit: 'cover' }}
                />
            }
            onClick={handleClick}
            actions={[
                <Button
                    type="text"
                    icon={isFavorite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite();
                    }}
                >
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>,
                <Button
                    type="text"
                    icon={<ShoppingOutlined />}
                    onClick={handleBuyNow}
                >
                    Mua ngay
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
            <p
                style={{
                    maxHeight: 40,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                <strong>Mô tả:</strong> {product.description || 'Không có mô tả'}
            </p>
        </Card>
    );
};

export default ProductCard;
