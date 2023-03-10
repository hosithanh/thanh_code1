import { SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, PageHeader, Radio, Row, Select } from 'antd'

import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_CODE_LOWER, REGEX_Number_Negative } from 'common/constant'
import { GET_IDTIENDOSOHOA } from 'common/constant/api-constant'
import { BaocCaoThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Tiendosohoa'
import { Authorization } from 'common/utils/cookie-util'
import 'moment/locale/vi'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCapNhatTienDo, editCapNhatTienDo } from 'store/actions/baocaothongke.actions/capnhattiendosohoa'

export default function ChiTietCapNhatTienDoSoHoa({ idEdit, setidEdit, setIsmodeal }): JSX.Element {
    const now = new Date().getUTCFullYear()
    const [dataDetail, setDataDetail] = useState<any>()
    const [namValue, setNamValue] = useState<any | undefined>(now)
    const [namChange, setnamChange] = useState<any>(namValue)
    const [form] = Form.useForm()

    useEffect(() => {
        axios.get(`${GET_IDTIENDOSOHOA}/${idEdit}`, Authorization()).then((res) => {
            setDataDetail(res.data?.data)
        })
    }, [idEdit])

    // useEffect(() => {
    //     setnamChange(dataDetail.nam)
    // const { nam, quy, darasoat, moibosung } = dataDetail
    // form.setFieldsValue({
    //     nam: namChange,
    //     quy,
    //     darasoat,
    //     moibosung
    // })
    // }, [dataDetail])

    useEffect(() => {
        setnamChange(namValue)
    }, [namValue])

    useEffect(() => {
        if (dataDetail) {
            setNamValue(dataDetail.nam)
            const { nam, quy, darasoat, moibosung, soKQHetHieuLuc } = dataDetail
            form.setFieldsValue({
                nam,
                quy,
                darasoat,
                moibosung,
                soKQHetHieuLuc
            })
        }
    }, [dataDetail])
    const dispatch = useDispatch<any>()
    const onFinish = async (values: BaocCaoThongKeTienDoSoHoa) => {
        idEdit
            ? (dispatch(editCapNhatTienDo(values)) as any).then((res) => {
                  Notification({ status: res.data?.errorCode > 0 ? 'error' : 'success', message: res.data?.message })
                  form.setFieldsValue({})
                  setidEdit(undefined)
                  setIsmodeal(false)
              })
            : (dispatch(addCapNhatTienDo(values)) as any).then((res) => {
                  Notification({ status: res.data?.errorCode > 0 ? 'error' : 'success', message: res.data?.message })
                  form.setFieldsValue({
                      nam: undefined,
                      quy: undefined,
                      darasoat: undefined,
                      moibosung: undefined,
                      soKQHetHieuLuc: undefined
                  })
                  setIsmodeal(false)
              })
    }

    const childrens = [] as any
    const { Option } = Select

    const years = Array(now - (now - 22))
        .fill('')
        .map((v, idx) => now - idx)
        .sort((a, b) => b - a)
    for (let i = 1; i < 13; i++) {
        childrens.push(
            <Option title={`Th??ng ${i}`} value={i} key={i}>
                Tha??ng {i}
            </Option>
        )
    }
    const changeNam = (value) => {
        setNamValue(value)
    }
    return (
        <div className='group-action'>
            {' '}
            <PageHeader
                ghost={false}
                title={idEdit ? 'Ch???nh s???a ti???n ????? s??? h??a' : 'Th??m m???i ti???n ????? s??? h??a'}
                extra={[]}
            />
            <Form onFinish={onFinish} form={form}>
                <Row gutter={24}>
                    <Col span={8} xs={24} sm={24} xl={8}>
                        <Row>
                            <label htmlFor=''> Ch???n n??m:</label>
                        </Row>
                        <Form.Item
                            rules={[{ required: true, message: 'Vui l??ng kh??ng ???????c ????? tr???ng!' }]}
                            name='nam'
                            // style={{ marginRight: '8px' }}
                        >
                            <Select
                                size='middle'
                                // onChange={(_, value) => {
                                //     setNamValue(value as any)
                                // }}
                                onChange={(value) => {
                                    changeNam(value)
                                }}
                                disabled={idEdit ? true : false}
                                allowClear
                                placeholder='----Cho??n n??m----'
                                showSearch
                                style={{ width: '100%', height: '30px', textAlign: 'left' }}>
                                {years?.map((item, index) => (
                                    <Select.Option key={index} value={`${item}`}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8} xs={24} sm={24} xl={8}>
                        <Row>
                            <label htmlFor=''>
                                <span style={{ float: 'left' }}>M???i b??? sung</span>
                            </label>
                        </Row>
                        <Form.Item
                            name='moibosung'
                            //  rules={[{ required: true, message: 'Vui l??ng kh??ng ????? tr???ng!' }]}

                            rules={[
                                { required: true, message: 'Vui l??ng nh???p m?? h??? th???ng!' },
                                {
                                    pattern: REGEX_CODE_LOWER,
                                    message: 'Vui l??ng kh??ng nh???p s??? ??m v?? k?? t??? ?????c bi???t!'
                                },
                                {
                                    pattern: REGEX_Number_Negative,
                                    message: 'Vui l??ng kh??ng nh???p ch???!'
                                }
                            ]}>
                            {/* <InputNumber min='0' style={{ width: '100%', height: '33px' }} /> */}
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} xl={8}>
                        <Row>
                            <label htmlFor=''>
                                <span style={{ float: 'left' }}>S??? k???t qu??? h???t hi???u l???c:</span>
                            </label>
                        </Row>
                        <Form.Item
                            name='soKQHetHieuLuc'
                            //  rules={[{ required: true, message: 'Vui l??ng kh??ng ????? tr???ng!' }]}
                            rules={[
                                { required: true, message: 'Vui l??ng nh???p m?? h??? th???ng!' },
                                {
                                    pattern: REGEX_CODE_LOWER,
                                    message: 'Vui l??ng kh??ng nh???p s??? ??m v?? k?? t??? ?????c bi???t!'
                                },
                                {
                                    pattern: REGEX_Number_Negative,
                                    message: 'Vui l??ng kh??ng nh???p ch???!'
                                }
                            ]}>
                            {/* <InputNumber min='0' style={{ width: '100%', height: '33px' }} /> */}
                            <Input></Input>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24} xs={24} sm={24} xl={24} style={{ top: '-4px ' }}>
                        <Row>
                            <label htmlFor=''>Ch???n qu??</label>
                        </Row>
                        <div className='radio--quy'>
                            <Form.Item
                                name='quy'
                                rules={[{ required: true, message: 'Vui l??ng kh??ng ???????c ????? tr???ng!' }]}>
                                <Radio.Group style={{ padding: '0 10px' }} disabled={idEdit ? true : false}>
                                    <Radio style={{ padding: '0 22px 0 0 ' }} value={1}>
                                        Qu?? I (15/12{namChange ? namChange - 1 : ''} - 14/03
                                        {namChange ? `${'/'}` + namChange : ''})
                                    </Radio>
                                    <Radio style={{ padding: '0 25px 0 0' }} value={2}>
                                        Qu?? II (15/03{namChange ? `${'/'}` + namChange : ''} - 14/06
                                        {namChange ? `${'/'}` + namChange : ''})
                                    </Radio>
                                    <Radio style={{ padding: '0 10px 0 0' }} value={3}>
                                        Qu?? III (15/06{namChange ? `${'/'}` + namChange : ''}- 14/09
                                        {namChange ? `${'/'}` + namChange : ''})
                                    </Radio>
                                    <Radio style={{ padding: '0 10px 0 0' }} value={4}>
                                        Qu?? IV (15/9{namChange ? `${'/'}` + namChange : ''} - 14/12
                                        {namChange ? `${'/'}` + namChange : ''})
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
                <Button type='primary' htmlType='submit' className='btn-submit'>
                    <SaveOutlined /> L??u
                </Button>
            </Form>
        </div>
    )
}
