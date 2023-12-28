import { FileOutlined, KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd'
import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'

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
  getItem(
    <Link to={path.home} title='User'>
      User
    </Link>,
    '1',
    <UserOutlined />
  ),
  getItem(
    <Link to={path.role} title='Role'>
      Role
    </Link>,
    '2',
    <KeyOutlined />
  ),
  getItem('Email Template', '3', <MailOutlined />),
  // getItem('Team', '4', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '5', <FileOutlined />)
]

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { profile } = useContext(AppContext)

  const routes = [
    { path: path.home, key: '1' },
    { path: `${path.role}`, key: '2' },
    { path: '/email', key: '3' },
    { path: '/files', key: '4' }
  ]

  const currentRoute = routes.find((route) => route.path === location.pathname)
  const defaultSelectedKey = currentRoute ? currentRoute.key : '1'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <p className='font-bold uppercase text-28 text-white py-4 text-center'>Ecommerce</p>
        <Menu theme='dark' defaultSelectedKeys={[defaultSelectedKey]} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className='flex justify-end items-center !px-4 h-12'
        >
          <p className='mr-4 h-full flex items-center'>{profile?.firstname + ' ' + profile?.lastname}</p>
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
