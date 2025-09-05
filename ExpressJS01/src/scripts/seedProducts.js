const mongoose = require('mongoose');
const Product = require('../models/product');
const connection = require('../config/database');

const seedProducts = async () => {
    try {
        // Kết nối tới MongoDB
        await connection();

        // Xóa toàn bộ dữ liệu trong collection products
        await Product.deleteMany({});
        console.log('All products deleted successfully');

        // Danh sách sản phẩm mở rộng
        const products = [
            // Danh mục Electronics
            {
                name: 'Laptop Pro',
                price: 1200,
                category: 'Electronics',
                description: 'High-end laptop with 16GB RAM',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_2_eswy0y.webp'
            },
            {
                name: 'Smartphone X',
                price: 800,
                category: 'Electronics',
                description: 'Latest smartphone with 5G',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_3_c8racz.webp'
            },
            {
                name: 'Wireless Headphones',
                price: 50,
                category: 'Electronics',
                description: 'Bluetooth headphones with noise cancellation',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055291/Bluetooth-Headphones-Wireless-Earbuds-Over-Ear-Bluetooth-Wireless-Headphones-Intelligent-Noise-Reduction-HiFi-Stereo-Foldable-Headset-With_640df7f1-641d-4032-ad4f-092a4cc49611.06294b1765f21f82255897add0c66d0c_ukgzvj.webp'
            },
            {
                name: 'Smart Watch',
                price: 150,
                category: 'Electronics',
                description: 'Fitness tracker with heart rate monitor',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_4_oijn4u.webp'
            },
            {
                name: 'Tablet',
                price: 300,
                category: 'Electronics',
                description: '10-inch tablet with 64GB storage',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_5_is0niy.webp'
            },

            // Danh mục Clothing
            {
                name: 'Cotton T-Shirt',
                price: 20,
                category: 'Clothing',
                description: 'Comfortable cotton T-shirt',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_6_vrhjkv.webp'
            },
            {
                name: 'Blue Jeans',
                price: 40,
                category: 'Clothing',
                description: 'Slim-fit blue jeans',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/OIP_7_vrumsd.webp'
            },
            {
                name: 'Jacket',
                price: 60,
                category: 'Clothing',
                description: 'Warm winter jacket',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/OIP_8_kxhbyc.webp'
            },
            {
                name: 'Sneakers',
                price: 70,
                category: 'Clothing',
                description: 'Stylish running sneakers',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055288/OIF_onw0eq.webp'
            },
            {
                name: 'Hoodie',
                price: 45,
                category: 'Clothing',
                description: 'Cozy cotton hoodie',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055288/OIP_9_qqnosq.webp'
            },

            // Danh mục Books
            {
                name: 'Fiction Novel',
                price: 15,
                category: 'Books',
                description: 'Best-selling fiction novel',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_10_fog2sj.webp'
            },
            {
                name: 'Science Textbook',
                price: 25,
                category: 'Books',
                description: 'Comprehensive science textbook',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/91PUaUX3nRL_esvvm3.jpg'
            },
            {
                name: 'History Book',
                price: 20,
                category: 'Books',
                description: 'Detailed history of the 20th century',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/OIP_11_l0bd8s.webp'
            },
            {
                name: 'Self-Help Book',
                price: 18,
                category: 'Books',
                description: 'Guide to personal growth',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055290/020b1b9cbf4b23936b5d0c38fe5b595d_kqq3lp.jpg'
            },
            {
                name: 'Cookbook',
                price: 22,
                category: 'Books',
                description: 'Recipes for everyday meals',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/OIP_12_ryuro8.webp'
            },

            // Danh mục Home
            {
                name: 'Table Lamp',
                price: 35,
                category: 'Home',
                description: 'Modern LED table lamp',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/OIP_13_tj8fqs.webp'
            },
            {
                name: 'Sofa',
                price: 500,
                category: 'Home',
                description: 'Comfortable 3-seater sofa',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/th_uvj7pe.webp'
            },
            {
                name: 'Coffee Maker',
                price: 80,
                category: 'Home',
                description: 'Automatic coffee maker',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055289/16f77040-27ab-4008-9852-59c900d7a7d9_1.c524f1d9c465e122596bf65f939c8d26_iwqncg.webp'
            },
            {
                name: 'Bed Sheets',
                price: 30,
                category: 'Home',
                description: 'Soft cotton bed sheets',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055288/OIP_14_fb9g6f.webp'
            },
            {
                name: 'Vacuum Cleaner',
                price: 120,
                category: 'Home',
                description: 'Powerful cordless vacuum',
                image: 'https://res.cloudinary.com/di1eiccl8/image/upload/v1757055288/istockphoto-985640624-612x612_thqxaw.jpg'
            },
        ];

        // Thêm dữ liệu mới
        await Product.insertMany(products);
        console.log(`Products seeded successfully: ${products.length} products added`);

        // Đóng kết nối và thoát
        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedProducts();