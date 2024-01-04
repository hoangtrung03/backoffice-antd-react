import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import { TableRowSelection } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import categoryApi from 'src/apis/category.api'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { CategoryType } from 'src/types/category.type'
import { PaginationParams, PaginationType, TableType } from 'src/types/utils.type'

export default function Category() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('')
  const [selectedListCategoryId, setListSelectedCategoryId] = useState<number[] | string[]>([])
  const [paginationData, setPaginationData] = useState<PaginationType | undefined>({})
  const [categoryData, setCategoryData] = useState<CategoryType[] | undefined>([])
  const queryConfig = useQueryConfig()

  const {
    data: dataCategory,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['user', queryConfig],
    queryFn: () => categoryApi.getAllCategory(queryConfig as PaginationParams)
  })

  useEffect(() => {
    if (dataCategory) {
      setCategoryData(dataCategory?.data?.data)
      setPaginationData(dataCategory?.data?.pagination)
    }
  }, [dataCategory])

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number | string) => categoryApi.deleteCategoryById(id)
  })

  const deleteListCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategoryByIds(id)
  })

  const searchMutation = useMutation({
    mutationFn: (value: string, queryParam?: PaginationParams) => categoryApi.searchCategory(value, queryParam)
  })

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedCategoryId(id)
  }

  const handleEdit = (id: number) => {
    navigate(`${path.category}/${id}`)
  }

  const dataSelectHandler = [
    {
      label: 'Drop',
      value: 'drop'
    }
  ]

  const columns: TableType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug'
    },
    {
      title: 'Children Categories',
      dataIndex: 'sub_categories',
      key: 'sub_categories',
      render: (sub_categories: CategoryType[]) => {
        return (
          <p className='whitespace-pre'>
            {sub_categories &&
              sub_categories
                .map(
                  (category) =>
                    `ID: ${category.id}` +
                    ' - ' +
                    `Name: ${category.name.length > 10 ? category.name.substring(0, 10) + '...' : category.name}`
                )
                .join('\r\n')}
          </p>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: boolean) => {
        return <p>{value === true ? 'Active' : 'Inactive'}</p>
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: { id: number }) => {
        return (
          <Space size='middle'>
            <Button onClick={() => handleEdit(record.id)}>Edit</Button>
            <Button type='primary' danger ghost onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </Space>
        )
      }
    }
  ]

  const handleSubmit = () => {
    if (form.getFieldsValue().handler === 'drop') {
      const ids = selectedListCategoryId.map((id) => id.toString()).join(',')

      ids &&
        deleteListCategoryMutation.mutate(ids, {
          onSuccess: () => {
            refetch()
            setListSelectedCategoryId([])
          }
        })
      setOpen(false)
    }
  }

  const handleSearch: SearchProps['onSearch'] = (value) => {
    navigate('?search=' + value)
    searchMutation.mutate(value, {
      onSuccess: (data) => {
        setCategoryData(data?.data?.data)
        setPaginationData(data?.data?.pagination)
      },
      onError: () => {
        setCategoryData([])
      }
    })
  }

  const rowSelection: TableRowSelection<CategoryType> = {
    onChange: (selectedRowKeys) => {
      setListSelectedCategoryId(selectedRowKeys.map((id) => id.toString()))
    }
  }

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
    refetch()
  }

  const handleOnOK = (id: number | string) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        refetch()
      }
    })
    setOpen(false)
  }

  return (
    <>
      <Flex justify='space-between' align='center' className='mb-4' gap={12}>
        <Form
          form={form}
          name='form-handle'
          noValidate
          onFinish={handleSubmit}
          initialValues={{ handler: dataSelectHandler[0].value, remember: true }}
        >
          <Space wrap>
            <Form.Item name='handler' className='mb-0'>
              <Select
                style={{ width: 120 }}
                placeholder='Handler'
                options={dataSelectHandler.map((data) => ({ label: data.label, value: data.value }))}
              />
            </Form.Item>
            <Button htmlType='submit'>Submit</Button>
          </Space>
        </Form>
        <Flex justify='end' align='center' className='flex-1' gap={12}>
          <Search placeholder='Search' allowClear onSearch={handleSearch} className='w-full md:w-1/3' size='large' />
          <Button onClick={() => navigate(path.addCategory)}>Add Category</Button>
        </Flex>
      </Flex>
      <Table
        dataSource={categoryData}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        rowKey='id'
        loading={isLoading}
        bordered
        className='overflow-x-auto scrollbar-input'
        pagination={false}
      />
      {paginationData?.total_page !== 1 && (
        <Pagination
          showQuickJumper
          current={paginationData?.page}
          pageSize={paginationData?.size}
          total={(paginationData?.total_page ?? 0) * (paginationData?.size ?? 1)}
          onChange={handleChangePagination}
          showSizeChanger={false}
          className='mt-4 text-right'
        />
      )}
      <Modal
        title='Confirm delete'
        open={open}
        okButtonProps={{ danger: true }}
        onOk={() => handleOnOK(selectedCategoryId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </>
  )
}
