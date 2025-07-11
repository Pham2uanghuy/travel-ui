import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';

const SidebarAccountant: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: collapsed ? '6%' : '15%' }}>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['revenue']}
                style={{ flexGrow: 1, borderRight: 0, backgroundColor: '#f3e6e4' }}
                inlineCollapsed={collapsed}
            >
                <Menu.Item
                    key="toggle"
                    onClick={toggleCollapsed}
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    style={{ cursor: 'pointer' }}
                />
                {/* Bạn có thể thêm icon hoặc sửa label cho phù hợp */}
                <Menu.Item key="partner-payment" icon={<UnorderedListOutlined />}>
                    <Link to="/dashboard/partnerpayment">Partner Payment</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default SidebarAccountant;
