/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { TONGIAO_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Tongiao } from 'common/interface/Danhmuc.interfaces/Tongiao'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { FETCH_TONGIAO } from 'store/actions'
import { addTongiao, editTongiao } from 'store/actions/danhmuc.actions/tongiao.action'
import { AppState } from 'store/interface'

export default function ChitietTongiao(): JSX.Element {
    const tongiaoList = useSelector<AppState, Tongiao[] | undefined>((state) => state.tongiao.tongiaoList)
    const history = useHistory()
    const [tongiaoDetail, setTongiaoDetail] = useState<Tongiao | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm tôn giáo ',
        detail: 'Thông tin tôn giáo ',
        edit: 'Chỉnh sửa tôn giáo '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${TONGIAO_URL}/${pathname}`, Authorization()).then((res) => {
            setTongiaoDetail(res.data.result)
        })
    }, [])
    useEffect(() => {
        !tongiaoList &&
            axios.get(TONGIAO_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_TONGIAO, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (tongiaoDetail) {
            const { id, ma, ten } = tongiaoDetail
            form.setFieldsValue({ id, ma, ten })
        }
    }, [form, tongiaoDetail])

    const onFinish = (values: Tongiao) => {
        isEdit
            ? (dispatch(editTongiao(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.tongiao}`)
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            : (dispatch(addTongiao(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.tongiao}`)
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
                    name='ma'
                    label='Mã tôn giáo '
                    rules={[{ required: true, message: 'Vui lòng nhập mã tôn giáo !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ten'
                    label='Tên tôn giáo '
                    rules={[{ required: true, message: 'Vui lòng nhập tên tôn giáo !' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
