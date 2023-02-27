/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppState } from 'store/interface'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { CapDonVi } from '../../common/interface/CapDonVi'
import { deleteAllCapdonvi, deleteCapdonvi, getCapdonvi } from '../../store/actions/capdonvi.action'
export default function DanhsachCapdonvi(): JSX.Element {
    const capdonviList = useSelector<AppState, CapDonVi[] | undefined>((state) => state.capdonvi.capdonviList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.capdonvi.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.capdonvi.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.capdonvi.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const searchData = useSelector<AppState, string | undefined>((state) => state.capdonvi?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.capdonvi?.sortData)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')

    const columns: ColumnsType<CapDonVi> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSortBy(`ten ${orderDataTen}`, 'ten')}>
                    <span>Tên cấp đơn vị</span> {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        },

        {
            title: (
                <div onClick={() => onSortBy(`ma ${orderDataMa}`, 'ma')}>
                    <span>Mã cấp đơn vị</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            title: (
                <div>
                    <span>Cấp đơn vị cha</span>
                </div>
            ),
            dataIndex: 'tendonvicha',
            key: 'tendonvicha'
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.capdonvi}/${value.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />}></Button>
                            </Tooltip>
                        </Link>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => deleteOne(`${value.id}`)}></Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    useEffect(() => {
        setLoad(true)
        !capdonviList && dispatch(getCapdonvi({ searchData }))
        capdonviList && setLoad(false)
    }, [capdonviList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onSearch = (searchData?: string) => {
        setLoad(true)
        dispatch(getCapdonvi({ searchData, pageSize: pageSize }))
    }
    const onPageChange = (page, pageSize) => {
        setLoad(true)
        dispatch(getCapdonvi({ page, pageSize, searchData, sortData }))
    }

    const onSortBy = (sortData, colum) => {
        if (colum === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getCapdonvi({ searchData, sortData }))
    }
    const deleteOne = (id) => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                return (dispatch(deleteCapdonvi(id)) as any)
                    .then((res) => {
                        setLoad(false)
                        Notification({
                            status: 'success',
                            message: res.data.message
                        })
                    })
                    .catch(() => {
                        setLoad(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    const deleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                return (dispatch(deleteAllCapdonvi(selectedRowKeys)) as any)
                    .then((res) => {
                        setDisabled(true)
                        setLoad(false)
                        Notification({
                            status: 'success',
                            message: res.data.message
                        })
                    })
                    .catch(() => {
                        setLoad(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách cấp đơn vị'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    prefix={<SearchOutlined className='site-form-item-icon' />}
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                loading={load}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.capdonvi}/add`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}
                />
            </div>
            <Table
                loading={load}
                size='small'
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={capdonviList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(capdonviList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={(total, range) => {
                            return `${range[0]}-${range[1]} của ${total} dòng`
                        }}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
