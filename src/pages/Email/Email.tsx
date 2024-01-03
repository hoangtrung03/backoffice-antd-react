import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, Modal, Pagination, PaginationProps, Select, Space, Table } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import emailApi from 'src/apis/email.api'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { EmailType } from 'src/types/email.type'
import { PaginationParams, PaginationType, TableType } from 'src/types/utils.type'

export default function Email() {
  const [open, setOpen] = useState(false)
  const [selectedEmailId, setSelectedEmailId] = useState<number | string>('')
  const [selectedListEmailId, setListSelectedEmailId] = useState<number[] | string[]>([])
  const [emailData, setEmailData] = useState<EmailType[] | undefined>([])
  const [paginationData, setPaginationData] = useState<PaginationType | undefined>({})
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const {
    data: dataEmails,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['emails', queryConfig],
    queryFn: () => emailApi.getAllEmail(queryConfig as PaginationParams)
  })

  useEffect(() => {
    if (dataEmails) {
      setEmailData(dataEmails?.data?.data)
      setPaginationData(dataEmails?.data?.pagination)
    }
  }, [dataEmails])

  const deleteEmailMutation = useMutation({
    mutationFn: (id: number | string) => emailApi.deleteEmailById(id)
  })

  const deleteListEmailMutation = useMutation({
    mutationFn: (id: string) => emailApi.deleteEmailByIds(id)
  })

  const handleEdit = (id: number) => {
    navigate(`${path.email}/${id}`)
    console.log(id)
  }

  const handleDelete = (id: number) => {
    setOpen(true)
    setSelectedEmailId(id)
  }

  const handleOnOK = (id: number | string) => {
    deleteEmailMutation.mutate(id, {
      onSuccess: () => {
        refetch()
      }
    })
    setOpen(false)
  }

  const rowSelection: TableRowSelection<EmailType> = {
    onChange: (selectedRowKeys) => {
      setListSelectedEmailId(selectedRowKeys.map((id) => id.toString()))
    }
  }

  const handleSubmit = () => {
    if (form.getFieldsValue().handler === 'drop') {
      const ids = selectedListEmailId.map((id) => id.toString()).join(',')

      ids &&
        deleteListEmailMutation.mutate(ids, {
          onSuccess: () => {
            refetch()
            setListSelectedEmailId([])
          }
        })
      setOpen(false)
    }
  }

  const handleChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    queryConfig.page = pageNumber.toString()
    refetch()
  }

  const columns: TableType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
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

  const dataSelectHandler = [
    {
      label: 'Drop',
      value: 'drop'
    }
  ]
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
        {/* <Search placeholder='Search' allowClear onSearch={handleSearch} className='w-full md:w-1/3' size='large' /> */}
        <Button onClick={() => navigate(`${path.email}/add`)}>Add Email</Button>
      </Flex>
      <Table
        dataSource={emailData}
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
        onOk={() => handleOnOK(selectedEmailId)}
        onCancel={() => setOpen(false)}
      >
        <p>Are you sure you want to delete this email?</p>
      </Modal>
    </>
  )
}
