/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { TRINHDOVANHOA_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Trinhdovanhoa } from 'common/interface/Danhmuc.interfaces/Trinhdovanhoa'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { FETCH_TRINHDOVANHOA } from 'store/actions'
import { addTrinhdovanhoa, editTrinhdovanhoa } from 'store/actions/danhmuc.actions/trinhdovanhoa.action'
import { AppState } from 'store/interface'

export default function ChitietTrinhdovanhoa(): JSX.Element {
    const trinhdovanhoaList = useSelector<AppState, Trinhdovanhoa[] | undefined>((state) => state.trinhdovanhoa.trinhdovanhoaList)
    const history = useHistory()
    const [trinhdovanhoaDetail, setTrinhdovanhoaDetail] = useState<Trinhdovanhoa | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm trình độ văn hóa ',
        detail: 'Thông tin trình độ văn hóa ',
        edit: 'Chỉnh sửa trình độ văn hóa '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${TRINHDOVANHOA_URL}/${pathname}`, Authorization()).then((res) => {
            setTrinhdovanhoaDetail(res.data.result)
        })
    }, [])
    useEffect(() => {
        !trinhdovanhoaList &&
            axios.get(TRINHDOVANHOA_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_TRINHDOVANHOA, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (trinhdovanhoaDetail) {
            const { id, ma, ten } = trinhdovanhoaDetail
            form.setFieldsValue({ id, ma, ten })
        }
    }, [form, trinhdovanhoaDetail])

    const onFinish = (values: Trinhdovanhoa) => {
        isEdit
            ? (dispatch(editTrinhdovanhoa(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.trinhdovanhoa}`)
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            : (dispatch(addTrinhdovanhoa(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.trinhdovanhoa}`)
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
                    label='Mã trình độ văn hóa '
                    rules={[{ required: true, message: 'Vui lòng nhập mã trình độ văn hóa !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ten'
                    label='Tên trình độ văn hóa '
                    rules={[{ required: true, message: 'Vui lòng nhập tên trình độ văn hóa !' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
