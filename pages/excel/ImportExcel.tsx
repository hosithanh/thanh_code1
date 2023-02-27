/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { BackwardOutlined, FileExcelOutlined, FileOutlined } from '@ant-design/icons'
import { Button, Form, PageHeader, Spin } from 'antd'
import 'assets/css/excel.css'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { ACCESS_TOKEN, USER_NAME } from 'common/constant'
import { DOWNLOAD_FILE_CSV, DOWNLOAD_FILE_EXCEL } from 'common/constant/api-constant'
import { MenuPaths } from 'common/constant/app-constant'
import { Doituong } from 'common/interface/Doituong'
import { getCookie } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getDulieu } from 'store/actions/dulieu.action'
import { getResultID } from 'store/actions/ketqua.action'

export default function ImportExcel(): JSX.Element {
    const param = useParams<any>()
    const history = useHistory()
    const maDoiTuong = param.id
    const dispatch = useDispatch()
    const [resultDetail, setResultDetail] = useState<Doituong | undefined>()
    // const userName = useSelector<AppState | undefined>((state) => state.auth.userName)
    useEffect(() => {
        maDoiTuong &&
            (dispatch(getResultID(maDoiTuong)) as any).then((res) => {
                setResultDetail(res?.data?.data)
            })
    }, [])

    const downloadFile = (url, ma, name) => {
        axios({
            url: `${url}/${ma}`,
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

    const fileExcel = (): void => {
        downloadFile(DOWNLOAD_FILE_EXCEL, resultDetail?.ma, `info.xlsx`)
    }
    const fileCSV = (): void => {
        downloadFile(DOWNLOAD_FILE_CSV, resultDetail?.ma, `info.csv`)
    }
    const [loading, setLoading] = useState<boolean>(false)

    const onFinish = () => {
        setLoading(true)
        axios({
            method: 'post',
            url: 'https://uniplugin.unitech.vn:9876',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            data: {
                method: 'importExcelSoHoa',
                uploadHandleUrl: `${process.env.REACT_APP_API_URL}/public/file/multiuploadkyso?safe=1&maDoiTuong=${maDoiTuong}`,
                auth: {
                    jwt: getCookie(USER_NAME)
                }
            }
        })
            .then((res) => {
                setLoading(false)
                dispatch(getDulieu({}))
                Notification({ status: 'success', message: 'Hoàn thành import dữ liệu!' })
            })
            .catch(() => {
                setLoading(false)
                Notification({
                    status: 'error',
                    message: 'Vui lòng khởi động phần mềm ký số trước khi thực hiện chức năng!'
                })
            })
    }
    return (
        <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_kyso' spinning={loading}>
            <div className='group-action'>
                <PageHeader ghost={false} title={`IMPORT EXCEL - ${resultDetail?.ma}`} style={{ padding: '16px 0' }} />
            </div>
            <div className='form-import'>
                <div>
                    <strong>Tải tệp tin mẫu tại đây :</strong>
                    <a style={{ padding: '0 10px' }} onClick={fileExcel}>
                        <FileExcelOutlined />
                        File Excel mẫu
                    </a>
                    <a onClick={fileCSV}>
                        <FileOutlined />
                        File CSV mẫu
                    </a>
                </div>
                <div className='note'>
                    <p>
                        Chú ý: Để cho việc import được nhanh chóng, chính xác, vui lòng upload lên tệp tin được tạo ra
                        từ tệp tin mẫu ở trên
                    </p>
                    <p>Đối với các dữ liệu ngày, vui lòng nhập định dạng yyyy-mm-dd</p>
                    <p>Đối với các dữ liệu kiểu giờ, vui lòng nhập định dạng HH:MM:SS</p>
                </div>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item>
                        <div className='button-import'>
                            <Button
                                style={{ background: '#d9d9d9', marginRight: '10px' }}
                                onClick={() => history.push(`/${MenuPaths.importExcel}`)}>
                                <BackwardOutlined /> Quay Lại
                            </Button>
                            <Button type='primary' htmlType='submit'>
                                Import
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
