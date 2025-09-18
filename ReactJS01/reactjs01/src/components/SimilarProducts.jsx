import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { getSimilarApi } from '../util/api';
import ProductCard from './ProductCard';

const SimilarProducts = ({ productId }) => {
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            loadSimilar();
        }
    }, [productId]);

    const loadSimilar = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSimilarApi(productId);
            if (response.EC === 0) {
                setSimilar(response.data);
            } else {
                setError(response.message || 'Failed to load similar products');
            }
        } catch (error) {
            setError(error.message || 'Unknown error occurred while fetching similar products');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Sản phẩm tương tự</h3>
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {similar.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>
            {similar.length === 0 && !loading && !error && <p>Không có sản phẩm tương tự.</p>}
        </div>
    );
};

export default SimilarProducts;
