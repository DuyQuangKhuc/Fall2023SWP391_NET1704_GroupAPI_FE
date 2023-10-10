import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { PieChartOutlined, UserOutlined, DesktopOutlined, FileOutlined } from '@ant-design/icons';
import UserListScreen from '../screens/admin/UserListScreen';
import UserEditScreen from '../screens/admin/UserEditScreen';
import ProductListScreen from '../screens/admin/ProductListScreen';
import ProductEditScreen from '../screens/admin/ProductEditScreen';
import OrderListScreen from '../screens/admin/OrderListScreen';
import { Navigate } from 'react-router-dom';

const { Content, Sider } = Layout;

function getItem(label, key, icon, children, route) {
    return {
        key,
        icon,
        children,
        label,
        route
    };
}

const items = [
    getItem('Dashboard', '1', <PieChartOutlined />, null, '/admin'),
    getItem('Account', 'sub1', <UserOutlined />, [
        getItem('List Account', '3', null, null, '/admin/userlist'),
        getItem('Edit Account', '4', null, null, '/admin/user/:id/edit'),
    ]),
    getItem('Product', 'sub2', <DesktopOutlined />, [
        getItem('List Product', '5', null, null, '/admin/productlist'),
        getItem('Edit Product', '6', null, null, '/admin/user/:id/edit'),
    ]),
    getItem('Files', '9', <FileOutlined />, null, '/admin/orderlist'),
];

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const handleMenuClick = (item) => {
        setSelectedMenuItem(item.key);
        switch (item.key) {
            case '1':
                Navigate('/admin');
                break;
            case '2':
                Navigate('/admin/userlist');
                break;
            case '3':
                Navigate('/admin/user/:id/edit');
                break;
            case '4':
                Navigate('/admin/productlist');
                break;
            case '5':
                Navigate('/admin/user/:id/edit');
                break;
            case '6':
                Navigate('/admin/orderlist');
                break;
            default:
                break;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    onSelect={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, minHeight: 660 }}>
                        {selectedMenuItem === '1' && <div>Dashboard Details</div>}
                        {selectedMenuItem === '2' && <UserListScreen />}
                        {selectedMenuItem === '3' && <UserEditScreen />}
                        {selectedMenuItem === '4' && <ProductListScreen />}
                        {selectedMenuItem === '5' && <ProductEditScreen />}
                        {selectedMenuItem === '6' && <OrderListScreen />}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
