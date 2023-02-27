/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Modal, PageHeader, Space, Table, Tooltip } from 'antd'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { LINHVUC_USER } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import DanhSachLinhVuc from 'pages/danhmuc/linhvuc/DanhSachLinhVuc'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
function DanhSachTheoLinhVuc() {
    // const dispatch = useDispatch()
    const history = useHistory()
    const [dataTable, setDataTable] = useState<any>([])
    const [selectedRow, setSelectedRow] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const accountName = window.location.pathname.split('/').pop()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isSave, setIsSave] = useState(false)
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const [resetCount, setResetCount] = useState(0)
    // const [listLinhvuc, setListLinhvuc] = useState<any>([])

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
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRow) => {
            setSelectedRow(selectedRow.map((item) => item.malinhvuc))
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const getUserLinhVuc = () => {
        axios
            .get(`${LINHVUC_USER}/${accountName}`, Authorization())
            .then((data) => {
                SetIsLoading(false)
                setDataTable(data.data.data.result)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const deleteLinhvuc = (listMaLinhvuc: []) => {
        axios
            .delete(`${LINHVUC_USER}/${accountName}`, {
                ...Authorization(),
                data: listMaLinhvuc
            })
            .then((data) => {
                if (data.data.errorCode === 0) {
                    getUserLinhVuc()
                    Notification({ status: 'success', message: data.data.message })
                } else {
                    Notification({ status: 'error', message: data.data.message })
                }
            })
    }
    const handleDeleteLinhvuc = (maLinhvuc) => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa lĩnh vực này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                deleteLinhvuc(maLinhvuc)
            }
        })
    }
    const handleDeleteAllLinhvuc = (selectedRow) => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những lĩnh vực này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                deleteLinhvuc(selectedRow)
            }
        })
    }

    useEffect(() => {
        getUserLinhVuc()
    }, [isSave])

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (value, _, index) => index + 1
        },
        {
            title: 'Mã lĩnh vực',
            key: 'malinhvu',
            dataIndex: 'malinhvuc',
            align: 'center',
            width: '200px'
        },
        {
            title: 'Tên lĩnh vực',
            key: 'tenlinhvuc',
            dataIndex: 'tenlinhvuc',
            align: 'left'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: '70px',
            render: (record) => {
                return (
                    <>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => handleDeleteLinhvuc([record.malinhvuc])}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách lĩnh vực theo người dùng'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Button onClick={(): void => history.goBack()}>
                                <BackwardOutlined />
                                Quay lại
                            </Button>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                onClick={() => handleDeleteAllLinhvuc(selectedRow)}>
                                Xóa
                            </Button>
                            {/* <Button onClick={saveLinhvuc} type='primary' icon={<PlusOutlined />}>
                                Lưu
                            </Button> */}
                        </Space>
                    ]}
                />
            </div>
            <Modal
                width='90%'
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
                    setIsModalVisible={setIsModalVisible}
                    accountName={accountName}
                    setIsSave={setIsSave}
                    isSave={isSave}
                    isPhanQuyenTheoNhom={false}
                    resetCount={resetCount}
                    setResetCount={setResetCount}
                />
            </Modal>
            <Button
                style={{ marginBottom: '10px' }}
                size='small'
                onClick={showModal}
                type='primary'
                icon={<PlusOutlined />}>
                Thêm lĩnh vực
            </Button>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns as any}
                dataSource={dataTable}
                pagination={false}
                loading={isLoading}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
        </>
    )
}

export default DanhSachTheoLinhVuc
