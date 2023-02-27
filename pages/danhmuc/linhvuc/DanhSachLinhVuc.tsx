/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { CaretDownOutlined, CaretUpOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Select, Space, Spin, Table } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DONVI_LIST_USER_URL, LINHVUC_USER, NHOMNGUOIDUNG_LINHVUC_ADD_URL } from 'common/constant/api-constant'
import { Linhvuc } from 'common/interface/Danhmuc.interfaces/Linhvuc'
import { Donvi } from 'common/interface/Donvi'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import queryString from 'query-string'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLinhvuc } from 'store/actions/danhmuc.actions/linhvuc.action'
import { selectDoituongDonviMorong, selectUserDonvi } from 'store/actions/donvi.action'
import { AppState } from 'store/interface'

function DanhSachLinhVuc({
    isModalVisible,
    setIsModalVisible,
    accountName,
    setIsSave,
    isSave,
    isPhanQuyenTheoNhom,
    resetCount,
    setResetCount
}) {
    const dispatch = useDispatch<any>()
    const listLinhVuc = useSelector<AppState, Linhvuc[] | undefined>((state) => state.linhvuc?.listLinhVuc)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.linhvuc?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.linhvuc?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.linhvuc?.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.linhvuc?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.linhvuc?.sortData)
    const [selectedRow, setSelectedRow] = useState<any[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    // const idDonvi = useSelector<AppState, number | undefined>((state) => state.results.idDonvi)
    const [orderDataMaLinhVuc, setOrderDataMaLinhVuc] = useState('asc')
    const [orderDataMaNganh, setOrderDataMaNganh] = useState('asc')
    const [orderDatamaCoQuan, setOrderDataMaCoQuan] = useState('asc')
    const [orderDataTenLinhVuc, setOrderDataTenLinhVuc] = useState('asc')
    const [form] = Form.useForm()
    const parsed = queryString.parse(window.location.search)
    const [idDonViChange, setidDonViChange] = useState<number | undefined>()
    const [idDV, setidDonVi] = useState(Number(parsed.idDonVi))
    useEffect(() => {
        setidDonViChange(idDV)
    }, [idDV])

    const addLinhvuc = () => {
        if (isModalVisible) {
            if (isPhanQuyenTheoNhom) {
                var data = []
                selectedRow.map((item) => {
                    data.push({
                        isCreate: 0,
                        isDeleteAll: 0,
                        isDeleteCreatedBy: 0,
                        isSeeAll: 0,
                        isSeeCreatedBy: 0,
                        isUpdateAll: 0,
                        isUpdateCreatedBy: 0,
                        maLinhVuc: item.maLinhVuc
                    })
                })
                axios.post(`${NHOMNGUOIDUNG_LINHVUC_ADD_URL}/${accountName}`, data, Authorization()).then((res) => {
                    if (res.data.errorCode === 0) {
                        setIsModalVisible(false)

                        Notification({ status: 'success', message: res.data.message })
                    } else {
                        Notification({ status: 'error', message: res.data.message })
                    }
                    setResetCount(0)
                })
            } else {
                const value = selectedRow.map((item) => item.maLinhVuc)
                axios.post(`${LINHVUC_USER}/${accountName}`, value, Authorization()).then((res) => {
                    if (res.data.errorCode === 0) {
                        setIsModalVisible(false)
                        setIsSave(!isSave)

                        Notification({ status: 'success', message: res.data.message })
                    } else {
                        Notification({ status: 'error', message: res.data.message })
                    }
                    setResetCount(0)
                })
            }
        }
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(getLinhvuc({ page, pageSize, searchData, sortData, idDonvi: idDonViChange }))
        SetIsLoading(false)
    }
    const onSearch = (searchData?: string) => {
        SetIsLoading(true)
        dispatch(getLinhvuc({ searchData, pageSize: pageSize, idDonvi: idDonViChange }))
        SetIsLoading(false)
    }
    useEffect(() => {
        form.setFieldsValue({ layout: '' })
        SetIsLoading(true)
        dispatch(getLinhvuc({ searchData: '', idDonvi: idDV }))
        SetIsLoading(false)
    }, [resetCount])

    const onSortBy = (sortData, colum) => {
        if (colum === 'maLinhVuc') {
            setOrderDataMaLinhVuc(orderDataMaLinhVuc === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'MaNganh') {
            setOrderDataMaNganh(orderDataMaNganh === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'maCoQuan') {
            setOrderDataMaCoQuan(orderDatamaCoQuan === 'asc' ? 'desc' : 'asc')
        } else if (colum === 'tenLinhVuc') {
            setOrderDataTenLinhVuc(orderDataTenLinhVuc === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getLinhvuc({ searchData, sortData, idDonvi: idDonViChange }))
    }

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSortBy(`maLinhVuc ${orderDataMaLinhVuc}`, 'maLinhVuc')}>
                    <span>Mã lĩnh vực</span>{' '}
                    {orderDataMaLinhVuc === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            key: 'maLinhVuc',
            dataIndex: 'maLinhVuc',
            align: 'center',
            width: '200px'
        },
        {
            title: (
                <div onClick={() => onSortBy(`tenLinhVuc ${orderDataTenLinhVuc}`, 'tenLinhVuc')}>
                    <span>Tên lĩnh vực</span>{' '}
                    {orderDataTenLinhVuc === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            key: 'tenLinhVuc',
            dataIndex: 'tenLinhVuc',
            //align: 'center'
            left: '15px'
            //width: '300px'
        },
        {
            title: (
                <div onClick={() => onSortBy(`MaNganh ${orderDataMaNganh}`, 'MaNganh')}>
                    <span>Mã ngành</span> {orderDataMaNganh === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            key: 'maNganh',
            dataIndex: 'maNganh',
            align: 'center',
            width: '200px'
        },
        {
            title: (
                <div onClick={() => onSortBy(`maCoQuan ${orderDatamaCoQuan}`, 'maCoQuan')}>
                    <span>Mã cơ quan</span> {orderDatamaCoQuan === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            key: 'maCoQuan',
            dataIndex: 'maCoQuan',
            // align: 'left',
            width: '200px',
            align: 'center'
        }
    ]

    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])

    const onChangeSearch = (idDonvi) => {
        SetIsLoading(true)
        selectDoituongDonviMorong(idDonvi)
        setidDonViChange(idDonvi)
        if (idDonvi !== '') {
            dispatch(getLinhvuc({ pageSize, idDonvi: idDonvi }))
        }
        SetIsLoading(false)
    }
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 300)
    }

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh mục lĩnh vực'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline' form={form}>
                                <Form.Item name='idDonVi' style={{ borderRadius: '4px' }}>
                                    <Select
                                        allowClear
                                        placeholder='Đơn vị'
                                        showSearch
                                        onChange={onChangeSearch}
                                        onSearch={onSearchDonVi}
                                        optionFilterProp='children'
                                        filterOption={(input, option: any) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{
                                            width: 200,
                                            textAlign: 'left',
                                            marginRight: '-8px'
                                        }}>
                                        {donviList ? (
                                            donviList?.map((item, index) => (
                                                <Select.Option key={index} value={`${item.id}`}>
                                                    {item.ten}
                                                </Select.Option>
                                            ))
                                        ) : (
                                            <Select.Option value={''}>
                                                <Spin
                                                    tip='Đang tải dữ liệu'
                                                    style={{
                                                        display: 'block',
                                                        justifyContent: 'center',
                                                        marginTop: '0.1px'
                                                    }}></Spin>
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name='layout'
                                    colon={false}
                                    style={{ fontWeight: 'bold', width: '300px', marginRight: 0 }}>
                                    <Input.Search
                                        defaultValue={searchData}
                                        allowClear
                                        enterButton={
                                            <>
                                                <SearchOutlined /> Tìm kiếm
                                            </>
                                        }
                                        placeholder='Nhập từ khóa cần tìm'
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </Form>
                            {isModalVisible && (
                                <Button type='primary' icon={<SaveOutlined />} onClick={addLinhvuc} disabled={disabled}>
                                    Chọn
                                </Button>
                            )}
                        </Space>
                    ]}
                />
            </div>
            <Table
                size='small'
                rowKey='maLinhVuc'
                rowSelection={isModalVisible && { ...rowSelection }}
                columns={columns as any}
                dataSource={listLinhVuc}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                loading={isLoading}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(listLinhVuc) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} của ${total} dòng`
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}

export default DanhSachLinhVuc
