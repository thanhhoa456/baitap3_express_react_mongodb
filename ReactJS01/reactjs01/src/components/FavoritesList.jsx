import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { getFavoritesApi } from '../util/api';
import ProductCard from './ProductCard';

const FavoritesList = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFavoritesApi();
            if (response.EC === 0) {
                setFavorites(response.data);
            } else {
                setError(response.message || 'Failed to load favorites');
            }
        } catch (error) {
            setError(error.message || 'Unknown error occurred while fetching favorites');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Sản phẩm yêu thích</h2>
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {favorites.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>
            {favorites.length === 0 && !loading && !error && <p>Không có sản phẩm yêu thích.</p>}
        </div>
    );
};

export default FavoritesList;
