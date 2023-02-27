import { Modal } from 'antd'
import axios from 'axios'
import { DOWLOAD_FILE } from 'common/constant/api-constant'
import queryString from 'query-string'
import { useEffect, useState } from 'react'

function XemTepKySo() {
    // query string
    const parsed = queryString.parse(window.location.search)
    const tokenIframe = parsed.token
    const signature = parsed.signature
    //
    const [fileUrl, setFileUrl] = useState<any>()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (tokenIframe && signature) {
            axios({
                url: `${DOWLOAD_FILE}/${signature}`,
                method: 'GET',
                responseType: 'blob',
                headers: { Authorization: `Bearer ${tokenIframe as string}` }
            }).then((response) => {
                const file = new Blob([response.data], { type: 'application/pdf' })
                const fileURL = URL.createObjectURL(file)

                setFileUrl(fileURL)
                setVisible(true)
            })
        }
    }, [tokenIframe, signature])

    return (
        <div>
            {fileUrl && (
                <Modal
                    closable={false}
                    className='modal-pdf'
                    visible={visible}
                    width='100%'
                    style={{ maxWidth: 'none', padding: '0' }}
                    centered
                    footer={null}
                >
                    <iframe
                        src={fileUrl}
                        style={{ width: '100%', height: '100vh' }}
                        title='view-pdf'
                    />
                </Modal>
            )}
        </div>
    )
}

export default XemTepKySo
