import { Layout, Menu } from 'antd'
import { MenuPermission } from 'common/interface/MenuPermission'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useSelector } from 'react-redux'
import { Link, useRouteMatch } from 'react-router-dom'
import { AppState } from 'store/interface'

interface Props {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

const MenuItem = ({ item, match }): JSX.Element => {
    return (
        <Menu mode='inline'>
            {item.invisible ? (
                isArrayEmpty(item.children) ? (
                    <Menu.Item
                        key={item.id}
                        icon={<i className={`fa fa-${item.icon}`} />}
                        className={`/${match?.path.split('/')[1]}` === item.url ? 'active_menu' : ''}
                        style={{
                            borderBottom: item.idParent === 0 ? '1px solid #f0f0f0' : '',
                            marginTop: '0',
                            marginBottom: '0'
                        }}>
                        <Link to={item.url as string} title={item.name}>
                            {item.name}
                        </Link>
                    </Menu.Item>
                ) : (
                    <Menu.SubMenu
                        key={item.name}
                        title={item.name}
                        icon={<i className={`fa fa-${item.icon}`} />}
                        style={{
                            borderBottom: item.idParent === 0 ? '1px solid #f0f0f0' : '',
                            marginTop: '0',
                            marginBottom: '0'
                        }}>
                        {item.children.map((node: MenuPermission) => (
                            <MenuItem item={node} match={match} key={node.id} />
                        ))}
                    </Menu.SubMenu>
                )
            ) : null}
        </Menu>
    )
}

const SideBar = ({ collapsed, setCollapsed }: Props): JSX.Element => {
    const match = useRouteMatch({
        path: window.location.pathname,
        strict: true,
        sensitive: true
    })
    const menuPermission = useSelector<AppState, MenuPermission[] | undefined>(
        (state) => state.permission.menuPermission
    )

    return (
        <Layout.Sider
            width={265}
            collapsed={collapsed}
            style={{
                overflowY: 'scroll',
                height: '100vh',
                position: 'relative',
                left: 0,
                bottom: 50,
                paddingTop: 50
            }}>
            {menuPermission?.map((item, index) => (
                <MenuItem item={item} match={match} key={index} />
            ))}
        </Layout.Sider>
    )
}

export default SideBar
