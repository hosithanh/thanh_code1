import { CaretRightOutlined } from '@ant-design/icons'
import { Col, DatePicker, Empty, List } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import axios from 'axios'
import { LUOTSUDUNG_URL_PUBLIC } from 'common/constant/api-constant'
import { isStringEmpty } from 'common/utils/empty-util'
import moment from 'moment'
import 'moment/locale/vi'
import { useEffect, useRef, useState } from 'react'

interface Thongke {
    title?: string
    count?: number
    thang?: number
}

function LuotSuDungPublic({ date, setDate }) {
    const [isLoading, setIsLoading] = useState(true)
    const [luotSuDung, setLuotSuDung] = useState<Thongke[] | undefined>()
    const listRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        axios.get(`${LUOTSUDUNG_URL_PUBLIC}${date ? `?from=${date[0]}&to=${date[1]}` : ''}`).then((res) => {
            setLuotSuDung(res.data.data)
            setIsLoading(false)
        })
    }, [date])
    return (
        <Col span={24} xl={8}>
            <div className='luotsudung'>
                <div>
                    <div className='luotsudung-date'>
                        <DatePicker.RangePicker
                            defaultValue={[
                                moment(`01/01/${moment().year()}`, 'DD/MM/YYYY'),
                                moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY')
                            ]}
                            disabledDate={(current) => current && current > moment().endOf('day')}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={(_, date) => {
                                setIsLoading(true)
                                setDate(!isStringEmpty(date[0]) || !isStringEmpty(date[1]) ? date : undefined)
                            }}
                            format='DD/MM/YYYY'
                            locale={locale}
                        />
                    </div>
                    <div className='luotsudung-list' ref={listRef}>
                        <List
                            loading={isLoading}
                            size='large'
                            dataSource={luotSuDung}
                            locale={{
                                emptyText: <Empty description='Không có dữ liệu' />
                            }}
                            renderItem={(item: any, index) => (
                                <List.Item key={index}>
                                    <List.Item.Meta avatar={<CaretRightOutlined />} title={item.ten} />
                                    <div className='count-result'>{item.count}</div>
                                </List.Item>
                            )}></List>
                    </div>
                </div>
            </div>
        </Col>
    )
}

export default LuotSuDungPublic
