import { KeyOutlined, MailOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import { UserType } from 'src/types/user.type'
import { clearCookies, getProfileFromLS } from 'src/utils/auth'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const [userData, setUserData] = useState<UserType>()

  useEffect(() => {
    const profileData = getProfileFromLS()
    setUserData(profileData)
  }, [])

  const routes = [
    { path: path.home, key: '1' },
    { path: path.role, key: '2' },
    { path: path.email, key: '3' },
    { path: path.category, key: '4' }
  ]

  const matchingRoute = routes.find((route) => {
    if (route.path === path.home) {
      return location.pathname === route.path
    } else {
      return location.pathname.startsWith(route.path)
    }
  })

  const defaultSelectedKey = matchingRoute ? matchingRoute.key : '1'
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
    getItem(
      <Link to={path.email} title='Email'>
        Email
      </Link>,
      '3',
      <MailOutlined />
    ),
    getItem(
      <Link to={path.category} title='Category'>
        Category
      </Link>,
      '4',
      <QrcodeOutlined />
    )
  ]

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          onClick={() => {
            clearCookies()
            window.location.reload()
            toast.success('Logout successfully', { position: 'top-right' })
          }}
          className='w-full border-none'
        >
          Logout
        </Button>
      )
    }
  ]

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
          <p className='mr-4 h-full flex items-center'>{userData?.firstname + ' ' + userData?.lastname}</p>
          <Dropdown menu={{ items: dropdownItems }} className='p-0'>
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
