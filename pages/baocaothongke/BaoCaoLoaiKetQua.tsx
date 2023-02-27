/* eslint-disable react-hooks/exhaustive-deps */
import { BarChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Empty,
    Form,
    Input,
    PageHeader,
    Pagination,
    Radio,
    Row,
    Select,
    Spin,
    Table
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { DONVI_LIST_USER_URL, DOWNLOAD_FILE_EXCEL_BAOCAOLOAIKETQUA } from 'common/constant/api-constant'
import { BaoCaoLoaiKetQua } from 'common/interface/Baocaothongke.interfaces/Baocaoloaiketqua'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import moment from 'moment'
import 'moment/locale/vi'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaoCaoLoaiKetQua } from 'store/actions/baocaothongke.actions/baocaoloaiketqua'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import '../../assets/css/baocaoloaiketqua.css'
import { Donvi } from '../../common/interface/Donvi'
import { isNotNullAndNotUndefined, isNullOrUndefined, isStringEmpty } from '../../common/utils/empty-util'
import { AppState } from '../../store/interface'
export default function BaoCaoThongKeLoaiKetQua(): JSX.Element {
    const baocaoloaiketquaList = useSelector<AppState, BaoCaoLoaiKetQua[] | undefined>(
        (state) => state.baocaoloaiketqua.baocaoloaiketquaList
    )
    const searchData = useSelector<AppState, string | undefined>((state) => state.baocaoloaiketqua?.searchData)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.baocaoloaiketqua.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.baocaoloaiketqua.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.baocaoloaiketqua.pageSize)
    const dispatch = useDispatch()
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const idDonvi = useSelector<AppState, number | undefined>((state) => state.baocaoloaiketqua.idDonvi)
    const [ngayBatDau, setNgayBatDau] = useState<string[] | undefined>()
    const [ngayKetThuc, setNgayKetThuc] = useState<string[] | undefined>()
    const [dataSearch, setDataSearch] = useState<string[] | undefined>()
    const [donviId, setDonviId] = useState<string[] | undefined>()
    const [isLoadingStatistical, setIsLoadingStatistical] = useState(false)
    const [isloadingDownload, setIsloadingDownload] = useState(false)
    const [isloadingReset, setIsloadingReset] = useState(false)
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true)
    const [form] = Form.useForm()

    const [isLoadingBandau, setisLoadingBandau] = useState(true)
    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()


    const columns: ColumnsType<BaoCaoLoaiKetQua> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '60px',
            render: (value, _, index) => pageSize && currentPage && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: 'Tên loại kết quả',
            dataIndex: 'tenloaiketqua',
            key: 'tenloaiketqua'
        },
        {
            title: 'Mã loại kết quả',
            dataIndex: 'maloaiketqua',
            key: 'maloaiketqua'
        },
        {
            title: 'Đơn vị',
            dataIndex: 'tendonvi',
            key: 'tendonvi'
        },
        {
            title: 'Số kết quả',
            dataIndex: 'count',
            align: 'center',
            key: 'phienBan',
            width: '15%',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.count - b.count
        }
    ]

    useEffect(() => {
        // !baocaoloaiketquaList && dispatch(getBaoCaoLoaiKetQua({ searchData }))
        setIsLoadingStatistical(false)
        setIsloadingReset(false)
        baocaoloaiketquaList && setIsLoadingTable(false)
        setDataSourceBaoCao(baocaoloaiketquaList)
    }, [baocaoloaiketquaList])

    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])
    useEffect(() => {
        if (isNotNullAndNotUndefined(ngayBatDau) && isNotNullAndNotUndefined(ngayKetThuc)) {
            form.setFieldsValue({
                ngaybatdau: moment(ngayBatDau, 'DD/MM/YYYY'),
                ngayketthuc: moment(ngayKetThuc, 'DD/MM/YYYY')
            })
        }
    }, [ngayBatDau, ngayKetThuc])
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
    const onPageChange = (page, pageSize) => {
        setDataSourceBaoCao([])
        const tuNgay: any = ngayBatDau && ngayBatDau
        const denNgay: any = ngayKetThuc && ngayKetThuc
        setIsLoadingTable(true)
        dispatch(getBaoCaoLoaiKetQua({ page, pageSize, idDonvi, searchData, tuNgay, denNgay }))
    }
    const onFinish = (values) => {
        setDataSourceBaoCao([])
        setisLoadingBandau(false)
        setIsLoadingTable(true)
        const { idDonVi, ngaybatdau, ngayketthuc, searchData } = values
        // setDataSearch(searchData)
        setIsLoadingStatistical(true)
        const idDonvi = idDonVi
        const tuNgay = ngaybatdau && ngaybatdau.format('DD/MM/YYYY')
        const denNgay = ngayketthuc && ngayketthuc.format('DD/MM/YYYY')
        dispatch(getBaoCaoLoaiKetQua({ tuNgay, denNgay, idDonvi, searchData }))
    }
    const downloadFile = async (url, ngayBatDau, ngayKetThuc, donviId, dataSearch, name) => {
        await axios({
            url: `${url}?1=1${!isNullOrUndefined(donviId) ? `&donVi=${donviId?.value}` : ''}${
                !isNullOrUndefined(ngayBatDau) && !isStringEmpty(ngayBatDau) ? `&tuNgay=${ngayBatDau}` : ''
            }${!isNullOrUndefined(ngayKetThuc) && !isStringEmpty(ngayKetThuc) ? `&denNgay=${ngayKetThuc}` : ''}${
                !isNullOrUndefined(dataSearch) && !isStringEmpty(dataSearch) ? `&searchData=${dataSearch}` : ''
            }`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            setIsloadingDownload(false)
        })
    }
    const fileExcel = (): void => {
        setIsloadingDownload(true)
        downloadFile(
            DOWNLOAD_FILE_EXCEL_BAOCAOLOAIKETQUA,
            ngayBatDau,
            ngayKetThuc,
            donviId,
            dataSearch,
            `Baocaoloaiketqua.xlsx`
        )
    }
    const onReset = () => {
        setIsLoadingTable(true)
        setisLoadingBandau(true)
        form.resetFields()
        setDataSourceBaoCao(null)
        setNgayBatDau(null)
        setNgayKetThuc(null)
        setDataSearch(null)
        setDonviId(null)
    }

    const onChangeInput = (e) => {
        setDataSearch(e.target.value)
        if (!e.target.value) {
            dispatch(getBaoCaoLoaiKetQua({ idDonvi: idDonvi }))
        }
    }
    const onChangeQuy = (e) => {
        var day = new Date()
        var namhientai = day.getFullYear()
        if (e.target.value === 1) {
            setNgayBatDau(('01/01/' + namhientai) as any)
            setNgayKetThuc(('31/03/' + namhientai) as any)
        } else if (e.target.value === 2) {
            setNgayBatDau(('01/04/' + namhientai) as any)
            setNgayKetThuc(('30/06/' + namhientai) as any)
        } else if (e.target.value === 3) {
            setNgayBatDau(('01/07/' + namhientai) as any)
            setNgayKetThuc(('30/09/' + namhientai) as any)
        } else if (e.target.value === 4) {
            setNgayBatDau(('01/10/' + namhientai) as any)
            setNgayKetThuc(('31/12/' + namhientai) as any)
        }
    }

    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader ghost={false} title='Báo cáo tình hình dữ liệu theo loại kết quả' extra={[]} />

                <Form onFinish={onFinish} form={form}>
                    <Row>
                        <Col span={6} xs={24} xl={6} lg={12}>
                            <Row>
                                <label htmlFor=''>Từ ngày:</label>
                            </Row>
                            <div className='row-date tungay'>
                                <Form.Item name='ngaybatdau'>
                                    <DatePicker
                                        placeholder='--Chọn ngày--'
                                        style={{ width: '100%' }}
                                        format='DD/MM/YYYY'
                                        locale={locale}
                                        onChange={(_, date) => {
                                            setNgayBatDau(date as any)
                                            form.setFieldsValue({ prioty: 5 })
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col span={6} xs={24} xl={6} lg={12}>
                            <Row>
                                <label htmlFor=''>Đến ngày:</label>
                            </Row>
                            <div className='row-date'>
                                <Form.Item name='ngayketthuc'>
                                    <DatePicker
                                        placeholder='--Chọn ngày--'
                                        style={{ width: '100%' }}
                                        format='DD/MM/YYYY'
                                        locale={locale}
                                        onChange={(_, date) => {
                                            setNgayKetThuc(date as any)
                                            form.setFieldsValue({ prioty: 5 })
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11} xs={24} xl={11} lg={24}>
                            <Row>
                                <label htmlFor=''>Đơn vị:</label>
                            </Row>
                            <Form.Item name='idDonVi'>
                                <Select
                                    onChange={(_, value) => {
                                        setDonviId(value as any)
                                    }}
                                    allowClear
                                    placeholder='Đơn vị'
                                    showSearch
                                    onSearch={onSearchDonVi}
                                    optionFilterProp='children'
                                    filterOption={(input, option: any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    style={{ width: '100%', textAlign: 'left' }}>
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
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12} xs={24} xl={12} lg={24}>
                            <Row>
                                <label htmlFor=''>Theo quý:</label>
                            </Row>
                            <Form.Item name='prioty'>
                                <Radio.Group
                                    onChange={onChangeQuy}
                                    style={{ float: 'left', padding: '0 10px', paddingBottom: '20px' }}>
                                    <Radio style={{ padding: '0 8px' }} value={1}>
                                        Quý I
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={2}>
                                        Quý II
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={3}>
                                        Quý III
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={4}>
                                        Quý IV
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11} xs={24} xl={11} lg={24}>
                            <Row>
                                <label htmlFor=''>Mã /Tên loại kết quả, Mã /Tên thủ tục hành chính:</label>
                            </Row>
                            <Form.Item name='searchData'>
                                <Input allowClear placeholder='Nhập từ khóa cần tìm' onChange={onChangeInput} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}></Col>
                        <Col span={1}></Col>

                        <Col span={11} style={{ float: 'left', marginBottom: '10px' }} xs={24} xl={11} lg={24}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='ant-btn-sm btn-submit'
                                icon={<BarChartOutlined />}
                                loading={isLoadingStatistical}>
                                Thống kê
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                type='default'
                                htmlType='button'
                                className='ant-btn-sm btn-submit'
                                icon={<DownloadOutlined />}
                                onClick={fileExcel}
                                loading={isloadingDownload}>
                                Tải xuống   
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                type='primary'
                                htmlType='button'
                                className='ant-btn-sm btn-submit'
                                icon={<ReloadOutlined />}
                                onClick={onReset}
                                loading={isloadingReset}>
                                Làm mới
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {dataSourceBaoCao && dataSourceBaoCao.length > 0 ? (
                <>
                    <Table
                        rowKey='id'
                        size='small'
                        columns={columns}
                        dataSource={dataSourceBaoCao}
                        pagination={false}
                        locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                        bordered
                        scroll={{ y: '65vh' }}
                        loading={isLoadingTable}
                    />

                    <ConfigProvider locale={viVN}>
                        <Pagination
                            total={totalRecords}
                            style={{ textAlign: 'end', paddingTop: '20px' }}
                            defaultCurrent={1}
                            current={currentPage}
                            onChange={onPageChange}
                            defaultPageSize={pageSize}
                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                            showSizeChanger
                            pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                        />
                    </ConfigProvider>
                </>
            ) : !isLoadingBandau ? (
                <Table
                    columns={columns}
                    loading={isLoadingTable}
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                />
            ) : (
                ''
            )}
        </Fragment>
    )
}
