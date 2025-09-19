import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import SimilarProducts from '../components/SimilarProducts';

const HomePage = () => {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const refreshProducts = localStorage.getItem('refreshProducts');
        if (refreshProducts) {
            localStorage.removeItem('refreshProducts');
            setRefreshKey(prev => prev + 1);
        }
    }, []);

    const handleProductSelect = (productId) => {
        setSelectedProductId(productId);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Product List</h1>
            <ProductList key={refreshKey} onProductSelect={handleProductSelect} />
            {/* Render SimilarProducts if a product is selected */}
            {selectedProductId && (
                <SimilarProducts productId={selectedProductId} />
            )}
        </div>
    );
};

export default HomePage;
