/* eslint-disable array-callback-return */
import { BarChartOutlined, DownloadOutlined, UpCircleOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Form, Modal, PageHeader, Radio, Row, Select, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { DONVI_LIST_USER_URL, DOWNLOAD_FILE_EXCEL_BAOCAOTIENDOSOHOA } from 'common/constant/api-constant'
import { BaocCaoThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Tiendosohoa'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined } from 'common/utils/empty-util'
import 'moment/locale/vi'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaoCaoTienDoSoHoa } from 'store/actions/baocaothongke.actions/baocaotiendosohoa'
import { selectUserDonviMorong } from 'store/actions/donvi.action'

import { Donvi } from '../../../common/interface/Donvi'
import { AppState } from '../../../store/interface'
import CapNhatDuLieuTienDoSoHoa from './CapNhatDuLieuTienDoSoHoa'

export default function BaoCaoTienDoSoHoa() {
    const now = new Date().getUTCFullYear()
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()
    const [donviId, setDonviId] = useState<string[] | undefined>()
    const [LoadingTable, setLoadingTable] = useState<boolean>(true)
    const [loadingDownload, setLoadingDownload] = useState(false)
    const [loadingThongke, setLoadingThongke] = useState(false)
    const [namValue, setNamValue] = useState<any | undefined>(now)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [quy, setQuy] = useState<number | undefined>()
    const dispatch = useDispatch<any>()
    const [ngayKetThuc, setNgayKetThuc] = useState<string[] | undefined>()
    const [namChange, setnamChange] = useState<any>(namValue)

    const dataList = useSelector<AppState, BaocCaoThongKeTienDoSoHoa[] | undefined>(
        (state) => state.baocaotiendosohoa.tiendosohoaList
    )
    useEffect(() => {
        let arrayDataTemp = []
        if (!isArrayEmpty(dataList)) {
            dataList.map((item) => {
                arrayDataTemp.push(item)
                if (item.childrenData?.length > 0) {
                    item.childrenData?.map((itemChild) => {
                        arrayDataTemp.push(itemChild)
                    })
                }
            })
            setLoadingTable(false)
        }

        setDataSourceBaoCao(arrayDataTemp)
        setLoadingThongke(false)
    }, [dataList])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        dispatch(getBaoCaoTienDoSoHoa({}))
    }

    useEffect(() => {
        setnamChange(namValue)
    }, [namValue])

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
    var nam = new Date().getFullYear()
    var d = new Date()
    var x = new Date(`${nam - 1}-12-15`)
    var y = new Date(`${nam}-03-14`)
    var z = new Date(`${nam}-06-14`)
    var w = new Date(`${nam}-09-14`)

    useEffect(() => {
        if (namChange < now) {
            setQuy(1)
            setNgayKetThuc(('14/03/' + namChange) as any)
        } else {
            if (d >= x && d < y) {
                setQuy(1)
                setNgayKetThuc(('14/03/' + namChange) as any)
            } else if (d > y && d <= z) {
                setNgayKetThuc(('14/06/' + namChange) as any)
            } else if (d > z && d <= w) {
                setQuy(3)

                setNgayKetThuc(('14/09/' + namChange) as any)
            } else if (d >= w) {
                setQuy(4)
                setNgayKetThuc(('14/12/' + namChange) as any)
            }
        }
    }, [namChange, namValue])

    const onChangeTKQuy = (e) => {
        if (e.target.value === 1) {
            setQuy(1)
            setNgayKetThuc(('14/03/' + namChange) as any)
        }
        if (e.target.value === 2) {
            setQuy(2)
            setNgayKetThuc(('14/06/' + namChange) as any)
        }
        if (e.target.value === 3) {
            setQuy(3)
            setNgayKetThuc(('14/09/' + namChange) as any)
        }
        if (e.target.value === 4) {
            setQuy(4)
            setNgayKetThuc(('14/12/' + namChange) as any)
        }
    }
    useEffect(() => {
        form.setFieldsValue({
            quy: quy
        })
    }, [quy])
    const columns: ColumnsType<BaocCaoThongKeTienDoSoHoa> = [
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
            width: '400px',
            dataIndex: 'tendonvi',
            key: 'tendonvi',
            render: (value, row, index) => {
                if (index > 1) {
                    return row.parrentId === 0 ? row.tendonvi : '----' + row.tendonvi
                } else {
                    return row.tendonvi
                }
            }
        },

        {
            title: 'Đã rà soát trước kỳ báo cáo',
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
            title: 'Đã số hóa',
            dataIndex: 'dasohoa',
            align: 'center',

            key: 'dasohoa'
        },
        {
            title: 'Chưa số hóa',
            dataIndex: 'chuasohoa',

            align: 'center',
            key: 'chuasohoa'
        },
        {
            title: 'Số kết quả hết hiệu lực',
            dataIndex: 'soKQHetHieuLuc',

            align: 'center',
            key: 'soKQHetHieuLuc'
        },
        {
            title: 'Số kết quả đã số hoá hết hiệu lực',
            dataIndex: 'skqDaSoHoaHetHieuLuc',

            align: 'center',
            key: 'skqDaSoHoaHetHieuLuc'
        },
        {
            title: 'Tỉ lệ số hóa',
            dataIndex: 'tyle_sohoa',
            align: 'center',
            key: 'tyle_sohoa',
            render: (value) => {
                if (value <= 100 && value >= 0) return value + ' %'
                else return '0 %'
            }
        }
    ]

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
        setLoadingTable(true)
        setLoadingThongke(true)
        const { idDonVi, nam, quy } = values
        dispatch(getBaoCaoTienDoSoHoa({ idDonVi, nam, quy: quy, ngayKetThuc: ngayKetThuc }))
    }

    const downloadFile = (url, donviId, namValue, quy, name, ngayKetThuc) => {
        axios({
            url: `${url}?1=1${!isNullOrUndefined(donviId) ? `&donvi=${donviId}` : ''}${
                !isNullOrUndefined(namValue?.value) ? `&year=${namValue?.value}` : `&year=${namValue}`
            }${!isNullOrUndefined(quy) ? `&quarter=${quy}` : ''}${
                !isNullOrUndefined(ngayKetThuc) ? `&denNgay=${ngayKetThuc}` : ''
            } `,
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
            DOWNLOAD_FILE_EXCEL_BAOCAOTIENDOSOHOA,
            donviId,
            namValue,
            quy,
            `Baocaothongketiendosohoa.xlsx`,
            ngayKetThuc
        )
    }

    const changeNam = (value) => {
        setNamValue(value)
    }

    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader ghost={false} title='Báo cáo thống kê tiến độ số hóa' />
                <Form onFinish={onFinish} form={form} style={{ height: '98%' }}>
                    <Row gutter={16}>
                        <Col span={12} xs={24} sm={12} xl={12}>
                            <Row>
                                <label htmlFor=''>Thống kê theo năm:</label>
                            </Row>
                            <Form.Item name='nam' initialValue={now}>
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
                        <Col span={12} xs={24} sm={12} xl={12}>
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
                                    placeholder='---Chọn đơn vị---'
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
                    <Col span={6} style={{ textAlign: 'left' }}>
                        Theo quý:{' '}
                    </Col>
                    <Row>
                        <Col span={24} xs={24} xl={24} lg={24}>
                            <div className='radio--quy'>
                                <Form.Item name='quy'>
                                    <Radio.Group style={{ padding: '0 10px' }} onChange={onChangeTKQuy}>
                                        <Radio style={{ padding: '0  0 30 0px' }} value={1}>
                                            Quý I(15/12/{namChange - 1} - 14/03/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 0 30px 0' }} value={2}>
                                            Quý II (15/03/{namChange} - 14/06/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 0 30px 0' }} value={3}>
                                            Quý III (15/06/{namChange} - 14/09/{namChange})
                                        </Radio>
                                        <Radio style={{ padding: '0 0 30px 0' }} value={4}>
                                            Quý IV (15/9/{namChange} - 14/12/{namChange})
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        </Col>
                        {/* <Col span={1}></Col> */}
                    </Row>
                    <Row>
                        <Col span={24} style={{ marginTop: '-8px' }} xs={24} xl={24}>
                            {' '}
                            <Button
                                type='primary'
                                loading={loadingThongke}
                                htmlType='submit'
                                className='ant-btn-sm btn-submit'
                                icon={<BarChartOutlined />}>
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
                                style={{ backgroundColor: 'orange', color: 'white', border: '1px solid white' }}
                                onClick={showModal}
                                type='primary'
                                className='ant-btn-sm btn-submit'
                                icon={<UpCircleOutlined />}>
                                Cập nhật dữ liệu
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
                    sticky
                    dataSource={dataSourceBaoCao}
                    style={{ maxHeight: '95%' }}
                />
            ) : (
                ''
            )}

            <Modal
                style={{ top: '48px' }}
                width='100%'
                visible={isModalVisible}
                okText={'Cập nhật'}
                cancelText={'Hủy'}
                // onOk={}
                onCancel={handleCancel}
                footer={[
                    <Button danger type='primary' onClick={handleCancel}>
                        Đóng
                    </Button>
                ]}>
                <CapNhatDuLieuTienDoSoHoa />
            </Modal>
        </Fragment>
    )
}
