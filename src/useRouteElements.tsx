import { Suspense, useContext } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './contexts/app.context'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import Category from './pages/Category'
import AddCategory from './pages/Category/AddCategory'
import EditCategory from './pages/Category/EditCategory'
import Email from './pages/Email'
import AddEmail from './pages/Email/AddEmail'
import EditEmail from './pages/Email/EditEmail'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Role from './pages/Role'
import AddRole from './pages/Role/AddRole'
import EditRole from './pages/Role/EditRole'
import User from './pages/User'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense>
                <User />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: '/role',
          element: (
            <MainLayout>
              <Suspense>
                <Role />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: '/role/:id',
          element: (
            <MainLayout>
              <Suspense>
                <EditRole />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.addRole,
          element: (
            <MainLayout>
              <Suspense>
                <AddRole />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.email,
          element: (
            <MainLayout>
              <Suspense>
                <Email />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.addEmail,
          element: (
            <MainLayout>
              <Suspense>
                <AddEmail />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: `${path.email}/:id`,
          element: (
            <MainLayout>
              <Suspense>
                <EditEmail />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.category,
          element: (
            <MainLayout>
              <Suspense>
                <Category />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.addCategory,
          element: (
            <MainLayout>
              <Suspense>
                <AddCategory />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.editCategory,
          element: (
            <MainLayout>
              <Suspense>
                <EditCategory />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <AuthLayout>
              <Suspense>
                <Login />
              </Suspense>
            </AuthLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])

  return <RouterProvider router={router} />
}
