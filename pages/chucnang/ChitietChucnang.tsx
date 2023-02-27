import { Button, Form, Input, PageHeader, Select } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Notification } from '../../common/component/notification'
import { CHUCNANG_GROUP_URL, CHUCNANG_LIST_URL, CHUCNANG_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Chucnang } from '../../common/interface/Chucnang'
import { ChucnangGroup } from '../../common/interface/ChucnangGroup'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_CHUCNANG } from '../../store/actions'
import { addChucnang, editChucnang } from '../../store/actions/chucnang.action'
import { AppState } from '../../store/interface'
export default function ChitietChucnang(): JSX.Element {
    const history = useHistory()
    const chucnangList = useSelector<AppState, Chucnang[] | undefined>((state) => state.chucnang.chucnangList)
    const [chucnangGroup, setChucnangGroup] = useState<ChucnangGroup[] | undefined>()
    const [chucnangDetail, setChucnangDetail] = useState<any>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = { add: 'Thêm chức năng', edit: 'Chỉnh sửa chức năng', detail: 'Thông tin chức năng' }
    const [form] = Form.useForm()

    const dispatch = useDispatch()
    useEffect(() => {
        axios.get(CHUCNANG_GROUP_URL, Authorization()).then((res) => {
            setChucnangGroup(res.data.data)
        })
    }, [])
    useEffect(() => {
        !chucnangList &&
            axios.get(CHUCNANG_LIST_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_CHUCNANG, payload: res.data })
            })
    }, [])

    useEffect(() => {
        axios.get(`${CHUCNANG_URL}/${pathname}`, Authorization()).then((res) => {
            setChucnangDetail(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (chucnangDetail) {
            const { id, ten, ma, nhomChucNang } = chucnangDetail
            form.setFieldsValue({ id, ten, ma, nhomChucNang: nhomChucNang?.id })
        }
    }, [chucnangDetail])

    const onFinish = (values: Chucnang) => {
        if (isEdit) {
            return (dispatch(editChucnang(chucnangDetail?.id, values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.chucnang}`)
                    Notification({ status: 'success', message: res.data.message })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
        } else if (isAdd) {
            return (dispatch(addChucnang(values)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.chucnang}`)
                    if (res.data.errorCode == 0) {
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
                    label='Tên chức năng'
                    rules={[{ required: true, message: 'Vui lòng nhập tên chức năng!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ma'
                    label='Mã chức năng'
                    rules={[{ required: true, message: 'Vui lòng nhập mã chức năng!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='nhomChucNang'
                    label='Nhóm chức năng'
                    rules={[{ required: true, message: 'Vui lòng chọn nhóm chức năng!' }]}>
                    <Select>
                        {chucnangGroup?.map((item, index) => (
                            <Select.Option key={index} value={item.id}>
                                {item.ten}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}
