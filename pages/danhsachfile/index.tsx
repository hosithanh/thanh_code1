/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { SearchOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, DatePicker, Empty, Form, Input, PageHeader, Pagination, Space, Table } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { ACCESS_TOKEN } from 'common/constant'
import { Doituong } from 'common/interface/Doituong'
import { File } from 'common/interface/Files'
import { getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import 'moment/locale/vi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles } from 'store/actions/danhsachfile.action'
import { AppState } from 'store/interface'

export default function DanhSachFile(): JSX.Element {
    const dispatch = useDispatch()
    const files = useSelector<AppState, File[] | undefined>((state) => state.files.files)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.files.currentPage)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.files.totalRecords)
    const dataSearch = useSelector<AppState, string | undefined>((state) => state.files.dataSearch)
    const [isloadingTable, setIsloadingTable] = useState<boolean>(true)

    const downloadFile = (url, name) => {
        axios({
            url: `${process.env.REACT_APP_API_URL}${url}`,
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
    const columns: ColumnsType<Doituong> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '50px',
            render: (value, _, index) => currentPage && Math.ceil(currentPage - 1) * 10 + index + 1
        },
        {
            title: 'T??n t???p ban ?????u',
            dataIndex: 'tenFileBanDau',
            key: 'tenFileBanDau',
            width: '100px'
        },
        {
            title: 'M?? lo???i k???t qu???',
            dataIndex: 'maLoaiKetQua',
            key: 'maLoaiKetQua',
            width: '100px'
        },
        {
            title: 'Ng??y ????nh k??m',
            dataIndex: 'ngayTao',
            width: '100px',
            key: 'ngayTao',
            align: 'center'
        },
        {
            title: 'Thao t??c',
            key: 'action',
            width: '100px',
            align: 'center',
            render: (value) => {
                return (
                    <>
                        {files?.map(
                            (file, index) =>
                                file.id === value?.id && (
                                    <>
                                        <div style={{ marginBottom: '5px' }}>
                                            {/* <strong>D??? li???u g???c : </strong> */}
                                            <a onClick={() => downloadFile(file.fileSuccess, file.tenFileBanDau)}>
                                                D??? li???u ban ?????u
                                            </a>
                                        </div>
                                        <div>
                                            {/* <strong>D??? li???u ch??a import : </strong> */}
                                            <a
                                                onClick={() => downloadFile(file.fileFailed, file.tenFileChuaHoanThanh)}
                                                style={{ color: 'red' }}>
                                                {file.tenFileChuaHoanThanh ? 'D??? li???u import l???i' : ''}
                                            </a>
                                        </div>
                                    </>
                                )
                        )}
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => {
        dispatch(getFiles({ page, pageSize, dataSearch }))
    }
    const onFinish = (value) => {
        const { dataSearch, ngayTao } = value
        const from = ngayTao && ngayTao[0].format('DD/MM/YYYY')
        const to = ngayTao && ngayTao[1].format('DD/MM/YYYY')

        dispatch(getFiles({ dataSearch, from, to }))
    }
    useEffect(() => {
        !files && dispatch(getFiles({ dataSearch }))
    }, [])
    useEffect(() => {
        files && setIsloadingTable(false)
    }, [files])

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh s??ch t???p ????nh k??m'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <div style={{ display: 'flex', justifyContent: 'space-between', height: '32px' }}>
                                <Form style={{ display: 'flex' }} onFinish={onFinish}>
                                    <Form.Item name='dataSearch' style={{ width: '300px' }}>
                                        <Input
                                            defaultValue={dataSearch}
                                            placeholder='Nh???p t??n t???p ????nh k??m'
                                            allowClear
                                        />
                                    </Form.Item>
                                    <Form.Item name='ngayTao' style={{ margin: '0 10px' }}>
                                        <DatePicker.RangePicker
                                            placeholder={['T??? ng??y', '?????n ng??y']}
                                            format='DD/MM/YYYY'
                                            locale={locale}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>
                                            <SearchOutlined />
                                            T??m ki???m
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Space>
                    ]}
                />
            </div>

            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={files}
                pagination={false}
                bordered
                loading={isloadingTable}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(files) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} do??ng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
