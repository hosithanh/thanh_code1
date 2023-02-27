/* eslint-disable react-hooks/exhaustive-deps */
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
import { Nhomchucnang } from '../../common/interface/Nhomchucnang'
import { isArrayEmpty } from '../../common/utils/empty-util'
import {
    deleteAllNhomchucnang,
    deleteNhomchucnang,
    getNhomchucnang,
    onChangeNhomchucnang,
    onSearchNhomchucnang
} from '../../store/actions/nhomchucnang.action'
import { AppState } from '../../store/interface'

export default function DanhsachNhomchucnang(): JSX.Element {
    const nhomchucnangList = useSelector<AppState, Nhomchucnang[] | undefined>(
        (state) => state.nhomchucnang.nhomchucnangList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.nhomchucnang.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.nhomchucnang.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.nhomchucnang.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const columns: ColumnsType<Nhomchucnang> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <Link key={value.id} to={`/${MenuPaths.nhomchucnang}/${value.id}`}>
                    {currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}
                </Link>
            )
        },
        {
            title: <span>Tên nhóm chức năng</span>,
            dataIndex: 'ten',
            key: 'ten',
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.ten.length - b.ten.length
        },
        {
            title: <span>Mã nhóm chức năng</span>,
            dataIndex: 'ma',
            key: 'ma',
            showSorterTooltip: false,
            sorter: (a: any, b: any) => a.ma.length - b.ma.length
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.nhomchucnang}/${value.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />}></Button>
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
                                }></Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    useEffect(() => {
        !nhomchucnangList && dispatch(getNhomchucnang())
    }, [nhomchucnangList])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
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
                return (dispatch(deleteNhomchucnang(id)) as any)
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
                return (dispatch(deleteAllNhomchucnang(selectedRowKeys)) as any)
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
    const pathname = window.location.search
    // const isSearch = pathname.split('=')[0] === '?search'
    // const isSorter =
    //     pathname.split('=')[0] === '?sortby' || '&' + pathname.split('&').pop()?.split('=')[0] === '&sortby'

    const onSearch = (searchData?: string) => {
        history.push(`?searchData=${searchData}`)
        dispatch(onSearchNhomchucnang(searchData))
    }
    const onPageChange = (page, pageSize?) => {
        dispatch(onChangeNhomchucnang(page, pageSize, pathname.split('?').pop()))
    }
    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title='Danh sách nhóm chức năng'
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
                            <Link to={`/${MenuPaths.nhomchucnang}/add`}>
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
                dataSource={nhomchucnangList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(nhomchucnangList) && (
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
