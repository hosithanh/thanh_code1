/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Empty, Switch, Table } from 'antd'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { DYNAMIC_URL } from 'common/constant/api-constant'
import { Quyen } from 'common/interface/Quyen'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { errorMessage } from '../../../common/constant/app-constant'

export default function PhanquyenDoituong(): JSX.Element {
    const history = useHistory()
    const [data, setData] = useState<Quyen[] | undefined>()
    const maDoiTuong = window.location.search.split('=').pop()

    useEffect(() => {
        axios.get(`${DYNAMIC_URL}/doituong/quyen/${maDoiTuong}`, Authorization()).then((res) => {
            setData(res.data.data)
        })
    }, [])

    const columns: any = [
        { title: 'STT', key: 'stt', align: 'center', width: '70px', render: (value, _, index) => index + 1 },
        { title: 'Mã nhóm', dataIndex: 'group_code', key: 'group_code' },
        { title: 'Tên nhóm', dataIndex: 'namecode', key: 'namecode' },
        {
            title: 'Phân quyền',
            key: 'permission',
            align: 'center',
            render: (record: Quyen) => {
                const [readChecked, setReadChecked] = useState<boolean>(Boolean(Number(record.quyendoc)))
                const [writeChecked, setWriteChecked] = useState<boolean>(Boolean(Number(record.quyenghi)))
                const onClick = (checked, maNhom: string, isRead?: boolean) => {
                    showConfirm({
                        title: 'Bạn có chắc chắn thay đổi quyền?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Hủy',
                        maskClosable: true,
                        onOk: (): void => {
                            const check = isRead ? { read: checked } : { write: checked }
                            const value = { maNhom, ...check }
                            axios
                                .post(`${DYNAMIC_URL}/doituong/${maDoiTuong}`, value, Authorization())
                                .then((res) => {
                                    if (res.data.data.status) {
                                        isRead ? setReadChecked(!readChecked) : setWriteChecked(!writeChecked)
                                    }
                                    Notification({
                                        status: `${res.data.data.status ? 'success' : 'warning'}`,
                                        message: res.data.data.msg
                                    })
                                })
                                .catch((err) => {
                                    Notification({ status: 'error', message: err?.data?.msg ?? errorMessage })
                                })
                        }
                    })
                }
                return (
                    <>
                        <Switch
                            className='switch-rule'
                            checked={readChecked}
                            checkedChildren='Đọc'
                            unCheckedChildren='Đọc'
                            onClick={(checked) => onClick(checked, record.group_code, true)}
                        />
                        <Switch
                            className='switch-rule'
                            checked={writeChecked}
                            checkedChildren='Ghi'
                            unCheckedChildren='Ghi'
                            onClick={(checked) => onClick(checked, record.group_code)}
                        />
                    </>
                )
            }
        }
    ]

    return (
        <div className='custom-form'>
            {/* <div className='group-btn-detail'>
                <Button style={{ marginRight: 0 }} icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                    Quay lại
                </Button>
            </div> */}
            <Table
                size='small'
                rowKey='groupCode'
                columns={columns}
                dataSource={data as any}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
        </div>
    )
}
