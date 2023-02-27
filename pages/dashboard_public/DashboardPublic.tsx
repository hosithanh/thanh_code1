/* eslint-disable react-hooks/exhaustive-deps */
import {
    BulbOutlined,
    CaretRightOutlined,
    DatabaseOutlined,
    DeliveredProcedureOutlined,
    FileSearchOutlined,
    GlobalOutlined,
    PicCenterOutlined
} from '@ant-design/icons'
import { Card, Col, DatePicker, Empty, List, Row, Spin, Statistic } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dashboard from 'assets/image/dashboard.png'
import axios from 'axios'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { LUOTSUDUNG_URL, THONGKE_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import moment from 'moment'
import 'moment/locale/vi'
import { useEffect, useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppState } from 'store/interface'
import '../../assets/css/trangchu.css'

interface Thongke {
    title?: string
    count?: number
    thang?: number
}

export default function DashboardPublic(): JSX.Element {
    const [thongke, setThongke] = useState<Thongke[] | undefined>()
    const accessToken = useSelector<AppState, string | undefined>((state) => state.auth.accessToken)
    const [luotSuDung, setLuotSuDung] = useState<Thongke[] | undefined>()
    const [truyCap, setTruyCap] = useState<any>()
    const [date, setDate] = useState<string[] | undefined>([`01/01/${moment().year()}`, moment().format('DD/MM/YYYY')])
    const listRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number>(listRef.current?.clientHeight ?? 0)
    const bgStatistic = ['#007bff', '#fec107', '#27a844', '#db3646', '#343c73', '#df5326']
    const iconStatistic = [
        <FileSearchOutlined />,
        <BulbOutlined />,
        <PicCenterOutlined />,
        <DeliveredProcedureOutlined />,
        <GlobalOutlined />,
        <DatabaseOutlined />
    ]
    Chart.register(ChartDataLabels)

    useEffect(() => {
        axios.get(`${THONGKE_URL}`, Authorization(accessToken)).then((res) => {
            setThongke(res.data.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`${THONGKE_URL}/theothang`, Authorization(accessToken)).then((res) => {
            const data = res.data.data
            const monthArr = data.map((item) => `Tháng ${item.thang}`)
            const countArr = data.map((item) => (item.count !== 0 ? item.count : null))
            const dataChart = {
                labels: monthArr,
                datasets: [
                    {
                        label: 'Lượt truy cập',
                        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                        datalabels: {
                            color: 'rgba(54, 162, 235, 1)',
                            anchor: 'end',
                            align: 'end',
                            formatter: (value) =>
                                !isNullOrUndefined(value)
                                    ? Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(value)
                                    : ''
                        },
                        data: countArr
                    }
                ]
            }
            setTruyCap(dataChart)
        })
    }, [])
    useEffect(() => {
        axios
            .get(`${LUOTSUDUNG_URL}${date ? `?from=${date[0]}&to=${date[1]}` : ''}`, Authorization(accessToken))
            .then((res) => {
                setLuotSuDung(res.data.data)
            })
    }, [date])

    useEffect(() => {
        listRef.current && setHeight(listRef.current.clientHeight)
    }, [luotSuDung])

    const options = {
        scales: {
            x: { grid: { display: false } },
            y: { grid: { display: false, paddingTop: 100 }, title: { display: true, text: '' } }
        },
        plugins: {
            legend: { display: false }
        },
        layout: { padding: { top: 25 } }
    }
    return (
        <div className='dashboard'>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                {thongke?.map((item, index) => (
                    <Col lg={4} span={12} key={index}>
                        <Card style={{ background: bgStatistic[index], border: 'none' }}>
                            <Statistic
                                style={{ textAlign: 'center', fontWeight: 500 }}
                                title={
                                    <div className='box-statistic'>
                                        <div className='title-statistic'>{item.title}</div>
                                        <div className='icon-statistic'>{iconStatistic[index]}</div>
                                    </div>
                                }
                                value={item.count ?? 0}
                                groupSeparator='.'
                                valueStyle={{ color: '#ffffff' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row gutter={16}>
                <Col span={24} xl={16}>
                    {/* Bang du lieu bao cao */}
                    <img src={dashboard} alt='' style={{ width: '100%' }} />
                </Col>
                <Col span={24} xl={8}>
                    <div className='list-object'>
                        <div className='row-list-date'>
                            <div className='row-date'>
                                <DatePicker.RangePicker
                                    defaultValue={[
                                        moment(`01/01/${moment().year()}`, 'DD/MM/YYYY'),
                                        moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY')
                                    ]}
                                    disabledDate={(current) => current && current > moment().endOf('day')}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    onChange={(_, date) =>
                                        setDate(!isStringEmpty(date[0]) || !isStringEmpty(date[1]) ? date : undefined)
                                    }
                                    format='DD/MM/YYYY'
                                    locale={locale}
                                />
                            </div>
                            <div
                                //className={`${height && height >= 400 ? 'list-overflow' : ''}`}
                                id='style-2'
                                ref={listRef}>
                                <List
                                    size='large'
                                    dataSource={luotSuDung}
                                    locale={{
                                        emptyText: <Empty description='Không có dữ liệu' />
                                    }}
                                    renderItem={(item: any, index) => (
                                        <List.Item key={index}>
                                            <List.Item.Meta
                                                avatar={<CaretRightOutlined />}
                                                title={<a href={`dulieu/chitiet?maDoiTuong=` + item.ma}>{item.ten}</a>}
                                            />
                                            <Link to={item.ma}> </Link>
                                            <div className='count-result'>{item.count}</div>
                                        </List.Item>
                                    )}></List>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            {truyCap ? '' : <Spin size='large' className='loading-layout centerspin' tip='Đang tải dữ liệu' />}
        </div>
    )
}
