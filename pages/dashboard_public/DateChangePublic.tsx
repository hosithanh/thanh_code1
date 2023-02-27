import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { isStringEmpty } from 'common/utils/empty-util'
import moment from 'moment'
import 'moment/locale/vi'
import { useState } from 'react'

function DateChangePublic() {
    const [date, setDate] = useState<string[] | undefined>([`01/01/${moment().year()}`, moment().format('DD/MM/YYYY')])

    return (
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
    )
}

export default DateChangePublic