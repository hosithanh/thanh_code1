/* eslint-disable react-hooks/exhaustive-deps */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import { Button, ConfigProvider, Empty, Form, Input, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { MenuPaths } from 'common/constant/app-constant'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteAllLoaiGiayTo, deleteLoaiGiayTo, getLoaiGiayTo } from 'store/actions/danhmuc.actions/loaigiayto.action'
import { AppState } from 'store/interface'

interface Props {
    isModal?: boolean
    copyDoiTuong?: boolean
    setIsModalVisible?: (isModalVisible: boolean) => void
    setIsModalVisibleTTHC?: (isModalVisibleTTHC: boolean) => void
    setLoaiGiayTo: (loaiGiayto: Loaigiayto) => void
}

export default function DanhsachLoaigiayto({
    copyDoiTuong,
    isModal,
    setIsModalVisible,
    setLoaiGiayTo,
    setIsModalVisibleTTHC
}: Props): JSX.Element {
    const dispatch = useDispatch()
    const loaigiaytoList = useSelector<AppState, Loaigiayto[] | undefined>((state) => state.loaigiayto?.loaigiaytoList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.loaigiayto?.pageSize)
    //const searchData = useSelector<AppState, string | undefined>((state) => state.loaigiayto?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.loaigiayto?.sortData)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTenGiayTo, setOrderDataTenGiayTo] = useState('asc')
    const [orderDataMaGiayTo, setOrderDataMaGiayTo] = useState('asc')
    const [orderDataTenTTHC, setOrderDataTenTTHC] = useState('asc')
    const [searchData, setSearchData] = useState('')
    const [isLoading, SetIsLoading] = useState<boolean>(true)

    const chonGiayTo = (giayto) => {
        setLoaiGiayTo(giayto)
        copyDoiTuong ? setIsModalVisibleTTHC(false) : setIsModalVisible(false)
    }

    const columns: ColumnsType<Loaigiayto> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => (
                <div key={value.id}>{currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1}</div>
            )
        },
        {
            title: (
                <div onClick={() => onSort(`matthc ${orderDataMa}`, 'matthc')}>
                    <span>M?? th??? t???c h??nh ch??nh</span>{' '}
                    {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            align: 'right',
            width: '190px',
            dataIndex: 'matthc',
            key: 'matthc'
        },
        {
            title: (
                <div onClick={() => onSort(`tenTTHC ${orderDataTenTTHC}`, 'tenTTHC')}>
                    <span>T??n th??? t???c h??nh ch??nh</span>{' '}
                    {orderDataTenTTHC === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'tenTTHC',
            key: 'tenTTHC'
        },
        {
            title: (
                <div onClick={() => onSort(`maGiayTo ${orderDataMaGiayTo}`, 'maGiayTo')}>
                    <span>M?? gi???y t???</span> {orderDataMaGiayTo === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            align: 'right',
            width: '190px',
            dataIndex: 'maGiayTo',
            key: 'maGiayTo'
        },
        {
            title: (
                <div onClick={() => onSort(`tenGiayTo ${orderDataTenGiayTo}`, 'tenGiayTo')}>
                    <span>T??n gi???y t???</span>{' '}
                    {orderDataTenGiayTo === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'tenGiayTo',
            key: 'tenGiayTo'
        },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '105px',
            render: (record) => {
                const handleDeleteLoaiGiayTo = (): void => {
                    showConfirm({
                        title: 'B???n c?? ch???c ch???n mu???n x??a?',
                        icon: <ExclamationCircleOutlined />,
                        okText: '?????ng ??',
                        okType: 'primary',
                        cancelText: 'Kh??ng',
                        maskClosable: true,
                        onOk: (): void => {
                            onDeleteOne(record.id)
                        }
                    })
                }
                return (
                    <>
                        {!isModal ? (
                            <>
                                <Link to={`/${MenuPaths.loaigiayto}/${record.id}?edit=true`}>
                                    <Tooltip title='S???a' color='#2db7f5' placement='left'>
                                        <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                                    </Tooltip>
                                </Link>
                                <Tooltip title='X??a' color='#ff4d4f' placement='right'>
                                    <Button
                                        type='text'
                                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                        onClick={handleDeleteLoaiGiayTo}
                                    />
                                </Tooltip>
                            </>
                        ) : (
                            <Button style={{ background: 'green', color: 'white' }} onClick={() => chonGiayTo(record)}>
                                Ch???n
                            </Button>
                        )}
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(getLoaiGiayTo({ page, pageSize, searchData: searchData, sortData }))
    }
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onDeleteOne = (id: number) => {
        ;(dispatch(deleteLoaiGiayTo(id)) as any)
            .then((res) => {
                dispatch(
                    getLoaiGiayTo({
                        page: currentPage,
                        pageSize,
                        isDelete:
                            loaigiaytoList?.length === 1 ||
                            (loaigiaytoList?.length === selectedRowKeys?.length &&
                                Math.ceil(totalRecords! / pageSize!) === currentPage),
                        searchData: searchData
                    })
                )
                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
            })
            .catch(() => {
                Notification({ status: 'error', message: 'X??a lo???i gi???y t??? th???t b???i' })
            })
    }
    const handleDeleteAllLoaiGiayTo = (): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a nh???ng m???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteAllLoaiGiayTo(selectedRowKeys)) as any)
                    .then((res) => {
                        SetIsLoading(true)
                        dispatch(
                            getLoaiGiayTo({
                                page: currentPage,
                                pageSize,
                                isDelete:
                                    loaigiaytoList?.length === 1 ||
                                    (loaigiaytoList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                searchData
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({ status: 'success', message: res.data.msg })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'X??a t???t c??? lo???i gi???y t??? th???t b???i' })
                    })
            }
        })
    }
    const onSearch = (searchData?: string) => {
        SetIsLoading(true)
        setSearchData(searchData)
        dispatch(getLoaiGiayTo({ searchData, pageSize: pageSize }))
    }
    const onSort = (sortData, colunm) => {
        if (colunm === 'matthc') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'tenGiayTo') {
            setOrderDataTenGiayTo(orderDataTenGiayTo === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'maGiayTo') {
            setOrderDataMaGiayTo(orderDataMaGiayTo === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'tenTTHC') {
            setOrderDataTenTTHC(orderDataTenTTHC === 'asc' ? 'desc' : 'asc')
        }

        dispatch(getLoaiGiayTo({ searchData, sortData }))
    }
    useEffect(() => {
        loaigiaytoList && SetIsLoading(false)
        !loaigiaytoList && dispatch(getLoaiGiayTo({ searchData }))
    }, [loaigiaytoList])

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh s??ch lo???i gi???y t???'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Form.Item
                                    name='layout'
                                    colon={false}
                                    style={{
                                        fontWeight: 'bold',
                                        width: `${isModal ? '80vh' : '300px'}`,
                                        marginRight: 0
                                    }}>
                                    <Input.Search
                                        defaultValue={searchData}
                                        allowClear
                                        // enterButton={
                                        //     <>
                                        //         <SearchOutlined /> T??m ki???m
                                        //     </>
                                        // }
                                        prefix={<SearchOutlined className='site-form-item-icon' />}
                                        placeholder='Nh???p t??? kh??a c???n t??m'
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </Form>
                            {!isModal && (
                                <>
                                    <Button
                                        danger
                                        type='primary'
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteAllLoaiGiayTo}
                                        disabled={disabled}>
                                        X??a
                                    </Button>
                                    <Link to={`/${MenuPaths.loaigiayto}/add`}>
                                        <Button type='primary' icon={<PlusOutlined />}>
                                            Th??m m???i
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={loaigiaytoList}
                pagination={false}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                bordered
                loading={isLoading}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(loaigiaytoList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} c???a ${total} do??ng`
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
