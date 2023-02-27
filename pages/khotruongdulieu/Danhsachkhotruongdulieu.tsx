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
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Khotruongdulieu } from '../../common/interface/Khotruongdulieu'
import { isArrayEmpty } from '../../common/utils/empty-util'
import {
    deleteAllKhotruongdulieu,
    deleteKhotruongdulieu,
    getKhotruongdulieu
} from '../../store/actions/khotruongdulieu.action'
import { AppState } from '../../store/interface'
export default function DanhSachKhoTruongDuLieu(): JSX.Element {
    const khotruongdulieuList = useSelector<AppState, Khotruongdulieu[] | undefined>(
        (state) => state.khotruongdulieu.khotruongdulieuList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.khotruongdulieu.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.khotruongdulieu.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.khotruongdulieu.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const searchData = useSelector<AppState, string | undefined>((state) => state.khotruongdulieu?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.khotruongdulieu?.sortData)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataMota, setOrderDataMota] = useState('asc')

    const columns: ColumnsType<Khotruongdulieu> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSortBy(`ma ${orderDataMa}`, 'ma')}>
                    <span>Mã trường dữ liệu</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            // title: (
            //     <div onClick={() => onSortBy(`mota ${orderDataMota}`, `mota`)}>
            //         <span>Tên trường dữ liệu</span>{' '}
            //         {orderDataMota === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
            //     </div>
            // ),
            title: (
                <div>
                    <span>Tên trường dữ liệu</span>
                </div>
            ),

            dataIndex: 'mota',
            key: 'mota'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                            <Link to={`/${MenuPaths.khotruongdulieu}/${value.id}?edit=true`}>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />}></Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title='Xóa' color='red' placement='right'>
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
        !khotruongdulieuList && dispatch(getKhotruongdulieu({ searchData }))
        khotruongdulieuList && setLoad(false)
    }, [khotruongdulieuList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onSearch = (searchData?: string) => {
        setLoad(true)
        dispatch(getKhotruongdulieu({ searchData }))
    }
    const onPageChange = (page, pageSize) => {
        setLoad(true)
        dispatch(getKhotruongdulieu({ page, pageSize, searchData, sortData }))
    }
    const onSortBy = (sortData, colum) => {
        if (colum === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'mota') {
            setOrderDataMota(orderDataMota === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getKhotruongdulieu({ searchData, sortData }))
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
                return (dispatch(deleteKhotruongdulieu(id)) as any)
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
                setLoad(true)
                return (dispatch(deleteAllKhotruongdulieu(selectedRowKeys)) as any)
                    .then((res) => {
                        setDisabled(true)
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

    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách kho trường dữ liệu'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    defaultValue={searchData}
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
                            <Link to={`/${MenuPaths.khotruongdulieu}/add`}>
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
                dataSource={khotruongdulieuList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(khotruongdulieuList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
