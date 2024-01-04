import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Radio, RadioChangeEvent, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import categoryApi from 'src/apis/category.api'
import path from 'src/constants/path'
import { CategoryType } from 'src/types/category.type'
import { convertToSlug } from 'src/utils/utils'

type FormData = Pick<CategoryType, 'name' | 'slug' | 'status' | 'description' | 'parent_category_id'> & {
  parentCategoryId: number
}

export default function EditCategory() {
  const [form] = Form.useForm()
  const navigation = useNavigate()
  const { id } = useParams() as { id: string | number }

  const { data: dataCategory } = useQuery({
    queryKey: ['email'],
    queryFn: () => categoryApi.getCategoryById(id)
  })

  console.log(dataCategory)

  useEffect(() => {
    if (dataCategory && dataCategory.data) {
      form.setFieldsValue({
        name: dataCategory?.data?.data?.name,
        parentCategoryId: dataCategory?.data?.data?.parent_category_id,
        slug: dataCategory?.data?.data?.slug,
        status: dataCategory?.data?.data?.status,
        description: dataCategory?.data?.data?.description
      })
    }
  }, [dataCategory, form])

  const addCategoryMutation = useMutation({
    mutationFn: (body: FormData) => categoryApi.editCategoryById(id, body)
  })

  const handleSubmit = (dataForm: FormData) => {
    console.log(dataForm)
    dataForm.description === '' ? (dataForm.description = null) : dataForm.description
    addCategoryMutation.mutate(dataForm, {
      onSuccess: (data) => {
        toast.success(data?.data?.message, {
          position: 'top-right'
        })
        navigation(path.category)
      }
    })
  }

  const onChange = (e: RadioChangeEvent) => {
    form.setFieldValue('status', e.target.value)
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
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please enter Name' }]}
            className='mb-4 font-medium'
          >
            <Input
              placeholder='Enter Name'
              className='h-10'
              onChange={(e) => {
                form.setFieldsValue({
                  slug: convertToSlug(e.target.value)
                })
              }}
            />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item
            label='Slug'
            name='slug'
            rules={[{ required: true, message: 'Please enter Slug' }]}
            className='mb-4 font-medium'
          >
            <Input placeholder='Enter Slug' className='h-10' />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Content' name='description' className='mb-4 font-medium'>
            <TextArea placeholder='Enter Content' style={{ height: 120, resize: 'none' }} />
          </Form.Item>
        </div>
        <div className='mb-4 md:mb-8'>
          <Form.Item label='Parent Category Id' name='parentCategoryId' className='mb-4 font-medium'>
            <Input type='number' placeholder='Enter Parent Category Id' className='h-10' />
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
          <Button htmlType='button' onClick={() => navigation(path.category)} className='px-10 h-10'>
            Cancel
          </Button>
        </Space>
      </Form>
    </>
  )
}
