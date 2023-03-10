/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    CloseOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    MergeCellsOutlined,
    PlusOutlined,
    SearchOutlined,
    SlidersTwoTone,
    UnorderedListOutlined
} from '@ant-design/icons'
import {
    Button,
    ConfigProvider,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    Modal,
    PageHeader,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tooltip
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { CHILD_EXISTS, REGEX_CODE, SUCCESS } from 'common/constant'
import { CAPDONVIS_LIST_URL, DONVI_LIST_USER_URL, DYNAMIC_URL } from 'common/constant/api-constant'
import { CapDonVi } from 'common/interface/CapDonVi'
import { Linhvuc } from 'common/interface/Danhmuc.interfaces/Linhvuc'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { Authorization } from 'common/utils/cookie-util'
import { nonAccentVietnamese, removeSpecialCharacters } from 'common/utils/string-util'
import moment from 'moment'
import DanhsachGopLoaigiayto from 'pages/danhmuc/loaigiayto/DanhsachGopLoaigiayto'
import DanhsachLoaigiayto from 'pages/danhmuc/loaigiayto/DanhsachLoaigiayto'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getLinhvuc } from 'store/actions/danhmuc.actions/linhvuc.action'
import { deleteDoituong, getDoituong } from 'store/actions/doituong.action'
import { selectDoituongDonviMorong, selectUserDonvi } from 'store/actions/donvi.action'
import { getDulieu } from 'store/actions/dulieu.action'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Doituong } from '../../common/interface/Doituong'
import { Donvi } from '../../common/interface/Donvi'
import { isArrayEmpty } from '../../common/utils/empty-util'
import { AppState } from '../../store/interface'
import DanhsachTruong from './fragment/DanhsachTruong'

