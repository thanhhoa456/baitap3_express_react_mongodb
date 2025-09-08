import React from 'react';
import { Card } from 'antd';

const ProductCard = ({ product }) => {
    console.log('Product image:', product.image); // Debug URL ảnh
    const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
    const imageUrl = product.image || 'https://via.placeholder.com/200x200.png?text=No+Image';

    return (
        <Card
            title={product.name}
            style={{ width: 300, margin: '10px' }}
            cover={<img alt={product.name} src={imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
        >
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p>
                <strong>Giá:</strong> ${discountedPrice.toFixed(2)}{' '}
                {product.discount > 0 && (
                    <span style={{ color: 'red', textDecoration: 'line-through' }}>${product.price.toFixed(2)}</span>
                )}
            </p>
            {product.discount > 0 && <p><strong>Khuyến mãi:</strong> {product.discount}%</p>}
            <p><strong>Lượt xem:</strong> {product.views}</p>
            <p><strong>Mô tả:</strong> {product.description || 'No description'}</p>
        </Card>
    );
};

export default ProductCard;