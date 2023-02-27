/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { CaretDownOutlined, CaretUpOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Select, Space, Spin, Table } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { LINHVUC_URL } from 'common/constant/api-constant'
import { Linhvuc } from 'common/interface/Danhmuc.interfaces/Linhvuc'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined } from 'common/utils/empty-util'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addGopLoaigiayto } from 'store/actions/danhmuc.actions/goploaigiayto.action'
import { getLoaiGiayTo } from 'store/actions/danhmuc.actions/loaigiayto.action'
import { AppState } from 'store/interface'

interface Props {
    maDoiTuong: any
    setIsModalVisiblelistGopdoituong?: (isModalVisiblelistGopdoituong: boolean) => void
    idDonviGop: number
    idDoiTuongGop: number
    resetCount: number
    tenTTHC?: string
    tenGiayTo?: string
    setResetCount?: (resetCount: number) => void
}

export default function DanhsachThemLoaigiayto({
    maDoiTuong,
    setIsModalVisiblelistGopdoituong,
    idDonviGop,
    idDoiTuongGop,
    resetCount,
    setResetCount
}: Props): JSX.Element {
    const dispatch = useDispatch()
    const loaigiaytoList = useSelector<AppState, Loaigiayto[] | undefined>((state) => state.loaigiayto?.loaigiaytoList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.pageSize)
    const sortData = useSelector<AppState, string | undefined>((state) => state.loaigiayto?.sortData)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTenGiayTo, setOrderDataTenGiayTo] = useState('asc')
    const [orderDataMaGiayTo, setOrderDataMaGiayTo] = useState('asc')
    const [orderDataTenTTHC, setOrderDataTenTTHC] = useState('asc')
    const [searchData, setSearchData] = useState('')
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const [linhVucList, setLinhVucList] = useState<Linhvuc[] | undefined>()
    const [isLoadingMoreLinhVucStop, setIsLoadingMoreLinhVucStop] = useState(false)
    const [loadingMoreLinhVucCurPage, setLoadingMoreLinhVucCurPage] = useState<number>(1)
    const [maLinhVuc, setMaLinhVuc] = useState<string | undefined>()
    const [disableSave, setDisableSave] = useState(true)
    const [searchSelect, setSearchSelect] = useState<string | undefined>()

    const { Option } = Select
    const [form] = Form.useForm()
    useEffect(() => {
        form.resetFields()
        form.setFieldsValue({ keySearch: '' })
        dispatch(getLoaiGiayTo({ idDonVi: idDonviGop }))
        SetIsLoading(false)
    }, [idDoiTuongGop, resetCount])
    useEffect(() => {
        axios
            .get(
                `${LINHVUC_URL}?curPage=1&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(idDonviGop) ? `&idDonVi=${idDonviGop}` : ''
                }`,
                Authorization()
            )
            .then((res) => {
                setLinhVucList(res.data.data.result)
            })
    }, [idDonviGop, resetCount])

    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(
            getLoaiGiayTo({
                page,
                pageSize,
                searchData: searchData,
                sortData,
                idDonVi: idDonviGop,
                maLinhVuc: maLinhVuc
            })
        )
        SetIsLoading(false)
        // setTimeout(() => {
        //     SetIsLoading(false)
        // }, 100)
    }
    const rowSelection = {
        onChange: (itemSelectedRowKeys) => {
            setSelectedRowKeys(itemSelectedRowKeys)
            if (itemSelectedRowKeys.length > 0) {
                setDisableSave(false)
            } else {
                setDisableSave(true)
            }
        }
    }

    const onSearch = (searchData?: string) => {
        setSearchData(searchData)
        dispatch(getLoaiGiayTo({ searchData, pageSize: pageSize, idDonVi: idDonviGop, maLinhVuc: maLinhVuc }))
    }
    const onSort = (sortData, colunm) => {
        if (colunm === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'ten') {
            setOrderDataTenGiayTo(orderDataTenGiayTo === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'maGiayTo') {
            setOrderDataMaGiayTo(orderDataMaGiayTo === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'tenTTHC') {
            setOrderDataTenTTHC(orderDataTenTTHC === 'asc' ? 'desc' : 'asc')
        }

        dispatch(getLoaiGiayTo({ searchData, sortData }))
    }
    const onAddLoaiGiayTo = (): void => {
        if (selectedRowKeys) {
            let data = []
            loaigiaytoList.map((item) => {
                if (selectedRowKeys.find((itemrow) => item.id === itemrow)) {
                    data.push({
                        maGiayTo: item.maGiayTo,
                        maTTHC: item.matthc,
                        sapXep: item.id % 1000,
                        tenTTHC: item.tenTTHC,
                        tenGiayTo: item.tenGiayTo
                    })
                }
            })

            dispatch(addGopLoaigiayto(maDoiTuong, data))

            setSearchData(searchData)
            dispatch(getLoaiGiayTo({ searchData, pageSize: pageSize, idDonVi: idDonviGop, maLinhVuc: maLinhVuc }))
            setResetCount(0)
            setIsModalVisiblelistGopdoituong(false)
            Notification({ status: 'success', message: 'Gộp đối tượng thành công !' })
        } else {
            Notification({ status: 'error', message: 'Vui lòng chọn đối tượng để gộp !' })
        }
    }
    const typingRef = useRef<any>()
    const onSearchLinhVuc = (dataSearch) => {
        if (typingRef.current) {
            clearTimeout(typingRef.current)
        }
        typingRef.current = setTimeout(async () => {
            setSearchSelect(dataSearch)
            axios
                .get(
                    `${LINHVUC_URL}?curPage=1&pageSize=${pageSize ?? 10}${
                        !isNullOrUndefined(idDonviGop) ? `&idDonVi=${idDonviGop}` : ''
                    }${!isNullOrUndefined(dataSearch) ? `&searchData=${dataSearch}` : ''}`,
                    Authorization()
                )
                .then((res) => {
                    setLinhVucList(res.data.data.result)
                })
        }, 300)
    }

    const onScrollLinhVuc = (e) => {
        if (!isLoadingMoreLinhVucStop && e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
            e.target.scrollTo(0, e.target.scrollHeight)
            var currPage = loadingMoreLinhVucCurPage + 1
            setLoadingMoreLinhVucCurPage(currPage)
            axios
                .get(
                    `${LINHVUC_URL}?curPage=${currPage}&pageSize=${pageSize ?? 10}&idDonVi=${idDonviGop}${
                        !isNullOrUndefined(searchSelect) ? `&searchData=${searchSelect}` : ''
                    }`,
                    Authorization()
                )
                .then((res) => {
                    if (res.data.data.result.length > 0) {
                        setLinhVucList(linhVucList.concat(res.data.data.result))
                    } else {
                        setIsLoadingMoreLinhVucStop(true)
                    }
                })
        }
    }

    const onChangeLinhVuc = (maLinhVuc) => {
        setMaLinhVuc(maLinhVuc)
        dispatch(getLoaiGiayTo({ searchData: searchData, sortData, idDonVi: idDonviGop, maLinhVuc: maLinhVuc }))
    }

    const columns: ColumnsType<Loaigiayto> = [
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
                <div onClick={() => onSort(`matthc ${orderDataMa}`, 'ma')}>
                    <span>Mã thủ tục hành chính</span>{' '}
                    {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            align: 'right',
            width: '190px',
            dataIndex: 'matthc',
            key: 'matthc'
        },
        {
            title: (
                <div onClick={() => onSort(`tenTTHC ${orderDataTenTTHC}`, 'tenTTHC')}>
                    <span>Tên thủ tục hành chính</span>{' '}
                    {orderDataTenTTHC === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'tenTTHC',
            key: 'tenTTHC'
        },
        {
            title: (
                <div onClick={() => onSort(`maGiayTo ${orderDataMaGiayTo}`, 'maGiayTo')}>
                    <span>Mã giấy tờ</span> {orderDataMaGiayTo === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            align: 'right',
            width: '190px',
            dataIndex: 'maGiayTo',
            key: 'maGiayTo'
        },
        {
            title: (
                <div onClick={() => onSort(`tenGiayTo ${orderDataTenGiayTo}`, 'ten')}>
                    <span>Tên giấy tờ</span>{' '}
                    {orderDataTenGiayTo === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'tenGiayTo',
            key: 'tenGiayTo'
        }
    ]

    return (
        <>
          
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách loại giấy tờ'
                    style={{ width: '100%', padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline' form={form}>
                                <Form.Item name='maLinhvuc'>
                                    <Select
                                        onSearch={onSearchLinhVuc}
                                        placeholder='Vui lòng tìm lĩnh vực'
                                        showSearch
                                        allowClear
                                        optionFilterProp='children'
                                        onPopupScroll={onScrollLinhVuc}
                                        onChange={(maLinhVuc) => {
                                            onChangeLinhVuc(maLinhVuc)
                                        }}
                                        style={{ width: 250, textAlign: 'left' }}>
                                        {linhVucList?.map((item, index) => (
                                            <Option key={index} value={item.maLinhVuc}>
                                                {item.tenLinhVuc}
                                            </Option>
                                        ))}

                                        {isLoadingMoreLinhVucStop ? (
                                            ''
                                        ) : (
                                            <Select value={''}>
                                                <Option value={''}>
                                                    <Spin
                                                        tip='Đang tải dữ liệu'
                                                        style={{
                                                            display: 'block',
                                                            justifyContent: 'center',
                                                            marginTop: '0.1px'
                                                        }}></Spin>
                                                </Option>
                                            </Select>
                                        )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name='keySearch'
                                    colon={false}
                                    style={{
                                        fontWeight: 'bold',
                                        marginRight: 0
                                    }}>
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

                            <>
                                <Button
                                    type='primary'
                                    icon={<SaveOutlined />}
                                    onClick={onAddLoaiGiayTo}
                                    disabled={disableSave}>
                                    Chọn
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
                dataSource={loaigiaytoList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                loading={isLoading}
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(loaigiaytoList) && (
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
