import { FileOutlined, MailOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd'
import React, { useState } from 'react'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('User', '1', <UserOutlined />),
  getItem('Email Template', '2', <MailOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [getItem('Tom', '3'), getItem('Bill', '4'), getItem('Alex', '5')]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />)
]

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <p className='font-bold uppercase text-28 text-white py-4 text-center'>Ecommerce</p>
        <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className='flex justify-end items-center !px-4 h-12'
        >
          <Dropdown menu={{ items }}>
            <Avatar
              src='https://d2welvdu9aysdk.cloudfront.net/uploads/account/img-avatar-user.png'
              className='cursor-pointer'
            />
          </Dropdown>
        </Header>
        <Content className='px-4'>
          <Breadcrumb items={[{ title: 'User' }]} className='py-2' />
          <Content className='w-full'>
            <div style={{ background: colorBgContainer }} className='p-4'>
              {children}
            </div>
          </Content>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Back Office</Footer>
      </Layout>
    </Layout>
  )
}
