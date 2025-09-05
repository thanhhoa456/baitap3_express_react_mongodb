import React from 'react';
import { Card } from 'antd';

const ProductCard = ({ product }) => {
    return (
        <Card
            title={product.name}
            style={{ width: 300, margin: '10px' }}
            cover={product.image && <img alt={product.name} src={product.image} />}
        >
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description || 'No description'}</p>
        </Card>
    );
};

export default ProductCard;