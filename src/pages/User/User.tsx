import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Select, Space, Table } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'
import userApi from 'src/apis/user.api'
import { UserType } from 'src/types/user.type'

interface TableType {
  title: string
  dataIndex: string
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: any
}

export default function User() {
  const [open, setOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | string>('')
  const [selectedListUserId, setListSelectedUserId] = useState<number[] | string[]>([])
  const [form] = Form.useForm()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.getAllUser()
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
    // onSelect: (record, selected, selectedRows) => {
    //   console.log(record, selected, selectedRows)
    // },
    // onSelectAll: (selected, selectedRows, changeRows) => {
    //   console.log(selected, selectedRows, changeRows)
    // }
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
      />
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
