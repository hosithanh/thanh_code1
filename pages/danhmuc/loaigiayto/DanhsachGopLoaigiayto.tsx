/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Button,
    ConfigProvider,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    PageHeader,
    Pagination,
    Space,
    Table,
    Tooltip
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { REGEX_Number_Negative } from 'common/constant'
import { errorMessage } from 'common/constant/app-constant'
import { GopLoaigiayto } from 'common/interface/Danhmuc.interfaces/GopLoaigiayto'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    addGopLoaigiayto,
    deleteGopLoaiGiayTo,
    getDanhsachGopLoaiGiayTo
} from 'store/actions/danhmuc.actions/goploaigiayto.action'
import { getLoaiGiayTo } from 'store/actions/danhmuc.actions/loaigiayto.action'
import { AppState } from 'store/interface'
import DanhsachThemLoaigiayto from './DanhsachThemLoaigiayto '

interface Props {
    maDoiTuong?: any
    idDonviGop?: number
    idDoiTuongGop?: number
    isgoptab?: boolean
    tenTTHC?: string
    tenGiayTo?: string
}

export default function DanhsachGopLoaigiayto({ maDoiTuong, idDonviGop, idDoiTuongGop, isgoptab }: Props): JSX.Element {
    const dispatch = useDispatch()
    const sortData = useSelector<AppState, string | undefined>((state) => state.loaigiayto?.sortData)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [searchData, setSearchData] = useState('')
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const goploaigiaytoList = useSelector<AppState, GopLoaigiayto[] | undefined>(
        (state) => state.goploaigiayto?.goploaigiaytoList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.goploaigiayto?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.goploaigiayto?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.goploaigiayto?.pageSize)
    const [isModalVisibleGopdoituong, setIsModalVisiblelistGopdoituong] = useState(false)

    const [resetCount, setResetCount] = useState(0)

    const [form] = useForm()
    //edit sapxep
    const inputRef = useRef(null)
    const [editingKey, setEditingKey] = useState('')
    const [valueSapxep, setValueSapxep] = useState<GopLoaigiayto>()
    const isEditing = (record) => record.id === editingKey
    const editSort = (record) => {
        setValueSapxep(record)
        setEditingKey(record.id)
    }

    const listGopDoiTuong = () => {
        setIsModalVisiblelistGopdoituong(true)
    }
    const handleOklistGopDoiTuong = () => {
        setIsModalVisiblelistGopdoituong(false)
    }
    const handleCancellistGopDoiTuong = () => {
        dispatch(getLoaiGiayTo({}))
        setIsModalVisiblelistGopdoituong(false)
        setResetCount(resetCount + 1)
    }
    useEffect(() => {
        dispatch(getDanhsachGopLoaiGiayTo({ maDoiTuong }))
        goploaigiaytoList && SetIsLoading(false)
    }, [maDoiTuong])

    useEffect(() => {
        goploaigiaytoList && SetIsLoading(false)
    }, [goploaigiaytoList, maDoiTuong])

    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(getDanhsachGopLoaiGiayTo({ page, pageSize, searchData: searchData, sortData, maDoiTuong }))
    }
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    const handleDeleteAllGopLoaiGiayTo = (): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a nh???ng m???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                if (selectedRowKeys.length > 0) {
                    let listId = []
                    goploaigiaytoList.map((item) => {
                        if (selectedRowKeys.find((itemrow) => item.id === itemrow)) {
                            listId.push({
                                maGiayTo: item.maGiayTo,
                                maTTHC: item.maTTHC,
                                sapXep: 0,
                                tenTTHC: item.tenTTHC,
                                tenGiayTo: item.tenGiayTo
                            })
                        }
                    })
                    ;(dispatch(deleteGopLoaiGiayTo(maDoiTuong, listId)) as any)
                        .then((res) => {
                            SetIsLoading(true)
                            setSelectedRowKeys([])
                            setDisabled(true)
                            dispatch(
                                getDanhsachGopLoaiGiayTo({
                                    // page: currentPage,
                                    // pageSize,
                                    searchData,
                                    maDoiTuong
                                })
                            )

                            SetIsLoading(false)
                            Notification({ status: 'success', message: res.data.message })
                        })
                        .catch(() => {
                            Notification({ status: 'error', message: 'X??a t???t c??? lo???i gi???y t??? th???t b???i' })
                        })
                } else {
                    Notification({ status: 'error', message: 'Vui l??ng ch???n lo???i gi???y t??? ????? x??a!' })
                }
            }
        })
    }
    const onSearch = (searchData?: string) => {
        setSearchData(searchData)
        dispatch(getDanhsachGopLoaiGiayTo({ searchData, pageSize: pageSize, maDoiTuong }))
    }
    const onSort = (sortData, colunm) => {
        setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')

        dispatch(getDanhsachGopLoaiGiayTo({ searchData, sortData, maDoiTuong }))
    }
    useEffect(() => {
        if (editingKey) {
            inputRef.current?.focus()
            form.setFieldsValue({ sapXep: valueSapxep.sapXep })
        }
    }, [editingKey])
    const saveSapxep = async (e) => {
        try {
            var sapXep = e.target.value
            if (e.target.value === 0 || e.target.value === '') {
                sapXep = valueSapxep.sapXep
            }
            if (e.target.value > -1) {
                const data = [
                    {
                        maGiayTo: valueSapxep.maGiayTo,
                        maTTHC: valueSapxep.maTTHC,
                        tenTTHC: valueSapxep.tenTTHC,
                        tenGiayTo: valueSapxep.tenGiayTo,
                        sapXep: sapXep
                    }
                ]

                dispatch(addGopLoaigiayto(maDoiTuong, data) as any)
                    .then((res) => {
                        setEditingKey('')
                        dispatch(getDanhsachGopLoaiGiayTo({ maDoiTuong }))
                        Notification({
                            status: res.data.errorCode > 0 ? 'error' : 'success',
                            message: res.data.message
                        })
                        form.resetFields()
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            } else {
                Notification({ status: 'error', message: 'Vui l??ng nh???p d??? li???u l?? s??? nguy??n d????ng!' })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const columns: ColumnsType<GopLoaigiayto> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <div key={value.id}>{currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}</div>
            )
        },
        {
            title: (
                <div onClick={() => onSort(`maTTHC ${orderDataMa}`, 'ma')}>
                    <span>M?? th??? t???c h??nh ch??nh</span>
                    {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            align: 'right',
            width: '190px',
            dataIndex: 'maTTHC',
            key: 'maTTHC'
        },
        {
            title: 'T??n th??? t???c h??nh ch??nh',
            dataIndex: 'tenTTHC',
            key: 'tenTTHC'
        },

        {
            title: 'M?? gi???y t???',
            align: 'right',
            width: '190px',
            dataIndex: 'maGiayTo',
            key: 'maGiayTo'
        },

        {
            title: 'M?? L??nh v???c',
            align: 'center',
            width: '190px',
            dataIndex: 'maLinhVuc',
            key: 'malinhvuc'
        },

        {
            title: 'T??n gi???y t???',
            dataIndex: 'tenGiayTo',
            key: 'tenGiayTo'
        },

        {
            title: (
                <div>
                    <span>S???p x???p</span>
                </div>
            ),
            dataIndex: 'sapXep',
            key: 'sapXep',
            width: '90px',
            align: 'center',
            render: (value, record) => {
                const editable = isEditing(record)
                return editable ? (
                    <Form.Item
                        name='sapXep'
                        rules={[{ pattern: REGEX_Number_Negative, message: 'Nh???p s??? nguy??n d????ng !' }]}>
                        <InputNumber
                            ref={inputRef}
                            onPressEnter={(e) => saveSapxep(e)}
                            min={0}
                            style={{ width: '70px', left: '-7px' }}
                        />
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
            width: '105px',
            render: (record) => {
                const handleDeleteGopLoaiGiayTo = (): void => {
                    showConfirm({
                        title: 'B???n c?? ch???c ch???n mu???n x??a?',
                        icon: <ExclamationCircleOutlined />,
                        okText: '?????ng ??',
                        okType: 'primary',
                        cancelText: 'Kh??ng',
                        maskClosable: true,
                        onOk: (): void => {
                            dispatch(
                                deleteGopLoaiGiayTo(maDoiTuong, [
                                    {
                                        maGiayTo: record.maGiayTo,
                                        maTTHC: record.maTTHC,
                                        sapXep: 0,
                                        tenTTHC: record.tenTTHC,
                                        tenGiayTo: record.tenGiayTo
                                    }
                                ]) as any
                            )
                                .then((res) => {
                                    SetIsLoading(true)
                                    dispatch(
                                        getDanhsachGopLoaiGiayTo({
                                            // page: currentPage,
                                            // pageSize,
                                            searchData,
                                            maDoiTuong
                                        })
                                    )
                                    setSelectedRowKeys([])
                                    Notification({ status: 'success', message: res.data.message })
                                })

                                .catch(() => {
                                    Notification({ status: 'error', message: 'X??a lo???i gi???y t??? th???t b???i' })
                                })
                        }
                    })
                }
                return (
                    <>
                        <>
                            <Tooltip title='X??a' color='#ff4d4f' placement='right'>
                                <Button
                                    type='text'
                                    icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                    onClick={handleDeleteGopLoaiGiayTo}
                                />
                            </Tooltip>
                        </>
                    </>
                )
            }
        }
    ]

    return (
        <>
            <div className='group-action'>
                <Modal
                    width='100%'
                    centered
                    visible={isModalVisibleGopdoituong}
                    onOk={handleOklistGopDoiTuong}
                    onCancel={handleCancellistGopDoiTuong}
                    closable={false}
                    footer={[
                        <Button
                            danger
                            type='primary'
                            onClick={(): void => {
                                handleCancellistGopDoiTuong()
                            }}>
                            ????ng
                        </Button>
                    ]}>
                    <DanhsachThemLoaigiayto
                        maDoiTuong={maDoiTuong}
                        setIsModalVisiblelistGopdoituong={setIsModalVisiblelistGopdoituong}
                        idDonviGop={idDonviGop}
                        idDoiTuongGop={idDoiTuongGop}
                        resetCount={resetCount}
                        setResetCount={setResetCount}
                    />
                </Modal>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh s??ch lo???i k???t qu??? g???p'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Form.Item
                                    name='layout'
                                    colon={false}
                                    style={{
                                        fontWeight: 'bold',
                                        width: '300px',
                                        marginRight: 0
                                    }}>
                                    <Input.Search
                                        size={isgoptab ? 'small' : 'middle'}
                                        defaultValue={searchData}
                                        allowClear
                                        enterButton={
                                            <>
                                                <SearchOutlined /> T??m ki???m
                                            </>
                                        }
                                        placeholder='Nh???p t??? kh??a c???n t??m'
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </Form>

                            <>
                                <Button
                                    danger
                                    type='primary'
                                    size={isgoptab ? 'small' : 'middle'}
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteAllGopLoaiGiayTo}
                                    disabled={disabled}>
                                    X??a
                                </Button>

                                <Button
                                    type='primary'
                                    size={isgoptab ? 'small' : 'middle'}
                                    icon={<PlusOutlined />}
                                    onClick={(): void => {
                                        listGopDoiTuong()
                                    }}>
                                    Th??m
                                </Button>
                            </>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={goploaigiaytoList}
                pagination={false}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                bordered
                loading={isLoading}
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(goploaigiaytoList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} c???a ${total} do??ng`
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
