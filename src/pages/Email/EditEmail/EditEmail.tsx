import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Radio, RadioChangeEvent, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import emailApi from 'src/apis/email.api'
import path from 'src/constants/path'
import { EmailType } from 'src/types/email.type'

type FormData = Pick<EmailType, 'type' | 'status' | 'subject' | 'content'>

export default function EditEmail() {
  const [form] = Form.useForm()
  const navigation = useNavigate()
  const { id } = useParams() as { id: string | number }

  const updateEmailMutation = useMutation({
    mutationFn: (body: FormData) => emailApi.updateEmailById(id, body)
  })

  const { data: dataEmail } = useQuery({
    queryKey: ['email', ''],
    queryFn: () => emailApi.getEmailById(id)
  })

  useEffect(() => {
    if (dataEmail && dataEmail.data) {
      form.setFieldsValue({
        type: dataEmail?.data?.data?.type,
        status: dataEmail?.data?.data?.status,
        subject: dataEmail?.data?.data?.subject,
        content: dataEmail?.data?.data?.content
      })
    }
  }, [dataEmail, form])

  const handleSubmit = (dataForm: FormData) => {
    updateEmailMutation.mutate(dataForm, {
      onSuccess: (data) => {
        console.log(data)
        toast.success(data?.data?.message, {
          position: 'top-right'
        })
        navigation(path.email)
      }
    })
  }

  const onChange = (e: RadioChangeEvent) => {
    form.setFieldValue('status', e.target.value)
  }

  useEffect(() => {
    form.setFieldsValue({
      status: true
    })
  }, [form])

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
            label='Type'
            name='type'
            rules={[{ required: true, message: 'Please enter Type' }]}
            className='mb-4 font-medium'
          >
            <Input placeholder='Enter Type' className='h-10' />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item
            label='Subject'
            name='subject'
            rules={[{ required: true, message: 'Please enter Subject' }]}
            className='mb-4 font-medium'
          >
            <Input placeholder='Enter Subject' className='h-10' />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Content' name='content' className='mb-4 font-medium'>
            <TextArea placeholder='Enter Content' style={{ height: 120, resize: 'none' }} />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Status' name='status' className='mb-4 font-medium'>
            <Radio.Group onChange={onChange}>
              <Radio value={true}>Active</Radio>
              <Radio value={false}>Inactive</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Space wrap>
          <Button htmlType='submit' className='px-10 h-10'>
            Save
          </Button>
          <Button htmlType='button' onClick={() => navigation(path.email)} className='px-10 h-10'>
            Cancel
          </Button>
        </Space>
      </Form>
    </>
  )
}
