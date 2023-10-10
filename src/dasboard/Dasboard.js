import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import ProductListScreen from '../screens/admin/ProductListScreen';
const { Header, Content, Footer, Sider } = Layout;
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
    getItem('Dashboard', '1', <PieChartOutlined />, null, '/admin/dashboard'),
    getItem('Option 2', '2', <DesktopOutlined />, null, '/admin/option2'),
    getItem('Account', 'sub1', <UserOutlined />, [
        getItem('List Account', '3', null, null, '/admin/userlist'),
        getItem('Add Account', '4', null, null, '/admin/adduser'),
    ]),
    getItem('Product', 'sub2', <TeamOutlined />, [
        getItem('List Product', '5', null, null, '/admin/productlist'),
        getItem('Team 2', '6', null, null, '/admin/team2'),
    ]),
    getItem('Files', '9', <FileOutlined />, null, '/admin/files'),
];

const Dasboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider hasSider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    onSelect={(item) => setSelectedMenuItem(item.key)}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, minHeight: 660, background: colorBgContainer }}>
                        {selectedMenuItem === '1' && <div>Dashboard Details</div>}
                        {selectedMenuItem === '2' && <div>Option 2 Details</div>}
                        {selectedMenuItem === '3' && <div>List Account Details</div>}
                        {selectedMenuItem === '4' && <div>Add Account Details</div>}
                        {selectedMenuItem === '5' && <ProductListScreen />}
                        {selectedMenuItem === '6' && <div>Team 2 Details</div>}
                        {selectedMenuItem === '9' && <div>Files Details</div>}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Dasboard;