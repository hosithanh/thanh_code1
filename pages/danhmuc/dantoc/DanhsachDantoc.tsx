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
import { Dantoc } from 'common/interface/Danhmuc.interfaces/Dantoc'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAllDantoc, deleteDantoc, getDantoc } from 'store/actions/danhmuc.actions/dantoc.action'
import { AppState } from 'store/interface'

export default function DanhsachDantoc(): JSX.Element {
    const dispatch = useDispatch()
    const dantocList = useSelector<AppState, Dantoc[] | undefined>((state) => state.dantoc?.dantocList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.dantoc?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.dantoc?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.dantoc?.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.dantoc?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.dantoc?.sortData)

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')

    const columns: ColumnsType<Dantoc> = [
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
                    <span>Mã dân tộc</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            title: (
                <div onClick={() => onSort(`ten ${orderDataTen}`, 'ten')}>
                    <span>Tên dân tộc</span> {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
                const handleDeleteDantoc = (): void => {
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
                        <Link to={`/${MenuPaths.dantoc}/${record.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeleteDantoc}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => dispatch(getDantoc({ page, pageSize, searchData, sortData }))
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onDeleteOne = (id: number) => {
        ;(dispatch(deleteDantoc(id)) as any)
            .then((res) => {
                dispatch(
                    getDantoc({
                        page: currentPage,
                        pageSize,
                        isDelete:
                            dantocList?.length === 1 ||
                            (dantocList?.length === selectedRowKeys?.length &&
                                Math.ceil(totalRecords! / pageSize!) === currentPage),
                        searchData: searchData
                    })
                )
                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
            })
            .catch(() => {
                Notification({ status: 'error', message: 'Xóa dân tộc thất bại' })
            })
    }
    const handleDeleteAllDantoc = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteAllDantoc(selectedRowKeys)) as any)
                    .then((res) => {
                        dispatch(
                            getDantoc({
                                page: currentPage,
                                pageSize,
                                isDelete:
                                    dantocList?.length === 1 ||
                                    (dantocList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                searchData
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({ status: 'success', message: res.data.msg })
                        setDisabled(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'xóa tất cả dân tộc thất bại' })
                    })
            }
        })
    }
    const onSearch = (searchData?: string) => {
        dispatch(getDantoc({ searchData, pageSize: pageSize }))
    }
    const onSort = (sortData, colunm) => {
        if (colunm === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getDantoc({ searchData, sortData }))
    }
    useEffect(() => {
        !dantocList && dispatch(getDantoc({ searchData }))
    }, [dantocList])
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách dân tộc'
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
                                onClick={handleDeleteAllDantoc}
                                disabled={disabled}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.dantoc}/add`}>
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
                dataSource={dantocList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(dantocList) && (
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
