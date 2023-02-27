import { Layout } from 'antd';
import AppRouting from '../../routing';


export default function Content(): JSX.Element {
    return (
        <Layout.Content className='site-layout-background' style={{ margin: '16px 16px 0', padding: '16px', }}>
            <AppRouting />
        </Layout.Content>

    )
}