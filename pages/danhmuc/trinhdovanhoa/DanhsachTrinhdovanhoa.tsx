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
import { Trinhdovanhoa } from 'common/interface/Danhmuc.interfaces/Trinhdovanhoa'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    deleteAllTrinhdovanhoa,
    deleteTrinhdovanhoa,
    getTrinhdovanhoa
} from 'store/actions/danhmuc.actions/trinhdovanhoa.action'
import { AppState } from 'store/interface'

export default function DanhsachTrinhdovanhoa(): JSX.Element {
    const dispatch = useDispatch()
    const trinhdovanhoaList = useSelector<AppState, Trinhdovanhoa[] | undefined>(
        (state) => state.trinhdovanhoa?.trinhdovanhoaList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.trinhdovanhoa?.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.trinhdovanhoa?.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.trinhdovanhoa?.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.trinhdovanhoa?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.trinhdovanhoa?.sortData)

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [orderDataMa, setOrderDataMa] = useState('asc')
    const [orderDataTen, setOrderDataTen] = useState('asc')

    const columns: ColumnsType<Trinhdovanhoa> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSort(`ma ${orderDataMa}`, 'ma')}>
                    <span>M?? tr??nh ????? v??n h??a</span>{' '}
                    {orderDataMa === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ma',
            key: 'ma'
        },
        {
            title: (
                <div onClick={() => onSort(`ten ${orderDataTen}`, 'ten')}>
                    <span>T??n tr??nh ????? v??n h??a</span>{' '}
                    {orderDataTen === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (record) => {
                const handleDeleteTrinhdovanhoa = (): void => {
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
                        <Link to={`/${MenuPaths.trinhdovanhoa}/${record.id}?edit=true`}>
                            <Tooltip title='S???a' color='#2db7f5' placement='left'>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Tooltip>
                        </Link>
                        <Tooltip title='X??a' color='#ff4d4f' placement='right'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeleteTrinhdovanhoa}
                            />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => dispatch(getTrinhdovanhoa({ page, pageSize, searchData, sortData }))
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onDeleteOne = (id: number) => {
        ;(dispatch(deleteTrinhdovanhoa(id)) as any)
            .then((res) => {
                dispatch(
                    getTrinhdovanhoa({
                        page: currentPage,
                        pageSize,
                        isDelete:
                            trinhdovanhoaList?.length === 1 ||
                            (trinhdovanhoaList?.length === selectedRowKeys?.length &&
                                Math.ceil(totalRecords! / pageSize!) === currentPage),
                        searchData: searchData
                    })
                )
                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
            })
            .catch(() => {
                Notification({ status: 'error', message: 'X??a tr??nh ????? v??n h??a th???t b???i' })
            })
    }
    const handleDeleteAllTrinhdovanhoa = (): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a nh???ng m???c n??y?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteAllTrinhdovanhoa(selectedRowKeys)) as any)
                    .then((res) => {
                        dispatch(
                            getTrinhdovanhoa({
                                page: currentPage,
                                pageSize,
                                isDelete:
                                    trinhdovanhoaList?.length === 1 ||
                                    (trinhdovanhoaList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                searchData
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({ status: 'success', message: res.data.msg })
                        setDisabled(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'x??a t???t c??? tr??nh ????? v??n h??a th???t b???i' })
                    })
            }
        })
    }
    const onSearch = (searchData?: string) => {
        dispatch(getTrinhdovanhoa({ searchData, pageSize: pageSize }))
    }
    const onSort = (sortData, colunm) => {
        if (colunm === 'ma') {
            setOrderDataMa(orderDataMa === 'asc' ? 'desc' : 'asc')
        } else if (colunm === 'ten') {
            setOrderDataTen(orderDataTen === 'asc' ? 'desc' : 'asc')
        }
        dispatch(getTrinhdovanhoa({ searchData, sortData }))
    }
    useEffect(() => {
        !trinhdovanhoaList && dispatch(getTrinhdovanhoa({ searchData }))
    }, [trinhdovanhoaList])
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh s??ch tr??nh ????? v??n h??a'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Form.Item
                                    name='layout'
                                    colon={false}
                                    style={{ fontWeight: 'bold', width: '300px', marginRight: 0 }}>
                                    <Input.Search
                                        defaultValue={searchData}
                                        allowClear
                                        enterButton={
                                            <>
                                                <SearchOutlined /> T??m ki???m
                                            </>
                                        }
                                        placeholder='Nh???p t??? kh??a c???n t??m'
                                        onSearch={onSearch}
                                    />
                                </Form.Item>
                            </Form>
                            <Button
                                danger
                                type='primary'
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteAllTrinhdovanhoa}
                                disabled={disabled}>
                                X??a
                            </Button>
                            <Link to={`/${MenuPaths.trinhdovanhoa}/add`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Th??m m???i
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                size='small'
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={trinhdovanhoaList}
                pagination={false}
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                bordered
                scroll={{ y: '65vh' }}
            />
            {!isArrayEmpty(trinhdovanhoaList) && (
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
