import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, PageHeader, Row, Select } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DONVI_LIST_URL, PHONGBAN_ID_URL } from 'common/constant/api-constant'
import { UserGroup } from 'common/interface/UserGroup'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addPhongban, editPhongban, getPhongban } from 'store/actions/phongban.action'

export default function Chitietphongban() {
    const history = useHistory()
    const pathname = window.location.pathname.split('/').pop()
    const [tendonvi, settendonvi] = useState<string | undefined>()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm phòng ban',
        detail: 'Thông tin đơn vị ',
        edit: 'Chỉnh sửa phòng ban '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch<any>()
    const [listDonvi, setListDonvi] = useState<UserGroup[] | undefined>()
    const [phongbanDetail, setphongbanDetail] = useState<any>()

    useEffect(() => {
        axios.get(`${DONVI_LIST_URL}/all`, Authorization()).then((res) => {
            setListDonvi(res.data.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`${PHONGBAN_ID_URL}/?phongBanId=${pathname}`, Authorization()).then((res) => {
            setphongbanDetail(res.data.result)
        })
    }, [pathname])

    useEffect(() => {
        if (phongbanDetail) {
            const { kyHieu, maCoQuan, tenPhongBan, maPhongBan } = phongbanDetail
            form.setFieldsValue({
                kyHieu: kyHieu,
                maCoQuan: maCoQuan,
                tenPhongBan: tenPhongBan,
                maPhongBan: maPhongBan
            })
        }
    }, [phongbanDetail])

    const onFinish = (value) => {
        const { kyHieu, maCoQuan, maPhongBan, tenPhongBan } = value
        const data = {
            kyHieu: kyHieu,
            maCoQuan: maCoQuan,
            maPhongBan: maPhongBan,
            tenPhongBan: tenPhongBan
        }
        const dataedit = {
            kyHieu: kyHieu,
            maCoQuan: maCoQuan,
            maPhongBan: maPhongBan,
            tenPhongBan: tenPhongBan,
            id: pathname
        }
        isAdd
            ? dispatch(addPhongban(data)).then((res) => {
                  if (res.data.status) {
                      history.push('/quanlyphongban')
                      dispatch(getPhongban({}))
                  }

                  const status = res.data.status ? 'success' : 'error'
                  Notification({ status: status, message: res.data.message })
              })
            : dispatch(editPhongban(dataedit)).then((res) => {
                  if (res.data.status) {
                      history.push('/quanlyphongban')
                      dispatch(getPhongban({}))
                  }
                  const status = res.data.status ? 'success' : 'error'
                  Notification({ status: status, message: res.data.msg })
              })
    }

    return (
        <div className='user-detail'>
            <PageHeader
                title={isAdd ? title.add : isEdit ? title.edit : title.detail}
                style={{ padding: '0 0 16px 0' }}
            />

            <Form onFinish={onFinish} className='custom-form' form={form}>
                {isEdit ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                ) : isAdd ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            {' '}
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                ) : (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            {' '}
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                    </div>
                )}
                <Row gutter={24}>
                    <Col span={12}>
                        {' '}
                        <Form.Item name='kyHieu' label='Ký Hiệu'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <Form.Item
                            name='maCoQuan'
                            label='Tên cơ quan'
                            rules={[{ required: true, message: 'Vui lòng chọn cơ quan!' }]}>
                            <Select showSearch placeholder='---chọn tên cơ quan ---'>
                                {listDonvi?.map((item, index) => (
                                    <Select.Option key={index} value={item.ma}>
                                        {item.ten}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='maPhongBan'
                            label='Mã phòng ban'
                            rules={[{ required: true, message: 'Vui lòng nhập mã phòng ban!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {' '}
                        <Form.Item
                            name='tenPhongBan'
                            label='Tên phòng ban'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên phòng ban!'
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
