import React from 'react';
import ProductList from '../components/ProductList';

const HomePage = () => {
    return (
        <div style={{ padding: 20 }}>
            <h1>Product List</h1>
            <ProductList />
        </div>
    );
};

export default HomePage;