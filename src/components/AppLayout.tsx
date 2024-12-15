import { Layout, Menu } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const items = [
  { key: '1', label: 'Home', link: '/' },
  { key: '2', label: 'Tests', link: '/tests' },
  { key: '3', label: 'Account', link: '/account' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout className="Layout" style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    {items.map((item) => (
                        <Menu.Item key={item.key}>
                            <Link to={item.link}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Header>
            <Content
                style={{
                    padding: '48px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        flex: 1,
                        minHeight: 0,
                        padding: 24,
                        borderRadius: 8,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Lingvoria ©{new Date().getFullYear()} Created by Pashhun
            </Footer>
        </Layout>
    )
}
