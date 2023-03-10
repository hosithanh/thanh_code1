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
                    <span>T??n Menu</span>
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
                    <span>Th??? t???</span>
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
        { title: 'Li??n k???t', dataIndex: 'url', key: 'url' },
        { title: 'T??n ch???c n??ng', dataIndex: 'tenchucnang' },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (record, _, index) => {
                return (
                    <Fragment>
                        <Link to={`/${MenuPaths.menu}/${record.id}?edit=true`}>
                            <Tooltip title='S???a' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='X??a' color='#ff4d4f' placement='right'>
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
            title: 'B???n c?? ch???c ch???n xo??a d???? li????u na??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '??????ng y??',
            okType: 'primary',
            cancelText: 'Kh??ng',
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
            title: 'B???n c?? ch???c ch???n mu???n x??a nh???ng m???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                setLoad(true)
                showConfirm({
                    title: 'B???n c?? ch???c ch???n xo??a d???? li????u na??y?',
                    icon: <ExclamationCircleOutlined />,
                    okText: '?????ng ??',
                    okType: 'primary',
                    cancelText: 'Kh??ng',
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
                    title='Danh s??ch Menu'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='nh???p t??? kh??a c???n t??m...'
                                    enterButton='T??m ki???m'
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
                                X??a
                            </Button>
                            <Link to={`/${MenuPaths.menu}/add`}>
                                <Button type='primary' icon={<PlusCircleOutlined />}>
                                    Th??m m???i
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
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
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
                        showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} menu`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
