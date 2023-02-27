/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { NGHENGHIEP_URL } from 'common/constant/api-constant'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { Nghenghiep } from 'common/interface/Danhmuc.interfaces/Nghenghiep'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { FETCH_NGHENGHIEP } from 'store/actions'
import { addNghenghiep, editNghenghiep } from 'store/actions/danhmuc.actions/nghenghiep.action'
import { AppState } from 'store/interface'

export default function ChitietNghenghiep(): JSX.Element {
    const nghenghiepList = useSelector<AppState, Nghenghiep[] | undefined>((state) => state.nghenghiep.nghenghiepList)
    const history = useHistory()
    const [nghenghiepDetail, setNghenghiepDetail] = useState<Nghenghiep | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm nghề nghiệp ',
        detail: 'Thông tin nghề nghiệp ',
        edit: 'Chỉnh sửa nghề nghiệp '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${NGHENGHIEP_URL}${pathname}`, Authorization()).then((res) => {
            setNghenghiepDetail(res.data.result)
        })
    }, [])
    useEffect(() => {
        !nghenghiepList &&
            axios.get(NGHENGHIEP_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_NGHENGHIEP, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (nghenghiepDetail) {
            const { id, ma, ten } = nghenghiepDetail
            form.setFieldsValue({ id, ma, ten })
        }
    }, [form, nghenghiepDetail])

    const onFinish = (values: Nghenghiep) => {
        isEdit
            ? (dispatch(editNghenghiep(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.nghenghiep}`)
                    Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            : (dispatch(addNghenghiep(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.nghenghiep}`)
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
                    label='Mã nghề nghiệp '
                    rules={[{ required: true, message: 'Vui lòng nhập mã nghề nghiệp !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ten'
                    label='Tên nghề nghiệp '
                    rules={[{ required: true, message: 'Vui lòng nhập tên nghề nghiệp !' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
