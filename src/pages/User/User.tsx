import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'
import userApi from 'src/apis/user.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { UserType } from 'src/types/user.type'
import { PaginationParams, TableType } from 'src/types/utils.type'

export default function User() {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | string>('')
  const [selectedListUserId, setListSelectedUserId] = useState<number[] | string[]>([])
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user', queryConfig],
    queryFn: () => userApi.getAllUser(queryConfig as PaginationParams)
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userApi.deleteUserById(id)
  })

  const deleteListUserMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUserByIds(id)
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
        refetch()
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
            refetch()
            setListSelectedUserId([])
          }
        })
      setOpen(false)
    }
  }

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
    refetch()
  }

  return (
    <>
      <Flex justify='space-between' align='center'>
        <Form
          form={form}
          name='form-handle'
          noValidate
          onFinish={handleSubmit}
          initialValues={{ handler: dataSelectHandler[0].value, remember: true }}
          className='mb-4'
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
      </Flex>

      <Table
        dataSource={data?.data?.data}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        rowKey='id'
        loading={isLoading}
        bordered
        className='overflow-x-auto scrollbar-input'
        pagination={false}
      />
      {data?.data?.pagination?.total_page !== 1 && (
        <Pagination
          showQuickJumper
          current={data?.data?.pagination?.page}
          pageSize={data?.data?.pagination?.size}
          total={(data?.data?.pagination?.total_page ?? 0) * (data?.data?.pagination?.size ?? 1)}
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
