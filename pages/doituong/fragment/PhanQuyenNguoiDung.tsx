/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, ConfigProvider, Empty, Modal, Pagination, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { USER_PERMISSION_LOAIKETQUA } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import UserGroupList from 'pages/nhomnguoidung/ThemDanhSachNguoiDungTrongNhom'
import { useEffect, useState } from 'react'
function PhanQuyenNguoiDung({ maDoiTuong }) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isUserPermission, setIsUserPermission] = useState<boolean>(true)
    const [listUser, setListUser] = useState<any>([])
    const [dataTable, setDataTable] = useState<any>([])
    const [disabled, setDisabled] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [total, setTotal] = useState<number>()
    const [curentPage, setCurentPage] = useState<number>()
    const [pageSize, setPageSize] = useState<number>()
    const [isloadingTB, setIsloadingTB] = useState(true)

    useEffect(() => {
        dataTable && setIsloadingTB(false)
    }, [dataTable])

    const showModal = () => {
        setIsModalVisible(true)
    }
    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRow) => {
            setSelectedRowKeys(selectedRow.map((item) => item.accountId))
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const getUserPermission = () => {
        axios
            .get(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, Authorization())
            .then((data) => {
                if (!isArrayEmpty(data.data.data)) {
                    setDataTable(data.data.data?.result)
                    setCurentPage(data.data.data?.pagination?.currentPage)
                    setPageSize(data.data.data?.pagination?.pageSize)
                    setTotal(data.data.data?.pagination?.total)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getUserPermission()
    }, [maDoiTuong, isModalVisible])

    // useEffect(() => {
    //     // if (!isArrayEmpty(dataTable)) {
    //     //     const array = listUser.filter(
    //     //         (elem) => !dataTable.find(({ accountName }) => elem.accountName === accountName)
    //     //     )
    //     //     setDataTable([...dataTable, ...array])
    //     // } else {
    //     //     setDataTable([...listUser])
    //     // }
    //     getUserPermission()
    // }, [isModalVisible, maDoiTuong])
    const addUserPermission = () => {
        if (dataTable) {
            const value = dataTable.map((user) => ({
                isCreate: user.isCreate,
                accountId: user.accountId,
                isSeeAll: user.isSeeAll,
                isSeeCreatedBy: user.isSeeCreatedBy,
                isDeleteAll: user.isDeleteAll,
                isDeleteCreatedBy: user.isDeleteCreatedBy,
                isUpdateAll: user.isUpdateAll,
                isUpdateCreatedBy: user.isUpdateCreatedBy
            }))
            axios.post(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, value, Authorization()).then((res) => {
                if (res.data.errorCode === 0) {
                    // dispatch(getDulieu({}))

                    axios
                        .get(
                            `${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}?curPage=${
                                curentPage ? curentPage : 1
                            }&pageSize=${pageSize ? pageSize : 10}`,
                            Authorization()
                        )
                        .then((data) => {
                            setDataTable(data.data.data?.result)
                            setCurentPage(data.data.data?.pagination?.currentPage)
                            setPageSize(data.data.data?.pagination?.pageSize)
                            setTotal(data.data.data?.pagination.total)
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                    Notification({ status: 'success', message: res.data.message })
                } else {
                    Notification({ status: 'error', message: res.data.message })
                }
            })
        }
    }

    const onPageChange = (curentPage, pageSize) => {
        setIsloadingTB(true)
        axios
            .get(
                `${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}?curPage=${curentPage}&pageSize=${pageSize}`,
                Authorization()
            )
            .then((data) => {
                setDataTable(data.data.data?.result)
                setCurentPage(data.data.data?.pagination?.currentPage)
                setPageSize(data.data.data?.pagination?.pageSize)
                setTotal(data.data.data?.pagination.total)
                setIsloadingTB(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onChangePermission = (e, value, type) => {
        dataTable.map((user) => {
            if (user.accountId === value) {
                switch (type) {
                    case 'ISSEEALL':
                        user.isSeeAll = e.target.checked ? 1 : 0
                        break
                    case 'ISCREATE':
                        user.isCreate = e.target.checked ? 1 : 0
                        break
                    case 'ISSEECREATEDBY':
                        user.isSeeCreatedBy = e.target.checked ? 1 : 0
                        break
                    case 'ISUPDATEDALL':
                        user.isUpdateAll = e.target.checked ? 1 : 0
                        break
                    case 'ISUPDATEDALLCREATEDBY':
                        user.isUpdateCreatedBy = e.target.checked ? 1 : 0
                        break
                    case 'ISDELETEALL':
                        user.isDeleteAll = e.target.checked ? 1 : 0
                        break
                    case 'ISDELETECREATEBY':
                        user.isDeleteCreatedBy = e.target.checked ? 1 : 0
                        break
                    default:
                        break
                }
            }
        })
    }
    const handleDeleteAllUser = (selectedRowKeys) => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những người dùng này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setIsloadingTB(true)
                axios
                    .delete(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, {
                        ...Authorization(),
                        data: selectedRowKeys
                    })
                    .then((data) => {
                        if (data.data.errorCode === 0) {
                            // getUserPermission()

                            axios
                                .get(
                                    `${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}?pageSize=${pageSize}`,
                                    Authorization()
                                )
                                .then((data) => {
                                    setDataTable(data.data.data?.result)
                                    setCurentPage(data.data.data?.pagination?.currentPage)
                                    setPageSize(data.data.data?.pagination?.pageSize)
                                    setTotal(data.data.data?.pagination?.total)
                                    dataTable && setIsloadingTB(false)
                                    setDisabled(true)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            Notification({ status: 'success', message: data.data.message })
                        } else {
                            dataTable && setIsloadingTB(false)
                            setDisabled(true)
                            Notification({ status: 'error', message: data.data.message })
                        }
                    })
            }
        })
    }
    const columns: any = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => index + 1
        },
        { title: 'Tên người dùng', dataIndex: 'accountName', key: 'accountName', width: '150px' },
        {
            title: 'Quyền',
            dataIndex: 'namecode',
            key: 'namecode',
            align: 'center',
            render: (_, value) => {
                return (
                    <>
                        <Checkbox
                            name={`${value.accountId}isSeeAll`}
                            defaultChecked={value.isSeeAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISSEEALL')}>
                            Xem tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isCreate`}
                            defaultChecked={value.isCreate === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISCREATE')}>
                            Thêm dữ liệu
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isSeeCreatedBy`}
                            defaultChecked={value.isSeeCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISSEECREATEDBY')}>
                            Xem do mình tạo
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isUpdateAll`}
                            defaultChecked={value.isUpdateAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISUPDATEDALL')}>
                            Sửa tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isUpdateCreatedBy`}
                            defaultChecked={value.isUpdateCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISUPDATEDALLCREATEDBY')}>
                            Sửa do mình tạo
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isDeleteAll`}
                            defaultChecked={value.isDeleteAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISDELETEALL')}>
                            Xóa tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.accountId}isDeleteCreatedBy`}
                            defaultChecked={value.isDeleteCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.accountId, 'ISDELETECREATEBY')}>
                            Xóa do mình nhập
                        </Checkbox>
                    </>
                )
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: '70px',
            render: (record) => {
                const handleDeleteUser = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            setIsloadingTB(true)
                            axios
                                .delete(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}`, {
                                    ...Authorization(),
                                    data: [record.accountId]
                                })
                                .then((data) => {
                                    if (data.data.errorCode === 0) {
                                        // getUserPermission()
                                        axios
                                            .get(
                                                `${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}?pageSize=${pageSize}`,
                                                Authorization()
                                            )
                                            .then((data) => {
                                                setIsloadingTB(false)
                                                setDataTable(data.data.data?.result)
                                                setCurentPage(data.data.data?.pagination?.currentPage)
                                                setPageSize(data.data.data?.pagination?.pageSize)
                                                setTotal(data.data.data?.pagination.total)
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })
                                        Notification({ status: 'success', message: data.data.message })
                                    } else {
                                        Notification({ status: 'error', message: data.data.message })
                                    }
                                })
                        }
                    })
                }
                return (
                    <>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeleteUser}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    return (
        <div className='custom-form'>
            <div className='group-btn-detail'>
                {/* <Button icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                    Quay lại
                </Button> */}
                <Button type='primary' icon={<SaveOutlined />} onClick={addUserPermission}>
                    Lưu
                </Button>
                <Button
                    danger
                    type='primary'
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteAllUser(selectedRowKeys)}
                    disabled={disabled}>
                    Xóa
                </Button>
            </div>
            <div>
                <Button
                    style={{ marginBottom: '10px' }}
                    icon={<PlusOutlined />}
                    type='primary'
                    size='small'
                    onClick={showModal}>
                    Thêm người dùng
                </Button>
                <Modal
                    width='100%'
                    centered
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    closable={false}
                    footer={[
                        <Button danger type='primary' onClick={handleCancel}>
                            Đóng
                        </Button>
                    ]}>
                    <UserGroupList
                        isModalVisible={isModalVisible}
                        maDoiTuong={maDoiTuong}
                        isUserPermission={isUserPermission}
                        setListUser={setListUser}
                        setIsModalVisible={setIsModalVisible}
                    />
                </Modal>
            </div>
            <Table
                size='small'
                rowKey='id'
                loading={isloadingTB}
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={dataTable}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(dataTable) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={total}
                        showTotal={(total, range) =>
                            `${curentPage! * pageSize! - pageSize! + 1}-${range[1]} của ${total} dòng`
                        }
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        current={curentPage}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </div>
    )
}

export default PhanQuyenNguoiDung
