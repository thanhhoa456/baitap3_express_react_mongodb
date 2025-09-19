import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Spin, Alert } from 'antd';
import { fetchProducts } from '../util/api';
import ProductCard from './ProductCard';
import SearchFilter from './SearchFilter';
import { AuthContext } from './context/auth.context';

const ProductList = ({ onProductSelect }) => {
    const { refreshProducts } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loaderRef = useRef(null);
    const currentSearchRef = useRef('');
    const currentFiltersRef = useRef({});

    const limit = 10;

    const loadProducts = useCallback(async (q = searchQuery, f = filters, pg = 1, append = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchProducts(q, f, pg, limit);
            if (response.EC === 0) {
                const { products: newProducts, totalPages: total } = response.data;
                setProducts((prev) => {
                    // Check if this request is for the current search and filters
                    if (q !== currentSearchRef.current || JSON.stringify(f) !== JSON.stringify(currentFiltersRef.current)) {
                        return prev; // Ignore outdated request
                    }
                    if (!append) return newProducts;
                    // Loại bỏ trùng lặp dựa trên id
                    const existingIds = new Set(prev.map((p) => p.id));
                    const uniqueNewProducts = newProducts.filter((p) => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewProducts];
                });
                setTotalPages(total);
            } else {
                setError(response.message || 'Failed to load products from API');
                console.error('Error loading products:', response);
            }
        } catch (error) {
            setError(error.message || 'Unknown error occurred while fetching products');
            console.error('Error in loadProducts:', error);
        }
        setLoading(false);
    }, [searchQuery, filters, limit, refreshProducts]);

    useEffect(() => {
        currentSearchRef.current = searchQuery;
        currentFiltersRef.current = filters;
        loadProducts(searchQuery, filters, 1, false);
        setPage(1);
        setProducts([]);
    }, [searchQuery, filters, loadProducts]);

    useEffect(() => {
        if (products.length > 0 && onProductSelect) {
            onProductSelect(products[0]._id || products[0].id);
        }
    }, [products, onProductSelect]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page < totalPages && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadProducts(searchQuery, filters, nextPage, true);
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
    }, [page, totalPages, loading, searchQuery, filters, loadProducts]);

    const handleSearchChange = (q) => {
        setSearchQuery(q);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div style={{ padding: '20px' }}>
            <SearchFilter onSearchChange={handleSearchChange} onFiltersChange={handleFiltersChange} />
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>
            {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
            {page < totalPages && <div ref={loaderRef} style={{ height: '20px' }} />}
            {products.length === 0 && !loading && !error && <p>Không tìm thấy sản phẩm.</p>}
        </div>
    );
};

export default ProductList;