import { ExclamationCircleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Menu } from 'antd'
import { MenuPaths } from 'common/constant/app-constant'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { log_out } from 'store/actions/auth.action'
import { AppState } from 'store/interface'
import showConfirm from '../confirm'

export default function Dangxuat(): JSX.Element {
    const dispatch = useDispatch()
    const userInfo = useSelector<AppState, boolean | undefined>((state) => state.auth.userInfo)
    const donvi = useSelector<AppState, string | undefined>((state) => state.auth.donvi)
    const showConfirmLogout = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn đăng xuất?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Thoát',
            okType: 'danger',
            cancelText: 'Hủy',
            maskClosable: true,
            onOk: (): void => {
                dispatch(log_out())
            }
        })
    }

    const menu = (
        <Menu>
            <Menu.Item key='1' icon={<UserOutlined />}>
                <Link to={`/${MenuPaths.thongtinnguoidung}`}>Thông tin người dùng</Link>
            </Menu.Item>
            <Menu.Item key='2' icon={<LogoutOutlined />} onClick={showConfirmLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    )
    return (
        <Dropdown overlay={menu} placement='bottom' arrow >
            <div className='user'>
                <Avatar
                    className='avatar_user'
                    style={{ backgroundColor: '#fff', color: 'black', marginRight: '10px' }}
                    icon={<UserOutlined />}
                />
                <div className='user_info'>
                    <span>( {donvi} )</span>
                    <span>{userInfo}</span>
                </div>
            </div>
        </Dropdown>
    )
}
