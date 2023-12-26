import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { useContext, useEffect, useState } from 'react'
import authApi from 'src/apis/auth.api'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { UserRole } from 'src/types/user.type'

interface FormData {
  email: string
  password: string
}

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const [token, setToken] = useState<string>('')

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const getUserProfileMutation = useMutation({
    mutationFn: () => userApi.getUserProfile()
  })

  const handleSubmit = async (dataForm: FormData) => {
    await loginMutation.mutate(dataForm, {
      onSuccess: (data) => {
        setToken(data?.data?.data?.access_token)
        // setIsAuthenticated(true)
      }
      // onError: (error) => {
      //   if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
      //     const formError = error.response?.data.data
      //     if (formError) {
      //       Object.keys(formError).forEach((key) => {
      //         setError(key as keyof FormData, {
      //           message: formError[key as keyof FormData],
      //           type: 'Server'
      //         })
      //       })
      //     }
      //   }
      // }
    })
  }

  useEffect(() => {
    if (token) {
      getUserProfileMutation.mutate(undefined, {
        onSuccess: () => {
          setIsAuthenticated(true)
        }
      })
    }
  }, [token])

  // const { data: productsData } = useQuery({
  //   queryKey: ['products', queryConfig],
  //   queryFn: () => {
  //     return productApi.getProducts(queryConfig as ProductListConfig)
  //   },
  //   keepPreviousData: true
  // })
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      password: '${label} is not a valid number!'
    }
  }

  return (
    <>
      <h1 className='font-bold text-32 md:text-48 mb-4'>Login</h1>
      <Form
        name='form-login'
        initialValues={{
          remember: true
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign='left'
        style={{ maxWidth: 600 }}
        noValidate
        onFinish={handleSubmit}
        validateMessages={validateMessages}
        className='p-10 shadow-black1 rounded-lg w-full'
      >
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Email' name='email' rules={[{ required: true }]} className='mb-4 font-medium'>
            <Input placeholder='Enter your email' className='h-10' />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Password' name='password' rules={[{ required: true }]} className='mb-4 font-medium'>
            <Input.Password placeholder='Enter your password' className='h-10' />
          </Form.Item>
        </div>
        <Button type='default' htmlType='submit' className='w-full'>
          Submit
        </Button>
      </Form>
    </>
  )
}
