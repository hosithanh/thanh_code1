/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader, Select, Spin } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_Expression } from 'common/constant'
import { MenuPaths } from 'common/constant/app-constant'
import { UserGroup } from 'common/interface/UserGroup'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { selectUserDonvi } from 'store/actions/donvi.action'
import { addUserGroup, editUserGroup, getUsersGroupID } from 'store/actions/nhomnguoidung.action'
import { DONVI_LIST_USER_URL } from '../../common/constant/api-constant'
import { Donvi } from '../../common/interface/Donvi'
import { Authorization } from '../../common/utils/cookie-util'

export default function ChiTietNhomNguoiDung(): JSX.Element {
    const history = useHistory()
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'them-moi'
    const isEdit = window.location.search === '?edit=true'
    const isDetail = !isAdd && !isEdit
    const [userGroup, setUserGroup] = useState<UserGroup | undefined>()
    const { TextArea } = Input
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    // const { Option } = Select
    const title = {
        add: 'Thêm nhóm người dùng',
        detail: 'Thông tin nhóm người dùng',
        edit: 'Chỉnh sửa nhóm người dùng'
    }

    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])

    const onFinish = (values: UserGroup) => {

        values.donVi = { id: values.donVi ? values.donVi.split('-').pop() : null }
        if (isAdd) {
            ; (dispatch(addUserGroup(values)) as any)
                .then((res) => {
                    Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
                    history.push(`/${MenuPaths.nhomnguoidung}`)
                })
                .catch((res) => {
                    Notification({ status: 'error', message: res.data.msg })
                })
        } else if (isEdit) {
            ; (dispatch(editUserGroup(values)) as any)
                .then((res) => {
                    Notification({ status: 'success', message: res.data.msg })
                    history.push(`/${MenuPaths.nhomnguoidung}`)
                })
                .catch((res) => {
                    Notification({ status: 'error', message: res.data.msg })
                })
        }
    }

    useEffect(() => {
        isEdit &&
            (dispatch(getUsersGroupID(String(pathname))) as any).then((res) => {
                setUserGroup(res.data.data)
            })
    }, [])

    useEffect(() => {
        if (userGroup) {
            const { name, groupCode, note, isEnable } = userGroup
            let donVi = userGroup.donVi !== null ? `${userGroup.donVi.ten}-${userGroup.donVi.id}` : null
            form.setFieldsValue({ groupCode, name, note, donVi, isEnable })
        }
    }, [userGroup])
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ; (dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
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
                {isDetail ? (
                    <div className='group-btn-detail'>
                        <Button>Xóa</Button>
                        <Button type='primary' onClick={(): void => history.replace('?edit=true')}>
                            Sửa
                        </Button>
                    </div>
                ) : (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                )}
                <Form.Item
                    name='groupCode'
                    label='Mã nhóm'
                    rules={[
                        { required: !isDetail, message: 'Vui lòng nhập mã nhóm người dùng!' },
                        { pattern: REGEX_Expression, message: 'Biểu thức không hợp lệ!' }
                    ]}>
                    {isDetail ? <span>Ten</span> : <Input disabled={isEdit ? true : false} />}
                </Form.Item>
                <Form.Item
                    name='name'
                    label='Tên nhóm'
                    rules={[{ required: !isDetail, message: 'Vui lòng nhập tên nhóm người dùng!' }]}>
                    {isDetail ? <span>Donvi</span> : <Input />}
                </Form.Item>
                <Form.Item name='donVi' label='Đơn vị'>
                    <Select
                        allowClear
                        placeholder='Vui lòng chọn đơn vị!'
                        showSearch
                        onSearch={onSearchDonVi}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {donviList ? (
                            donviList?.map((item, index) => (
                                <Select.Option key={index} value={`${item.ten}-${item.id}`}>
                                    {item.ten}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value={''}>
                                <Spin
                                    tip='Đang tải dữ liệu'
                                    style={{
                                        display: 'block',
                                        justifyContent: 'center',
                                        marginTop: '0.1px'
                                    }}></Spin>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item name='note' label='Ghi chú'>
                    <TextArea showCount maxLength={1000} />
                </Form.Item>
            </Form>
        </div>
    )
}
