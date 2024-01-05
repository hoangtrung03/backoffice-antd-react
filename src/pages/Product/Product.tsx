import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import { TableRowSelection } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductType } from 'src/types/product.type'
import { PaginationParams, PaginationType, TableType } from 'src/types/utils.type'

export default function Product() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const [open, setOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | string>('')
  const [selectedListProductId, setListSelectedProductId] = useState<number[] | string[]>([])
  const [paginationData, setPaginationData] = useState<PaginationType | undefined>({})
  const [productData, setProductData] = useState<ProductType[] | undefined>([])

  const {
    data: dataProduct,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['user', queryConfig],
    queryFn: () => productApi.getAllProduct(queryConfig as PaginationParams)
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id: number | string) => productApi.deleteProductById(id)
  })

  const deleteListProductMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProductByIds(id)
  })

  useEffect(() => {
    if (dataProduct) {
      setProductData(dataProduct?.data?.data)
      setPaginationData(dataProduct?.data?.pagination)
    }
  }, [dataProduct])

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
      title: 'Category ID',
      dataIndex: 'category_id',
      key: 'category_id'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
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

  const handleEdit = (id: number) => {
    navigate(`${path.product}/${id}`)
  }

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedProductId(id)
  }

  const handleSubmit = () => {
    if (form.getFieldsValue().handler === 'drop') {
      const ids = selectedListProductId.map((id) => id.toString()).join(',')

      ids &&
        deleteListProductMutation.mutate(ids, {
          onSuccess: () => {
            refetch()
            setListSelectedProductId([])
          }
        })
      setOpen(false)
    }
  }

  const rowSelection: TableRowSelection<ProductType> = {
    onChange: (selectedRowKeys) => {
      setListSelectedProductId(selectedRowKeys.map((id) => id.toString()))
    }
  }

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
    refetch()
  }

  const handleOnOK = (id: number | string) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        refetch()
      }
    })
    setOpen(false)
  }

  const handleSearch: SearchProps['onSearch'] = (value) => {
    navigate('?search=' + value)
    // searchMutation.mutate(value, {
    //   onSuccess: (data) => {
    //     setCategoryData(data?.data?.data)
    //     setPaginationData(data?.data?.pagination)
    //   },
    //   onError: () => {
    //     setCategoryData([])
    //   }
    // })
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
          <Button onClick={() => navigate(path.addProduct)}>Add Product</Button>
        </Flex>
      </Flex>
      <Table
        dataSource={productData}
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
        onOk={() => handleOnOK(selectedProductId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </>
  )
}
