/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { SaveOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { USER_PERMISSION_LOAIKETQUA } from 'common/constant/api-constant'
import { MenuPaths } from 'common/constant/app-constant'
import { UserInGroup } from 'common/interface/UserInGroup'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
    addUserbygroup,
    getUsersAllNoInGroup,
    onChangedanhsachnguoidungtrongnhom,
    onSearchUsernoingroup
} from 'store/actions/nhomnguoidung.action'
import { AppState } from 'store/interface'

export default function UserGroupList({
    isUserPermission,
    setListUser,
    setIsModalVisible,
    maDoiTuong,
    isModalVisible
}): JSX.Element {
    const dispatch = useDispatch<any>()
    const history = useHistory()
    const pathname2 = window.location.pathname.split('/').pop()
    const userinGroupList = useSelector<AppState, UserInGroup[] | undefined>((state) => state.userinGroup.result)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.userinGroup.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.userinGroup.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.userinGroup.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    // const [loadTb, setLoadTb] = useState(false)
    const [dataSearch, setdataSearch] = useState<any>()

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
            title: <span>Họ tên</span>,
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: <span>Email</span>,
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: <span>Số điện thoại</span>,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        }
    ]
    useEffect(() => {
        dispatch(getUsersAllNoInGroup(pathname2))
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(
                isUserPermission
                    ? selectedRows.map((item) => {
                          return {
                              isCreate: 0,
                              accountName: item.name,
                              accountId: item.id,
                              isDeleteAll: 0,
                              isDeleteCreatedBy: 0,
                              isUpdateAll: 0,
                              isUpdateCreatedBy: 0,
                              isSeeAll: 0,
                              isSeeCreatedBy: 0
                          }
                      })
                    : selectedRows.map((item) => {
                          return { id: item.user.id }
                      })
            )
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    const onPageChange = (page, pageSize?) => {
        dispatch(onChangedanhsachnguoidungtrongnhom(page, pageSize, pathname2, dataSearch))
    }
    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)

        // history.push(`?searchData=${searchData}`)
        dispatch(onSearchUsernoingroup(searchData, pathname2))
    }
    const adduserbygroup = (): void => {
        if (isUserPermission) {
            setListUser(selectedRowKeys)

            if (selectedRowKeys) {
                axios
                    .post(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, selectedRowKeys, Authorization())
                    .then((res) => {
                        if (res.data.errorCode === 0) {
                            setIsModalVisible(false)

                            // axios
                            //     .get(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, Authorization())
                            //     .then((data) => {
                            //         if (!isArrayEmpty(data.data.data)) {
                            //             // setDataTable(data.data.data?.result)
                            //             // setCurentPage(data.data.data?.pagination?.currentPage)
                            //             // setPageSize(data.data.data?.pagination?.pageSize)
                            //             // setTotal(data.data.data?.pagination?.total)
                            //         }
                            //     })
                            //     .catch((err) => {
                            //         console.log(err)
                            //     })
                        } else {
                            Notification({ status: 'error', message: res.data.message })
                        }
                    })
            }
        } else {
            dispatch(addUserbygroup(selectedRowKeys, pathname2)).then(() => {
                history.push(`/${MenuPaths.nhomnguoidung}/${MenuPaths.dsnguoidungtrongnhom}/${pathname2}`)
            })
        }
    }
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    onBack={() => window.history.back()}
                    backIcon={isUserPermission ? false : true}
                    title={`${isUserPermission ? '' : `Thêm người dùng vào nhóm ${pathname2}`}`}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm...'
                                    enterButton='Tìm kiếm'
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button type='primary' icon={<SaveOutlined />} disabled={disabled} onClick={adduserbygroup}>
                                Chọn
                            </Button>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={userinGroupList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
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
                        defaultCurrent={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                        onChange={onPageChange}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
