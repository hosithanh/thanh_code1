import { notification } from 'antd'
import { IconType } from 'antd/lib/notification'

interface Props {
    status: IconType
    message?: string
    description?: string
    duration?: number
}

export function Notification({ status, message, description, duration = 2 }: Props): void {
    return notification[status]({ message, description, duration })
}
