import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Select, Form, Row, Col } from 'antd';
import { AuthContext } from './context/auth.context';
import { getProductByIdApi, buyProductApi } from '../util/api';

const { Option } = Select;

const PaymentPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    useEffect(() => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await getProductByIdApi(productId);
                if (response.EC === 0) {
                    setProduct(response.data);
                } else {
                    message.error(response.message || 'Không thể tải thông tin sản phẩm');
                }
            } catch (error) {
                message.error('Lỗi khi tải thông tin sản phẩm');
            }
            setLoading(false);
        };

        fetchProduct();
    }, [productId, auth.isAuthenticated, navigate]);

    const handleConfirmPayment = async () => {
        if (!product) {
            message.error('Không có thông tin sản phẩm để thanh toán');
            return;
        }
        try {
            console.log('Calling buyProductApi with productId:', productId);
            const response = await buyProductApi({ productId });
            console.log('buyProductApi response:', response);
                if (response.EC === 0) {
                    console.log('Payment successful, showing message');
                    alert('Thanh toán thành công! Số lượt mua đã được cập nhật.');
                    console.log('Alert closed, navigating to home');
                    localStorage.setItem('refreshProducts', Date.now().toString());
                    navigate('/');
                } else {
                    console.log('Payment failed:', response.message);
                    message.error(response.message || 'Lỗi khi thanh toán');
                }
        } catch (error) {
            console.log('Error in payment:', error);
            message.error('Lỗi khi thanh toán');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-10 text-red-500">Không tìm thấy sản phẩm</div>;
    }

    const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Card
                title="Thanh toán sản phẩm"
                className="shadow-lg rounded-2xl"
                bodyStyle={{ padding: "24px" }}
            >
                <Row gutter={[32, 32]} align="middle">
                    {/* Cột hình ảnh */}
                    <Col xs={24} md={10} className="flex justify-center">
                        <img
                            alt={product.name}
                            src={product.image || 'https://via.placeholder.com/160x160.png?text=No+Image'}
                            style={{
                                maxWidth: '160px',
                                maxHeight: '160px',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'scale-down',
                                borderRadius: '6px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                margin: '0 auto',
                                display: 'block'
                            }}
                        />


                    </Col>

                    {/* Cột thông tin */}
                    <Col xs={24} md={14}>
                        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                        <div className="space-y-2 mb-6">
                            <p className="text-lg">
                                <strong>Giá:</strong>{" "}
                                <span className="text-blue-600 font-semibold">
                                    {discountedPrice.toLocaleString()} VNĐ
                                </span>
                            </p>
                            {product.discount > 0 && (
                                <p className="text-sm">
                                    <span className="text-red-500 line-through">
                                        {product.price.toLocaleString()} VNĐ
                                    </span>
                                    <span className="ml-2 text-green-600 font-medium">
                                        (-{product.discount}%)
                                    </span>
                                </p>
                            )}
                            <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
                        </div>

                        <Form layout="vertical" className="space-y-4">
                            <Form.Item label="Phương thức thanh toán">
                                <Select value={paymentMethod} onChange={setPaymentMethod}>
                                    <Option value="cash">Tiền mặt</Option>
                                    <Option value="card">Thẻ tín dụng</Option>
                                    <Option value="bank">Chuyển khoản ngân hàng</Option>
                                </Select>
                            </Form.Item>
                            <Button
                                type="primary"
                                onClick={handleConfirmPayment}
                                className="bg-blue-500 hover:bg-blue-600 w-full h-12 text-lg font-semibold rounded-lg"
                            >
                                Xác nhận thanh toán
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PaymentPage;
