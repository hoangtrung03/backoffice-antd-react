import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { useContext } from 'react'
import authApi from 'src/apis/auth.api'
import { AppContext } from 'src/contexts/app.context'

interface FormData {
  email: string
  password: string
}

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })

  const handleSubmit = (dataForm: FormData) => {
    console.log('dataForm', dataForm)
    loginMutation.mutate(dataForm, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        console.log('data', data)
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
      <Form.Item label='Email' name='email' rules={[{ required: true }]} className='mb-4'>
        <Input />
      </Form.Item>

      <Form.Item label='Password' name='password' rules={[{ required: true }]} className='mb-4'>
        <Input type='password' />
      </Form.Item>

      <Button type='default' htmlType='submit' className='w-full'>
        Submit
      </Button>
    </Form>
  )
}
