import React, { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { fetchProducts } from '../util/api';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    const limit = 10; // Số sản phẩm mỗi trang

    const loadProducts = async (cat = category, pg = 1, append = false) => {
        setLoading(true);
        const response = await fetchProducts(cat, pg, limit);
        if (response.EC === 0) {
            const { products: newProducts, totalPages } = response.data;
            setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
            setTotalPages(totalPages);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProducts(category, 1, false); // Tải lại sản phẩm khi danh mục thay đổi
    }, [category]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page < totalPages && !loading) {
                    setPage((prev) => prev + 1);
                    loadProducts(category, page + 1, true); // Tải thêm sản phẩm
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [page, totalPages, loading, category]);

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setPage(1); // Reset về trang 1 khi thay đổi danh mục
    };

    return (
        <div style={{ padding: '20px' }}>
            <CategoryFilter onCategoryChange={handleCategoryChange} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            {page < totalPages && <div ref={loaderRef} style={{ height: '20px' }} />}
        </div>
    );
};

export default ProductList;