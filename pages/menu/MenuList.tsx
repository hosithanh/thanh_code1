/* eslint-disable react-hooks/rules-of-hooks */
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
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
import { Menu } from '../../common/interface/Menu'
import { isArrayEmpty } from '../../common/utils/empty-util'
import {
    deleteMenu,
    deletesMenu,
    getListMenu,
    onMenuPageChange,
    onSearchMenu,
    onSortMenu
} from '../../store/actions/menu.action'
import { AppState } from '../../store/interface'

export default function MenuList(): JSX.Element {
    const menuList = useSelector<AppState, Menu[] | undefined>((state) => state.menu.menuList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.menu.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.menu.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.menu.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const dispatch = useDispatch()
    const history = useHistory()
    const [load, setLoad] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [sortOrder, setSortOrder] = useState('ASC')
    //const [iconSort, setIconSort] = useState('down')

    const columns: ColumnsType<Menu> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <Link key={value.id} to={`/${MenuPaths.menu}/${value.id}`}>
                    {currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}
                </Link>
            )
        },
        {
            title: (
                <div onClick={() => onSortBy(`ten ${sortOrder}`)}>
                    <span>Tên Menu</span>
                    {/* <span style={{ float: 'right' }}></span> */}
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten',
            sorter: true,
            showSorterTooltip: false
        },
        {
            title: (
                <div onClick={() => onSortBy(`tenmenucha ${sortOrder}`)}>
                    <span>Menu cha</span>
                </div>
            ),
            dataIndex: 'tenmenucha',
            key: 'tenmenucha',
            sorter: true,
            showSorterTooltip: false
        },
        { title: 'Icon', dataIndex: 'icon', key: 'icon' },
        {
            title: (
                <div onClick={() => onSortBy(`thutu ${sortOrder}`)}>
                    <span>Thứ tự</span>
                </div>
            ),
            sorter: true,
            showSorterTooltip: false,
            dataIndex: 'thutu',
            key: 'thutu',
            align: 'center',
            width: '100px'
        },
        { title: 'Script', dataIndex: 'script', key: 'script' },
        { title: 'Liên kết', dataIndex: 'url', key: 'url' },
        { title: 'Tên chức năng', dataIndex: 'tenchucnang' },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (record, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.menu}/${record.id}?edit=true`}>
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
                                        onClick={() => onDeleteOne(`${record.id}`)}
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
        !menuList && dispatch(getListMenu())
    }, [menuList])

    const onDeleteOne = (id) => {
        setLoad(true)
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                return (dispatch(deleteMenu(id)) as any)
                    .then((res) => {
                        setLoad(false)
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        setLoad(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            },
            onCancel: (): void => {
                setLoad(false)
            }
        })
    }

    const handleDelectAll = (): void => {
        setLoad(true)
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                showConfirm({
                    title: 'Bạn có chắc chắn xóa dữ liệu này?',
                    icon: <ExclamationCircleOutlined />,
                    okText: 'Đồng ý',
                    okType: 'primary',
                    cancelText: 'Không',
                    maskClosable: true,
                    onOk: (): void => {
                        ;(dispatch(deletesMenu(selectedRowKeys)) as any)
                            .then((res) => {
                                setDisabled(true)
                                setLoad(false)
                                Notification({ status: 'success', message: res.data.message })
                            })
                            .catch(() => {
                                setDisabled(true)
                                setLoad(false)
                                Notification({ status: 'error', message: errorMessage })
                            })
                    }
                })
            },
            onCancel: (): void => {
                setLoad(false)
            }
        })
    }

    const pathname = window.location.search
    const isSearch = pathname.split('=')[0] === '?searchData'
    const isSorter =
        pathname.split('=')[0] === '?sortData' || '&' + pathname.split('&').pop()?.split('=')[0] === '&sortData'

    const onSearch = (searchData?: string) => {
        history.push(`?searchData=${searchData}`)
        dispatch(onSearchMenu(searchData))
    }

    const onSortBy = (sortData) => {
        setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
        isSearch
            ? isSorter
                ? history.push(`?searchData=${pathname.split('=')[1].split('&')[0]}&sortData=${sortData}`)
                : history.push(`?searchData=${pathname.split('=').pop()}&sortData=${sortData}`)
            : history.push(`?sortData=${sortData}`)
        dispatch(onSortMenu(pathname))
    }

    const onPageChange = (page, pageSize?) => {
        dispatch(onMenuPageChange(page, pageSize, pathname.split('?').pop()))
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    return (
        <Fragment>
            <div>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    onBack={() => window.history.back()}
                    title='Danh sách Menu'
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
                                danger
                                type='primary'
                                disabled={disabled}
                                loading={load}
                                icon={<DeleteOutlined />}
                                onClick={handleDelectAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.menu}/add`}>
                                <Button type='primary' icon={<PlusCircleOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                loading={load}
                size='small'
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={menuList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                tableLayout='fixed'
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(menuList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} menu`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
