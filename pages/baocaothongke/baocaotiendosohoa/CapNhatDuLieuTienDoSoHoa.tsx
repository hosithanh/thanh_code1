/* eslint-disable array-callback-return */
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Button,
    Col,
    ConfigProvider,
    Empty,
    Form,
    Modal,
    PageHeader,
    Pagination,
    Radio,
    Row,
    Select,
    Table,
    Tooltip
} from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { CapNhatThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Capnhattiendosohoa'
import { isArrayEmpty } from 'common/utils/empty-util'

import 'moment/locale/vi'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    deleteALLTiendo,
    deleteOneTiendo,
    getCapNhatTienDoSoHoa
} from 'store/actions/baocaothongke.actions/capnhattiendosohoa'

import { AppState } from '../../../store/interface'
import ChiTietCapNhatTienDoSoHoa from './ChiTietCapNhatTienDoSoHoa'

export default function CapNhatDuLieuTienDoSoHoa() {
    const now = new Date().getUTCFullYear()
    const dispatch = useDispatch<any>()
    const dataList = useSelector<AppState, CapNhatThongKeTienDoSoHoa[] | undefined>(
        (state) => state.capnhattiendosohoa.capnhattiendosohoaList
    )
    const curenPage = useSelector<AppState, number | undefined>((state) => state.capnhattiendosohoa.currentPage)
    const total = useSelector<AppState, number | undefined>((state) => state.capnhattiendosohoa.total)

    const [LoadingTable, setLoadingTable] = useState<boolean>(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [isModalvisiblechitiet, setisModalvisiblechitiet] = useState(false)
    const [idEdit, setidEdit] = useState<number | undefined>()
    const [namValue, setNamValue] = useState<any | undefined>(now)
    const [namChange, setnamChange] = useState<any>(namValue)
    const [quy, setQuy] = useState<number | undefined>()
    const showModal = () => {
        setisModalvisiblechitiet(true)
    }
    useEffect(() => {
        setnamChange(namValue)
    }, [namValue])
    useEffect(() => {
        !dataList && dispatch(getCapNhatTienDoSoHoa({}))
        dataList && setLoadingTable(false)
    }, [dispatch, dataList])

    // console.log('thanhcode', dataList[0])

    const [form] = Form.useForm()
    const childrens = [] as any
    const { Option } = Select

    const years = Array(now - (now - 22))
        .fill('')
        .map((v, idx) => now - idx)
        .sort((a, b) => b - a)
    for (let i = 1; i < 13; i++) {
        childrens.push(
            <Option title={`Tháng ${i}`} value={i} key={i}>
                Tháng {i}
            </Option>
        )
    }

    const onFinish_capnhat = (values) => {
        setLoadingTable(true)
        const { idDonVi, nam, quy, darasoat, moibosung } = values
        dispatch(getCapNhatTienDoSoHoa({ idDonVi, nam, quy, darasoat, moibosung }))
    }

    const editId = (id) => {
        setidEdit(id)
        setisModalvisiblechitiet(true)
    }

    const deleteOne = (value) => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteOneTiendo(value)) as any)
                    .then((res) => {
                        dispatch(getCapNhatTienDoSoHoa({}))
                        Notification({
                            status: res.data.errorCode === 0 ? 'success' : 'error',
                            message: res.data.message
                        })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'Xóa thất bại' })
                    })
            }
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const handleDeleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteALLTiendo(selectedRowKeys)) as any)
                    .then((res) => {
                        setDisabled(true)
                        Notification({
                            status: res.data.errorCode === 0 ? 'success' : 'error',
                            message: res.data.message
                        })
                        dispatch(getCapNhatTienDoSoHoa({}))
                    })
                    .catch((res) => {
                        Notification({ status: 'error', message: res.data.message })
                    })
            }
        })
    }
    const columns: ColumnsType<CapNhatThongKeTienDoSoHoa> = [
        {
            title: 'STT',
            align: 'center',
            key: 'key',
            width: '80px',
            render: (value, row, index) => {
                return index + 1
            }
        },
        {
            title: 'Tên đơn vị',
            dataIndex: 'ten',
            key: 'ten'
        },
        {
            title: 'Quý',
            align: 'center',
            width: '80px',
            key: 'quy',
            render: (value, row, index) => {
                if (value?.quy === 1) {
                    return 'I'
                } else if (value?.quy === 2) {
                    return 'II'
                } else if (value?.quy === 3) {
                    return 'III'
                } else if (value?.quy === 4) {
                    return 'IV'
                } else {
                    return ''
                }
            }
        },

        {
            title: 'Năm',
            dataIndex: 'nam',
            align: 'center',
            width: '100px',
            key: 'nam'
        },
        {
            title: 'Đã rà soát',
            dataIndex: 'darasoat',
            align: 'center',

            key: 'darasoat'
        },
        {
            title: 'Mới bổ sung',
            dataIndex: 'moibosung',
            align: 'center',
            key: 'moibosung'
        },
        {
            title: 'Số kết quả hết hiệu lực',
            dataIndex: 'soketquahethieuluc',
            align: 'center',
            key: 'soketquahethieuluc'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        {/* <Link to={`/${MenuPaths.donvi}/${value.id}?edit=true`}> */}
                        <Tooltip title='Sửa' color='#2db7f5' placement='left'>
                            <Button
                                disabled={value.editPermission ? false : true}
                                type='text'
                                onClick={() => editId(`${value.id}`)}
                                icon={<EditOutlined style={{ color: '#1890ff' }} />}></Button>
                        </Tooltip>
                        {/* </Link> */}
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                disabled={value.editPermission ? false : true}
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => deleteOne(`${value.id}`)}></Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    const onReset = () => {
        form.resetFields()
        dispatch(getCapNhatTienDoSoHoa({}))
    }

    const handleCancels = () => {
        setidEdit(undefined)
        setisModalvisiblechitiet(false)
    }

    const changeNam = (value) => {
        setNamValue(value)
    }
    const onChangeTKQuy = (e) => {
        if (e.target.value === 1) {
            setQuy(1)
        }
        if (e.target.value === 2) {
            setQuy(2)
        }
        if (e.target.value === 3) {
            setQuy(3)
        }
        if (e.target.value === 4) {
            setQuy(4)
        }
    }
    const onPageChange = (curPage, pageSize) => {
        setLoadingTable(true)
        dispatch(getCapNhatTienDoSoHoa({ nam: namChange, quy: quy, curPage, pageSize }))
    }

    return (
        <div>
            <Modal
                width='100%'
                centered
                visible={isModalvisiblechitiet}
                onCancel={handleCancels}
                footer={
                    [
                        // <Button danger type='primary' onClick={handleCancel}>
                        //     Đóng
                        // </Button>
                    ]
                }>
                <ChiTietCapNhatTienDoSoHoa
                    idEdit={idEdit}
                    setIsmodeal={setisModalvisiblechitiet}
                    setidEdit={setidEdit}></ChiTietCapNhatTienDoSoHoa>
            </Modal>

            <div className='group-action'>
                <PageHeader ghost={false} title='Cập nhật tiến độ số hóa' extra={[]} />
                <Form onFinish={onFinish_capnhat} form={form}>
                    <Row gutter={24}>
                        <Col span={4} xs={24} sm={24} xl={4}>
                            <Row>
                                <label htmlFor=''>Thống kê theo năm:</label>
                            </Row>
                            <Form.Item
                                //rules={[{ required: true, message: 'Vui lòng không đuọc để trống!' }]}
                                name='nam'
                                // style={{ marginRight: '8px' }}
                            >
                                <Select
                                    // onChange={(_, value) => {
                                    //     setNamValue(value as any)
                                    // }}
                                    onChange={(value) => {
                                        changeNam(value)
                                    }}
                                    allowClear
                                    placeholder='----Chọn năm----'
                                    showSearch
                                    style={{ width: '100%', textAlign: 'left' }}>
                                    {years?.map((item, index) => (
                                        <Select.Option key={index} value={`${item}`}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={20} xs={24} sm={24} xl={20} xxl={20}>
                            <Row>
                                <label htmlFor=''>Chọn quý</label>
                            </Row>
                            <div className='radio--quy' style={{ top: '-10px' }}>
                                <Form.Item
                                    name='quy'
                                    // rules={[{ required: true, message: 'Vui lòng không được để trống!' }]}
                                >
                                    <Radio.Group onChange={onChangeTKQuy}>
                                        <Radio style={{ padding: '0 1px 0 0px' }} value={1}>
                                            Quý I(15/12/{namChange - 1} - 14/03/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 1px 0 0' }} value={2}>
                                            Quý II (15/03/{namChange} - 14/06/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 1px' }} value={3} className='radio3'>
                                            Quý III (15/06/{namChange} - 14/09/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 1px' }} value={4}>
                                            Quý IV (15/9/{namChange} - 14/12/{namChange})
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>

                    <Col span={12} style={{ float: 'right' }} xs={24} xl={12}>
                        {' '}
                        <Button type='primary' htmlType='submit' className='ant-btn-sm btn-submit'>
                            <SearchOutlined />
                            Tìm kiếm
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            danger
                            className='ant-btn-sm btn-submit'
                            type='primary'
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteAll}
                            disabled={disabled}>
                            Xóa
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            type='primary'
                            onClick={() => {
                                onReset()
                            }}
                            htmlType='button'
                            className='ant-btn-sm btn-submit'>
                            Làm mới
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            style={{ backgroundColor: 'orange', color: 'white', border: '1px solid white' }}
                            type='primary'
                            className='ant-btn-sm btn-submit'
                            onClick={() => {
                                showModal()
                            }}>
                            <PlusCircleOutlined /> Thêm mới
                        </Button>
                    </Col>
                </Form>
            </div>
            <div>
                <Table
                    rowKey='id'
                    rowSelection={{ ...rowSelection }}
                    scroll={{
                        y: window.innerHeight - 333
                    }}
                    columns={columns}
                    size='small'
                    pagination={false}
                    loading={LoadingTable}
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                    bordered
                    dataSource={dataList}
                    sticky
                />
                {!isArrayEmpty(dataList) && (
                    <ConfigProvider locale={viVN}>
                        <Pagination
                            total={total}
                            style={{ textAlign: 'end', paddingTop: '20px' }}
                            defaultCurrent={1}
                            current={curenPage}
                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                            showSizeChanger
                            onChange={onPageChange}
                            pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                        />
                    </ConfigProvider>
                )}
            </div>
        </div>
    )
}
