/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { BarChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Empty, Form, PageHeader, Radio, Row, Select, Spin, Switch, Table } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import 'assets/css/baocaochitiet.css'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import {
    DONVI_LIST_USER_URL,
    DOWNLOAD_FILE_EXCEL_BAOCAOCHITIETKETQUASOHOAMAU1,
    DYNAMIC_URL
} from 'common/constant/api-constant'
import { BaoCaoChiTietKQSoHoaMau1 } from 'common/interface/Baocaothongke.interfaces/Baocaochitietketquasohoamau1'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import moment from 'moment'
import 'moment/locale/vi'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaoCaoChiTietKetQuaSoHoaMau1 } from 'store/actions/baocaothongke.actions/baocaochitietketquasohoamau1'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import { Doituong } from '../../common/interface/Doituong'
import { Donvi } from '../../common/interface/Donvi'
import { isArrayEmpty, isNotNullAndNotUndefined, isNullOrUndefined, isStringEmpty } from '../../common/utils/empty-util'
import { AppState } from '../../store/interface'

export default function BaoCaoChiTietKetQuaSoHoaMau1(): JSX.Element {
    const { Option } = Select
    const baocaochitietketquasohoamau1List = useSelector<AppState, BaoCaoChiTietKQSoHoaMau1[] | undefined>(
        (state) => state.baocaochitietketquasohoamau1.baocaochitietketquasohoamau1List
    )

    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [ngayBatDau, setNgayBatDau] = useState<string[] | undefined>()
    const [ngayKetThuc, setNgayKetThuc] = useState<string[] | undefined>()
    const [maDoituong, setMaDoiTuong] = useState<string[] | undefined>()
    const [donviId, setDonviId] = useState<string[] | undefined>()
    const [doituong, setDoituong] = useState<Doituong[] | undefined>()
    const [isLoadingStatistical, setIsLoadingStatistical] = useState(false)
    const [isloadingDownload, setIsloadingDownload] = useState(false)
    const [isloadingReset, setIsloadingReset] = useState(false)
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true)
    const [isLoadingMoreDoiTuongStop, setIsLoadingMoreDoiTuongStop] = useState(false)
    const [loadingMoreDoiTuongCurPage, setLoadingMoreDoiTuongCurPage] = useState<number>(1)
    const [fixedTop, setFixedTop] = useState<boolean>(false)
    const [expended, setExpended] = useState(null)
    const [isLoadingBandau, setIsLoadingBandau] = useState(true)

    const [form] = Form.useForm()
    const dispatch = useDispatch<any>()
    const onReset = () => {
        setIsloadingReset(true)
        setIsLoadingTable(true)
        setIsLoadingBandau(true)
        form.resetFields()
        setDataSourceBaoCao(null)
        setMaDoiTuong(null)
        setDonviId(null)
        setNgayBatDau(null)
        setNgayKetThuc(null)
        setIsloadingReset(false)
    }
    // useEffect(() => {
    //     !baocaochitietketquasohoamau1List && dispatch(getBaoCaoChiTietKetQuaSoHoaMau1({}))
    //     setIsloadingReset(false)
    // }, [dispatch, baocaochitietketquasohoamau1List])

    useEffect(() => {
        let indexTemp = baocaochitietketquasohoamau1List?.length
        !isArrayEmpty(baocaochitietketquasohoamau1List)
            ? setDataSourceBaoCao(
                baocaochitietketquasohoamau1List
                    .map((item) => Object.entries(item)[0])
                    .map((item, index) =>
                        item.reduce((prev, curr) => {
                            curr.map((item) => {
                                indexTemp++
                                item.key = indexTemp
                            })
                            return { loaiketqua1: prev, children: curr, key: index + 1, isTitle: true }
                        })
                    )
            )
            : setDataSourceBaoCao([])
        setIsLoadingStatistical(false)
    }, [baocaochitietketquasohoamau1List])

    useEffect(() => {
        !isArrayEmpty(dataSourceBaoCao) && dataSourceBaoCao && setIsLoadingTable(false)
        // if (!isArrayEmpty(dataSourceBaoCao)) {
        //     setExpended(dataSourceBaoCao?.length > 1 ? null : dataSourceBaoCao[0].key)
        // }
        if (!isArrayEmpty(dataSourceBaoCao)) {
            var arraykeyexpend = []
            dataSourceBaoCao.map((item) => {
                if (item.children.length !== 0) {
                    arraykeyexpend.push(item.key)
                }
            })
            setExpended(arraykeyexpend)
        }
    }, [dataSourceBaoCao])
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`${DYNAMIC_URL}/doituong/all`, Authorization()).then((res) => {
            setDoituong(res.data.data.items)
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
            ; (dispatch(selectUserDonviMorong({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 300)
    }
    const onChangeDonVi = (idDonvi) => {
        setDonviId(idDonvi)
        axios.get(`${DYNAMIC_URL}/doituong/all?donVi=${idDonvi}`, Authorization()).then((res) => {
            setDoituong(res.data.data.items)
        })
    }
    const onChangeAllDonVi = () => {
        setDonviId(undefined)
        axios.get(`${DYNAMIC_URL}/doituong/all`, Authorization()).then((res) => {
            setDoituong(res.data.data.items)
        })
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

    const downloadFile = (url, ngayBatDau, ngayKetThuc, donviId, madoituong, name) => {
        axios({
            url: `${url}?1=1${!isNullOrUndefined(madoituong) ? `&madoituong=${madoituong}` : ''}${!isStringEmpty(ngayBatDau) && !isNullOrUndefined(ngayBatDau) ? `&from=${ngayBatDau}` : ''
                }${!isStringEmpty(ngayKetThuc) && !isNullOrUndefined(ngayKetThuc) ? `&to=${ngayKetThuc}` : ''}${!isNullOrUndefined(donviId) ? `&donvi=${donviId}` : ''
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
            DOWNLOAD_FILE_EXCEL_BAOCAOCHITIETKETQUASOHOAMAU1,
            ngayBatDau,
            ngayKetThuc,
            donviId,
            maDoituong,
            `Baocaochitietketquasohoamau1.xlsx`
        )
    }

    const onFinish = (values) => {
        setIsLoadingBandau(false)
        setIsLoadingTable(true)
        const { idDonVi, madoituong } = values
        setIsLoadingStatistical(true)
        setMaDoiTuong(madoituong)
        const idDonvi = idDonVi
        const from = ngayBatDau
        const to = ngayKetThuc
        dispatch(getBaoCaoChiTietKetQuaSoHoaMau1({ from, to, idDonvi, madoituong }))
    }
    const typingRef = useRef<any>()
    const onSearchDoituong = (dataSearch) => {
        if (typingRef.current) {
            clearTimeout(typingRef.current)
        }
        typingRef.current = setTimeout(() => {
            axios
                .get(
                    `${DYNAMIC_URL}/doituong/all?searchData=${dataSearch}${!isNullOrUndefined(donviId) ? `&donVi=${donviId}` : ''
                    }`,
                    Authorization()
                )
                .then((res) => {
                    setDoituong(res.data.data.items)
                })
        }, 300)
    }
    const onReloadSearchDoituong = () => {
        axios
            .get(
                `${DYNAMIC_URL}/doituong/all?searchData=''
                    }`,
                Authorization()
            )
            .then((res) => {
                setDoituong(res.data.data.items)
            })
    }

    const onScrollDoiTuong = (e) => {
        if (!isLoadingMoreDoiTuongStop && e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
            e.target.scrollTo(0, e.target.scrollHeight)
            var currPage = loadingMoreDoiTuongCurPage + 1
            setLoadingMoreDoiTuongCurPage(currPage)

            axios
                .get(
                    `${DYNAMIC_URL}/doituong/all?curPage=${currPage}${!isNullOrUndefined(donviId) ? `&donVi=${donviId}` : ''
                    }`,
                    Authorization()
                )
                .then((res) => {
                    if (res.data.data.items.length > 0) {
                        setDoituong(doituong.concat(res.data.data.items))
                    } else {
                        setIsLoadingMoreDoiTuongStop(true)
                    }
                })
        }
    }

    const columns: ColumnsType<BaoCaoChiTietKQSoHoaMau1> = [
        {
            title: 'STT',
            dataIndex: 'loaiketqua1',
            key: 'key',
            width: '60px',
            render: (value, row, index) => {
                const obj: any = {
                    children: !row.loaiketqua1 ? index + 1 : `${row.loaiketqua1} (${row.children?.length})`,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 11
                    obj.props.className = 'title_baocao'
                } else {
                    obj.props.align = 'center'
                }
                return obj
            }
        },
        {
            title: 'Cơ quan/đơn vị thực hiện TTHC',
            dataIndex: 'coquancapphep',
            key: 'coquancapphep',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.coquancapphep,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }

                return obj
            }
        },
        {
            title: 'Cơ quan ban hành kết quả',
            dataIndex: 'coquancapphep',
            key: 'coquancapphep',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.coquancapphep,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        },

        {
            title: 'Tình trạng',
            dataIndex: 'tinhtrang',
            key: 'tinhtrang',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.tinhtrang,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }

                return obj
            }
        },
        {
            title: 'Ngày ban hành',
            dataIndex: 'ngaybanhanh',
            key: 'ngaybanhanh',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.ngaybanhanh,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        },
        {
            title: 'Số ký hiệu VB',
            dataIndex: 'sokyhieu',
            key: 'sokyhieu',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.sokyhieu,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }

                return obj
            }
        },
        {
            title: 'Thời gian có hiệu lực',
            dataIndex: 'phamvihieuluc',
            key: 'phamvihieuluc',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.phamvihieuluc,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        },
        {
            title: 'Thời gian hết hiệu lực',
            dataIndex: 'thoigianhethieuluc',
            key: 'thoigianhethieuluc',
            width: '100px',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.thoigianhethieuluc,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        },
        {
            title: 'Thủ tục hành chính',
            dataIndex: 'thutuchanhchinh',
            key: 'thutuchanhchinh',
            width: '15%',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.thutuchanhchinh,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        },
        {
            title: 'Ngày số hóa',
            dataIndex: 'ngaytao',
            key: 'ngaytao',
            width: '100px',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.ngaytao,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }

                return obj
            }
        },
        {
            title: 'Người số hóa',
            dataIndex: 'nguoitao',
            key: 'nguoitao',
            render: (value, row, index) => {
                const obj: any = {
                    children: row.nguoitao,
                    props: {}
                }
                if (row.isTitle) {
                    obj.props.colSpan = 0
                }
                return obj
            }
        }
    ]
    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader ghost={false} title='Báo cáo chi tiết kết quả số hóa mẫu 1' extra={[]} />

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
                                            form.setFieldsValue({ quy: 10 })
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
                                            form.setFieldsValue({ quy: 10 })
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
                                    onSearch={onSearchDonVi}
                                    onChange={(_, value) => {
                                        if (value !== undefined) {
                                            onChangeDonVi(value['value'])
                                        } else {
                                            onChangeAllDonVi()
                                            onReloadSearchDoituong()
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
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                    </Row>

                    <Row>
                        <Col span={12} xs={24} xl={12} lg={24}>
                            <Row>
                                <label htmlFor=''>Theo quý:</label>
                            </Row>
                            <Form.Item name='quy'>
                                <Radio.Group
                                    onChange={onChangeQuy}
                                    style={{ float: 'left', padding: '0 10px' }}
                                    name='quy'>
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
                                <label htmlFor=''>Loại kết quả:</label>
                            </Row>
                            <Form.Item name='madoituong'>
                                <Select
                                    onSearch={onSearchDoituong}
                                    optionFilterProp='children'
                                    placeholder='Vui lòng tìm loại kết quả'
                                    showSearch
                                    allowClear
                                    filterOption={false}
                                    onPopupScroll={onScrollDoiTuong}
                                    onChange={(_, value: any) => {
                                        if (value !== undefined) {
                                            setMaDoiTuong(value['value'] as any)
                                        } else {
                                            setMaDoiTuong(undefined)
                                        }
                                    }}
                                    style={{ width: '100%', textAlign: 'left' }}>
                                    {doituong?.map((item, index) => (
                                        <Option key={index} value={item.ma as string}>
                                            <span style={{ color: '#099CD7' }}>{item.maGiayTo}</span> {item.ten}
                                        </Option>
                                    ))}

                                    {isLoadingMoreDoiTuongStop ? (
                                        ''
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
                        <Col span={13}></Col>
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
            {dataSourceBaoCao && dataSourceBaoCao?.length > 0 ? (
                <Table
                    columns={columns}
                    size='small'
                    dataSource={dataSourceBaoCao}
                    pagination={false}
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                    bordered
                    loading={isLoadingTable}
                    expandable={{
                        onExpand: (expanded, record): any => {
                            if (expanded) {
                                let expendedTemp = [...expended, record.key]
                                setExpended(expendedTemp)
                            } else {
                                let expendedTemp = expended.filter((e) => e !== record.key)
                                setExpended(expendedTemp)
                            }
                        }
                    }}
                    expandedRowKeys={expended}
                    summary={(pageData) => (
                        <Table.Summary fixed={true}>
                            <Table.Summary.Row style={{ display: 'none' }}>
                                <Table.Summary.Cell index={0} colSpan={2}>
                                    <Switch
                                        checkedChildren='Fixed Top'
                                        unCheckedChildren='Fixed Top'
                                        checked={fixedTop}
                                        onChange={() => {
                                            setFixedTop(!fixedTop)
                                        }}
                                    />
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                    sticky
                />
            ) : (
                ''
            )}
        </Fragment>
    )
}
