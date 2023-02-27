import { Pie } from '@ant-design/charts'
import { userAgent } from 'common/utils/device-util'

interface Props {
    isMonth?: boolean
    year?: number
    element?: any
}
function ChartThongKe({ isMonth, element }: Props): JSX.Element {
    const data = [
        {
            type: 'Nhập liệu :',
            value: element?.nhaplieu
        },
        {
            type: 'Import :',
            value: element?.importamount
        },
        {
            type: 'Liên thông :',
            value: element?.lienthong
        },
        {
            type: 'Chuyên ngành :',
            // value: 1000000
            value: element?.chuyennganh
        }
    ]
    const config = {
        appendPadding: 10,
        with: isMonth ? 200 : 400,
        height: 400,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: !isMonth ? '{name} {percentage}' : '{percentage}'
        },
        theme: {
            colors10: ['#FF6B3B', '#9FB40F', '#FFC100', '#247FEA']
        },
        interactions: [
            {
                type: 'pie-legend-active'
            },
            {
                type: 'element-active'
            }
        ],
        legend: {
            layout: isMonth ? 'vertical' : (userAgent.includes('Mobile') ? 'vertical' : 'horizontal'),
            angleField: 'value',
            colorField: 'type',
            position: 'bottom',
            itemValue: {
                formatter: (text, item) => {
                    const items = data.filter((d) => d.type === item.value)
                    return items.length ? items.reduce((a, b) => a + b.value, 0) / items.length : '-'
                },
                style: {
                    opacity: 0.65
                }
            }
        }
    }

    return <Pie {...(config as any)} />
}

export default ChartThongKe
