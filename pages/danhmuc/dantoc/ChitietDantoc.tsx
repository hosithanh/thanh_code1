/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DANTOC_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Dantoc } from 'common/interface/Danhmuc.interfaces/Dantoc'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { FETCH_DANTOC } from 'store/actions'
import { addDantoc, editDantoc } from 'store/actions/danhmuc.actions/dantoc.action'
import { AppState } from 'store/interface'

export default function ChitietDantoc(): JSX.Element {
    const dantocList = useSelector<AppState, Dantoc[] | undefined>((state) => state.dantoc.dantocList)
    const history = useHistory()
    const [dantocDetail, setDantocDetail] = useState<Dantoc | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm dân tộc ',
        detail: 'Thông tin dân tộc ',
        edit: 'Chỉnh sửa dân tộc '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${DANTOC_URL}/${pathname}`, Authorization()).then((res) => {
            setDantocDetail(res.data.result)
        })
    }, [])
    useEffect(() => {
        !dantocList &&
            axios.get(DANTOC_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_DANTOC, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (dantocDetail) {
            const { id, ma, ten } = dantocDetail
            form.setFieldsValue({ id, ma, ten })
        }
    }, [form, dantocDetail])

    const onFinish = (values: Dantoc) => {
        isEdit
            ? (dispatch(editDantoc(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.dantoc}`)
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            : (dispatch(addDantoc(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.dantoc}`)
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
                    label='Mã dân tộc '
                    rules={[{ required: true, message: 'Vui lòng nhập mã dân tộc !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ten'
                    label='Tên dân tộc '
                    rules={[{ required: true, message: 'Vui lòng nhập tên dân tộc !' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
