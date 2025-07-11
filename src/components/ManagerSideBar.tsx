import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';

const ManagerSideBar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '10%' }}>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['dashboard']}
                style={{ flexGrow: 1, borderRight: 0, backgroundColor: '#f3e6e4' }}
                inlineCollapsed={collapsed}
            >
                <Menu.Item key="toggle" onClick={toggleCollapsed} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} style={{ cursor: 'pointer' }} />
                {/* <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    <Link to="/dashboard">Dashboard</Link>
                </Menu.Item> */}
                <Menu.Item key="manage-tours" icon={<UnorderedListOutlined />}>
                    <Link to="/dashboard/manage-tours">Manage tours</Link>
                </Menu.Item>
                <Menu.Item key="revenue" icon={<UnorderedListOutlined />}>
                    <Link to="/dashboard/revenue">Revenue Statistics</Link>
                </Menu.Item>
                <Menu.Item key="partner-payment" icon={<UnorderedListOutlined />}>
                    <Link to="/dashboard/partnerpayment">Partner Payment</Link>
                </Menu.Item>

            </Menu>
        </div>
    );
};

export default ManagerSideBar;
