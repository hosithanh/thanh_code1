/* eslint-disable react-hooks/exhaustive-deps */
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
import { MenuPaths } from 'common/constant/app-constant'
import { Tongiao } from 'common/interface/Danhmuc.interfaces/Tongiao'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAllTongiao, deleteTongiao, getTongiao } from 'store/actions/danhmuc.actions/tongiao.action'
import { AppState } from 'store/interface'

export default function DanhsachTongiao(): JSX.Element {
    const dispatch = useDispatch()
    const tongiaoList = useSelector<AppState, Tongiao[] | undefined>((state) => state.tongiao?.tongiaoList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.tongiao?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.tongiao?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.tongiao?.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.tongiao?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.tongiao?.sortData)

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')

    const columns: ColumnsType<Tongiao> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSort(`ma ${orderDataMa}`, 'ma')}>
                    <span>Mã tôn giao</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            title: (
                <div onClick={() => onSort(`ten ${orderDataTen}`, 'ten')}>
                    <span>Tên tôn giáo</span> {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (record) => {
                const handleDeleteTongiao = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            onDeleteOne(record.id)
                        }
                    })
                }
                return (
                    <>
                        <Link to={`/${MenuPaths.tongiao}/${record.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeleteTongiao}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => dispatch(getTongiao({ page, pageSize, searchData, sortData }))
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onDeleteOne = (id: number) => {
        ; (dispatch(deleteTongiao(id)) as any)
            .then((res) => {
                dispatch(
                    getTongiao({
                        page: currentPage,
                        pageSize,
                        isDelete:
                            tongiaoList?.length === 1 ||
                            (tongiaoList?.length === selectedRowKeys?.length &&
                                Math.ceil(totalRecords! / pageSize!) === currentPage),
                        searchData: searchData
                    })
                )
                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
            })
            .catch(() => {
                Notification({ status: 'error', message: 'Xóa tôn giáo thất bại' })
            })
    }
    const handleDeleteAllTongiao = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                ; (dispatch(deleteAllTongiao(selectedRowKeys)) as any)
                    .then((res) => {
                        dispatch(
                            getTongiao({
                                page: currentPage,
                                pageSize,
                                isDelete:
                                    tongiaoList?.length === 1 ||
                                    (tongiaoList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                searchData
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({ status: 'success', message: res.data.msg })
                        setDisabled(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'xóa tất cả tôn giáo thất bại' })
                    })
            }
        })
    }
    const onSearch = (searchData?: string) => {
        dispatch(getTongiao({ searchData, pageSize: pageSize }))
    }
    const onSort = (sortData, colunm) => {
        if (colunm === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getTongiao({ searchData, sortData }))
    }
    useEffect(() => {
        !tongiaoList && dispatch(getTongiao({ searchData }))
    }, [tongiaoList])
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách tôn giáo'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Form.Item
                                    name='layout'
                                    colon={false}
                                    style={{ fontWeight: 'bold', width: '300px', marginRight: 0 }}>
                                    <Input.Search
                                        defaultValue={searchData}
                                        allowClear
                                        enterButton={
                                            <>
                                                <SearchOutlined /> Tìm kiếm
                                            </>
                                        }
                                        placeholder='Nhập từ khóa cần tìm'
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </Form>
                            <Button
                                danger
                                type='primary'
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteAllTongiao}
                                disabled={disabled}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.tongiao}/add`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={tongiaoList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{ y: '65vh' }}
            />
            {!isArrayEmpty(tongiaoList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} của ${total} dòng`
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
