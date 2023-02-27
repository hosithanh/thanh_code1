import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

function NoMatch() {
    return (
        <Result
            status="404"
            subTitle="Xin lỗi, trang bạn đã truy cập không tồn tại"
            style={{ fontSize: '16px' }}
            extra={
                <Link to={'/'}>
                    <Button type="primary">
                        Trang Chủ
                    </Button>
                </Link>
            }
        />
    )
}

export default NoMatch