import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import authApi from 'src/apis/auth.api'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { clearCookies } from 'src/utils/auth'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

interface FormData {
  email: string
  password: string
}

interface Validate {
  name: string
  message: string
}

export default function Login() {
  const [form] = Form.useForm()
  const { setIsAuthenticated, reset } = useContext(AppContext)
  const [token, setToken] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const getUserProfileMutation = useMutation({
    mutationFn: () => userApi.getUserProfile()
  })

  const handleSubmit = (dataForm: FormData) => {
    loginMutation.mutate(dataForm, {
      onSuccess: (data) => {
        setToken(data?.data?.data?.access_token)
        setMessage(data?.data?.message)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Validate>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            form.setFields([
              {
                name: formError.name,
                errors: [formError.message]
              }
            ])
          }
        }
      }
    })
  }

  useEffect(() => {
    if (token) {
      getUserProfileMutation.mutate(undefined, {
        onSuccess: (data) => {
          if (data?.data?.data?.roles.some((role) => role.name.includes('ADMIN'))) {
            setIsAuthenticated(true)
            toast.success(message, {
              position: 'top-right'
            })
          } else {
            reset()
            clearCookies()
            toast.error('You are not ADMIN', {
              position: 'top-right'
            })
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
        form={form}
        name='form-login'
        initialValues={{
          remember: true
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign='left'
        style={{ maxWidth: 600 }}
        noValidate
        scrollToFirstError
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
        <Button type='default' htmlType='submit' className='w-full' loading={loginMutation.isPending}>
          Submit
        </Button>
      </Form>
    </>
  )
}
