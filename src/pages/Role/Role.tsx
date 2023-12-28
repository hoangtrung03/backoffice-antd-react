import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Modal, Pagination, PaginationProps, Space, Table } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import roleApi from 'src/apis/role.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { PaginationParams, TableType } from 'src/types/utils.type'

export default function Role() {
  const [open, setOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedListRoleId, setSelectedListRoleId] = useState<number[] | string[]>([])
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['role', queryConfig],
    queryFn: () => roleApi.getAllRole(queryConfig as PaginationParams)
  })

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number | string) => roleApi.deleteRoleById(id)
  })

  const handleEdit = (id: number) => {
    navigate(`/role/${id}`)
  }

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedRoleId(id)
  }

  const handleOnOK = (id: number | string) => {
    deleteRoleMutation.mutate(id, {
      onSuccess: () => {
        refetch()
      }
    })
    setOpen(false)
  }

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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: { id: number }) => {
        return (
          <Space size='middle'>
            <Button onClick={() => handleEdit(record.id)}>Edit</Button>
            <Button
              type='primary'
              danger
              ghost
              onClick={() => handleDelete(record.id)}
              loading={deleteRoleMutation.isPending}
            >
              Delete
            </Button>
          </Space>
        )
      }
    }
  ]

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
    refetch()
  }

  return (
    <>
      <Flex justify='end' align='center' className='mb-4'>
        <Button onClick={() => navigate('/role/add')}>Add Role</Button>
      </Flex>

      <Table
        dataSource={data?.data?.data}
        columns={columns}
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
        onOk={() => handleOnOK(selectedRoleId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this role?</p>
      </Modal>
    </>
  )
}
