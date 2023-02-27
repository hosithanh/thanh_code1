/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    SlidersTwoTone
} from '@ant-design/icons'
import {
    Button,
    ConfigProvider,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    PageHeader,
    Pagination,
    Select,
    Space,
    Table,
    Tooltip
} from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { DONVI_LIST_URL, DONVI_LIST_USER_URL } from 'common/constant/api-constant'
import { Donvi } from 'common/interface/Donvi'
import { Phongban } from 'common/interface/Phongban'
import { Authorization } from 'common/utils/cookie-util'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import { deleteAllPhongbann, deletePhongban, getPhongban } from 'store/actions/phongban.action'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { isArrayEmpty } from '../../common/utils/empty-util'

import { AppState } from '../../store/interface'
export default function DanhsachDonvi(): JSX.Element {
    const phongbanList = useSelector<AppState, Phongban[] | undefined>((state) => state.phongban.phongbanList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.phongban.total)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.phongban.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.phongban.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const [isLoadDelete, setIsLoadDelete] = useState(false)
    const dispatch = useDispatch()
    const searchData = useSelector<AppState, string | undefined>((state) => state.donvi?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.donvi?.sortData)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [donvi, setdonvi] = useState<string[] | undefined>()
    const [donviId, setDonviId] = useState<number | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)

    useEffect(() => {
        !phongbanList && dispatch(getPhongban({}))
        phongbanList && setLoad(false)
    }, [phongbanList])

    useEffect(() => {
        axios.get(`${DONVI_LIST_URL}/all`, Authorization()).then((res) => {
            setdonvi(res.data.data)
        })
    }, [])
    useEffect(() => {
        dispatch(getPhongban({ idDonvi: donviId, searchData: dataSearch }))
    }, [donviId])

    const columns: ColumnsType<Phongban> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        { title: 'Ký hiệu', dataIndex: 'kyhieu', key: 'kyhieu' },
        {
            title: (
                <div onClick={() => onSortBy(`ma ${orderDataMa}`, 'ma')}>
                    <span>Mã cơ quan</span> {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'macoquan',
            key: 'macoquan'
        },
        {
            title: (
                <div onClick={() => onSortBy(`ten ${orderDataTen}`, 'ten')}>
                    <span>Tên đơn vị</span> {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            // dataIndex: 'tendonvi',
            key: 'ten',
            render: (record) => {
                return donvi?.map((item: any) => {
                    if (item.ma === record.macoquan) {
                        return item.ten
                    }
                })
            }
        },
        {
            title: 'Mã phòng ban',
            dataIndex: 'maphongban',
            key: 'maphongban',
            align: 'center'
        },
        {
            title: 'Tên phòng ban',
            dataIndex: 'tenphongban',
            key: 'tenphongban'
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: '200px',
            render: (record) => {
                const handleDeletePhongban = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            return (dispatch(deletePhongban(record.id)) as any).then((res) => {
                                setLoad(false)
                                Notification({ status: 'success', message: res.data.message })
                                dispatch(getPhongban({}))
                            })
                        }
                    })
                }

                return (
                    <>
                        <Link to={`/${MenuPaths.phongban}/${record.id}?edit=true`}>
                            <Tooltip title='Sửa' color='#2db7f5' placement='top'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeletePhongban}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    const onSortBy = (sortData, colum) => {
        if (colum === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getPhongban({ searchData: dataSearch, sortData }))
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)
        setLoad(true)
        dispatch(getPhongban({ searchData, pageSize: pageSize, idDonvi: donviId }))
    }
    const onPageChange = (page, pageSize) => {
        setLoad(true)
        dispatch(getPhongban({ page, pageSize, searchData: dataSearch, sortData }))
    }

    const deleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setIsLoadDelete(true)
                return (dispatch(deleteAllPhongbann(selectedRowKeys)) as any)
                    .then((res) => {
                        setIsLoadDelete(false)
                        setLoad(false)
                        Notification({ status: 'success', message: res.data.message })
                        dispatch(getPhongban({}))
                        setDisabled(true)
                    })
                    .catch(() => {
                        setIsLoadDelete(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    const showTotal = (total, range) => {
        return `${range[0]}-${range[1]} của ${total} dòng`
    }

    // const onFinish = (values) => {
    //     setLoad(true)
    //     const { searchData, idDonVi } = values
    //     dispatch(getPhongban({ searchData, pageSize: pageSize }))
    // }
    // const onChangeSearch = (idDonvi) => {
    //     setLoad(true)
    //     setSearchDonvi(idDonvi)
    //     if (idDonvi !== '') {
    //         dispatch(getPhongban({ searchData }))
    //     }
    // }
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectUserDonviMorong({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 300)
    }
    const onChangeDonVi = (idDonvi) => {
        setDonviId(idDonvi)
    }
    const onChangeAllDonVi = () => {
        setDonviId(undefined)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const onOpenChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }
    const menu = (
        <Menu style={{ width: '120%', float: 'left', marginTop: '62px', padding: '10px 10px ', left: '-10.6rem' }}>
            <p style={{ fontSize: '17px' }}>Tìm kiếm nâng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form.Item
                label='Đơn vị'
                name='idDonVi'
                style={{ marginTop: '10px', padding: '0px 5px' }}
                className='input-donvi'>
                <Select
                    onSearch={onSearchDonVi}
                    allowClear
                    onChange={(_, value) => {
                        if (value !== undefined) {
                            onChangeDonVi(value['value'])
                        } else {
                            onChangeAllDonVi()
                        }
                    }}
                    placeholder='---Chọn đơn vị---'
                    showSearch
                    style={{ width: 240, textAlign: 'left', padding: '0px 5px' }}
                    optionFilterProp='children'
                    filterOption={(input, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {donviList?.map((item, index) => (
                        <Select.Option key={index} value={`${item.id}`}>
                            {item.ten}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Button
                icon={<SearchOutlined />}
                type='primary'
                style={{ float: 'right' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Tìm kiếm
            </Button>
            {/* <Button
                icon={<SearchOutlined />}
                // type='danger'
                style={{ float: 'right' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Đóng
            </Button> */}
        </Menu>
    )
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách Phòng ban'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    defaultValue={searchData}
                                    onChange={(event) => {
                                        setdataSearch(event.target.value)
                                    }}
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    onSearch={onSearch}
                                    style={{ width: '328px' }}
                                    // prefix={<SearchOutlined className='site-form-item-icon' />

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
                                            <Tooltip title='Tìm kiếm nâng cao'>
                                                <SlidersTwoTone style={{ fontSize: '15px' }} />
                                            </Tooltip>
                                        </Dropdown>
                                    }
                                />
                            </Form>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                loading={isLoadDelete}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.phongban}/add`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}
                />
            </div>

            <Table
                size='small'
                loading={load}
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={phongbanList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(phongbanList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={showTotal}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
