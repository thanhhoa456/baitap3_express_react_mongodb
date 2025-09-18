import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import SimilarProducts from '../components/SimilarProducts';
import CommentSection from '../components/CommentSection';

const HomePage = () => {
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleProductSelect = (productId) => {
        setSelectedProductId(productId);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Product List</h1>
            <ProductList onProductSelect={handleProductSelect} />
            {/* Render SimilarProducts and CommentSection if a product is selected */}
            {selectedProductId && (
                <>
                    <SimilarProducts productId={selectedProductId} />
                    <CommentSection productId={selectedProductId} />
                </>
            )}
        </div>
    );
};

export default HomePage;
