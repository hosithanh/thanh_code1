import { Card, Carousel, Row, Select } from 'antd';
import 'assets/css/thongkesohoa.css';
import axios from 'axios';
import { THONG_KE_SO_HOA } from 'common/constant/api-constant';
import { Authorization } from 'common/utils/cookie-util';
import { monthNow, yearNow } from 'common/utils/date-util';
import { userAgent } from 'common/utils/device-util';
import { isArrayEmpty } from 'common/utils/empty-util';
import { chunkArray } from 'common/utils/function-util';
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import BaoCaoThongKePublic from './BaoCaoThongKePublic';
import ChartThongKe from './ChartThongKe';
import FooterPublic from './FooterPublic';
import HeaderPublic from './HeaderPublic';
import LuotSuDungPublic from './LuotSuDungPublic';
import ScrollToTop from './ScrollToTop';
const { Option } = Select



function ThongKeSoHoa({ setPathPublic }) {
    const [date, setDate] = useState<string[] | undefined>([`01/01/${moment().year()}`, moment().format('DD/MM/YYYY')])
    const [year, setYear] = useState<any>(yearNow)
    const [thongKeThang, setThongKeThang] = useState<any>([])
    const [thongKeNam, setThongKeNam] = useState<any>([])
    const [dataThongKeTong, setDataThongKeTong] = useState<any>([])
    const yearsSelect = Array(yearNow - (yearNow - 23))
        .fill('')
        .map((v, idx) => yearNow - idx)
        .sort((a, b) => b - a)

    useEffect(() => {
        axios.get(`${THONG_KE_SO_HOA}?thang=1,${year < yearNow ? 12 : monthNow}&nam=${year}`, Authorization()).then((res) => {
            setDataThongKeTong(res.data.data)
        })
    }, [year])

    useEffect(() => {
        if (!isArrayEmpty(dataThongKeTong)) {
            const arrayData = [...dataThongKeTong]
            setThongKeNam(arrayData.shift())
            dataThongKeTong.splice(0, 1)
            const result = (userAgent.includes('Mobile') ? chunkArray(dataThongKeTong, 1) : chunkArray(dataThongKeTong, 2))
            setThongKeThang(result)
        }
    }, [dataThongKeTong])
    return (
        <>
            <HeaderPublic setPathPublic={setPathPublic} />
            {/* Thong ke so hoa Public */}
            <div className='content-warpper'>
                <div className="thongke">
                    <Card
                        title={`Tình hình số hóa năm ${yearNow}`}
                        className="thongke_card right"
                        extra={
                            <Select
                                onChange={(value) => {
                                    setYear(value)
                                }}
                                defaultValue={year}
                                showSearch
                            >
                                {yearsSelect?.map((item, index) => (
                                    <Option key={index} value={`${item}`}>
                                        {item}
                                    </Option>
                                ))}
                            </Select>
                        }
                    >
                        <ChartThongKe year={year} isMonth={false} element={thongKeNam} />
                    </Card>
                    <Card title="Tình hình số hóa các tháng trong năm 2022 " className='thongke_card left'>
                        <Carousel arrows dots={false} initialSlide={thongKeThang.length - 1}>
                            {
                                !isArrayEmpty(thongKeThang) &&
                                thongKeThang.map((item, index) => {
                                    return (
                                        <div className='chartMonth'>
                                            {
                                                item.map((ele, idx) => {
                                                    return (
                                                        <div className='chartMonth-item' key={idx}>
                                                            <span className='chartMonth-month'>Tháng {ele.thang}</span>
                                                            <ChartThongKe year={year} isMonth={true} element={ele} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                    </Card>
                </div>
                {/* Thong ke bao cao */}
                <div className='baocao'>
                    <div className="baocao-title">
                        <span id="baocao-title-name">Tình hình số hóa {date && `${date[0]} đến ${date[1]}`}</span>
                        {/* <span id="baocao-title-time"> ( Thời điểm tổng hợp số liệu: ngày {`${dateNow}/${monthNow}/${yearNow}`} )</span> */}
                    </div>
                    <Row gutter={16}>
                        <LuotSuDungPublic date={date} setDate={setDate} />
                        <BaoCaoThongKePublic date={date} />
                    </Row>
                </div>
            </div>
            <FooterPublic />
            <ScrollToTop />
        </>
    )
}

export default ThongKeSoHoa