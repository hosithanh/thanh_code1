/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Carousel, DatePicker, Empty, Table, Typography } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import axios from 'axios'
import { BAOCAOTHONGKEDONVI_PUBLIC, THONG_KE_SO_HOA } from 'common/constant/api-constant'
import { monthNow, yearNow } from 'common/utils/date-util'
import { userAgent } from 'common/utils/device-util'
import { isArrayEmpty, isStringEmpty } from 'common/utils/empty-util'
import { chunkArray } from 'common/utils/function-util'
import moment from 'moment'
import { useEffect, useState } from 'react'
import ChartThongKe from './ChartThongKe'
import FooterPublic from './FooterPublic'
import HeaderPublic from './HeaderPublic'
import ScrollToTop from './ScrollToTop'

const { Text } = Typography

function DonViPublic({ setPathPublic }): JSX.Element {
    const [date, setDate] = useState<string[] | undefined>([`01/01/${moment().year()}`, moment().format('DD/MM/YYYY')])
    const idDonvi = window.location.pathname.split('/').pop()
    const [year, setYear] = useState<any>(yearNow)
    const [isLoadingTable, setIsLoadingTable] = useState(true)
    const [dataDonVi, setDataDonVi] = useState([])

    const [thongKeThang, setThongKeThang] = useState<any>([])
    const [thongKeNam, setThongKeNam] = useState<any>([])
    const [dataThongKeTong, setDataThongKeTong] = useState<any>([])
    const [tenDonVi, settenDonVi] = useState<string>('')

    useEffect(() => {
        axios.get(`${BAOCAOTHONGKEDONVI_PUBLIC}?donvi=${idDonvi}&from=${date[0]}&to=${date[1]}`).then((res) => {
            setDataDonVi(res.data.data)
            dataDonVi && setIsLoadingTable(false)
        })
    }, [date])
    useEffect(() => {
        axios
            .get(`${THONG_KE_SO_HOA}?thang=1,${year < yearNow ? 12 : monthNow}&nam=${year}&donvi=${idDonvi}`)
            .then((res) => {
                setDataThongKeTong(res.data.data)
                settenDonVi(res.data.data[0].ten)
            })
    }, [year])

    useEffect(() => {
        if (!isArrayEmpty(dataThongKeTong)) {
            const arrayData = [...dataThongKeTong]
            setThongKeNam(arrayData.shift())
            dataThongKeTong.splice(0, 1)
            const result = userAgent.includes('Mobile')
                ? chunkArray(dataThongKeTong, 1)
                : chunkArray(dataThongKeTong, 2)
            setThongKeThang(result)
        }
    }, [dataThongKeTong])
    const columns: any = [
        {
            title: 'STT',
            align: 'center',
            key: 'key',
            width: '55px',
            render: (value, row, index) => {
                return index + 1
            }
        },
        {
            title: 'Loại kết quả',
            dataIndex: 'tenloaiketqua',
            align: 'left',
            key: 'tenloaiketqua',
            width: '30%'
        },
        {
            title: 'Số lượng số hóa',
            dataIndex: 'tong',
            align: 'center',
            key: 'tong'
        },
        {
            title: 'Liên Thông',
            dataIndex: 'lienthong',
            align: 'center',
            key: 'lienthong'
        },
        {
            title: 'Nhập liệu',
            dataIndex: 'nhaplieu',
            align: 'center',
            key: 'nhaplieu'
        },
        {
            title: 'Từ pm chuyên ngành',
            dataIndex: 'chuyennganh',
            align: 'center',
            key: 'chuyennganh'
        },
        {
            title: 'Import Excel',
            dataIndex: 'importamount',
            align: 'center',
            key: 'importamount'
        }
    ]

    return (
        <div className='donvi-public'>
            <HeaderPublic setPathPublic={setPathPublic} />
            <div className='donvi-public-table'>
                <div className='thongke'>
                    <Card title={`Tình hình số hóa năm của ${tenDonVi} ${yearNow}`} className='thongke_card right'>
                        <ChartThongKe year={year} isMonth={false} element={thongKeNam} />
                    </Card>
                    <Card
                        title={`Tình hình số hóa các tháng của ${tenDonVi} trong năm ${yearNow} `}
                        className='thongke_card left'>
                        <Carousel arrows dots={false} initialSlide={thongKeThang.length - 1}>
                            {!isArrayEmpty(thongKeThang) &&
                                thongKeThang.map((item, index) => {
                                    return (
                                        <div className='chartMonth'>
                                            {item.map((ele, idx) => {
                                                return (
                                                    <div className='chartMonth-item' key={idx}>
                                                        <span className='chartMonth-month'>Tháng {ele.thang}</span>
                                                        <ChartThongKe year={year} isMonth={true} element={ele} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                        </Carousel>
                    </Card>
                </div>
                <div className='baocao-title'>
                    <span id='baocao-title-name'>
                        <div>Tình hình số hóa của đơn vị {tenDonVi}</div>
                        <DatePicker.RangePicker
                            defaultValue={[
                                moment(`01/01/${moment().year()}`, 'DD/MM/YYYY'),
                                moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY')
                            ]}
                            disabledDate={(current) => current && current > moment().endOf('day')}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={(_, dateSelect) => {
                                setDate(!isStringEmpty(date[0]) || !isStringEmpty(date[1]) ? dateSelect : date)
                            }}
                            format='DD/MM/YYYY'
                            locale={locale}
                        />
                    </span>
                </div>

                <Table
                    size='small'
                    locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                    loading={isLoadingTable}
                    columns={columns}
                    pagination={false}
                    bordered
                    dataSource={dataDonVi}
                    summary={(pageData) => {
                        let totalTong = 0
                        let totalLienThong = 0
                        let totalNhaplieu = 0
                        let totalImport = 0
                        let totalChuyennganh = 0
                        pageData.forEach(({ tong, lienthong, importamount, chuyennganh, nhaplieu }) => {
                            totalTong += tong
                            totalLienThong += lienthong
                            totalNhaplieu += nhaplieu
                            totalChuyennganh += chuyennganh
                            totalImport += importamount
                        })

                        return (
                            pageData.length > 0 && (
                                <Table.Summary fixed>
                                    <Table.Summary.Row className='summary_donvi'>
                                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} align='left'>
                                            TỔNG CỘNG
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3} align='center'>
                                            <Text>{totalTong}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} align='center'>
                                            <Text>{totalLienThong}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5} align='center'>
                                            <Text>{totalNhaplieu}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={6} align='center'>
                                            <Text>{totalChuyennganh}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={7} align='center'>
                                            <Text>{totalImport}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )
                        )
                    }}
                />
            </div>
            <div className='footer_donvi'>
                <FooterPublic />
            </div>
            <ScrollToTop />
        </div>
    )
}

export default DonViPublic
