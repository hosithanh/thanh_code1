/* eslint-disable array-callback-return */
import { BarChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Form, PageHeader, Row, Select, Switch, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { ACCESS_TOKEN } from 'common/constant'
import { DOWNLOAD_FILE_EXCEL_BAOCAOSUDUNGDICHVU } from 'common/constant/api-constant'
import { BaoCaoSuDungDichVu } from 'common/interface/Baocaothongke.interfaces/Baocaosudungdichvu'
import { getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined } from 'common/utils/empty-util'
import 'moment/locale/vi'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBaoCaoSuDungDichVu } from 'store/actions/baocaothongke.actions/baocaosudungdichvu'
import { nonAccentVietnamese } from '../../common/utils/string-util'
import { AppState } from '../../store/interface'

export default function BaoCaoThongKeSuDungDichVu(): JSX.Element {
    const baocaosudungdichvuList = useSelector<AppState, BaoCaoSuDungDichVu[] | undefined>(
        (state) => state.baocaosudungdichvu.baocaosudungdichvuList
    )
    const [namValue, setNamValue] = useState<any | undefined>()
    const [thangValue, setThangValue] = useState<any | undefined>()
    const { Option } = Select
    const childrens = [] as any
    const dispatch = useDispatch()
    const [isLoadingStatistical, setIsLoadingStatistical] = useState(false)
    const [isloadingDownload, setIsloadingDownload] = useState(false)
    const [isloadingReset, setIsloadingReset] = useState(false)
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true)
    const [fixedTop, setFixedTop] = useState<boolean>(false)
    const [form] = Form.useForm()
    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()
    const [isLoadingBandau, setIsLoadingBandau] = useState(true)
    const columns: ColumnsType<BaoCaoSuDungDichVu> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '60px',
            render: (value, _, index) => index + 1
        },
        {
            title: 'Tháng',
            dataIndex: 'thang',
            key: 'thang',
            render: (value) => {
                return <div>Tháng {value} </div>
            },
            align: 'center'
        },
        {
            title: 'Số lượng truy cập',
            dataIndex: 'count',
            key: 'count',
            align: 'center'
        }
    ]

    useEffect(() => {
        //!baocaosudungdichvuList && dispatch(getBaoCaoSuDungDichVu({}))
        setIsLoadingBandau(true)
        setIsLoadingStatistical(false)
        setIsloadingReset(false)
        baocaosudungdichvuList && setIsLoadingTable(false)
        setDataSourceBaoCao(baocaosudungdichvuList)
    }, [baocaosudungdichvuList])

    const onFinish = (values) => {
        const { nam, thang } = values
        if (nam !== undefined || nam != null) {
            setIsLoadingStatistical(true)
            dispatch(getBaoCaoSuDungDichVu({ nam, thang }))
        } else {
            Notification({ status: 'error', message: 'Vui lòng chọn năm để thống kê !' })
        }
    }
    const yearNow = new Date().getUTCFullYear()
    const downloadFile = (url, name) => {
        const nam = namValue?.value
        const thang = []
        thangValue?.map((item) => {
            thang.push(item.value)
        })
        if (nam !== undefined || nam != null) {
            axios({
                url: `${url}${!isArrayEmpty(thang) && !isNullOrUndefined(nam)
                    ? `?thang=${thang}&nam=${nam}`
                    : '' || (isArrayEmpty(thang) && nam)
                        ? `?nam=${nam}`
                        : '' || (isNullOrUndefined(nam) && thang)
                            ? `?thang=${thang}&nam=${yearNow}`
                            : `?nam=${yearNow}`
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
        } else {
            Notification({ status: 'error', message: 'Vui lòng chọn năm để tải file !' })
            setIsloadingDownload(false)
        }
    }
    const fileExcel = (): void => {
        setIsloadingDownload(true)
        downloadFile(DOWNLOAD_FILE_EXCEL_BAOCAOSUDUNGDICHVU, `Baocaosudungdichvu.xlsx`)
    }
    const onReset = () => {
        setIsloadingReset(false)
        setDataSourceBaoCao(null)
        form.resetFields()
        //dispatch(getBaoCaoSuDungDichVu({}))
        setNamValue(null)
        setThangValue(null)
    }

    const now = new Date().getUTCFullYear()
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
    return (
        <Fragment>
            <div className='group-action'>
                <PageHeader ghost={false} title='Báo cáo tình hình sử dụng dịch vụ' extra={[]} />

                <Form onFinish={onFinish} form={form}>
                    <Row>
                        <Col span={11} xs={24} sm={24} xl={11}>
                            <Row>
                                <label htmlFor=''>Thống kê theo năm:</label>
                            </Row>
                            <Form.Item name='nam' style={{ marginRight: '8px' }}>
                                <Select
                                    onChange={(_, value) => {
                                        setNamValue(value as any)
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
                        <Col span={1}></Col>
                        <Col span={12} xs={24} sm={24} xl={12}>
                            <Row>
                                <label htmlFor=''>Thống kê theo tháng:</label>
                            </Row>
                            <Form.Item name='thang'>
                                {
                                    <Select
                                        optionFilterProp='children'
                                        mode='multiple'
                                        allowClear
                                        placeholder='--- Chọn tháng ---'
                                        style={{ width: '100%', textAlign: 'left' }}
                                        onChange={(_, value) => {
                                            setThangValue(value as any)
                                        }}
                                        filterOption={(input, option) => {
                                            let titleSearch = option.title
                                            let inputSearch = input

                                            titleSearch = nonAccentVietnamese(titleSearch)
                                            inputSearch = nonAccentVietnamese(inputSearch)

                                            return titleSearch.toLowerCase().indexOf(inputSearch.toLowerCase()) >= 0
                                        }}>
                                        {childrens}
                                    </Select>
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '15px' }}>
                        <Col span={11}></Col>
                        <Col span={1}></Col>
                        <Col span={12} xs={24} sm={24} xl={12}>
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
                <Table
                    rowKey='id'
                    size='small'
                    columns={columns}
                    dataSource={dataSourceBaoCao}
                    pagination={false}
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                    bordered
                    loading={isLoadingTable}
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
            ) : !isLoadingBandau ? (
                ''
            ) : (
                ''
            )}
        </Fragment>
    )
}
