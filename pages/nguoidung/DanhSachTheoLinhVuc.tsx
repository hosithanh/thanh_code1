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
            title: 'B???n c?? ch???c ch???n mu???n x??a l??nh v???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                deleteLinhvuc(maLinhvuc)
            }
        })
    }
    const handleDeleteAllLinhvuc = (selectedRow) => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a nh???ng l??nh v???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
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
            title: 'M?? l??nh v???c',
            key: 'malinhvu',
            dataIndex: 'malinhvuc',
            align: 'center',
            width: '200px'
        },
        {
            title: 'T??n l??nh v???c',
            key: 'tenlinhvuc',
            dataIndex: 'tenlinhvuc',
            align: 'left'
        },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: '70px',
            render: (record) => {
                return (
                    <>
                        <Tooltip title='X??a' color='#ff4d4f' placement='right'>
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
                    title='Danh s??ch l??nh v???c theo ng?????i d??ng'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Button onClick={(): void => history.goBack()}>
                                <BackwardOutlined />
                                Quay la??i
                            </Button>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                onClick={() => handleDeleteAllLinhvuc(selectedRow)}>
                                X??a
                            </Button>
                            {/* <Button onClick={saveLinhvuc} type='primary' icon={<PlusOutlined />}>
                                L??u
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
                        ????ng
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
                Th??m l??nh v???c
            </Button>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns as any}
                dataSource={dataTable}
                pagination={false}
                loading={isLoading}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
        </>
    )
}

export default DanhSachTheoLinhVuc