export default function DanhsachDoituong(): JSX.Element {
    const resultList = useSelector<AppState, Doituong[] | undefined>((state) => state.results.resultList)
    const listLinhVuc = useSelector<AppState, Linhvuc[] | undefined>((state) => state.linhvuc?.listLinhVuc)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.results.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.results.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.results.pageSize)
    // const dataSearch = useSelector<AppState, string | undefined>((state) => state.results.dataSearch)
    const idDonvi = useSelector<AppState, number | undefined>((state) => state.results.idDonvi)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disable, setDisable] = useState<boolean>(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const maDoiTuongRef = useRef<HTMLElement | null>(null)
    const maDoiTuongGopRef = useRef<HTMLElement | null>(null)
    const dispatch = useDispatch()
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [searchDonvi, setSearchDonvi] = useState<number | undefined>()
    const [isFetchTruong, setIsFetchTruong] = useState(false)
    const [isModalVisibleDSTruong, setIsModalVisibleDSTruong] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [donviListAll, setDonviListAll] = useState<Donvi[] | undefined>()
    const maDTRef = useRef<HTMLElement | null>(null)
    const [isModalVisibleGopdoituong, setIsModalVisibleGopdoituong] = useState(false)
    const [isModalGopdoituong, setIsModalGopdoituong] = useState(false)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [idDonviGop, setIdDonviGop] = useState<number | undefined>()
    const [idDoiTuongGop, setIdDoiTuongGop] = useState<number | undefined>()
    const [capDonViList, setCapDonViList] = useState<CapDonVi[] | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)
    const [idDonViLinhVuc, setidDonViLinhVuc] = useState()
    const [malinhvuc, setMalinhvuc] = useState()

    useEffect(() => {
        dispatch(getLinhvuc({ page: 1, pageSize: 500, idDonvi: idDonViLinhVuc }))
    }, [idDonViLinhVuc])

    useEffect(() => {
        axios.get(`${CAPDONVIS_LIST_URL}`, Authorization()).then((res) => {
            setCapDonViList(res?.data?.result)
        })
    }, [])
    const showModalDSTruong = () => {
        setIsModalVisibleDSTruong(true)
    }

    const handleOkDSTruong = () => {
        setIsModalVisibleDSTruong(false)
    }
    const handleCancelkDSTruong = () => {
        setIsModalVisibleDSTruong(false)
        setIsFetchTruong(!isFetchTruong)
    }
    //gop doituong
    const GopDoiTuong = () => {
        setIsModalVisibleGopdoituong(true)
        setIsModalGopdoituong(true)
    }
    const handleOkGopDoiTuong = () => {
        setIsModalVisibleGopdoituong(false)
    }
    const handleCancelGopDoiTuong = () => {
        setIsModalVisibleGopdoituong(false)
        setIsModalGopdoituong(false)
        dispatch(getDoituong({ dataSearch, idDonvi }))
    }
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}`, Authorization()).then((res) => {
            setDonviListAll(res.data.data)
        })
    }, [])

    const columns: ColumnsType<Doituong> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '60px',
            render: (value, _, index) => pageSize && currentPage && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: 'M?? lo???i k???t qu??? g???p/T??n lo???i k???t qu???',
            dataIndex: 'maGiayTo',
            key: 'maGiayTo',
            width: '290px',
            render: (text, row) => {
                return (
                    <div>
                        {' '}
                        <span style={{ color: 'red' }}>{row.ma}</span>
                        <br></br> {row.ten}
                    </div>
                )
            }
        },

        // {
        //     title: 'Th??? t???c b??i b???',
        //     dataIndex: 'isBaiBo',
        //     key: 'isBaiBo',
        //     align: 'center',
        //     width: '8%',
        //     render: (value) => value === 1 && <CheckOutlined />
        // },
        // {
        //     title: 'K??ch ho???t',
        //     dataIndex: 'kichHoat',
        //     key: 'kichHoat',
        //     align: 'center',
        //     width: '5%',
        //     render: (value) => value === 1 && <CheckOutlined />
        // },
        {
            title: 'M?? lo???i k???t qu??? / T??n th??? t???c  ',
            dataIndex: 'thutucloaiketqua',
            key: 'thutucloaiketqua',
            align: 'left',
            render: (text, record) => {
                return !isArrayEmpty(record.doiTuongGopLoaiKetQuaDTOs) ? (
                    record.doiTuongGopLoaiKetQuaDTOs.map((item) => (
                        <div className='doiTuongGopLoaiKetQuaDTOs'>
                            - <span style={{ color: '#52c41a' }}>{item.maGiayTo}</span> - {item.tenTTHC} .
                        </div>
                    ))
                ) : record.isSub !== 1 ? (
                    <div style={{ color: 'red' }}>( Vui l??ng c???u h??nh danh s??ch lo???i k???t qu??? )</div>
                ) : (
                    <Link to={`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${record.ma}`}>
                        <div className='doiTuongGopLoaiKetQuaDTOs'>
                            - <span style={{ color: '#52c41a' }}> Lo???i danh s??ch b???ng ph??? </span>
                        </div>
                    </Link>
                )
            }
        },

        { title: 'Phi??n b???n', dataIndex: 'phienBan', align: 'center', key: 'phienBan', width: '6%' },
        {
            title: 'Nga??y ta??o',
            dataIndex: 'ngayTao',
            align: 'center',
            key: 'ngayTao',
            width: '10%',
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: '????n v??? / C???p ????n v???',
            // dataIndex: '',
            key: 'donViIds',
            width: '150px',
            render: (value) => {
                let tenDonVi = []
                value.donViIds &&
                    value.donViIds?.map((id) => {
                        tenDonVi.push(donviListAll?.find((item) => item.id === id)?.ten)
                    })

                value.capDonViIds &&
                    value.capDonViIds?.map((id) => {
                        tenDonVi.push(donviListAll?.find((item) => item.id === id)?.ten)
                    })
                return tenDonVi.join(', ')
            }
        },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '195px',
            render: (value) => {
                return (
                    <Fragment>
                        <Tooltip title='G???p ?????i t?????ng' color='#4caf50' placement='top'>
                            <Button
                                style={{ color: '#4caf50' }}
                                type='text'
                                icon={<MergeCellsOutlined />}
                                onClick={(): void => {
                                    GopDoiTuong()
                                    maDoiTuongGopRef.current = value.ma
                                    setIdDonviGop(value.donViId)
                                    setIdDoiTuongGop(value.id)
                                }}></Button>
                        </Tooltip>

                        <Tooltip title='Sao ch??p' color='#4caf50' placement='top'>
                            <Button
                                style={{ color: '#4caf50' }}
                                type='text'
                                icon={<CopyOutlined />}
                                onClick={(): void => {
                                    maDoiTuongRef.current = value.ma
                                    setIsModalVisible(true)
                                    setIsLoadingSave(false)
                                }}></Button>
                        </Tooltip>
                        <Tooltip title='S???a' color='#2db7f5' placement='top'>
                            <Link to={`/${MenuPaths.doituong}/thong-tin?maDoiTuong=${value.ma}`} title='Ch???nh s???a'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />}></Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title='?????nh ngh??a tr?????ng d??? li???u c???a ?????i t?????ng ' placement='topRight'>
                            <Button
                                icon={<UnorderedListOutlined />}
                                type='text'
                                onClick={(): void => {
                                    maDTRef.current = value.ma
                                    showModalDSTruong()
                                }}></Button>
                        </Tooltip>
                        <Tooltip title='X??a' color='#ff4d4f' placement='top'>
                            <Button
                                type='text'
                                icon={
                                    <DeleteOutlined
                                        style={{ color: '#ff4d4f' }}
                                        onClick={(): void => handleDeleteDoituong(value.id)}
                                    />
                                }></Button>
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]

    const handleDeleteDoituong = (id): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteDoituong(id)) as any)
                    .then((res) => {
                        dispatch(
                            getDoituong({
                                page: currentPage,
                                pageSize,
                                isOne:
                                    resultList?.length === 1 ||
                                    (resultList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                dataSearch: dataSearch,
                                idDonvi: idDonvi
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({
                            status: res.data.errorCode === 0 ? 'success' : 'error',
                            message: res.data.message
                        })
                        dispatch(getDulieu({}))
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'X??a th???t b???i' })
                    })
            }
        })
    }
    useEffect(() => {
        !resultList && dispatch(getDoituong({ dataSearch, idDonvi, maLinhVuc: malinhvuc }))
        setIsLoading(false)
    }, [])
    useEffect(() => {
        resultList ? setIsLoading(false) : setIsLoading(true)
    }, [resultList])

    useEffect(() => {
        isArrayEmpty(selectedRowKeys) ? setDisable(true) : setDisable(false)
    }, [selectedRowKeys])

    const onPageChange = (page, pageSize) => {
        setIsLoading(true)
        dispatch(getDoituong({ page, pageSize, dataSearch, idDonvi: idDonvi, maLinhVuc: malinhvuc }))
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys)
    }
    const [form] = useForm()

    const onFinish = (): void => {
        const values = form.getFieldsValue()
        values.maHeThongCu = maDoiTuongRef.current

        if (!values.maHeThongMoi && !values.tenLoaiKetQua) {
            form.setFields([
                { name: 'maHeThongMoi', errors: ['Vui l??ng nh???p m?? h??? th???ng'] },
                { name: 'tenLoaiKetQua', errors: ['Vui l??ng nh???p t??n lo???i k???t qu???'] }
            ])
        } else if (values.maHeThongMoi.length > 57) {
            form.setFields([{ name: 'maHeThongMoi', errors: ['M?? h??? th???ng kh??ng nh???p qu?? 57 k?? t???'] }])
        } else {
            setIsLoadingSave(true)
            axios
                .post(`${DYNAMIC_URL}/doituong/copy`, values, Authorization())
                .then((res) => {
                    if (res.data.errorCode === SUCCESS) {
                        Notification({ status: 'success', message: res.data.message })
                        dispatch(getDoituong({ page: currentPage, pageSize, dataSearch, idDonvi }))
                        setIsModalVisible(false)
                        form.resetFields()
                    } else if (res.data.errorCode === CHILD_EXISTS) {
                        setIsLoadingSave(false)
                        form.setFields([{ name: 'maHeThongMoi', errors: [res.data.message] }])
                    } else {
                        setIsLoadingSave(false)
                        Notification({ status: 'error', message: res.data.message })
                    }
                })
                .catch(() => {
                    setIsLoadingSave(false)
                    Notification({ status: 'error', message: errorMessage })
                })
        }
    }
    const onChangeSearch = (idDonvi) => {
        setidDonViLinhVuc(idDonvi)
        setIsLoading(true)
        selectDoituongDonviMorong(idDonvi)

        setSearchDonvi(idDonvi)
        if (idDonvi !== '') {
            dispatch(getDoituong({ pageSize, dataSearch, idDonvi: idDonvi }))
        }
    }

    const onChangeLinhVuc = (maLinhVuc) => {
        setMalinhvuc(maLinhVuc)
    }

    const onFinishs = (values) => {
        setIsLoading(true)
        const { dataSearch, idDonVi } = values
        dispatch(getDoituong({ dataSearch, idDonvi: searchDonvi, pageSize: pageSize }))
    }
    const onChangeInput = (e) => {
        if (!e.target.value) {
            dispatch(getDoituong({ idDonvi: searchDonvi }))
        }
    }
    // Modal Ch???n TTHC
    const [isModalVisibleTTHC, setIsModalVisibleTTHC] = useState(false)
    const [isModal, setIsModal] = useState<boolean>(false)
    const [loaiGiayTo, setLoaiGiayTo] = useState<Loaigiayto | undefined>()
    const [copyDoiTuong, setCopyDoiTuong] = useState<boolean>(false)
    const handleCancel = () => {
        setIsModalVisibleTTHC(false)
        setIsModal(false)
    }
    const handleOk = () => {
        setIsModalVisibleTTHC(false)
    }
    const chonTTHC = () => {
        setIsModalVisibleTTHC(true)
        setIsModal(true)
        setCopyDoiTuong(true)
    }
    useEffect(() => {
        if (loaiGiayTo) {
            const { matthc, tenGiayTo, maGiayTo } = loaiGiayTo
            form.setFieldsValue({
                maThuTucHanhChinh: matthc,
                tenThuTucHanhChinh: tenGiayTo,
                maLoaiKetQua: maGiayTo,
                tenLoaiKetQua: tenGiayTo,
                maHeThongMoi: matthc.concat(loaiGiayTo.maGiayTo).replace(/[.-]/gi, '').toLowerCase()
            })
        }
    }, [loaiGiayTo])
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ; (dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 300)
    }

    //   const onSearchLinhVuc = (searchData) => {
    //       if (typingTimeoutRef.current) {
    //           clearTimeout(typingTimeoutRef.current)
    //       }
    //       typingTimeoutRef.current = setTimeout(() => {
    //           ;(dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
    //               setDonviList(res.data.data)
    //           })
    //       }, 300)
    //   }
    const onChangeMahethong = (e) => {
        var mahethong = removeSpecialCharacters(nonAccentVietnamese(e.target.value).split(' ').join(''))
        form.setFieldsValue({ maHeThongMoi: mahethong })
    }

    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)
        setIsLoading(true)
        dispatch(
            getDoituong({ dataSearch: searchData, idDonvi: searchDonvi, maLinhVuc: malinhvuc, pageSize: pageSize })
        )
    }

    useEffect(() => {
        dispatch(
            getDoituong({ dataSearch: dataSearch, idDonvi: searchDonvi, maLinhVuc: malinhvuc, pageSize: pageSize })
        )
    }, [malinhvuc])

    const onOpenChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const menu = (
        <Menu style={{ width: '130%', float: 'left', marginTop: '62px', padding: '10px 10px ', left: '-15.5rem' }}>
            <p style={{ fontSize: '17px' }}>T??m ki???m n??ng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form layout='inline' onFinish={onFinishs}>
                {/* <Form.Item name='dataSearch' style={{ marginRight: '8px' }}>
                                <Input
                                    allowClear
                                    placeholder='Nh???p t??? kh??a c???n t??m'
                                    onChange={onChangeInput}
                                    style={{ borderRadius: '3px' }}
                                />
                            </Form.Item> */}
                <Form.Item name='idDonVi'>
                    <Select
                        allowClear
                        placeholder='????n v???'
                        showSearch
                        onChange={onChangeSearch}
                        onSearch={onSearchDonVi}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: 200, textAlign: 'left', marginRight: '-8px', marginLeft: '10px' }}>
                        {donviList ? (
                            donviList?.map((item, index) => (
                                <Select.Option key={index} value={`${item.id}`}>
                                    {item.ten}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value={''}>
                                <Spin
                                    tip='??ang t???i d??? li???u'
                                    style={{
                                        display: 'block',
                                        justifyContent: 'center',
                                        marginTop: '0.1px'
                                    }}></Spin>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name='idLinhVuc'>
                    <Select
                        allowClear
                        placeholder='L??nh V???c'
                        showSearch
                        onChange={onChangeLinhVuc}
                        // onSearch={onSearchLinhvuc}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: 190, textAlign: 'left', marginRight: '-135px', marginLeft: '10px' }}>
                        {listLinhVuc ? (
                            listLinhVuc?.map((item, index) => (
                                <Select.Option key={index} value={`${item?.maLinhVuc}`}>
                                    {item.tenLinhVuc}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value={''}>
                                <Spin
                                    tip='??ang t???i d??? li???u'
                                    style={{
                                        display: 'block',
                                        justifyContent: 'center',
                                        marginTop: '0.1px'
                                    }}></Spin>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
            <Button
                icon={<SearchOutlined />}
                type='primary'
                style={{ float: 'right', marginTop: '10px' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                T??m ki???m
            </Button>
        </Menu>
    )

    return (
        <Fragment>
            <Modal
                className='modal-clone'
                closable={false}
                title={`Sao ch??p ?????i t?????ng - ${maDoiTuongRef.current}`}
                visible={isModalVisible}
                width={650}
                footer={[
                    <Button
                        danger
                        type='primary'
                        onClick={() => {
                            setIsModalVisible(false)
                            form.resetFields()
                        }}>
                        H???y
                    </Button>,
                    <Button type='primary' onClick={onFinish} loading={isLoadingSave}>
                        L??u
                    </Button>
                ]}>
                <p>
                    - B???n ??ang sao ch??p lo???i k???t qu??? v???i m?? h??? th???ng l?? <b>{maDoiTuongRef.current} </b>
                </p>
                <Form form={form}>
                    <Form.Item
                        name='tenLoaiKetQua'
                        label='T??n lo???i k???t qu???'
                        rules={[{ required: true, message: 'Vui l??ng nh???p m?? t??? ?????i t?????ng m???i' }]}>
                        <Input onChange={(e) => onChangeMahethong(e)} />
                    </Form.Item>
                    <Form.Item
                        name='maHeThongMoi'
                        label='Ma?? h??? th???ng'
                        rules={[
                            {
                                max: 57,
                                message: 'M?? h??? th???ng kh??ng ???????c qu?? 57 k?? t???!'
                            },
                            { required: true, message: 'Vui l??ng nh???p m?? ?????i t?????ng m???i' },
                            { pattern: REGEX_CODE, message: 'M?? ?????i t?????ng kh??ng h???p l???' }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Modal
                        width='100%'
                        centered
                        visible={isModalVisibleTTHC}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        closable={false}
                        footer={[
                            <Button danger type='primary' onClick={handleCancel}>
                                ????ng
                            </Button>
                        ]}>
                        <DanhsachLoaigiayto
                            isModal={isModal}
                            setIsModalVisibleTTHC={setIsModalVisibleTTHC}
                            setLoaiGiayTo={setLoaiGiayTo}
                            copyDoiTuong={copyDoiTuong}
                        />
                    </Modal>
                </Form>
            </Modal>
            <Modal
                width='90%'
                centered
                style={{ height: 'calc(100vh -100px)', top: '10px' }}
                bodyStyle={{ overflowY: 'scroll' }}
                visible={isModalVisibleDSTruong}
                onOk={handleOkDSTruong}
                onCancel={handleCancelkDSTruong}
                closable={false}
                footer={[
                    <Button danger type='primary' onClick={handleCancelkDSTruong}>
                        ????ng
                    </Button>
                ]}>
                <DanhsachTruong isModalAdd={true} maDT={maDTRef.current} />
            </Modal>
            <Modal
                width='100%'
                centered
                visible={isModalVisibleGopdoituong}
                onOk={handleOkGopDoiTuong}
                onCancel={handleCancelGopDoiTuong}
                closable={false}
                footer={[
                    <Button danger type='primary' onClick={handleCancelGopDoiTuong}>
                        ????ng
                    </Button>
                ]}>
                <DanhsachGopLoaigiayto
                    maDoiTuong={maDoiTuongGopRef.current}
                    idDonviGop={idDonviGop}
                    idDoiTuongGop={idDoiTuongGop}
                />
            </Modal>
            <PageHeader
                className='input_doituong'
                ghost={false}
                title='Danh s??ch lo???i k???t qu???'
                style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                extra={[
                    <Space>
                        {/* <Form layout='inline' onFinish={onFinishs}>
                            <Form.Item name='dataSearch' style={{ marginRight: '8px' }}>
                                <Input
                                    allowClear
                                    placeholder='Nh???p t??? kh??a c???n t??m'
                                    onChange={onChangeInput}
                                    style={{ borderRadius: '3px' }}
                                />
                            </Form.Item>
                            <Form.Item name='idDonVi'>
                                <Select
                                    allowClear
                                    placeholder='????n v???'
                                    showSearch
                                    onChange={onChangeSearch}
                                    onSearch={onSearchDonVi}
                                    optionFilterProp='children'
                                    filterOption={(input, option: any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: 200, textAlign: 'left', marginRight: '-8px' }}>
                                    {donviList ? (
                                        donviList?.map((item, index) => (
                                            <Select.Option key={index} value={`${item.id}`}>
                                                {item.ten}
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <Select.Option value={''}>
                                            <Spin
                                                tip='??ang t???i d??? li???u'
                                                style={{
                                                    display: 'block',
                                                    justifyContent: 'center',
                                                    marginTop: '0.1px'
                                                }}></Spin>
                                        </Select.Option>
                                    )}
                                </Select>
                            </Form.Item>

                            <Button
                                type='primary'
                                htmlType='submit'
                                className='btn-submit-doituong'
                                icon={<SearchOutlined />}>
                                T??m ki???m
                            </Button>
                        </Form> */}

                        <Form layout='inline' style={{ width: 434, textAlign: 'left' }}>
                            <Input.Search
                                onChange={(event) => {
                                    setdataSearch(event.target.value)
                                }}
                                allowClear={true}
                                // defaultValue={searchData}
                                onSearch={onSearch}
                                placeholder='Nh???p t??? kh??a c???n t??m'
                                prefix={<SearchOutlined className='site-form-item-icon' />}
                                suffix={
                                    <Dropdown
                                        open={disibleDrop}
                                        onOpenChange={onOpenChange}
                                        className='search-overlay-dropdown'
                                        overlay={menu}
                                        trigger={['click']}
                                        placement='bottom'
                                        arrow={false}>
                                        <Tooltip title='T??m ki???m n??ng cao'>
                                            <SlidersTwoTone style={{ fontSize: '15px' }} />
                                        </Tooltip>
                                    </Dropdown>
                                }
                            />
                        </Form>

                        <Button
                            danger
                            className='btn-delete-doituong'
                            disabled={disable}
                            type='primary'
                            icon={<DeleteOutlined />}
                            onClick={(): void => handleDeleteDoituong(selectedRowKeys)}>
                            X??a
                        </Button>
                        <Link to={`/${MenuPaths.doituong}/them-moi`}>
                            <Button className='btn-themmmoi-doituong' type='primary' icon={<PlusOutlined />}>
                                Th??m m???i
                            </Button>
                        </Link>
                    </Space>
                ]}
            />

            <Table
                size='small'
                rowKey='id'
                columns={columns}
                dataSource={resultList}
                pagination={false}
                bordered
                rowSelection={{ ...rowSelection }}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                scroll={{
                    y: window.innerHeight - 250
                }}
                loading={isLoading}
            />
            {!isArrayEmpty(resultList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} c???a ${total} do??ng`
                        }
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        current={currentPage}
                        defaultCurrent={1}
                        defaultPageSize={pageSize}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
