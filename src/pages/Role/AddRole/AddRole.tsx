import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import roleApi from 'src/apis/role.api'

interface FormData {
  name: string
}

export default function AddRole() {
  const [form] = Form.useForm()
  const navigation = useNavigate()

  const addRoleMutation = useMutation({
    mutationFn: (body: FormData) => roleApi.createRole(body)
  })

  const handleSubmit = (dataForm: FormData) => {
    console.log(dataForm)

    addRoleMutation.mutate(dataForm, {
      onSuccess: (data) => {
        console.log(data)
        toast.success(data?.data?.message, {
          position: 'top-right'
        })
        navigation('/role')
      }
    })
  }

  return (
    <>
      <Form
        form={form}
        name='form-handle'
        onFinish={handleSubmit}
        className='mb-4'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign='left'
      >
        <div className='mb-4 md:mb-8'>
          <Form.Item
            label='Role Name'
            name='name'
            rules={[{ required: true, message: 'Please enter Role Name' }]}
            className='mb-4 font-medium'
          >
            <Input
              placeholder='Enter Role'
              className='h-10'
              onChange={(e) => form.setFieldValue('name', e.target.value.toUpperCase())}
            />
          </Form.Item>
        </div>
        <Button htmlType='submit' className='px-10 h-10'>
          Save
        </Button>
      </Form>
    </>
  )
}
