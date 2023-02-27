import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import "assets/css/dangnhap.css"
import Logo from 'assets/image/icon.png'
import { Notification } from 'common/component/notification'
import { useDispatch } from 'react-redux'
import { login } from 'store/actions/auth.action'

const Dangnhap = (): JSX.Element => {
    const dispatch = useDispatch<any>()
    const onFinish = (values): void => {
        dispatch(login(values)).then(data => {
            if (data?.errorCode === 0) {
                Notification({
                    status: "success",
                    message: data.message
                })
            } else {
                Notification({
                    status: "error",
                    message: data?.message
                })
            }
        })
    }

    return (
        <div className="login-content">
            <div className="login-left" />
            <div className="login-right">
                <div className="form-login">
                    <img src={Logo} alt="logo" className="logo-img" />
                    <div className="max-width-form">
                        <Form
                            onFinish={values => onFinish(values)}
                            requiredMark={false}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Tên đăng nhập"
                                name="userName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên đăng nhập"
                                    }
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                    className="form-input"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu"
                                name="passWord"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu!"
                                    }
                                ]}
                            >
                                <Input.Password
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                    className="form-input"
                                    placeholder="Nhập mật khẩu"
                                />
                            </Form.Item>
                            <Button
                                className="btn-submit btndangnhap"
                                // type="primary"
                                htmlType="submit"
                                icon={<LoginOutlined />}
                            >
                                Đăng nhập
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dangnhap
