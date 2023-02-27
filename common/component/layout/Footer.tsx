import { Col, Layout, Row } from 'antd'
import '../../../assets/css/footer.css'

export default function Footer(): JSX.Element {
    return (
        <Layout.Footer className='footer--content'>
            <Row>
                <Col span={24}>
                    <p className='dvql'>Đơn vị quản lý: Sở Thông Tin và Truyền Thông thành phố Cần Thơ</p>
                </Col>
                <Col span={14} xs={24} sm={24} md={24} xl={24} xxl={14} lg={24}>
                    <p className='contact--information'>
                        Mọi vướng mắc xin vui lòng liên hệ: Trung tâm Công Nghệ Thông Tin và Truyền Thông
                    </p>
                </Col>
                <Col span={10} xs={24} sm={24} md={24} xl={24} xxl={10} lg={24}>
                    <p className='email--information'>
                        {' -'}
                        Email: baotri1cua@cantho.gov.vn - Điện thoại: 02923.762.333
                    </p>
                </Col>
            </Row>
        </Layout.Footer>
    )
}
