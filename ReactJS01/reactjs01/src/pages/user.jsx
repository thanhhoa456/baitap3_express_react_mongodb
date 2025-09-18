import { notification, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";
import FavoritesList from "../components/FavoritesList";
import ViewedList from "../components/ViewedList";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getUserApi();
                if (res?.EC === 0 && res?.data) {
                    // Wrap user data in an array for Ant Design Table
                    setDataSource([res.data]);
                } else {
                    setError(res?.message || "Không thể lấy thông tin người dùng");
                    notification.error({
                        message: "Lỗi",
                        description: res?.message || "Không thể lấy thông tin người dùng",
                    });
                }
            } catch (error) {
                setError(error.message || "Lỗi không xác định khi lấy thông tin người dùng");
                notification.error({
                    message: "Lỗi",
                    description: error.message || "Lỗi không xác định khi lấy thông tin người dùng",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    const items = [
        {
            key: '1',
            label: 'Thông tin cá nhân',
            children: (
                <>
                    {error && (
                        <div style={{ color: 'red', marginBottom: 16 }}>
                            {error}
                        </div>
                    )}
                    <Table
                        bordered
                        loading={loading}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="_id"
                    />
                </>
            ),
        },
        {
            key: '2',
            label: 'Sản phẩm yêu thích',
            children: <FavoritesList />,
        },
        {
            key: '3',
            label: 'Sản phẩm đã xem',
            children: <ViewedList />,
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default UserPage;