/* eslint-disable react-hooks/rules-of-hooks */
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Chucnang } from '../../common/interface/Chucnang'
import { isArrayEmpty } from '../../common/utils/empty-util'
import {
    deleteAllChucnang,
    deleteChucnang,
    getChucnang,
    onChangeChucnang,
    onSearchChucnang
} from '../../store/actions/chucnang.action'
import { AppState } from '../../store/interface'

export default function DanhsachChucnang(): JSX.Element {
    const chucnangList = useSelector<AppState, Chucnang[] | undefined>((state) => state.chucnang.chucnangList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.chucnang.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.chucnang.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.chucnang.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    const columns: ColumnsType<Chucnang> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <Link key={value.id} to={`/${MenuPaths.chucnang}/${value.id}`}>
                    {currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}
                </Link>
            )
        },
        {
            title: <span>Tên chức năng</span>,
            dataIndex: 'ten',
            key: 'ten',
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.ten.length - b.ten.length
        },
        {
            title: <span>Mã chức năng</span>,
            dataIndex: 'ma',
            key: 'ma',
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.ma.length - b.ma.length
        },
        {
            title: 'Nhóm chức năng',
            dataIndex: 'nhomChucNang',
            key: 'nhomChucNang',
            render: (value) => value?.ten
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.chucnang}/${value.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={
                                    <DeleteOutlined
                                        style={{ color: '#ff4d4f' }}
                                        onClick={() => deleteOne(`${value.id}`)}
                                    />
                                }
                            />
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    useEffect(() => {
        !chucnangList && dispatch(getChucnang())
    }, [chucnangList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const pathname = window.location.search
    const isSearch = pathname.split('=')[0] === '?search'
    const isSorter =
        pathname.split('=')[0] === '?sortby' || '&' + pathname.split('&').pop()?.split('=')[0] === '&sortby'

    const onSearch = (searchData?: string) => {
        history.push(`?searchData=${searchData}`)
        dispatch(onSearchChucnang(searchData))
    }
    const onPageChange = (page, pageSize?) => {
        dispatch(onChangeChucnang(page, pageSize, pathname.split('?').pop()))
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
                return (dispatch(deleteChucnang(id)) as any)
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
                return (dispatch(deleteAllChucnang(selectedRowKeys)) as any)
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
                    onBack={() => window.history.back()}
                    title='Danh sách chức năng'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='nhập từ khóa cần tìm...'
                                    enterButton='Tìm kiếm'
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
                            <Link to={`/${MenuPaths.chucnang}/add`}>
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
                dataSource={chucnangList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(chucnangList) && (
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
