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
import { Config } from '../../common/interface/Config'
import { isArrayEmpty } from '../../common/utils/empty-util'
import { deleteAllConfig, deleteConfig, getConfig } from '../../store/actions/config.action'
import { AppState } from '../../store/interface'
export default function Danhsachconfig(): JSX.Element {
    const configList = useSelector<AppState, Config[] | undefined>((state) => state.config.configList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.config.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.config.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.config.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const [loadDelete, setLoadDelete] = useState(false)
    const dispatch = useDispatch()
    const searchData = useSelector<AppState, string | undefined>((state) => state.config?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.config?.sortData)
    const [orderDataKey, setOrderDataKey] = useState('asc')
    const columns: ColumnsType<Config> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSortBy(`key ${orderDataKey}`, 'key')}>
                    <span>Mã</span> {orderDataKey === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'key',
            key: 'key'
        },

        {
            title: (
                <div>
                    <span>Mô tả</span>
                </div>
            ),
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: (
                <div>
                    <span>Giá trị</span>
                </div>
            ),
            dataIndex: 'value',
            key: 'value'
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.config}/${value.id}?edit=true`}>
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
        !configList && dispatch(getConfig({ searchData }))
        configList && setLoad(false)
    }, [configList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onSearch = (searchData?: string) => {
        setLoad(true)
        dispatch(getConfig({ searchData, pageSize: pageSize }))
    }
    const onPageChange = (page, pageSize) => {
        setLoad(true)
        dispatch(getConfig({ page, pageSize, searchData, sortData }))
    }
    const onSortBy = (sortData, colum) => {
        if (colum === 'key') {
            setOrderDataKey(orderDataKey === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getConfig({ searchData, sortData }))
    }
    const deleteOne = (id) => {
        setLoadDelete(true)
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                return (dispatch(deleteConfig(id)) as any)
                    .then((res) => {
                        Notification({ status: 'success', message: res.data.msg })
                        setLoadDelete(false)
                        setLoad(false)
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
                return (dispatch(deleteAllConfig(selectedRowKeys)) as any)
                    .then((res) => {
                        setDisabled(true)
                        setLoad(false)
                        Notification({ status: 'success', message: res.data.msg })
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
                    title='Danh sách config'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    enterButton={
                                        <>
                                            <SearchOutlined /> Tìm kiếm
                                        </>
                                    }
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                loading={loadDelete}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.config}/add`}>
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
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={configList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(configList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
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
