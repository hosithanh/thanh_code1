import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import React from 'react'
import Dangxuat from '../header/Dangxuat'

interface Props {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

export default function Header({ collapsed, setCollapsed }: Props): JSX.Element {
    return (
        <Layout.Header className='layout-header'>
            <div className='logo-header'>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: (): void => setCollapsed(!collapsed)
                })}
                <div className='title-header'>SỐ HÓA KẾT QUẢ GIẢI QUYẾT TTHC</div>
            </div>
            <Dangxuat />
        </Layout.Header>
    )
}
