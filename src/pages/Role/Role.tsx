import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'
import roleApi from 'src/apis/role.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { UserType } from 'src/types/user.type'
import { PaginationParams, TableType } from 'src/types/utils.type'

export default function Role() {
  const [open, setOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedListUserId, setListselectedRoleId] = useState<number[] | string[]>([])
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['role', queryConfig],
    queryFn: () => roleApi.getAllRole(queryConfig as PaginationParams)
  })

  // const deleteUserMutation = useMutation({
  //   mutationFn: (id: number | string) => userApi.deleteUserById(id)
  // })

  // const deleteListUserMutation = useMutation({
  //   mutationFn: (id: string) => userApi.deleteUserByIds(id)
  // })

  const handleEdit = (id: number) => {
    console.log(id)
  }

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedRoleId(id)
  }

  const handleOnOK = (id: number | string) => {
    // deleteUserMutation.mutate(id, {
    //   onSuccess: () => {
    //     refetch()
    //   }
    // })
    console.log(id)

    setOpen(false)
  }

  const rowSelection: TableRowSelection<UserType> = {
    onChange: (selectedRowKeys) => {
      setListselectedRoleId(selectedRowKeys.map((id) => id.toString()))
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
    // if (form.getFieldsValue().handler === 'drop') {
    //   const ids = selectedListUserId.map((id) => id.toString()).join(',')
    //   ids &&
    //     deleteListUserMutation.mutate(ids, {
    //       onSuccess: () => {
    //         refetch()
    //         setListselectedRoleId([])
    //       }
    //     })
    //   setOpen(false)
    // }
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
        onOk={() => handleOnOK(selectedRoleId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this role?</p>
      </Modal>
    </>
  )
}
