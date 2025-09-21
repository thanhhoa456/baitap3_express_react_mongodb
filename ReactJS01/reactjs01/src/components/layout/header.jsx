import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    console.log(">>> check auth: ", auth);

    const items = [
        {
            label: <Link to="/">Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(auth.isAuthenticated
            ? [
                {
                    label: <Link to="/user">User</Link>,
                    key: 'user',
                    icon: <UsergroupAddOutlined />,
                },
            ]
            : []),
{
    label: auth.isAuthenticated && auth.user.email ? `Welcome ${auth.user.email}` : 'Welcome',
    key: 'submenu',
    icon: <SettingOutlined />,
    children: [
        ...(auth.isAuthenticated
            ? [
                {
                    label: (
<span
    onClick={() => {
        localStorage.removeItem('access_token');
        setAuth({
            isAuthenticated: false,
            user: { email: '', name: '' },
        });
        // Navigate after state update to ensure re-render
        setTimeout(() => {
            navigate('/');
        }, 0);
    }}
>
    Đăng xuất
</span>
                    ),
                    key: 'logout',
                },
            ]
            : [
                {
                    label: <Link to="/login">Đăng nhập</Link>,
                    key: 'login',
                },
                {
                    label: <Link to="/register">Đăng ký</Link>,
                    key: 'register',
                },
            ]),
    ],
},
    ];

    const [current, setCurrent] = useState('home');

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default Header;