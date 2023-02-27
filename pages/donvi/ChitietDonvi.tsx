/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, PageHeader, Select } from 'antd'
import axios from 'axios'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Notification } from '../../common/component/notification'
import { CAPDONVI_LIST_URL, DONVI_LIST_URL, DONVI_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { CapDonVi } from '../../common/interface/CapDonVi'
import { Donvi } from '../../common/interface/Donvi'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_DONVI } from '../../store/actions'
import { addDonvi, editDonvi, selectDonvi } from '../../store/actions/donvi.action'
import { AppState } from '../../store/interface'
export default function ChitietDonvi(): JSX.Element {
    const donviList = useSelector<AppState, Donvi[] | undefined>((state) => state.donvi.donviList)
    const history = useHistory()
    const [donviDetail, setDonviDetail] = useState<Donvi | undefined>()
    const [donviListParent, setDonviListParent] = useState<Donvi[] | undefined>()
    const [isEditdonviListParent, setIsEditDonviListParent] = useState<Donvi[] | undefined>()
    const [isEditcapDonvi, setIsEditcapDonvi] = useState<CapDonVi[] | undefined>()
    const [capDonvi, setcapDonvi] = useState<CapDonVi[] | undefined>()
    if (donviListParent && donviListParent[0]?.id !== 0)
        donviListParent?.unshift({ id: 0, ten: '-------------- Chọn đơn vị cha ---------------' })
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm đơn vị ',
        detail: 'Thông tin đơn vị ',
        edit: 'Chỉnh sửa đơn vị '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch<any>()
    useEffect(() => {
        axios.get(`${CAPDONVI_LIST_URL}`, Authorization()).then((res) => {
            setcapDonvi(res.data.result)
            setIsEditcapDonvi(res.data.result)
        })
    }, [])
    useEffect(() => {
        axios.get(`${DONVI_URL}/${pathname}`, Authorization()).then((res) => {
            setDonviDetail(res.data.data)
        })
    }, [])
    useEffect(() => {
        !donviList &&
            axios.get(DONVI_LIST_URL, Authorization()).then((res) => {
                dispatch({ type: FETCH_DONVI, payload: res.data })
            })
    }, [])
    useEffect(() => {
        axios.get(`${DONVI_LIST_URL}/all`, Authorization()).then((res) => {
            setDonviListParent(res.data.data)
            setIsEditDonviListParent(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (isEdit && donviDetail) {
            const { id, ten, ma, isCungCap, isKhaiThac } = donviDetail
            const idparrent = donviDetail?.parrentId
            const parrentId = isEditdonviListParent?.find((item) => item.id === idparrent)?.ten
            const idcapdonvi = isEditcapDonvi?.find((item) => item.id === donviDetail.capDonVi?.id)?.id
            form.setFieldsValue({ id, ten, ma, parrentId: parrentId, isCungCap, isKhaiThac, idcapdonvi })
        }
    }, [form, donviDetail, isEditdonviListParent, isEditcapDonvi])

    const onFinish = (values: any) => {
        const { id, ten, ma, parrentId, isCungCap, isKhaiThac, idcapdonvi } = values
        const danhMucCapDonVi = {
            id: idcapdonvi
        }
        const data = {
            id: id,
            ten: ten,
            ma: ma,
            isCungCap: isCungCap,
            isKhaiThac: isKhaiThac,
            parrentId: Number(parrentId?.split('-').slice(1).toString()),
            danhMucCapDonVi: danhMucCapDonVi
        }
        isEdit
            ? (dispatch(editDonvi(donviDetail?.id, data)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.donvi}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
            : (dispatch(addDonvi(data)) as any)
                  .then((res) => {
                      history.push(`/${MenuPaths.donvi}`)
                      Notification({ status: res.data.errorCode > 0 ? 'error' : 'success', message: res.data.message })
                  })
                  .catch(() => {
                      Notification({ status: 'error', message: errorMessage })
                  })
    }
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            dispatch(selectDonvi({ searchData })).then((res) => {
                setDonviListParent(res.data.data.items)
            })
        }, 300)
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

                <Form.Item name='id' style={{ height: '0.5px' }} hidden>
                    <Input hidden />
                </Form.Item>

                <Form.Item
                    name='ten'
                    label='Tên đơn vị '
                    rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='ma'
                    label='Mã đơn vị '
                    rules={[{ required: true, message: 'Vui lòng nhập mã đơn vị !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='parrentId' label='Đơn vị cha'>
                    <Select onSearch={onSearchDonVi} showSearch allowClear>
                        {donviListParent?.map((item, index) => (
                            <Select.Option key={index} value={`${item.ten}-${item.id}`}>
                                {item.ten}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {(isAdd || !isNullOrUndefined(donviDetail?.isCungCap)) && (
                    <Form.Item name='isCungCap' label='Đơn vị cung cấp'>
                        <Checkbox
                            onChange={(value) => {
                                form.setFieldsValue({ isCungCap: Number(value.target.checked) })
                            }}
                            defaultChecked={!!donviDetail?.isCungCap}></Checkbox>
                    </Form.Item>
                )}
                {(isAdd || !isNullOrUndefined(donviDetail?.isKhaiThac)) && (
                    <Form.Item name='isKhaiThac' label='Đơn vị khai thác'>
                        <Checkbox
                            defaultChecked={!!donviDetail?.isKhaiThac}
                            onChange={(value) =>
                                form.setFieldsValue({ isKhaiThac: Number(value.target.checked) })
                            }></Checkbox>
                    </Form.Item>
                )}
                <Form.Item
                    name='idcapdonvi'
                    label='Cấp đơn vị'
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn cấp đơn vị !'
                        }
                    ]}>
                    <Select>
                        {capDonvi?.map((item, index) => (
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
