/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Donvi } from '../../common/interface/Donvi'
import { isArrayEmpty } from '../../common/utils/empty-util'
import { deleteAllDonvi, deleteDonvi, getDonvi } from '../../store/actions/donvi.action'
import { AppState } from '../../store/interface'
export default function DanhsachDonvi(): JSX.Element {
    const donviList = useSelector<AppState, Donvi[] | undefined>((state) => state.donvi.donviList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.donvi.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.donvi.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.donvi.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const [isLoadDelete, setIsLoadDelete] = useState(false)
    const dispatch = useDispatch()
    const searchData = useSelector<AppState, string | undefined>((state) => state.donvi?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.donvi?.sortData)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')
    const columns: ColumnsType<Donvi> = [
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
                    <span>Tên đơn vị</span> {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        },

        {
            title: (
                <div onClick={() => onSortBy(`ma ${orderDataMa}`, 'ma')}>
                    <span>Mã đơn vị</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            title: (
                <div>
                    <span>Tên đơn vị cha</span>
                </div>
            ),
            dataIndex: 'tendonvicha',
            key: 'tendonvicha'
        },
        {
            title: 'Cung cấp',
            dataIndex: 'iscungcap',
            align: 'center',
            key: 'iscungcap',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'Khai thác',
            dataIndex: 'iskhaithac',
            align: 'center',
            key: 'iskhaithac',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'Cấp đơn vị',
            dataIndex: 'tencapdonvi',
            key: 'tencapdonvi'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.donvi}/${value.id}?edit=true`}>
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
        !donviList && dispatch(getDonvi({ searchData }))
        donviList && setLoad(false)
    }, [donviList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onSearch = (searchData?: string) => {
        setLoad(true)
        dispatch(getDonvi({ searchData, pageSize: pageSize }))
    }
    const onPageChange = (page, pageSize) => {
        setLoad(true)
        dispatch(getDonvi({ page, pageSize, searchData, sortData }))
    }
    const onSortBy = (sortData, colum) => {
        if (colum === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getDonvi({ searchData, sortData }))
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
                return (dispatch(deleteDonvi(id)) as any)
                    .then((res) => {
                        setLoad(false)
                        Notification({ status: 'success', message: res.data.message })
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
                setIsLoadDelete(true)
                return (dispatch(deleteAllDonvi(selectedRowKeys)) as any)
                    .then((res) => {
                        setIsLoadDelete(false)
                        setLoad(false)
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        setIsLoadDelete(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    const showTotal = (total, range) => {
        return `${range[0]}-${range[1]} của ${total} dòng`
    }
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách đơn vị'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    // enterButton={
                                    //     <>
                                    //         <SearchOutlined /> Tìm kiếm
                                    //     </>
                                    // }
                                    onSearch={onSearch}
                                    prefix={<SearchOutlined className='site-form-item-icon' />}
                                />
                            </Form>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                loading={isLoadDelete}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.donvi}/add`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}
                />
            </div>
            <Table
                size='small'
                loading={load}
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={donviList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(donviList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={showTotal}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
