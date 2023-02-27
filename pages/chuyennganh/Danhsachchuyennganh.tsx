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
import { MenuPaths } from 'common/constant/app-constant'
import { Chuyennganh } from 'common/interface/Chuyennganh'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAllChuyennganh, deleteChuyennganh, getChuyennganh } from 'store/actions/chuyennganh.action'
import { AppState } from 'store/interface'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage } from '../../common/constant/app-constant'
export default function DanhsachChuyennganh() {
    const [isDisabled, setIsDisabled] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [isLoadingTable, setIsLoadingTable] = useState(false)
    const dispatch = useDispatch()
    const chuyennganh = useSelector<AppState, Chuyennganh[] | undefined>((state) => state.chuyennganh.chuyennganhList)
    const currenPage = useSelector<AppState, number | undefined>((state) => state.chuyennganh.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.chuyennganh.pageSize)
    const total = useSelector<AppState, number | undefined>((state) => state.chuyennganh.totalRecords)
    const [searchData, setSearchData] = useState('')
    const [orderAppcode, setOrderAppcode] = useState('desc')
    const [orderMaDoiTuong, setorderMaDoiTuong] = useState('desc')
    const [orderMaGiayTo, setorderMaGiayTo] = useState('desc')
    useEffect(() => {
        setIsLoadingTable(true)
        !chuyennganh && dispatch(getChuyennganh({}))
        chuyennganh && setIsLoadingTable(false)
    }, [chuyennganh])
    
    const deleteOne = (id) => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setIsLoadingTable(true)
                return (dispatch(deleteChuyennganh(id)) as any)
                    .then((res) => {
                        setIsLoadingTable(false)
                        Notification({ status: 'success', message: res.data.msg })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setIsDisabled(false) : setIsDisabled(true)
        }
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
                setIsLoadingTable(true)
                return (dispatch(deleteAllChuyennganh(selectedRowKeys)) as any)
                    .then((res) => {
                        Notification({
                            status: 'success',
                            message: res.data.msg
                        })
                        setIsDisabled(true)
                        setIsLoadingTable(false)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    const onPageChange = (page, pageSize) => {
        setIsLoadingTable(true)

        dispatch(getChuyennganh({ pageSize: pageSize, searchData }))
    }

    const onSearch = (searchData?: string) => {
        setIsLoadingTable(true)
        setSearchData(searchData)
        dispatch(getChuyennganh({ searchData, pageSize: pageSize }))
    }

    const onSortBy = (sortData, colum) => {
        if (colum === 'maDoiTuong') {
            setorderMaDoiTuong(orderMaDoiTuong === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'appCode') {
            setOrderAppcode(orderAppcode === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'maGiayTo') {
            setorderMaGiayTo(orderMaGiayTo === 'asc' ? 'desc' : 'asc')
        }

        dispatch(getChuyennganh({ searchData, sortData }))
    }
    const columns: ColumnsType<Chuyennganh> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '50px',
            render: (value, _, index) => (
                <div key={value.id}>{currenPage && pageSize && Math.ceil(currenPage - 1) * pageSize + index + 1}</div>
            )
        },
        {
            title: (
                <div onClick={() => onSortBy(`appCode ${orderAppcode}`, 'appCode')}>
                    <span>Appcodde</span> {orderAppcode === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'appCode',
            key: 'appCode',
            align: 'center',
            width: '200px'
        },

        {
            title: (
                <div onClick={() => onSortBy(`maDoiTuong ${orderMaDoiTuong}`, 'maDoiTuong')}>
                    <span>Mã đối tượng</span> {orderMaDoiTuong === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'maDoiTuong',
            key: 'maDoiTuong',
            align: 'center'
        },
        {
            title: (
                <div onClick={() => onSortBy(`maGiayTo ${orderMaGiayTo}`, 'maGiayTo')}>
                    <span>Mã giấy tờ</span> {orderMaGiayTo === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'maGiayTo',
            key: 'maGiayTo',
            align: 'center',
            width: '190px'
        },
        {
            title: 'columnData',
            dataIndex: 'columnData',
            key: 'columnData',
            align: 'center'
        },
        // {
        //     title: 'keyMapSoGiayPhep',
        //     dataIndex: 'keyMapSoGiayPhep',
        //     key: '     keyMapSoGiayPhep',
        //     align: 'center'
        // },
        // {
        //     title: 'keyMapNgayCapPhep',
        //     dataIndex: 'keyMapNgayCapPhep',
        //     key: 'keyMapNgayCapPhep',
        //     align: 'center'
        // },
        {
            title: 'tableChuyenNganh',
            dataIndex: 'tableChuyenNganh',
            key: 'tableChuyenNganh',
            align: 'center'
        },
        {
            title: 'sắp xếp',
            dataIndex: 'sapXep',
            key: 'sapXep',
            width: '70px',
            align: 'center'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '90px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.quanlychuyennganh}/${value.id}?edit=true`}>
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

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách chuyên ngành'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    onSearch={onSearch}
                                    prefix={<SearchOutlined className='site-form-item-icon' />}
                                />
                            </Form>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={isDisabled}
                                //   loading={isLoadDelete}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.quanlychuyennganh}/add`}>
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
                loading={isLoadingTable}
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={chuyennganh}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(chuyennganh) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={total}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currenPage}
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
        </>
    )
}
