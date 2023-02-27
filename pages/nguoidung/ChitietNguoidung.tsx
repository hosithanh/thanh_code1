/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Form, Input, PageHeader, Row, Select, Spin } from 'antd'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_CODE } from 'common/constant'
import { MenuPaths } from 'common/constant/app-constant'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { selectDonvi } from 'store/actions/donvi.action'
import { getUsersGroup } from 'store/actions/nhomnguoidung.action'
import { addUsers, editUser } from 'store/actions/user.action'
import {
    DONVI_LIST_URL,
    PHONGBAN_IDDONVI,
    USER_GROUP_LIST_URL,
    USER_LIST_URL
} from '../../common/constant/api-constant'
import { UserGroup } from '../../common/interface/UserGroup'
import { Authorization } from '../../common/utils/cookie-util'

export default function ChitietNguoidung(): JSX.Element {
    const history = useHistory()
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [listDonvi, setListDonvi] = useState<UserGroup[] | undefined>()
    const [userDetail, setUserDetail] = useState<any>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'them-moi'
    const isEdit = window.location.search === '?edit=true'
    const title = { add: 'Thêm người dùng', edit: 'Chỉnh sửa người dùng' }
    const [isQuanTriChange, setIsQuanTri] = useState(false)
    const [isRootChange, setIsRoot] = useState(false)
    const [dataPhongban, setDataPhongban] = useState<any | undefined>()
    const [dataNhomnguoidung, setDataNhomnguoidung] = useState<any | undefined>()
    const [isLoadingMoreNhomNguoiDungStop, setIsLoadingMoreNhomNguoiDungStop] = useState(false)
    const [loadingMoreNhomNguoiDungCurPage, setLoadingMoreNhomNguoiDungCurPage] = useState<number>(1)

    useEffect(() => {
        if (userDetail) {
            axios.get(`${PHONGBAN_IDDONVI}/${userDetail?.donVi.id}`, Authorization()).then((res) => {
                setDataPhongban(res.data?.result)
            })
        }
    }, [userDetail])
    useEffect(() => {
        axios.get(`${DONVI_LIST_URL}/all`, Authorization()).then((res) => {
            setListDonvi(res.data.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`${USER_GROUP_LIST_URL}`, Authorization()).then((res) => {
            setDataNhomnguoidung(res.data.result)
        })
    }, [])

    useEffect(() => {
        isEdit &&
            axios.get(`${USER_LIST_URL}${pathname}`, Authorization()).then((res) => {
                setUserDetail(res.data)
            })
    }, [])

    useEffect(() => {
        if (userDetail) {
            const {
                fullName,
                name,
                email,
                phoneNumber,
                regency,
                isEnable,
                donVi,
                phongBanId,
                donViBackup,
                isQuanTri,
                isRoot,
                groupCodeUser
            } = userDetail
            let arrayGroupCode = []
            groupCodeUser.map((item) => {
                arrayGroupCode.push(item.group_code)
            })
            form.setFieldsValue({
                fullName,
                name,
                email,
                phoneNumber,
                regency,
                isEnable,
                donVi: `${donVi.ten}-${donVi.id}`,
                groupCode: arrayGroupCode,
                phongBanId: phongBanId,
                donViBackup: donViBackup === null ? null : `${donViBackup.ten}-${donViBackup.id}`,
                isQuanTri,
                isRoot
            })
        }
    }, [userDetail, listDonvi])

    const typingTimeoutRef = useRef<any>()
    const typingTimeoutRef2 = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectDonvi({ searchData })) as any).then((res) => {
                setListDonvi(res.data.data.items)
            })
        }, 300)
    }
    const onSearchNhomNguoiDung = (searchData) => {
        if (typingTimeoutRef2.current) {
            clearTimeout(typingTimeoutRef2.current)
        }
        typingTimeoutRef2.current = setTimeout(() => {
            ;(dispatch(getUsersGroup({ searchData })) as any).then((res) => {
                setDataNhomnguoidung(res.data.result)
            })
        }, 300)
    }
    const onChangeDonVi = (e) => {
        let idDonvi = Number(e.split('-').pop())
        axios.get(`${PHONGBAN_IDDONVI}/${idDonvi}`, Authorization()).then((res) => {
            setDataPhongban(res.data?.result)
        })
    }
    const onClickCheckDonvi = (e) => {
        if (!dataPhongban) {
            Notification({ status: 'error', message: 'Vui lòng chọn đơn vị để lọc theo phòng ban!' })
        }
    }
    const onScrollNhomNguoiDung = (e) => {
        if (!isLoadingMoreNhomNguoiDungStop && e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
            e.target.scrollTo(0, e.target.scrollHeight)
            var currPage = loadingMoreNhomNguoiDungCurPage + 1
            setLoadingMoreNhomNguoiDungCurPage(currPage)
            axios.get(`${USER_GROUP_LIST_URL}?page=${currPage}`, Authorization()).then((res) => {
                if (res.data.result.length > 0) {
                    setDataNhomnguoidung(dataNhomnguoidung.concat(res.data.result))
                } else {
                    setIsLoadingMoreNhomNguoiDungStop(true)
                }
            })
        }
    }
    const onFinish = (values) => {
        const { fullName, email, donVi, phongBanId, groupCode, donViBackup, phoneNumber, regency, name, password } =
            values
        let { isEnable, isQuanTri, isRoot } = values
        if (isEnable === true) {
            isEnable = 1
        } else if (isEnable === false) isEnable = 0
        if (isAdd) {
            ;(
                dispatch(
                    addUsers({
                        account: {
                            fullName,
                            name,
                            email,
                            donVi: {
                                id: donVi && Number(donVi.split('-').pop())
                            },
                            donViBackup: {
                                id: donViBackup && Number(donViBackup.split('-').pop())
                            },
                            // isEnable: isEnableChange,
                            isQuanTri: isQuanTriChange,
                            isRoot: isRootChange,
                            phoneNumber,
                            regency
                        },
                        phongBanId: phongBanId,
                        groupCode: groupCode,
                        username: name,
                        password
                    })
                ) as any
            )
                .then((res) => {
                    history.push(`/${MenuPaths.nguoidung}`)
                    Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
                })
                .catch((err) => {
                    Notification({ status: 'error', message: 'Thêm người dùng thất bại' })
                })
        } else if (isEdit) {
            ;(
                dispatch(
                    editUser({
                        id: userDetail.id,
                        fullName,
                        email,
                        donVi: {
                            id: donVi && Number(donVi.split('-').pop())
                        },
                        donViBackup: {
                            id: donViBackup && Number(donViBackup.split('-').pop())
                        },
                        // isEnable,
                        phongBanId: phongBanId,
                        groupCode: groupCode,
                        isQuanTri,
                        isRoot,
                        phoneNumber,
                        regency
                    })
                ) as any
            )
                .then((res) => {
                    history.push(`/${MenuPaths.nguoidung}`)
                    Notification({ status: 'success', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: 'Sửa người dùng thất bại' })
                })
        }
    }
    return (
        <div className='user-detail'>
            <PageHeader title={isAdd ? title.add : title.edit} style={{ padding: '0 0 16px 0' }} />
            <Form onFinish={onFinish} className='custom-form' form={form} layout='vertical'>
                <div className='group-btn-detail'>
                    <Button onClick={(): void => history.goBack()}>
                        <BackwardOutlined />
                        Quay lại
                    </Button>
                    <Button type='primary' htmlType='submit' className='btn-submit'>
                        <SaveOutlined /> Lưu
                    </Button>
                </div>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name='fullName'
                            label='Họ và tên'
                            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='name'
                            label='Tên đăng nhập'
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                { pattern: REGEX_CODE, message: 'Tên đăng nhập không hợp lệ' }
                            ]}>
                            <Input disabled={isEdit ? true : false} />
                        </Form.Item>
                        {!isEdit && (
                            <>
                                <Form.Item
                                    name='password'
                                    label='Mật khẩu'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập mật khẩu!'
                                        },
                                        {
                                            min: 6,
                                            message: 'Vui lòng nhập 6 kí tự trở lên !'
                                        }
                                    ]}
                                    hasFeedback>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name='confirm'
                                    label='Xác nhận mật khẩu'
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy xác nhận password!'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(new Error('Mật khẩu không khớp nhau!'))
                                            }
                                        })
                                    ]}>
                                    <Input.Password />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            name='groupCode'
                            label='Nhóm người dùng'
                            rules={[{ required: true, message: 'Vui lòng chọn nhóm người dùng!' }]}>
                            <Select
                                onSearch={onSearchNhomNguoiDung}
                                allowClear
                                placeholder='--- Chọn nhóm người dùng ---'
                                showSearch
                                mode='multiple'
                                onPopupScroll={onScrollNhomNguoiDung}
                                style={{ width: '100%', textAlign: 'left' }}>
                                {dataNhomnguoidung?.map((item) => (
                                    <Select.Option key={item.id} value={`${item.groupCode}`}>
                                        {`${item.name}`}
                                    </Select.Option>
                                ))}
                                {isLoadingMoreNhomNguoiDungStop ? (
                                    ''
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

                        <Row style={{ marginTop: '50px' }}>
                            {/* <Form.Item name='isEnable' valuePropName='checked'>
                                <Checkbox onChange={(e) => setIsEnable(e.target.checked === true ? 1 : 0)}>
                                    Kích hoạt tài khoản
                                </Checkbox>
                            </Form.Item> */}
                            <Form.Item name='isQuanTri' valuePropName='checked'>
                                <Checkbox onChange={(e) => setIsQuanTri(e.target.checked)}>
                                    Quyền quản trị đơn vị
                                </Checkbox>
                            </Form.Item>
                            {/* <Form.Item name='isRoot' valuePropName='checked' style={{ marginLeft: '50px' }}>
                                <Checkbox onChange={(e) => setIsRoot(e.target.checked)}>Quyền root</Checkbox>
                            </Form.Item> */}
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='email'
                            label='Email'
                            rules={[
                                { required: true, message: 'Vui lòng nhập thư điện tử!' },
                                {
                                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Vui lòng nhập đúng định dạng thư điện tử!'
                                }
                            ]}>
                            <Input type='email' />
                        </Form.Item>
                        <Form.Item
                            name='phoneNumber'
                            label='Điện thoại di động'
                            rules={[
                                {
                                    max: 10,
                                    message: 'Vui lòng nhập tối đa 10 kí tự !'
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name='regency' label='Chức vụ'>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='donVi'
                            label='Đơn vị'
                            rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}>
                            <Select
                                onSearch={onSearchDonVi}
                                showSearch
                                onChange={onChangeDonVi}
                                placeholder='--- Chọn đơn vị ---'>
                                {listDonvi?.map((item, index) => (
                                    <Select.Option key={index} value={`${item.ten}-${item.id}`}>
                                        {item.ten}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='phongBanId'
                            label='Phòng ban'
                            rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}>
                            <Select
                                showSearch
                                placeholder='--- Chọn phòng ban ---'
                                onClick={onClickCheckDonvi}
                                optionFilterProp='children'
                                filterOption={(input, option: any) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {dataPhongban?.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>
                                        {item.tenphongban}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='donViBackup'
                            label='Cấp/Đơn vị mở rộng'
                            rules={[{ required: true, message: 'Vui lòng chọn cấp/đơn vị mở rộng!' }]}>
                            <Select onSearch={onSearchDonVi} showSearch placeholder='--- Chọn Cấp/Đơn vị mở rộng ---'>
                                {listDonvi?.map((item, index) =>
                                    item == null ? (
                                        <Select.Option key={null} value={null}>
                                            Chọn Cấp/Đơn vị mở rộng
                                        </Select.Option>
                                    ) : (
                                        <Select.Option key={index} value={`${item.ten}-${item.id}`}>
                                            {item.ten}
                                        </Select.Option>
                                    )
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
