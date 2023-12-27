import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Modal, Space, Table } from 'antd'
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: () => userApi.getAllUser()
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => userApi.deleteUserById(id)
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
    // onChange: (selectedRowKeys, selectedRows) => {
    //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    // },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows)
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

  return (
    <>
      <Table
        dataSource={data?.data?.data}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        rowKey='id'
        loading={isLoading}
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
