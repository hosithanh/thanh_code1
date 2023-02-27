/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { BackwardOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Empty, PageHeader, Pagination, Space, Table, Tooltip } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import { Danhsachcoquanquanly } from 'common/interface/Danhsachcoquanquanly'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { deleteCoQuanQuanLy, getAllCoQuanQuanLy } from 'store/actions/user.action'
import { AppState } from 'store/interface'
import showConfirm from '../../common/component/confirm'
import { Notification } from '../../common/component/notification'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'

export default function DanhsachCoquanquanly(): JSX.Element {
    const dispatch = useDispatch()
    const history = useHistory()
    const pathname = window.location.pathname.split('/').pop()
    const danhsachcoquanquanlyList = useSelector<AppState, Danhsachcoquanquanly[] | undefined>(
        (state) => state.danhsachcoquanquanly.danhsachcoquanquanlyList
    )
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.danhsachcoquanquanly.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.danhsachcoquanquanly.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.danhsachcoquanquanly.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [sortOrder, setSortOrder] = useState('ASC')
    const [SortName, setSortName] = useState(true)
    const columns: ColumnsType<Danhsachcoquanquanly> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },

        {
            title: (
                <div>
                    <span>Tên đơn vị</span>
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '150px',
            render: (value) => {
                return (
                    <Fragment>
                        <Tooltip title='Xóa' placement='right'>
                            <Button
                                danger
                                type='text'
                                icon={<DeleteOutlined />}
                                onClick={() => deleteOne(`${value.id}`)}
                            />
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]
    useEffect(() => {
        dispatch(getAllCoQuanQuanLy({ pathname }))
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(
                selectedRows.map((item) => {
                    return item.id
                })
            )
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }

    const onPageChange = (page, pageSize) => {
        dispatch(getAllCoQuanQuanLy({ pathname, page, pageSize }))
    }

    const deleteOne = (id) => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteCoQuanQuanLy([id], pathname)) as any)
                    .then((res) => {
                        dispatch(getAllCoQuanQuanLy({ pathname }))
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    const deleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                return (dispatch(deleteCoQuanQuanLy(selectedRowKeys, pathname)) as any)
                    .then((res) => {
                        dispatch(getAllCoQuanQuanLy({ pathname }))
                        setDisabled(true)
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title={`Danh sách cơ quan quản lý `}
                    extra={[
                        <Space>
                            <Button onClick={(): void => history.goBack()}>
                                <BackwardOutlined />
                                Quay lại
                            </Button>
                            <Button
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                                disabled={disabled}
                                onClick={deleteAll}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.nguoidung}/${MenuPaths.danhsachthemcoquanquanly}/${pathname}`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='id'
                columns={columns}
                dataSource={danhsachcoquanquanlyList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                rowSelection={{ ...rowSelection }}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(danhsachcoquanquanlyList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        onChange={onPageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
