import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CategoryFilter = ({ onCategoryChange }) => {
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['Electronics', 'Clothing', 'Books', 'Home']; // Danh mục mẫu, thay đổi theo dữ liệu thực tế

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        onCategoryChange(value);
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>Filter by Category: </label>
            <Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
                <Option value="">All</Option>
                {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                        {cat}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default CategoryFilter;