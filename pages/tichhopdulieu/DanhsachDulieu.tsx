/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { CheckOutlined, DownloadOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import Form from 'antd/lib/form/Form'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { DOWNLOAD_FILE_KQAPI } from 'common/constant/api-constant'
import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getDulieuToken } from 'store/actions/dulieu.action'
import { MenuPaths } from '../../common/constant/app-constant'
import { Doituong } from '../../common/interface/Doituong'
import { isArrayEmpty } from '../../common/utils/empty-util'
import { AppState } from '../../store/interface'

export default function DanhsachDulieu(): JSX.Element {
    const resultList = useSelector<AppState, Doituong[] | undefined>((state) => state.dulieu.resultList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.dulieu.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.dulieu.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.dulieu.pageSize)
    const dataSearch = useSelector<AppState, string | undefined>((state) => state.dulieu.dataSearch)
    const dispatch = useDispatch()
    const tokenIframe = window.location.search.split('=').pop()
    const columns: ColumnsType<Doituong> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => pageSize && currentPage && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        { title: 'Mã loại kết quả', dataIndex: 'ma', key: 'ma', width: '30%' },
        { title: 'Tên loại kết quả', dataIndex: 'ten', key: 'ten' },
        {
            title: 'Kích hoạt',
            dataIndex: 'kichHoat',
            key: 'kichHoat',
            align: 'center',
            width: '10%',
            render: (value) => value === 1 && <CheckOutlined />
        },
        { title: 'Số kết quả', dataIndex: 'count', align: 'center', key: 'phienBan', width: '10%' },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value) => (
                <Fragment>
                    <Tooltip title='Chi tiết' placement='top'>
                        <Link to={`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${value.ma}`}>
                            <Button type='text' icon={<UnorderedListOutlined />}></Button>
                        </Link>
                    </Tooltip>
                    <Tooltip title='Tài liệu hướng dẫn tích hợp' placement='top'>
                        <Button type='text' icon={<DownloadOutlined />} onClick={() => fileKQAPI(value.ma)}></Button>
                    </Tooltip>
                </Fragment>
            )
        }
    ]

    useEffect(() => {
        if (tokenIframe) {
            dispatch(getDulieuToken({ dataSearch, tokenIframe }))
        }
    }, [tokenIframe])

    const onPageChange = (page, pageSize) => dispatch(getDulieuToken({ page, pageSize, dataSearch, tokenIframe }))

    const downloadFile = (url, ma, name) => {
        axios({
            url: `${url}/${ma}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${tokenIframe}` }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
        })
    }
    const fileKQAPI = (ma): void => {
        downloadFile(DOWNLOAD_FILE_KQAPI, ma, `LoaiKetQuaAPI_${ma}.docx`)
    }
    return (
        <Fragment>
            <PageHeader
                ghost={false}
                title='Danh sách loại kết quả'
                style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                extra={[
                    <Space>
                        <Form layout='inline'>
                            <Input.Search
                                style={{ borderRadius: '3px' }}
                                allowClear
                                placeholder='Nhập từ khóa cần tìm'
                                defaultValue={dataSearch}
                                enterButton={
                                    <>
                                        <SearchOutlined /> Tìm kiếm
                                    </>
                                }
                                onSearch={(dataSearch?: string) =>
                                    dispatch(getDulieuToken({ dataSearch, tokenIframe }))
                                }
                            />
                        </Form>
                    </Space>
                ]}
            />
            <Table
                rowKey='id'
                columns={columns}
                size='small'
                dataSource={resultList}
                pagination={false}
                bordered
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(resultList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} của ${total} dòng`
                        }
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        current={currentPage}
                        defaultCurrent={currentPage}
                        defaultPageSize={pageSize}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
