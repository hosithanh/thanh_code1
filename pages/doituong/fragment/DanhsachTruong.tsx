/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    AliyunOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    CheckOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Form, Input, Modal, PageHeader, Pagination, Space, Spin, Table, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { CHILD_EXISTS, REGEX_CODE, REGEX_Number_Negative, SUCCESS } from 'common/constant'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    deleteAllDanhsachtruong,
    deleteDanhsachtruong,
    editDanhsachtruong,
    getDanhsachtruong,
    unbinding
} from 'store/actions/danhsachtruong.action'
import { DYNAMIC_URL } from '../../../common/constant/api-constant'
import { errorMessage, successMessage, typeField } from '../../../common/constant/app-constant'
import { TruongDuLieu } from '../../../common/interface/TruongDuLieu'
import { Authorization } from '../../../common/utils/cookie-util'
import { AppState } from '../../../store/interface'
import ChitietTruong from './ChitietTruong'
import EditTruong from './EditTruong'

export default function DanhsachTruong({ isModalAdd, maDT }): JSX.Element {
    const fieldList = useSelector<AppState, TruongDuLieu[] | undefined>(
        (state) => state.danhsachtruong.danhsachtruongList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.danhsachtruong.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.danhsachtruong.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.danhsachtruong.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.danhsachtruong?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.danhsachtruong?.sortData)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disable, setDisable] = useState<boolean>(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    var maDoiTuong = window.location.search.split('=')[1]
    const maTruongRef = useRef<HTMLElement | null>(null)
    const idTruongRef = useRef<HTMLElement | null>(null)
    const dispatch = useDispatch<any>()
    const [orderDataMa, setOrderDataMa] = useState('desc')
    const [isModalAddDS, setIsModalAddDS] = useState<boolean>(false)
    const [isModalVisibleDS, setIsModalAddVisibleDS] = useState(false)
    const [isFetchTruongDS, setIsFetchTruongDS] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isModalEditDS, setIsModalEditDS] = useState<boolean>(false)
    const [isModalVisibleDSEdit, setIsModalVisibleDSEdit] = useState(false)
    const [isFetchTruongDSEdit, setIsFetchTruongDSEdit] = useState(false)
    // edit s???p x???p
    const [editingKey, setEditingKey] = useState('')
    const [valueSort, setValueSort] = useState<TruongDuLieu>()
    const inputRef = useRef(null)
    const isEditing = (record) => record.id === editingKey
    const editSort = (record) => {
        setValueSort(record)
        setEditingKey(record.id)
    }
    const showModal = () => {
        setIsModalAddVisibleDS(true)
        setIsModalAddDS(true)
        setIsFetchTruongDS(false)
    }

    const handleOk = () => {
        setIsModalAddVisibleDS(false)
    }
    const handleCancel = () => {
        setIsModalAddVisibleDS(false)
        setIsModalAddDS(false)
        setIsFetchTruongDS(false)
    }
    //Edit tr????ng
    const showModalEdit = () => {
        setIsModalVisibleDSEdit(true)
        setIsModalEditDS(true)
        setIsFetchTruongDSEdit(false)
    }

    const handleOkEdit = () => {
        setIsModalVisibleDSEdit(false)
        setIsModalEditDS(false)
    }
    const handleCancelEdit = () => {
        setIsModalVisibleDSEdit(false)
        setIsModalEditDS(false)
        setIsFetchTruongDSEdit(false)
    }
    if (maDT) {
        maDoiTuong = maDT
    }

    const saveSort = async () => {
        try {
            const valueInput = await form.validateFields()
            const { ngayTao, ...newValue } = valueSort
            dispatch(editDanhsachtruong(Number(editingKey), { ...newValue, sapXep: Number(valueInput?.sapXep) }))
                .then((res) => {
                    setEditingKey('')
                    dispatch(getDanhsachtruong({ maDoiTuong, pageSize }))
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
                    form.resetFields()
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (editingKey) {
            inputRef.current?.focus()
            form.setFieldsValue({ sapXep: valueSort.sapXep })
        }
    }, [editingKey])

    const columns: ColumnsType<TruongDuLieu> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <Link key={value.id} to=''>
                    {currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}
                </Link>
            )
        },
        {
            title: (
                <div onClick={() => onSortBy(`ma ${orderDataMa}`, 'ma')}>
                    <span>Ma?? tr??????ng</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma',
            width: '15%'
        },
        {
            title: 'T??n tr??????ng',
            dataIndex: 'moTa',
            key: 'moTa',
            width: '20%'
        },
        {
            title: 'Ki???u d??? li???u',
            dataIndex: 'kieuDuLieu',
            key: 'kieuDuLieu',
            width: '10%',
            render: (value) => typeField[value]
        },
        { title: '????? d??i', dataIndex: 'doDai', key: 'doDai', align: 'center', width: '8%' },
        {
            title: 'B???t bu???c',
            dataIndex: 'batBuoc',
            align: 'center',
            key: 'batBuoc',
            width: '8%',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'To??n v??n',
            dataIndex: 'toanVan',
            align: 'center',
            key: 'toanVan',
            width: '8%',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'K??ch ho???t',
            dataIndex: 'kichHoat',
            align: 'center',
            key: 'kichHoat',
            width: '5%',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'Ki????u textarea',
            dataIndex: 'isTextArea',
            align: 'center',
            key: 'isTextArea',
            width: '8%',
            render: (value) => value === 1 && <CheckOutlined />
        },
        {
            title: 'S????p x????p',
            dataIndex: 'sapXep',
            key: 'sapXep',
            align: 'center',
            width: '100px',
            render: (value, record) => {
                const editable = isEditing(record)
                return editable ? (
                    <Form.Item
                        style={{
                            margin: 0
                        }}
                        name='sapXep'
                        rules={[
                            // {
                            //     required: true,
                            //     message: `Nh???p th??? t??? s???p x???p !`,
                            // },
                            { pattern: REGEX_Number_Negative, message: 'Vui l??ng nh???p s??? nguy??n d????ng !' }
                        ]}>
                        <Input ref={inputRef} onPressEnter={saveSort} type='number' onBlur={saveSort} min={0} />
                    </Form.Item>
                ) : (
                    <div style={{ cursor: 'pointer' }} onClick={() => editSort(record)}>
                        {value}
                    </div>
                )
            }
        },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value, _, index) => {
                return (
                    <Fragment>
                        <Tooltip title='Sao ch??p' color='#4caf50' placement='top'>
                            <Button
                                style={{ color: '#4caf50' }}
                                type='text'
                                icon={<CopyOutlined />}
                                onClick={(): void => {
                                    maTruongRef.current = value.ma
                                    setIsModalVisible(true)
                                }}></Button>
                        </Tooltip>
                        <Tooltip title='Chi??nh s????a' color='#1890ff' placement='top'>
                            <Button
                                style={{ color: '#1890ff' }}
                                type='text'
                                icon={<EditOutlined />}
                                onClick={(): void => {
                                    idTruongRef.current = value.id
                                    showModalEdit()
                                }}></Button>
                        </Tooltip>

                        <Tooltip title='X??a' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={() => onDeleteOne(`${value.id}`)}></Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    const onDeleteOne = (id) => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n xo??a d???? li????u na??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '??????ng y??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteDanhsachtruong(id)) as any)
                    .then((res) => {
                        const status = res.data?.errorCode !== 0 ? 'error' : 'success'
                        Notification({ status: status, message: res.data.message })
                        dispatch(getDanhsachtruong({ maDoiTuong }))
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'X??a th???t b???i' })
                    })
            }
        })
    }
    useEffect(() => {
        // !fieldList && dispatch(getDanhsachtruong({ maDoiTuong }))
        dispatch(getDanhsachtruong({ maDoiTuong }))
    }, [maDoiTuong])
    const onSearch = (searchData?: string) => {
        dispatch(getDanhsachtruong({ maDoiTuong, searchData }))
    }

    const onPageChange = (page, pageSize) =>
        dispatch(getDanhsachtruong({ page, pageSize, maDoiTuong, searchData, sortData }))

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            isArrayEmpty(selectedRowKeys) ? setDisable(true) : setDisable(false)
        }
    }
    const onSortBy = (sortData, colum) => {
        if (colum === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getDanhsachtruong({ maDoiTuong, searchData, sortData }))
    }

    const onUnbinding = () => {
        if (maDoiTuong) {
            showConfirm({
                title: 'B???n c?? ch???c ch???n bo?? b????t bu????c?',
                icon: <ExclamationCircleOutlined />,
                okText: '??????ng y??',
                okType: 'primary',
                cancelText: 'Kh??ng',
                maskClosable: true,
                onOk: (): void => {
                    var values = {
                        batBuoc: 0,
                        maDoiTuong: maDoiTuong
                    }
                    setIsLoading(true)
                    dispatch(unbinding(values))
                        .then((res) => {
                            dispatch(getDanhsachtruong({ maDoiTuong }))
                            setIsLoading(false)
                            Notification({
                                status: res.data.errorCode > 0 ? 'error' : 'success',
                                message: 'Bo?? b????t bu????c tha??nh c??ng'
                            })
                            form.resetFields()
                        })
                        .catch(() => {
                            Notification({ status: 'error', message: errorMessage })
                        })
                }
            })
        }
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
                return (dispatch(deleteAllDanhsachtruong(selectedRowKeys)) as any)
                    .then((res) => {
                        Notification({ status: 'success', message: res.data.message })
                        dispatch(getDanhsachtruong({ maDoiTuong }))
                        setDisable(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    const [form] = useForm()

    const onFinish = (): void => {
        const values = form.getFieldsValue()
        values.maTruongCu = maTruongRef.current
        values.maDoiTuong = maDoiTuong
        if (!values.maTruongMoi || !values.moTaTruongMoi) {
            if (!values.maTruongMoi && !values.moTaTruongMoi) {
                form.setFields([
                    { name: 'maTruongMoi', errors: ['Vui l??ng nh???p m?? tr?????ng d??? li???u m???i'] },
                    { name: 'moTaTruongMoi', errors: ['Vui l??ng nh???p m?? t??? tr?????ng d??? li???u m???i'] }
                ])
            } else if (!values.maTruongMoi) {
                form.setFields([{ name: 'maTruongMoi', errors: ['Vui l??ng nh???p m?? tr?????ng d??? li???u m???i'] }])
            }
        } else {
            axios
                .post(`${DYNAMIC_URL}/truong/copy`, values, Authorization())
                .then((res) => {
                    if (res.data.errorCode === SUCCESS) {
                        Notification({ status: 'success', message: successMessage })
                        setIsModalVisible(false)
                        form.resetFields()
                        dispatch(getDanhsachtruong({ maDoiTuong }))
                    } else if (res.data.errorCode === CHILD_EXISTS) {
                        form.setFields([{ name: 'maTruongMoi', errors: [res.data.message] }])
                    } else {
                        Notification({ status: 'error', message: res.data.message })
                    }
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
        }
    }

    return (
        <Fragment>
            <Spin size='large' tip='??ang x??? l?? d??? li???u' className='spin_bieumau' spinning={isLoading}>
                <Modal
                    className='modal-truong-clone'
                    title={`Sao ch??p ?????i t?????ng - ${maTruongRef.current}`}
                    visible={isModalVisible}
                    onOk={(): void => onFinish()}
                    onCancel={(): void => {
                        setIsModalVisible(false)
                        form.resetFields()
                    }}>
                    <p>
                        B???n ??ang sao ch??p ?????i t?????ng v???i m?? ?????i t?????ng l?? <b>{maTruongRef.current}</b> - vui l??ng nh???p m??
                        ?????i t?????ng v?? m?? t??? ?????i t?????ng cho ?????i t?????ng m???i
                    </p>
                    <Form form={form}>
                        <Form.Item
                            name='maTruongMoi'
                            label='M?? tr?????ng d??? li???u m???i'
                            rules={[
                                { required: true, message: 'Vui l??ng nh???p m?? tr?????ng d??? li???u m???i' },
                                { pattern: REGEX_CODE, message: 'M?? tr?????ng d??? li???u kh??ng h???p l???' }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='moTaTruongMoi'
                            label='M?? t??? tr?????ng d??? li???u m???i'
                            rules={[{ required: true, message: 'Vui l??ng nh???p m?? t??? tr?????ng d??? li???u m???i' }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    width='90%'
                    centered
                    style={{ height: 'calc(100vh - 100px)' }}
                    bodyStyle={{ overflowY: 'scroll' }}
                    visible={isModalVisibleDS}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    closable={false}
                    footer={[
                        <Button danger type='primary' onClick={handleCancel}>
                            ????ng
                        </Button>
                    ]}>
                    <ChitietTruong
                        isModalAdd={isModalAddDS}
                        setIsModalAddVisible={setIsModalAddVisibleDS}
                        setIsFetchTruong={setIsFetchTruongDS}
                        maDT={maDoiTuong}
                    />
                </Modal>
                <Modal
                    width='90%'
                    centered
                    style={{ height: 'calc(100vh - 100px)' }}
                    bodyStyle={{ overflowY: 'scroll' }}
                    visible={isModalVisibleDSEdit}
                    onOk={handleOkEdit}
                    onCancel={handleCancelEdit}
                    closable={false}
                    footer={[
                        <Button danger type='primary' onClick={handleCancelEdit}>
                            ????ng
                        </Button>
                    ]}>
                    <EditTruong
                        isModalEditDS={isModalEditDS}
                        setIsModalVisibleDSEdit={setIsModalVisibleDSEdit}
                        setIsFetchTruongDSEdit={setIsFetchTruongDSEdit}
                        idTruong={idTruongRef.current}
                    />
                </Modal>
                <PageHeader
                    ghost={false}
                    title={`Danh s??ch tr?????ng d??? li???u - ${maDoiTuong}`}
                    style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    allowClear
                                    placeholder='Nh???p t??? kh??a c???n t??m'
                                    enterButton={
                                        <>
                                            <SearchOutlined />
                                        </>
                                    }
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button icon={<AliyunOutlined />} onClick={onUnbinding}>
                                Bo?? b????t bu????c
                            </Button>
                            <Button
                                danger
                                disabled={disable}
                                type='primary'
                                icon={<DeleteOutlined />}
                                style={{ marginRight: 1 }}
                                onClick={deleteAll}>
                                X??a
                            </Button>
                            <>
                                <Button
                                    icon={<PlusOutlined />}
                                    type='primary'
                                    onClick={(): void => {
                                        idTruongRef.current = null
                                        showModal()
                                    }}>
                                    Th??m
                                </Button>
                            </>
                        </Space>
                    ]}
                />
                <Form form={form}>
                    <Table
                        size='small'
                        rowKey='id'
                        columns={columns}
                        dataSource={fieldList}
                        bordered
                        pagination={false}
                        rowSelection={{ ...rowSelection }}
                        scroll={{ y: !isModalAdd ? '50vh' : window.innerHeight < 650 ? '50vh' : '50vh' }}
                    />
                </Form>
                {!isArrayEmpty(fieldList) && (
                    <ConfigProvider locale={viVN}>
                        <Pagination
                            total={totalRecords}
                            style={{ textAlign: 'end', paddingTop: '20px' }}
                            defaultCurrent={currentPage}
                            defaultPageSize={pageSize}
                            onChange={onPageChange}
                            showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} do??ng`}
                            showSizeChanger
                            pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                        />
                    </ConfigProvider>
                )}
            </Spin>
        </Fragment>
    )
}
