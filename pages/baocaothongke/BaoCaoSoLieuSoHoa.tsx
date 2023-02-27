/* eslint-disable array-callback-return */
import { BarChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Empty, Form, PageHeader, Radio, Row, Select, Spin, Table } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import 'assets/css/thongkesolieusohoa.css'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { DONVI_LIST_USER_URL, DOWNLOAD_FILE_EXCEL_BAOCAOSOLIEUSOHOA } from 'common/constant/api-constant'
import { BaoCaoThongKeSoLieuSoHoa } from 'common/interface/Baocaothongke.interfaces/BaoCaoSoLieuSoHoa'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty, isNotNullAndNotUndefined, isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import moment from 'moment'
import 'moment/locale/vi'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaoCaoThongKeSoLieuSoHoa } from 'store/actions/baocaothongke.actions/baocaothongkesolieusohoa'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import { AppState } from 'store/interface'
import { Donvi } from '../../common/interface/Donvi'

export default function BaoCaoSoLieuSoHoa() {
    const [LoadingTable, setLoadingTable] = useState<boolean>(true)
    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [ngayBatDau, setNgayBatDau] = useState<string[] | undefined>()
    const [ngayKetThuc, setNgayKetThuc] = useState<string[] | undefined>()
    const [donviId, setDonviId] = useState<string[] | undefined>()
    const [loadingThongke, setLoadingThongke] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)

    const [form] = Form.useForm()
    const dispatch = useDispatch<any>()

    const onReset = () => {
        form.resetFields()

        setDataSourceBaoCao(null)
        setNgayBatDau(null)
        setNgayKetThuc(null)
        setDonviId(null)
    }

    const baocaothongkesolieusohoa = useSelector<AppState, BaoCaoThongKeSoLieuSoHoa[] | undefined>(
        (state) => state.baocaothongkesolieusohoa.baocaothongkesolieusohoaList
    )

    useEffect(() => {
        let arrayDataTemp = []
        if (!isArrayEmpty(baocaothongkesolieusohoa)) {
            baocaothongkesolieusohoa.map((item) => {
                arrayDataTemp.push(item)
                if (item.childrenData?.length > 0) {
                    item.childrenData.map((itemChild) => {
                        arrayDataTemp.push(itemChild)
                    })
                }
            })
            setLoadingTable(false)
            // setLoadingNew(false)
        }

        setDataSourceBaoCao(arrayDataTemp)
        setLoadingThongke(false)
    }, [baocaothongkesolieusohoa])

    useEffect(() => {
        if (isNotNullAndNotUndefined(ngayBatDau) && isNotNullAndNotUndefined(ngayKetThuc)) {
            form.setFieldsValue({
                ngaybatdau: moment(ngayBatDau, 'DD/MM/YYYY'),
                ngayketthuc: moment(ngayKetThuc, 'DD/MM/YYYY')
            })
        }
    }, [ngayBatDau, ngayKetThuc, form])

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

    const onFinish = (values) => {
        const { idDonVi, ngaybatdau, ngayketthuc } = values
        setLoadingThongke(true)
        const idDonvi = idDonVi
        const from = ngaybatdau && ngaybatdau.format('DD/MM/YYYY')
        const to = ngayketthuc && ngayketthuc.format('DD/MM/YYYY')
        dispatch(getBaoCaoThongKeSoLieuSoHoa({ idDonvi, from, to }))
        // setIsLoadLanDau(false)
    }
    const downloadFile = (url, ngayBatDau, ngayKetThuc, donviId, name) => {
        axios({
            url: `${url}?1=1${
                !isStringEmpty(ngayBatDau) && !isNullOrUndefined(ngayBatDau) ? `&from=${ngayBatDau}` : ''
            }${!isStringEmpty(ngayKetThuc) && !isNullOrUndefined(ngayKetThuc) ? `&to=${ngayKetThuc}` : ''}${
                !isNullOrUndefined(donviId) ? `&donvi=${donviId}` : ''
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
            setLoadingDownload(false)
        })
    }
    const fileExcel = (): void => {
        setLoadingDownload(true)
        downloadFile(
            DOWNLOAD_FILE_EXCEL_BAOCAOSOLIEUSOHOA,
            ngayBatDau,
            ngayKetThuc,
            donviId,
            `Baocaothongkesolieusohoa.xlsx`
        )
    }

    const columns: ColumnsType<BaoCaoThongKeSoLieuSoHoa> = [
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
            title: 'Cơ quan/đơn vị ',
            dataIndex: 'tenDonVi',
            width: '400px',
            key: 'tenDonVi',
            render: (value, row, index) => {
                if (index > 1) {
                    return row.parrentId === 0 ? row.tenDonVi : '----' + row.tenDonVi
                } else {
                    return row.tenDonVi
                }
            }
        },

        {
            title: 'Số lượng số hóa',
            dataIndex: 'tong',
            align: 'center',
            key: 'tong',
            render: (value, row, index) => {
                return row.tong
            }
        },

        {
            title: 'Liên thông',
            dataIndex: 'tinhtrang',
            align: 'center',
            key: 'tinhtrang',
            render: (value, row, index) => {
                return row.lienThong
            }
        },
        {
            title: 'Nhập liệu',
            dataIndex: 'ngaybanhanh',
            align: 'center',
            key: 'ngaybanhanh',
            render: (value, row, index) => {
                return row.nhapLieu
            }
        },
        {
            title: 'Chuyên ngành',
            dataIndex: 'chuyenNganh',
            align: 'center',
            key: 'chuyenNganh'
        },
        {
            title: 'Import',
            dataIndex: 'masohoso',
            align: 'center',
            key: 'masohoso',
            render: (value, row, index) => {
                return row.importAmount
            }
        }
    ]

    // quy
    const onChangeTKQuy = (e) => {
        var nam = new Date().getFullYear()
        if (e.target.value === 1) {
            setNgayBatDau(('01/01/' + nam) as any)
            setNgayKetThuc(('31/03/' + nam) as any)
        }
        if (e.target.value === 2) {
            setNgayBatDau(('01/04/' + nam) as any)
            setNgayKetThuc(('30/06/' + nam) as any)
        }
        if (e.target.value === 3) {
            setNgayBatDau(('01/07/' + nam) as any)
            setNgayKetThuc(('30/09/' + nam) as any)
        }
        if (e.target.value === 4) {
            setNgayBatDau(('01/10/' + nam) as any)
            setNgayKetThuc(('31/12/' + nam) as any)
        }
    }
    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader ghost={false} title='Báo cáo thống kê số liệu số hóa' extra={[]} />

                <Form onFinish={onFinish} form={form}>
                    <Row>
                        <Col span={6} xs={24} xl={6} lg={12}>
                            <Row>
                                {/* <Col span={24}> */}
                                <label htmlFor=''>
                                    <span style={{ float: 'left' }}>Từ ngày:</span>
                                </label>
                                {/* </Col> */}
                            </Row>
                            <div className='row-date'>
                                <Form.Item name='ngaybatdau' className='date--ngaybatdau'>
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
                                <label htmlFor=''>
                                    <span style={{ float: 'left' }}>Đến ngày:</span>
                                </label>
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
                                <label htmlFor=''>
                                    <span style={{ float: 'left' }}>Đơn vị:</span>
                                </label>
                            </Row>
                            <Form.Item name='idDonVi'>
                                <Select
                                    onSearch={onSearchDonVi}
                                    onChange={(_, value) => {
                                        if (value !== undefined) {
                                            onChangeDonVi(value['value'])
                                        } else {
                                            onChangeAllDonVi()
                                        }
                                    }}
                                    allowClear
                                    placeholder='Đơn vị'
                                    showSearch
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
                        <Col span={12}>{/*  */}</Col>
                    </Row>
                    <Col span={6} style={{ textAlign: 'left' }}>
                        Theo quý:{' '}
                    </Col>
                    <Row>
                        <Col span={11} xs={24} xl={11} lg={24}>
                            <div className='radio--quy'>
                                <Form.Item name='prioty'>
                                    <Radio.Group onChange={onChangeTKQuy} style={{ padding: '0 10px' }}>
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
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={12} style={{ marginTop: '08px' }} xs={24} xl={12}>
                            {' '}
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='ant-btn-sm btn-submit'
                                icon={<BarChartOutlined />}
                                loading={loadingThongke}>
                                Thống kê
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                type='default'
                                htmlType='button'
                                className='ant-btn-sm btn-submit'
                                icon={<DownloadOutlined />}
                                onClick={fileExcel}
                                loading={loadingDownload}>
                                Tải xuống
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                type='primary'
                                htmlType='button'
                                className='ant-btn-sm btn-submit'
                                icon={<ReloadOutlined />}
                                onClick={onReset}>
                                Làm mới
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {dataSourceBaoCao && dataSourceBaoCao?.length > 0 ? (
                <Table
                    scroll={{
                        y: window.innerHeight - 330
                    }}
                    columns={columns}
                    size='small'
                    pagination={false}
                    loading={LoadingTable}
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                    bordered
                    dataSource={dataSourceBaoCao}
                    sticky
                />
            ) : (
                ''
            )}
        </Fragment>
    )
}
