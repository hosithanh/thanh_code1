/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, PageHeader, Row } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_Expression } from 'common/constant'
import { CHUYENNGANH_LIST_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Chuyennganh } from 'common/interface/Chuyennganh'
import { Authorization } from 'common/utils/cookie-util'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { addChuyennganh, editChuyennganh } from 'store/actions/chuyennganh.action'
export default function Chitietchuyenganh() {
    const [chuyennganhDetail, setChuyennganhDetail] = useState<Chuyennganh | undefined>()
    const history = useHistory()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm mới cấp chuyên ngành',
        edit: 'Chỉnh sửa chuyên ngành '
    }

    useEffect(() => {
        axios.get(`${CHUYENNGANH_LIST_URL}/${pathname}`, Authorization()).then((res) => {
            setChuyennganhDetail(res.data.result)
        })
    }, [])

    useEffect(() => {
        if (chuyennganhDetail) {
            const {
                id,
                appCode,
                maDoiTuong,
                maGiayTo,
                columnData,
                keyMapSoGiayPhep,
                keyMapNgayCapPhep,
                tableChuyenNganh,
                sapXep
            } = chuyennganhDetail
            form.setFieldsValue({
                id,
                appCode,
                maDoiTuong,
                maGiayTo,
                columnData,
                keyMapSoGiayPhep,
                keyMapNgayCapPhep,
                tableChuyenNganh,
                sapXep
            })
        }
    }, [chuyennganhDetail])

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const onFinish = (values: Chuyennganh) => {
        isAdd
            ? (dispatch(addChuyennganh(values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.quanlychuyennganh}`)
                      Notification({
                          status: res.data.errorCode > 0 ? 'error' : 'success',
                          message: res.data.msg
                      })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
            : (dispatch(editChuyennganh(values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.quanlychuyennganh}`)
                      Notification({
                          status: res.data.status === true ? 'success' : 'error',
                          message: res.data.msg
                      })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
    }

    return (
        <div className='user-detail'>
            <PageHeader title={isAdd ? title.add : title.edit} style={{ padding: '0 0 16px 0' }} />
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
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                    </div>
                )}

                <Form.Item name='id' style={{ height: '0.5px' }}>
                    <Input hidden style={{ height: '0.5px' }} />
                </Form.Item>

                <Row gutter={10}>
                    <Col span={11}>
                        <Form.Item
                            name='appCode'
                            // style={{ textAlign: 'center' }}
                            label='Appcode'
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập appcode !'
                                }
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name='maDoiTuong'
                            label='Mã đối tượng '
                            // style={{ textAlign: 'center' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã đối tượng !'
                                },
                                { pattern: REGEX_Expression, message: 'Biểu thức không hợp lệ!' }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            // style={{ textAlign: 'center' }}
                            name='maGiayTo'
                            label='Mã giấy tờ '
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã giấy tờ !'
                                }
                            ]}>
                            {/* <InputNumber
                        min={1}
                        max={10}
                        defaultValue={3}
                        //  onChange={onChange}
                    /> */}
                            <Input />
                        </Form.Item>

                        <Form.Item name='columnData' label='ColumnData '>
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={12}>
                        <Form.Item name='keyMapSoGiayPhep' label='Mapping field số giấy phép '>
                            <Input style={{ width: '98%' }} />
                        </Form.Item>
                        <Form.Item name='keyMapNgayCapPhep' label='Mapping field ngày cấp phép '>
                            <Input style={{ width: '98%' }} />
                        </Form.Item>
                        <Form.Item style={{}} name='tableChuyenNganh' label='Table chuyen ngành '>
                            <Input style={{ width: '98%' }} />
                        </Form.Item>
                        <Form.Item name='sapXep' label='Sắp xếp'>
                            <InputNumber style={{ width: '98%', height: '35px' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
