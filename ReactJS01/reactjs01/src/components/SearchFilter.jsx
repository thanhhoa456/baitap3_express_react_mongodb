import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Slider, Checkbox } from 'antd';

const { Option } = Select;
const { Search } = Input;

const SearchFilter = ({ onSearchChange, onFiltersChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [sortBy, setSortBy] = useState('views');
    const [sortOrder, setSortOrder] = useState('desc');

    const categories = ['Electronics', 'Clothing', 'Books', 'Home'].sort();

    // Create a memoized filters object to ensure stable reference
    const filters = useMemo(
        () => ({
            category,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            hasDiscount: hasDiscount ? 'true' : 'false',
            sortBy,
            sortOrder,
        }),
        [category, priceRange, hasDiscount, sortBy, sortOrder]
    );

    // Call onFiltersChange when filters change
    useEffect(() => {
        onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    const handleSearch = (value) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

    return (
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Search
                placeholder="Tìm kiếm sản phẩm (Fuzzy Search)..."
                onSearch={handleSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div>
                <label>Danh mục: </label>
                <Select value={category} onChange={setCategory} style={{ width: 150, marginLeft: 10 }}>
                    <Option value="">Tất cả</Option>
                    {categories.map((cat) => (
                        <Option key={cat} value={cat}>
                            {cat}
                        </Option>
                    ))}
                </Select>
            </div>

            <div>
                <label>Giá: {priceRange[0]} - {priceRange[1]}</label>
                <Slider range defaultValue={[0, 1000]} max={2000} onChange={setPriceRange} style={{ width: 300 }} />
            </div>

            <div>
                <Checkbox checked={hasDiscount} onChange={(e) => setHasDiscount(e.target.checked)}>
                    Có khuyến mãi
                </Checkbox>
            </div>

            <div>
                <label>Sắp xếp theo: </label>
                <Select value={sortBy} onChange={setSortBy} style={{ width: 150 }}>
                    <Option value="views">Lượt xem</Option>
                    <Option value="price">Giá</Option>
                    <Option value="discount">Khuyến mãi</Option>
                </Select>
                <Select value={sortOrder} onChange={setSortOrder} style={{ width: 100, marginLeft: 10 }}>
                    <Option value="desc">Giảm dần</Option>
                    <Option value="asc">Tăng dần</Option>
                </Select>
            </div>
        </div>
    );
};

export default SearchFilter;