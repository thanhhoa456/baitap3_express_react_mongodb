import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { getViewedApi } from '../util/api';
import ProductCard from './ProductCard';

const ViewedList = () => {
    const [viewed, setViewed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadViewed();
    }, []);

    const loadViewed = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getViewedApi();
            if (response.EC === 0) {
                setViewed(response.data);
            } else {
                setError(response.message || 'Failed to load viewed products');
            }
        } catch (error) {
            setError(error.message || 'Unknown error occurred while fetching viewed products');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Sản phẩm đã xem</h2>
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {viewed.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>
            {viewed.length === 0 && !loading && !error && <p>Chưa có sản phẩm đã xem.</p>}
        </div>
    );
};

export default ViewedList;
