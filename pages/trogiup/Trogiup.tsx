import { Button, Card, Modal } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { getCookie } from 'common/utils/cookie-util'
import { useState } from 'react'
import '../../assets/css/trogiup.css'
export default function Trogiup(): JSX.Element {
    const [fileUrl, setFileUrl] = useState<any>()
    const [visible, setVisible] = useState(false)
    const downloadFile = (url, name) => {
        axios({
            url: `${process.env.REACT_APP_API_URL}/file/download/${url}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
        })
    }
    const onDisplayFile = (id) => {
        axios({
            url: `${process.env.REACT_APP_API_URL}/file/download/${id}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((response) => {
            const file = new Blob([response.data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(file)
            setFileUrl(fileURL)
            setVisible(true)
        })
    }
    return (
        <div className='site-card-border-less-wrapper'>
            <Card title='Trợ giúp' bordered={false} style={{ width: '100%' }}>
                <p>
                    <a href='# ' onClick={() => downloadFile('1', 'UniKySoKQTTHC.zip')}>1. Bộ cài đặt ký số UNI.</a>
                </p>
                <p>
                    <a href='# ' onClick={() => onDisplayFile('2')}>2. Hướng dẫn cài đặt ký số.</a>
                </p>
                <p>
                    <a href='# ' onClick={() => onDisplayFile('3')}>3. Hướng dẫn dành cho quản trị hệ thống.</a>
                </p>
                <p>
                    <a href='# ' onClick={() => onDisplayFile('4')} >4. Hướng dẫn dành cho cán bộ số hóa.</a>
                </p>
            </Card>
            {fileUrl && (
                <Modal
                    closable={false}
                    className='modal-pdf'
                    visible={visible}
                    width='70%'
                    footer={[
                        <Button
                            danger
                            ant-btn-sm
                            type='primary'
                            onClick={() => setVisible(false)}
                            style={{ margin: '10px 10px 10px 0px' }}>
                            Đóng tệp
                        </Button>
                    ]}
                    centered>
                    <iframe src={fileUrl} style={{ width: '100%', height: '75vh' }} title='view-pdf' />
                </Modal>
            )}
        </div>
    )
}
