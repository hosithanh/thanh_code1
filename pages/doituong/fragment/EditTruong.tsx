/* eslint-disable react-hooks/exhaustive-deps */
import { SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, PageHeader, Row, Select, Tooltip } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_CODE_LOWER } from 'common/constant'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { editDanhsachtruong, getDanhsachtruong } from 'store/actions/danhsachtruong.action'
import '../../../assets/css/chitiettruong.css'
import { DYNAMIC_URL, KHOTRUONGDULIEU_LIST_URL } from '../../../common/constant/api-constant'
import { dataTypeField, errorMessage } from '../../../common/constant/app-constant'
import { TruongDuLieu } from '../../../common/interface/TruongDuLieu'
import { Authorization } from '../../../common/utils/cookie-util'

export default function EditTruong({
    isModalEditDS,
    setIsModalVisibleDSEdit,
    setIsFetchTruongDSEdit,
    idTruong
}): JSX.Element {
    // const history = useHistory()
    const [form] = Form.useForm()
    const dispatch = useDispatch<any>()
    const [fieldDetail, setFieldDetail] = useState<TruongDuLieu | undefined>()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [dataModal, setDataModal] = useState<any>()
    const [isString, setIsString] = useState<boolean | undefined>()
    const [isInteger, setIsInteger] = useState<boolean | undefined>()
    const [isList, setIsList] = useState<boolean | undefined>()
    const [isKBBS, setIsKBBS] = useState<boolean>(true)
    const khoRef = useRef<any>(null)

    const [matruongdulieu, setMatruongdulieu] = useState<string>()
    useEffect(() => {
        axios.get(`${DYNAMIC_URL}/truong/${idTruong}`, Authorization()).then((res) => setFieldDetail(res.data.data))
    }, [idTruong])

    useEffect(() => {
        axios.get(KHOTRUONGDULIEU_LIST_URL, Authorization()).then((res) => {
            setDataModal(res.data.data.items)
        })
    }, [])

    useEffect(() => {
        fieldDetail && form.setFieldsValue(fieldDetail)
        setIsString(fieldDetail ? fieldDetail?.kieuDuLieu === 'STRING' : form.getFieldValue('kieuDuLieu') === 'STRING')
        setIsInteger(fieldDetail ? fieldDetail?.kieuDuLieu === 'INT' : form.getFieldValue('kieuDuLieu') === 'INT')
        setIsList(fieldDetail ? fieldDetail?.isDanhSach === 1 : form.getFieldValue('isDanhSach') === 1)
        setIsKBBS(fieldDetail ? fieldDetail?.nguonDanhSach === 1 : form.getFieldValue('nguonDanhSach') === 1)
    }, [form, fieldDetail])

    const onFinish = (values: TruongDuLieu) => {
        if (fieldDetail) {
            values.id = fieldDetail?.id as number
            values.maDoiTuong = fieldDetail?.maDoiTuong
            var maDT = fieldDetail?.maDoiTuong
            dispatch(editDanhsachtruong(fieldDetail?.id, values))
                .then((res) => {
                    dispatch(getDanhsachtruong({ maDoiTuong: maDT }))
                    setIsModalVisibleDSEdit(false)
                    setIsFetchTruongDSEdit(true)
                    form.resetFields()
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })

        }
    }

    const RuleValidate = (): JSX.Element => (
        <div>
            <p>
                Đối với kiểu dữ liệu là kiểu số nguyên và số thực thì validate số nhỏ nhất với key là "min" và số lớn
                nhất với key là "max"
            </p>
            <p>Vui lòng nhập kịch bản validate theo mẫu dưới dạng JSON như sau:</p>
            <p>
                {JSON.stringify({
                    min: 10,
                    max: 100
                })}
            </p>
        </div>
    )
    // useEffect(() => {
    //     if (matruongdulieu) {
    //         form.setFieldsValue({
    //             ma: removeSpecialCharacters(nonAccentVietnamese(matruongdulieu).split(' ').join(''))
    //         })
    //     }
    // }, [matruongdulieu])
    return (
        <div className='result-detail'>
            <PageHeader title={`${fieldDetail?.moTa} - Chỉnh sửa`} style={{ padding: '0 0 16px 0' }} />
            <Modal
                title='Kho trường dữ liệu'
                visible={isModalVisible}
                onOk={(): void => {
                    form.setFieldsValue({ ma: khoRef.current?.split('~')[0], moTa: khoRef.current?.split('~')[1] })
                    setIsModalVisible(false)
                }}
                onCancel={(): void => setIsModalVisible(false)}>
                <Select
                    style={{ width: '100%' }}
                    showSearch
                    onChange={(e: any) => {
                        khoRef.current = e
                    }}>
                    {dataModal?.map((item, index) => (
                        <Select.Option value={`${item.ma}~${item.mota}`} index={index}>
                            {item.ma} - {item.mota}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
            <Form form={form} onFinish={onFinish} initialValues={fieldDetail} className='custom-form'>
                <div className='group-btn-detail'>
                    <Button type='primary' onClick={() => setIsModalVisible(true)}>
                        Chọn từ kho
                    </Button>
                    <Button type='primary' htmlType='submit' className='btn-submit'>
                        <SaveOutlined /> Lưu
                    </Button>
                </div>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name='moTa'
                            label='Tên trường'
                            rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
                            <Input onChange={(e) => setMatruongdulieu(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='ma'
                            label='Mã trường dữ liệu'
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã trường dữ liệu!' },
                                {
                                    pattern: REGEX_CODE_LOWER,
                                    message:
                                        'Mã trường dữ liệu không được viết hoa, không được có ký tự đặc biệt, không có khoảng cách!'
                                }
                            ]}>
                            <Input disabled={true} defaultValue={matruongdulieu} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12} className='selectkieudulieu'>
                        <Form.Item
                            name='kieuDuLieu'
                            label='Kiểu dữ liệu'
                            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}>
                            <Select
                                onChange={(type) => {
                                    setIsString(type === 'STRING')
                                    setIsInteger(type === 'INT')
                                }}
                                disabled={isList}>
                                {dataTypeField.map((item, index) => (
                                    <Select.Option key={index} value={Object.keys(item)[0]}>
                                        {Object.values(item)[0]}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {isString && !isList && (
                            <Form.Item name='doDai' label='Độ dài'>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        )}
                    </Col>
                </Row>
                {(!isNullOrUndefined(fieldDetail?.isDanhSach) || !isNullOrUndefined(fieldDetail?.isTextArea)) && (
                    <>
                        {isString && (
                            <Form.Item name='isTextArea' label='Nhập mở rộng (textarea)'>
                                <Checkbox
                                    defaultChecked={!!fieldDetail?.isTextArea}
                                    onChange={(value) =>
                                        form.setFieldsValue({ isTextArea: Number(value.target.checked) })
                                    }
                                />
                            </Form.Item>
                        )}
                        {isInteger && (
                            <Form.Item name='isDanhSach' label='Kiểu danh sách'>
                                <Checkbox
                                    defaultChecked={!!fieldDetail?.isDanhSach}
                                    onChange={(e) => {
                                        setIsList(e.target.checked)
                                        e.target.checked && form.setFieldsValue({ kieuDuLieu: 'INT' })
                                        form.setFieldsValue({ isDanhSach: Number(e.target.checked) })
                                    }}
                                />
                            </Form.Item>
                        )}
                    </>
                )}

                {isList && (
                    <Form.Item name='nguonDanhSach' label='Nguồn dữ liệu danh sách'>
                        <Select onChange={(type) => setIsKBBS(type === 1)}>
                            <Select.Option value={1}>Kịch bản bổ sung</Select.Option>
                            <Select.Option value={2}>Dữ liệu API</Select.Option>
                        </Select>
                    </Form.Item>
                )}
                {isList &&
                    (isKBBS ? (
                        <Fragment>
                            <div style={{ minHeight: 32, marginLeft: 170 }}>
                                <span style={{ color: '#ff4d4f' }}>Lưu ý: </span>
                                <span>
                                    Bạn vui lòng cấu hình Key danh sách đúng với kiểu dữ liệu sẽ lưu cho trường dữ liệu
                                </span>
                            </div>
                            <Form.Item
                                name='boSung'
                                label='Kịch bản bổ sung'
                                rules={[{ required: isList, message: 'Vui lòng nhập kịch bản bổ sung!' }]}>
                                <Input.TextArea rows={5} />
                            </Form.Item>
                        </Fragment>
                    ) : (
                        <Form.Item
                            name='linkApi'
                            label='Đường dẫn API'
                            rules={[{ required: isList, message: 'Vui lòng nhập đường dẫn API!' }]}>
                            <Input />
                        </Form.Item>
                    ))}
                <>
                    <Row>
                        <Col flex='100px'>
                            <Form.Item label='Trạng thái:'></Form.Item>
                        </Col>
                        <Col flex='90px'>
                            {!isNullOrUndefined(fieldDetail?.batBuoc) && (
                                <Form.Item name='batBuoc'>
                                    <Checkbox
                                        defaultChecked={!!fieldDetail?.batBuoc}
                                        onChange={(value) =>
                                            form.setFieldsValue({ batBuoc: Number(value.target.checked) })
                                        }>
                                        Bắt buộc
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>
                        <Col flex='170px'>
                            {!isNullOrUndefined(fieldDetail?.toanVan) && (
                                <Form.Item name='toanVan'>
                                    <Checkbox
                                        defaultChecked={!!fieldDetail?.toanVan}
                                        onChange={(value) =>
                                            form.setFieldsValue({ toanVan: Number(value.target.checked) })
                                        }>
                                        Tìm kiếm toàn văn
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>
                        <Col flex='100px'>
                            {!isNullOrUndefined(fieldDetail?.kichHoat) && (
                                <Form.Item name='kichHoat'>
                                    <Checkbox
                                        defaultChecked={!!fieldDetail?.kichHoat || true}
                                        onChange={(value) =>
                                            form.setFieldsValue({ kichHoat: Number(value.target.checked) })
                                        }>
                                        Kích hoạt
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                </>
                <Form.Item name='sapXep' label='Sắp xếp'>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='validate' label='Kịch bản validate'>
                    <Tooltip placement='topLeft' title={RuleValidate}>
                        <div
                            style={{
                                minHeight: 32,
                                lineHeight: '32px',
                                color: '#1890ff',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}>
                            Quy tắc kịch bản validate
                        </div>
                    </Tooltip>
                    <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item name='ghiChu' label='Ghi chú'>
                    <Input.TextArea rows={7} />
                </Form.Item>
            </Form>
        </div>
    )
}
