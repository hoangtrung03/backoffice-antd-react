import { useMutation } from '@tanstack/react-query'
import { Button, Flex, Form, Input, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import { SearchProps } from 'antd/es/input'
import { TableRowSelection } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userApi from 'src/apis/user.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { UserType } from 'src/types/user.type'
import { PaginationParams, PaginationType, TableType } from 'src/types/utils.type'
const { Search } = Input

export default function User() {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | string>('')
  const [selectedListUserId, setListSelectedUserId] = useState<number[] | string[]>([])
  const [userData, setUserData] = useState<UserType[] | undefined>([])
  const [paginationData, setPaginationData] = useState<PaginationType | undefined>({})
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()

  const getAllUserMutation = useMutation({
    mutationFn: (queryParam?: PaginationParams) => userApi.getAllUser(queryParam)
  })

  useEffect(() => {
    getAllUserMutation.mutate(queryConfig as PaginationParams, {
      onSuccess: (data) => {
        setUserData(data?.data?.data)
        setPaginationData(data?.data?.pagination)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userApi.deleteUserById(id)
  })

  const deleteListUserMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUserByIds(id)
  })

  const searchMutation = useMutation({
    mutationFn: (value: string, queryParam?: PaginationParams) => userApi.searchUser(value, queryParam)
  })

  const handleEdit = (id: number) => {
    console.log(id)
  }

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedUserId(id)
  }

  const handleOnOK = (id: number | string) => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => {
        getAllUserMutation.reset()
      }
    })
    setOpen(false)
  }

  const rowSelection: TableRowSelection<UserType> = {
    onChange: (selectedRowKeys) => {
      setListSelectedUserId(selectedRowKeys.map((id) => id.toString()))
    }
  }

  const columns: TableType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstname'
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth'
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: { id: number; name: string }[]) => roles && roles.map((role) => role.name).join(', ')
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

  const dataSelectHandler = [
    {
      label: 'Drop',
      value: 'drop'
    }
  ]

  const handleSubmit = () => {
    if (form.getFieldsValue().handler === 'drop') {
      const ids = selectedListUserId.map((id) => id.toString()).join(',')

      ids &&
        deleteListUserMutation.mutate(ids, {
          onSuccess: () => {
            setListSelectedUserId([])
          }
        })
      setOpen(false)
    }
  }

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
  }

  const handleSearch: SearchProps['onSearch'] = (value) => {
    navigate('?search=' + value)
    searchMutation.mutate(value, {
      onSuccess: (data) => {
        setUserData(data?.data?.data)
      },
      onError: () => {
        setUserData([])
      }
    })
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
        <Search placeholder='Search' allowClear onSearch={handleSearch} className='w-full md:w-1/3' size='large' />
      </Flex>
      <Table
        dataSource={userData}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        rowKey='id'
        loading={getAllUserMutation.isPending}
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
        onOk={() => handleOnOK(selectedUserId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </>
  )
}
