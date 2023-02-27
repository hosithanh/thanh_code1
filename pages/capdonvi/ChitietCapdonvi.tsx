/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, Form, Input, PageHeader, Select } from "antd"
import axios from "axios"
import { Notification } from 'common/component/notification'
import { REGEX_Expression } from "common/constant"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router"
import { CAPDONVI_LIST_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { CapDonVi } from '../../common/interface/CapDonVi'
import { Authorization } from '../../common/utils/cookie-util'
import { addCapdonvi, editCapdonvi } from '../../store/actions/capdonvi.action'


export default function ChitietDonvi(): JSX.Element {
    const history = useHistory()
    const [capdonviDetail, setcapdonviDetail] = useState<CapDonVi | undefined>()
    const [capDonviListParent, setcapDonviListParent] = useState<CapDonVi[] | undefined>()
    const [capDonvi, setcapDonvi] = useState<CapDonVi[] | undefined>()

    if (capDonviListParent && capDonviListParent[0]?.id !== 0)
        capDonviListParent?.unshift({
            id: 0,
            ten: "-------------- Chọn cấp đơn vị cha ---------------"
        })

    const pathname = window.location.pathname.split("/").pop()
    const isAdd = pathname === "add"
    const isEdit = window.location.search === "?edit=true"
    const title = {
        add: "Thêm cấp đơn vị ",
        detail: "Thông tin cấp đơn vị ",
        edit: "Chỉnh sửa cấp đơn vị "
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${CAPDONVI_LIST_URL}/${pathname}`, Authorization()).then(res => {
            setcapdonviDetail(res.data.result)
        })
    }, [])

    useEffect(() => {
        axios.get(`${CAPDONVI_LIST_URL}`, Authorization()).then(res => {
            setcapDonviListParent(res.data.result)
        })
    }, [])

    useEffect(() => {
        axios.get(`${CAPDONVI_LIST_URL}`, Authorization()).then(res => {
            setcapDonvi(res.data.result)
        })
    }, [])

    useEffect(() => {
        if (capdonviDetail && capdonviDetail !== undefined && capDonvi !== undefined) {
            const { id, ten, ma } = capdonviDetail
            const parrentId = capDonvi?.find(item => item.id === capdonviDetail.parrentId)?.id
            form.setFieldsValue({
                id,
                ten,
                ma,
                parrentId: parrentId
            })
        }
    }, [form, capdonviDetail, capDonvi, capDonviListParent])

    const onFinish = (values: CapDonVi) => {
        if (!values.parrentId) {
            values.parrentId = 0
        }
        isEdit
            ? (dispatch(editCapdonvi(values)) as any)
                  .then(res => {
                      history.push(`/${MenuPaths.capdonvi}`)
                      Notification({
                          status: res.data.errorCode > 0 ? "error" : "success",
                          message: res.data.msg
                      })
                  })
                  .catch(() => {
                      Notification({ status: "error", message: errorMessage })
                  })
            : (dispatch(addCapdonvi(values)) as any)
                  .then(res => {
                      history.push(`/${MenuPaths.capdonvi}`)
                      Notification({
                          status: res.data.errorCode > 0 ? "error" : "success",
                          message: res.data.message
                      })
                  })
                  .catch(() => {
                      Notification({ status: "error", message: errorMessage })
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

                <Form.Item name='id' hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    name='ten'
                    label='Tên cấp đơn vị '
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên cấp đơn vị !'
                        }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ma'
                    label='Mã cấp đơn vị '
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã cấp đơn vị !'
                        },
                        { pattern: REGEX_Expression, message: 'Biểu thức không hợp lệ!' }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item name='parrentId' label=' Cấp đơn vị cha'>
                    <Select>
                        {capDonviListParent?.map((item, index) => (
                            <Select.Option key={index} value={item.id as number}>
                                {item.ten}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}
