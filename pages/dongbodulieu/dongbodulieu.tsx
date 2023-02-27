import { CloudSyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Empty, Spin, Table } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import { useState } from 'react'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import {
    DONGBODULIEU_URL,
    DONGBODULIEU_COLUMN_URL,
    DONGBODULIEU_COLUMN_9318_URL,
    DONGBODULIEU_ISHOANTHANH_URL
} from '../../common/constant/api-constant'
import { XToken } from '../../common/utils/cookie-util'
export default function Dongbodulieu(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const donbodulieu = (url, method) => {
        setIsLoading(true)
        var values = {}
        axios
            .request({ url: `${url}`, method: method, headers: { Authorization: XToken } })
            .then((res) => {
                setIsLoading(false)
                Notification({ status: 'success', message: 'Đồng bộ dữ liệu thành công' })
            })
            .catch(() => {
                setIsLoading(false)
                Notification({ status: 'error', message: 'Máy chủ gặp sự cố vui lòng thử lại sau!' })
            })
    }

    const columns: any = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => index + 1
        },
        {
            title: 'Loại đồng bộ',
            dataIndex: 'loaidongbo',
            key: 'loaidongbo'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (record) => {
                console.log(record)
                const handledonbodulieu = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn đồng bộ dữ liệu này?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            donbodulieu(record.action.URL, record.action.METHOD)
                        }
                    })
                }
                return (
                    <Button type='primary' icon={<CloudSyncOutlined />} onClick={() => handledonbodulieu()}>
                        Thực hiện
                    </Button>
                )
            }
        }
    ]

    let dataSource = [
        {
            loaidongbo: 'Đồng bộ dữ liệu ELASTICSEACRCH',
            action: { URL: DONGBODULIEU_URL, METHOD: 'POST' }
        },
        {
            loaidongbo: 'Đồng bộ Column POSTGRES',
            action: { URL: DONGBODULIEU_COLUMN_URL, METHOD: 'GET' }
        },
        ,
        {
            loaidongbo: 'Đồng bộ Column 9318',
            action: { URL: DONGBODULIEU_COLUMN_9318_URL, METHOD: 'GET' }
        },
        ,
        {
            loaidongbo: 'Đồng bộ ISHOANTHANH',
            action: { URL: DONGBODULIEU_ISHOANTHANH_URL, METHOD: 'POST' }
        }
    ]
    return (
        <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_bieumau' spinning={isLoading}>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
            />
        </Spin>
    )
}
