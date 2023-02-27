/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { LOAIGIAYTO_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { FETCH_LOAIGIAYTO } from 'store/actions'
import { addLoaigiayto, editLoaigiayto } from 'store/actions/danhmuc.actions/loaigiayto.action'
import { AppState } from 'store/interface'

export default function ChitietLoaigiayto(): JSX.Element {
    const LoaigiaytoList = useSelector<AppState, Loaigiayto[] | undefined>((state) => state.loaigiayto.loaigiaytoList)
    const history = useHistory()
    const [LoaigiaytoDetail, setLoaigiaytoDetail] = useState<Loaigiayto | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm Loại Giấy Tờ ',
        detail: 'Thông tin Loại Giấy Tờ ',
        edit: 'Chỉnh sửa Loại Giấy Tờ '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${LOAIGIAYTO_URL}/${pathname}`, Authorization()).then((res) => {
            setLoaigiaytoDetail(res.data.result)
        })
    }, [])
    useEffect(() => {
        !LoaigiaytoList &&
            axios.get(LOAIGIAYTO_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_LOAIGIAYTO, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (LoaigiaytoDetail) {
            const { id, matthc, maGiayTo, tenGiayTo, tenTTHC, tenTep, url } = LoaigiaytoDetail
            form.setFieldsValue({ id, matthc, maGiayTo, tenGiayTo, tenTTHC, tenTep, url })
        }
    }, [form, LoaigiaytoDetail])

    const onFinish = (values: Loaigiayto) => {
        isEdit
            ? (dispatch(editLoaigiayto(values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.loaigiayto}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
            : (dispatch(addLoaigiayto(values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.loaigiayto}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
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
                    name='matthc'
                    label='Mã thủ tục '
                    rules={[{ required: true, message: 'Vui lòng nhập mã thủ tục!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='maGiayTo'
                    label='Mã giấy tờ '
                    rules={[{ required: true, message: 'Vui lòng nhập mã giấy tờ!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='tenGiayTo'
                    label='Tên giấy tờ '
                    rules={[{ required: true, message: 'Vui lòng nhập tên giấy tờ!' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name='tenTTHC'
                    label='Tên thủ tục'
                    rules={[{ required: true, message: 'Vui lòng nhập tên thủ tục hành chính!' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name='tenTep' label='Tên tệp '>
                    <Input />
                </Form.Item>
                <Form.Item name='url' label='Đường dẫn'>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
