import { Menu, Typography } from 'antd';
import { useAuthStore } from "../stores/auth.store.ts";
import MenuOptions from "./MenuOptions.tsx";
import React from "react";
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { Title } = Typography;
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login'); // chuyển về trang login sau khi logout
    };

    return (
        <div className="bg-blue-900 flex items-center p-4">
            <Title level={3} style={{ color: 'white', margin: 0 }}>
                Travel Agency
            </Title>
            {user?.email && (
                <Menu
                    mode="horizontal"
                    style={{ backgroundColor: 'transparent', color: 'white', marginLeft: 'auto' }}
                >
                    <MenuOptions
                        email={user.email}
                        onLogout={handleLogout}
                    />
                </Menu>
            )}
        </div>
    );
};
