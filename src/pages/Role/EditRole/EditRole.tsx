import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import roleApi from 'src/apis/role.api'

interface FormData {
  id: string | number
  name: string
}

export default function EditRole() {
  const { id } = useParams() as { id: string | number }
  const [form] = Form.useForm()
  const navigation = useNavigate()

  const { data } = useQuery({
    queryKey: ['role', id],
    queryFn: () => roleApi.getRoleById(id)
  })

  const updateRoleMutation = useMutation({
    mutationFn: (body: FormData) => roleApi.updateRoleById(body)
  })

  const handleSubmit = (dataForm: FormData) => {
    console.log(dataForm)

    updateRoleMutation.mutate(dataForm, {
      onSuccess: (data) => {
        console.log(data)
        toast.success(data?.data?.message, {
          position: 'top-right'
        })
        navigation('/role')
      }
    })
  }

  useEffect(() => {
    if (data && data.data) {
      form.setFieldsValue({
        id: data?.data?.data?.id,
        name: data?.data?.data?.name
      })
    }
  }, [data, form])

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
          <Form.Item label='ID' name='id' className='mb-4 font-medium'>
            <Input className='h-10' disabled readOnly />
          </Form.Item>
        </div>
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
