/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    BackwardOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SaveOutlined
} from '@ant-design/icons'
import { Button, Checkbox, ConfigProvider, Empty, Modal, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { NHOMNGUOIDUNG_LINHVUC_UPDATE_URL, NHOMNGUOIDUNG_LINHVUC_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import DanhSachLinhVuc from 'pages/danhmuc/linhvuc/DanhSachLinhVuc'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import queryString from 'query-string'
function PhanQuyenNhomNguoiDung() {
    let groupCode = window.location.pathname.split('/').pop()
    const history = useHistory()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>()
    const [dataTable, setDataTable] = useState<any>([])
    const [disabledDelete, setdisabledDelete] = useState(true)
    const [resetCount, setResetCount] = useState(0)
    const [total, setTotal] = useState<number | undefined>()
    const [current, setCurrent] = useState<number | undefined>(1)
    const [pagesize, setPagesize] = useState<number | undefined>(10)
    const [isLoadingTB, setIsLoadingTB] = useState(true)

   const parsed = queryString.parse(window.location.search)
 
    
    const showModal = () => {
        setIsModalVisible(true)
    }
    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
        setResetCount(resetCount + 1)
    }
    useEffect(() => {
        axios
            .get(
                `${NHOMNGUOIDUNG_LINHVUC_URL}/${groupCode}?curPage=${current ? current : 1}&pageSize=${
                    pagesize ? pagesize : 10
                }`,
                Authorization()
            )
            .then((res) => {
                if (res.status === 200) {
                    setIsLoadingTB(false)
                }
                setDataTable(res.data.data.result)
                setPagesize(res.data.data.pagination?.pageSize)
                setCurrent(res.data.data.pagination?.currentPage)
                setTotal(res.data.data.pagination?.total)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [groupCode, isModalVisible])

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys?.length > 0 ? setdisabledDelete(false) : setdisabledDelete(true)
        }
    }

    const onPageChange = (current, pagesize) => {
        setIsLoadingTB(true)
        axios
            .get(`${NHOMNGUOIDUNG_LINHVUC_URL}/${groupCode}?curPage=${current}&pageSize=${pagesize}`, Authorization())
            .then((res) => {
                setDataTable(res.data.data.result)
                setPagesize(res.data.data.pagination?.pageSize)
                setCurrent(res.data.data.pagination?.currentPage)
                setTotal(res.data.data.pagination?.total)
                setIsLoadingTB(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setIsLoadingTB(true)
                axios
                    .delete(
                        `${NHOMNGUOIDUNG_LINHVUC_UPDATE_URL}/${groupCode}?curPage=${current}&pageSize=${pagesize}`,
                        {
                            ...Authorization(),
                            data: selectedRowKeys
                        }
                    )
                    .then((data) => {
                        if (data.data.errorCode === 0) {
                            setdisabledDelete(true)
                            axios
                                .get(`${NHOMNGUOIDUNG_LINHVUC_URL}/${groupCode}?pageSize=${pagesize}`, Authorization())
                                .then((res) => {
                                    setTimeout(() => {
                                        setSelectedRowKeys([])
                                    }, 1500)
                                    setDataTable(res.data.data.result)
                                    setPagesize(res.data.data.pagination?.pageSize)
                                    setCurrent(res.data.data.pagination?.currentPage)
                                    setTotal(res.data.data.pagination?.total)
                                    setIsLoadingTB(false)
                                })

                            Notification({ status: 'success', message: data.data.message })
                        } else {
                            Notification({ status: 'error', message: data.data.message })
                        }
                    })
            }
        })
    }

    const onChangePermission = (e, value, type) => {
        dataTable.map((linhvuc) => {
            if (linhvuc.maLinhVuc === value) {
                switch (type) {
                    case 'ISCREATE':
                        linhvuc.isCreate = e.target.checked ? 1 : 0
                        break
                    case 'ISSEEALL':
                        linhvuc.isSeeAll = e.target.checked ? 1 : 0
                        break
                    case 'ISSEECREATEDBY':
                        linhvuc.isSeeCreatedBy = e.target.checked ? 1 : 0
                        break
                    case 'ISUPDATEDALL':
                        linhvuc.isUpdateAll = e.target.checked ? 1 : 0
                        break
                    case 'ISUPDATEDALLCREATEDBY':
                        linhvuc.isUpdateCreatedBy = e.target.checked ? 1 : 0
                        break
                    case 'ISDELETEALL':
                        linhvuc.isDeleteAll = e.target.checked ? 1 : 0
                        break
                    case 'ISDELETECREATEBY':
                        linhvuc.isDeleteCreatedBy = e.target.checked ? 1 : 0
                        break
                    default:
                        break
                }
            }
        })
    }

    const addPermission = () => {


        if (dataTable) {
            const values = dataTable.map((linhvuc) => ({
                maLinhVuc: linhvuc.maLinhVuc,
                isCreate: linhvuc.isCreate,
                isSeeAll: linhvuc.isSeeAll,
                isSeeCreatedBy: linhvuc.isSeeCreatedBy,
                isDeleteAll: linhvuc.isDeleteAll,
                isDeleteCreatedBy: linhvuc.isDeleteCreatedBy,
                isUpdateAll: linhvuc.isUpdateAll,
                isUpdateCreatedBy: linhvuc.isUpdateCreatedBy
            }))

            axios.post(`${NHOMNGUOIDUNG_LINHVUC_UPDATE_URL}/${groupCode}`, values, Authorization()).then((res) => {
                if (res.data.errorCode === 0) {
                    Notification({ status: 'success', message: res.data.message })
                } else {
                    Notification({ status: 'error', message: res.data.message })
                }
            })
        }
    }

    const columns: any = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '50px',
            render: (value, _, index) => current && pagesize && Math.ceil(current - 1) * pagesize + index + 1
        },
        { title: 'Tên lĩnh vực', dataIndex: 'tenLinhVuc', key: 'tenLinhVuc', width: '200px' },
        {
            title: 'Quyền',
            dataIndex: 'namecode',
            key: 'namecode',
            align: 'center',
            render: (_, value) => {
                return (
                    <>
                        <Checkbox
                            name={`${value.maLinhVuc}isSeeAll`}
                            defaultChecked={value.isSeeAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISSEEALL')}>
                            Xem tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isCreate`}
                            defaultChecked={value.isCreate === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISCREATE')}>
                            Thêm dữ liệu
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isSeeCreatedBy`}
                            defaultChecked={value.isSeeCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISSEECREATEDBY')}>
                            Xem do mình tạo
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isUpdateAll`}
                            defaultChecked={value.isUpdateAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISUPDATEDALL')}>
                            Sửa tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isUpdateCreatedBy`}
                            defaultChecked={value.isUpdateCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISUPDATEDALLCREATEDBY')}>
                            Sửa do mình tạo
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isDeleteAll`}
                            defaultChecked={value.isDeleteAll === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISDELETEALL')}>
                            Xóa tất cả
                        </Checkbox>
                        <Checkbox
                            name={`${value.maLinhVuc}isDeleteCreatedBy`}
                            defaultChecked={value.isDeleteCreatedBy === 1 ? true : false}
                            onChange={(e) => onChangePermission(e, value.maLinhVuc, 'ISDELETECREATEBY')}>
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
            fixed: 'center',
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
                            setIsLoadingTB(true)
                            axios
                                .delete(
                                    `${NHOMNGUOIDUNG_LINHVUC_UPDATE_URL}/${groupCode}?curPage=${
                                        current ? current : ''
                                    }&pageSize=${pagesize ? pagesize : ''}`,
                                    {
                                        ...Authorization(),
                                        data: [record.maLinhVuc]
                                    }
                                )
                                .then((data) => {
                                    if (data.data.errorCode === 0) {
                                        axios
                                            .get(
                                                `${NHOMNGUOIDUNG_LINHVUC_URL}/${groupCode}?pageSize=${pagesize}`,
                                                Authorization()
                                            )
                                            .then((res) => {
                                                setDataTable(res.data.data.result)
                                                setPagesize(res.data.data.pagination?.pageSize)
                                                setCurrent(res.data.data.pagination?.currentPage)
                                                setTotal(res.data.data.pagination?.total)
                                                setIsLoadingTB(false)
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
                <Button icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                    Quay lại
                </Button>
                <Button type='primary' icon={<SaveOutlined />}>
                    Lưu
                </Button>
                <Button danger type='primary' icon={<DeleteOutlined />} disabled={disabled}>
                    Xóa
                </Button>
            </div>
            <div></div>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách phân quyền lĩnh vực'
                    extra={[
                        <Space>
                            <Button
                                style={{ marginTop: '10px' }}
                                icon={<BackwardOutlined />}
                                onClick={(): void => history.goBack()}>
                                Quay lại
                            </Button>
                            <Button
                                style={{ marginTop: '10px' }}
                                icon={<PlusOutlined />}
                                type='primary'
                                onClick={showModal}>
                                Thêm lĩnh vực
                            </Button>
                            <Button
                                disabled={disabledDelete}
                                style={{ marginTop: '10px' }}
                                danger
                                icon={<DeleteOutlined />}
                                type='primary'
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Button
                                style={{ marginTop: '10px' }}
                                icon={<SaveOutlined />}
                                type='primary'
                                onClick={addPermission}>
                                Lưu
                            </Button>
                        </Space>
                    ]}></PageHeader>
            </div>
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
                <DanhSachLinhVuc
                    isModalVisible={isModalVisible}
                    accountName={groupCode}
                    setIsSave=''
                    isSave=''
                    setIsModalVisible={setIsModalVisible}
                    isPhanQuyenTheoNhom={true}
                    resetCount={resetCount}
                    setResetCount={setResetCount}
                />
            </Modal>
            <Table
                size='small'
                rowKey='maLinhVuc'
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataTable}
                pagination={false}
                loading={isLoadingTB}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(dataTable) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={total}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={current}
                        defaultPageSize={10}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </div>
    )
}

export default PhanQuyenNhomNguoiDung
