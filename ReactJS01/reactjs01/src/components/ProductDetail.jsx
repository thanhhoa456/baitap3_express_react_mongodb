import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, message, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { getProductByIdApi, addViewedApi } from '../util/api';
import SimilarProducts from './SimilarProducts';
import CommentSection from './CommentSection';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getProductByIdApi(productId);
                if (response.EC === 0) {
                    setProduct(response.data);
                    // Gọi API để tăng lượt xem
                    await addViewedApi({ productId });
                } else {
                    setError(response.message || 'Không thể tải thông tin sản phẩm');
                }
            } catch (error) {
                setError(error.message || 'Lỗi không xác định khi tải sản phẩm');
            }
            setLoading(false);
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <Spin style={{ display: 'block', margin: '20px auto' }} />;
    if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: '20px' }} />;
    if (!product) return <p>Không tìm thấy sản phẩm</p>;

    const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
    const imageUrl = product.image || 'https://via.placeholder.com/200x200.png?text=No+Image';

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title={product.name}
                style={{ maxWidth: 600, margin: '0 auto' }}
                cover={<img alt={product.name} src={imageUrl} style={{ height: 300, objectFit: 'cover' }} />}
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
                <Button
                    type="primary"
                    icon={<ShoppingOutlined />}
                    style={{ margin: '10px 0' }}
                    onClick={() => navigate(`/payment/${productId}`)}
                >
                    Mua ngay
                </Button>
            </Card>

            <SimilarProducts productId={productId} />
            <CommentSection productId={productId} />
        </div>
    );
};

export default ProductDetail;