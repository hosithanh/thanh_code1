/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Spin } from 'antd'
import { MenuPermission } from 'common/interface/MenuPermission'
import { isArrayEmpty } from 'common/utils/empty-util'
import { set } from 'js-cookie'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPermission } from 'store/actions/app.action'
import { AppState } from 'store/interface'
import '../../../assets/css/layout.css'
import Content from './Content'
import Header from './Header'
import SideBar from './SideBar'

export default function AppLayout(): JSX.Element {
    const [collapsed, setCollapsed] = useState<boolean>(true)
    let resizeWindow = () => {
        if (window.innerWidth <= 1024) {
            setCollapsed(true)
        } else {
            setCollapsed(false)
        }
    }

    useEffect(() => {
        resizeWindow()
        window.addEventListener('resize', resizeWindow)
        return () => window.removeEventListener('resize', resizeWindow)
    }, [])

    const menuPermission = useSelector<AppState, MenuPermission[] | undefined>(
        (state) => state.permission.menuPermission
    )
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPermission())
    }, [])

    return (
        <div>
            <Layout>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                {isArrayEmpty(menuPermission) ? (
                    <Spin size='large' tip='Đang tải dữ liệu' className='loading-layout' />
                ) : (
                    <Layout className='site-layout'>
                        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
                        <Layout.Content>
                            <Content />
                        </Layout.Content>
                    </Layout>
                )}
            </Layout>
        </div>
    )
}
