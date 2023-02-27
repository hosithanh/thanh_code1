/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Notification } from '../../common/component/notification'
import { NHOMCHUCNANG_LIST_URL, NHOMCHUCNANG_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Nhomchucnang } from '../../common/interface/Nhomchucnang'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_NHOMCHUCNANG } from '../../store/actions'
import { addNhomchucnang, editNhomchucnang } from '../../store/actions/nhomchucnang.action'
import { AppState } from '../../store/interface'
export default function ChitietNhomchucnang(): JSX.Element {
    const history = useHistory()
    const nhomchucnangList = useSelector<AppState, Nhomchucnang[] | undefined>(
        (state) => state.nhomchucnang.nhomchucnangList
    )
    const [nhomchucnangDetail, setNhomchucnangDetail] = useState<any>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = { add: 'Thêm nhóm chức năng', edit: 'Chỉnh sửa nhóm chức năng', detail: 'Thông tin nhóm chức năng' }
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    useEffect(() => {
        !nhomchucnangList &&
            axios.get(NHOMCHUCNANG_LIST_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_NHOMCHUCNANG, payload: res.data })
            })
    }, [])

    useEffect(() => {
        axios.get(`${NHOMCHUCNANG_URL}/${pathname}`, Authorization()).then((res) => {
            setNhomchucnangDetail(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (nhomchucnangDetail) {
            const { id, ten, ma, ngayTao, ngaySua, nguoiTao, nguoiSua, daXoa } = nhomchucnangDetail
            form.setFieldsValue({
                id,
                ten,
                ma,
                ngayTao,
                ngaySua,
                nguoiTao,
                nguoiSua,
                daXoa
            })
        }
    }, [nhomchucnangDetail])

    const onFinish = (values: Nhomchucnang) => {
        if (isEdit) {
            return (dispatch(editNhomchucnang(nhomchucnangDetail?.id, values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.nhomchucnang}`)
                    Notification({ status: 'success', message: res.data.message })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
        } else if (isAdd) {
            return (dispatch(addNhomchucnang(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.nhomchucnang}`)
                    if (res.data.errorCode === 0) {
                        Notification({ status: 'success', message: res.data.message })
                    } else {
                        Notification({ status: 'error', message: res.data.message })
                    }
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
        }
    }
    return (
        <div className='user-detail'>
            <PageHeader
                onBack={(): void => history.goBack()}
                title={isAdd ? title.add : isEdit ? title.edit : title.detail}
                style={{ padding: '0 0 16px 0' }}
            />
            <Form onFinish={onFinish} className='custom-form' form={form}>
                {isEdit ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>Quay lại</Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            Cập nhật
                        </Button>
                    </div>
                ) : isAdd ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>Quay lại</Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            Lưu
                        </Button>
                    </div>
                ) : (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>Quay lại</Button>
                    </div>
                )}
                <Form.Item name='id' hidden>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ten'
                    label='Tên nhóm chức năng'
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhóm chức năng!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ma'
                    label='Mã nhóm chức năng'
                    rules={[{ required: true, message: 'Vui lòng nhập mã nhóm chức năng!' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
