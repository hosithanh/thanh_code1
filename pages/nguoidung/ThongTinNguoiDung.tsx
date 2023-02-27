/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, PageHeader } from 'antd'
import { User } from 'common/interface/User'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { changePasswordUser, getUserInfo } from 'store/actions/user.action'

export default function ThongTinNguoiDung(): JSX.Element {
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState<User | undefined>()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const showModal = () => {
        setIsModalVisible(true)
    }
    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    useEffect(() => {
        ;(dispatch(getUserInfo()) as any).then((res) => {
            setUserInfo(res.data.data)
        })
    }, [])
    const onChangePassword = (values) => {
        handleCancel()
        form.resetFields()
        const { password, confirm, oldPassword } = values
        dispatch(
            changePasswordUser({
                newPassword: password,
                repeatPassword: confirm,
                oldPassword: oldPassword
            })
        )
    }

    return (
        <div>
            <PageHeader
                className='site-page-header'
                ghost={false}
                // onBack={() => window.history.back()}
                title='Thông tin người dùng'
            />
            {userInfo && (
                <div style={{ padding: '10px 60px', fontSize: '16px' }}>
                    <p>
                        <strong>Tài khoản :</strong> {userInfo.user?.username}
                    </p>
                    <p>
                        <strong>Email :</strong> {userInfo.email}
                    </p>
                    <p>
                        <strong>Tên người dùng :</strong> {userInfo.fullName}
                    </p>
                    <p>
                        <strong>Đơn vị : </strong>
                        {userInfo.donVi?.ten}
                    </p>
                    <p>
                        <strong>Chức vụ :</strong> {userInfo.regency}
                    </p>
                    <p>
                        <strong>Điện thoại :</strong> {userInfo.phoneNumber}
                    </p>
                    <Button
                        type='primary'
                        onClick={() => {
                            showModal()
                        }}>
                        Đổi mật khẩu
                    </Button>
                </div>
            )}
            <Modal
                width='30%'
                centered
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                footer={[]}>
                <Card title='Đổi mật khẩu' bordered={false} style={{ width: '100%' }}>
                    <Form layout='vertical' onFinish={onChangePassword} form={form}>
                        <Form.Item
                            name='oldPassword'
                            label='Nhập mật khẩu cũ'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mật khẩu cũ!'
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
                            name='password'
                            label='Nhập mật khẩu mới'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mật khẩu mới!'
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
                        <Button danger type='primary' onClick={handleCancel} style={{ float: 'right' }}>
                            Đóng
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='btn-submit'
                            style={{ float: 'right', marginRight: '10px' }}>
                            <SaveOutlined /> Lưu
                        </Button>
                        &nbsp;
                    </Form>
                </Card>
            </Modal>
        </div>
    )
}
