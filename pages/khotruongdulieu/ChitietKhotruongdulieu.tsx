/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { REGEX_Expression } from 'common/constant'
import { truncate } from 'fs'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Notification } from '../../common/component/notification'
import { KHOTRUONGDULIEU_LIST_URL, KHOTRUONGDULIEU_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Khotruongdulieu } from '../../common/interface/Khotruongdulieu'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_DONVI } from '../../store/actions'
import { addKhotruongdulieu, editKhotruongdulieu } from '../../store/actions/khotruongdulieu.action'
import { AppState } from '../../store/interface'
export default function ChitietKhotruongdulieu(): JSX.Element {
    const khotruongdulieuList = useSelector<AppState, Khotruongdulieu[] | undefined>(
        (state) => state.khotruongdulieu.khotruongdulieuList
    )
    const history = useHistory()
    const [khotruongdulieuDetail, setKhotruongdulieuDetail] = useState<Khotruongdulieu | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm trường dữ liệu ',
        detail: 'Thông tin trường dữ liệu ',
        edit: 'Chỉnh sửa trường dữ liệu '
    }

    const [loadingSave, setLoadingSave] = useState(false)

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${KHOTRUONGDULIEU_URL}/${pathname}`, Authorization()).then((res) => {
            setKhotruongdulieuDetail(res.data.data)
        })
    }, [])
    useEffect(() => {
        !khotruongdulieuList &&
            axios.get(KHOTRUONGDULIEU_LIST_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_DONVI, payload: res.data })
            })
    }, [])

    useEffect(() => {
        if (khotruongdulieuDetail) {
            const { id, moTa, ma } = khotruongdulieuDetail
            form.setFieldsValue({ id, moTa, ma })
        }
    }, [form, khotruongdulieuDetail])

    const onFinish = (values: Khotruongdulieu) => {
        isEdit
            ? (dispatch(editKhotruongdulieu(khotruongdulieuDetail?.id, values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.khotruongdulieu}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
            : (dispatch(addKhotruongdulieu(values)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.khotruongdulieu}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
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
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit' loading={loadingSave}>
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
                <Form.Item
                    name='moTa'
                    label='Tên trường dữ liệu '
                    rules={[{ required: true, message: 'Vui lòng nhập tên trường dữ liệu !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item  
                    name='ma'
                    label='Mã trường dữ liệu '
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã trường dữ liệu !' },
                        { pattern: REGEX_Expression, message: 'Biểu thức không hợp lệ!' }
                    ]}>
                    <Input />
                </Form.Item>
                {isEdit ? (
                    <Form.Item style={{ display: 'none' }} name='id'>
                        <Input />
                    </Form.Item>
                ) : (
                    ''
                )}
            </Form>
        </div>
    )
}
