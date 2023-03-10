/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    BackwardOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import { UserInGroup } from 'common/interface/UserInGroup'
import { getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
    deleteAlluseringroup,
    deleteoneuseringroup,
    getUsersAllGroup,
    onChangepageuseringroup,
    onSearchUseringroup,
    onSortInNhomnguoidung
} from 'store/actions/nhomnguoidung.action'
import { AppState } from 'store/interface'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'

export default function UserGroupList(): JSX.Element {
    const dispatch = useDispatch()
    const history = useHistory()
    const pathname = window.location.pathname.split('/').pop()
    const userinGroupList = useSelector<AppState, UserInGroup[] | undefined>((state) => state.userinGroup.result)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.userinGroup.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.userinGroup.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.userinGroup.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [sortOrder, setSortOrder] = useState('ASC')
    const [SortName, setSortName] = useState(true)

    const columns: ColumnsType<UserInGroup> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <Link key={value.id} to={`/${MenuPaths.nhomnguoidung}/${value.id}`}>
                    {currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}
                </Link>
            )
        },

        {
            title: (
                <div onClick={() => onSortBy(`name ${sortOrder}`, `name`)}>
                    <span>Ho?? t??n</span> {SortName ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'fullName',
            key: 'fullName',
            align: 'center'
        },
        {
            title: <span>T??n ????ng nh???p</span>,
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },

        {
            title: <span>S???? ??i????n thoa??i</span>,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            align: 'center'
        },
        {
            title: <span>Email</span>,
            dataIndex: 'email',
            key: 'email',
            align: 'center'
        },

        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value) => {
                return (
                    <Fragment>
                        <Tooltip title='X??a' placement='right'>
                            <Button
                                danger
                                disabled={value.fullName === getCookie('username') ? true : false}
                                type='text'
                                icon={<DeleteOutlined />}
                                onClick={() => deleteOne(`${value.user.id}`)}
                            />
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]
    useEffect(() => {
        dispatch(getUsersAllGroup(pathname))
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(
                selectedRows.map((item) => {
                    return { id: item.user.id }
                })
            )
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        },
        getCheckboxProps: (record) => ({
            disabled: record.fullName === getCookie('username')
        })
    }

    const onPageChange = (page, pageSize?) => {
        dispatch(onChangepageuseringroup(page, pageSize, pathname))
    }
    const onSearch = (searchData?: string) => {
        history.push(`?searchData=${searchData}`)
        dispatch(onSearchUseringroup(searchData, pathname))
    }
    let pathnames = window.location.search
    const isSearch = pathnames.split('=')[0] === '?searchData'
    const isSorter =
        pathnames.split('=')[0] === '?sortData' || '&' + pathnames.split('&').pop()?.split('=')[0] === '&sortData'
    const onSortBy = (sortData, colum) => {
        setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
        if (colum === 'name') {
            setSortName(!SortName)
        }
        isSearch
            ? isSorter
                ? (pathnames = `?searchData=${pathnames.split('=')[1].split('&')[0]}&sortData=${sortData}`)
                : (pathnames = `?searchData=${pathnames.split('=').pop()}&sortData=${sortData}`)
            : (pathnames = `?sortData=${sortData}`)
        dispatch(onSortInNhomnguoidung(pathname, pathnames))
    }
    const deleteOne = (id) => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n xo??a d???? li????u na??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '??????ng y??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteoneuseringroup(id, pathname)) as any)
                    .then((res) => {
                        dispatch(getUsersAllGroup(pathname))
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    const deleteAll = (): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n xo??a d???? li????u na??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteAlluseringroup(selectedRowKeys, pathname)) as any)
                    .then((res) => {
                        dispatch(getUsersAllGroup(pathname))
                        setDisabled(true)
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title={`Danh s??ch ng?????i d??ng thu????c nho??m ` + pathname}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='Nh???p t??? kh??a c???n t??m...'
                                    enterButton={
                                        <>
                                            <SearchOutlined /> T??m ki???m
                                        </>
                                    }
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button onClick={(): void => history.goBack()}>
                                <BackwardOutlined />
                                Quay la??i
                            </Button>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                onClick={deleteAll}>
                                X??a
                            </Button>
                            <Link to={`/${MenuPaths.nhomnguoidung}/${MenuPaths.themdsnguoidungtrongnhom}/` + pathname}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Th??m
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={userinGroupList}
                pagination={false}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                bordered
                rowSelection={{ ...rowSelection }}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(userinGroupList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} do??ng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
