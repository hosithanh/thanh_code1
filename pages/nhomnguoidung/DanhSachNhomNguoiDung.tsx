/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    CaretDownOutlined,
    CaretUpOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    ShareAltOutlined,
    SlidersTwoTone,
    UsergroupAddOutlined,
    CloseOutlined
} from '@ant-design/icons'
import {
    Button,
    ConfigProvider,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    PageHeader,
    Pagination,
    Select,
    Space,
    Table,
    Tooltip,
    Tree
} from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import {
    DATAPERMISSION_URL,
    DONVI_LIST_USER_URL,
    PERMISSION_URL,
    UPDATEPERMISSION_URL
} from 'common/constant/api-constant'
import { MenuPaths } from 'common/constant/app-constant'
import { Donvi } from 'common/interface/Donvi'
import { MenuPermission } from 'common/interface/MenuPermission'
import { UserGroup } from 'common/interface/UserGroup'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPermission } from 'store/actions/app.action'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import { deleteAllUserGroup, deleteUserGroup, getUsersGroup } from 'store/actions/nhomnguoidung.action'
import { AppState } from 'store/interface'

import '../../assets/css/nhomnguoidung.css'

export default function UserGroupList(): JSX.Element {
    const dispatch = useDispatch()
    const userGroupList = useSelector<AppState, UserGroup[] | undefined>((state) => state.userGroup.result)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.userGroup.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.userGroup.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.userGroup.pageSize)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [isDrowVisible, setIsDrowVisible] = useState(false)
    const [data, setData] = useState<MenuPermission[] | undefined>()
    const [datapermission, setDatapermission] = useState<MenuPermission[] | undefined>()
    const [groupcodepermission, setGroupcodepermission] = useState<string | undefined>()
    const [expandedKeys, setExpandedKeys] = useState(['10'])
    const [checkedKeys, setCheckedKeys] = useState([13])
    const [autoExpandParent, setAutoExpandParent] = useState(true)
    const [SortName, setSortName] = useState(true)
    const [SortGroupCode, setSortGroupCode] = useState(false)
    const searchData = useSelector<AppState, string | undefined>((state) => state.userGroup?.searchData)
    const sortData = useSelector<AppState, string | undefined>((state) => state.userGroup?.sortData)
    const [SortOrder, setSortOrder] = useState(true)
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const total = []
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [donviId, setDonviId] = useState<string[] | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)

    useEffect(() => {
        axios.get(`${PERMISSION_URL}?isTree=true`, Authorization()).then((res) => {
            setData(res.data.result)
            SetIsLoading(false)
        })
    }, [])
    useEffect(() => {
        SetIsLoading(true)
        dispatch(getUsersGroup({ pageSize, searchData, sortData, idDonvi: donviId }))
    }, [donviId])

    const ongetdataPermission = (groupcode: string) => {
        axios.get(`${DATAPERMISSION_URL}/${groupcode}`, Authorization()).then((res) => {
            setDatapermission(res.data.data.systemPermissions)
        })
        setGroupcodepermission(groupcode)
    }

    useEffect(() => {
        let arrcheck: any = []
        if (datapermission !== undefined) {
            datapermission?.map((item) => {
                arrcheck.push(item.id)
            })
            setCheckedKeys(arrcheck)
        }
    }, [datapermission])
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue)
        setAutoExpandParent(true)
    }

    const onCheck = (checkedKeysValue, info) => {
        setCheckedKeys(checkedKeysValue)
    }

    const onClose = () => {
        setIsDrowVisible(false)
    }

    const drawTree = (indexTotal, indexData) => {
        indexData?.map((i: any) => {
            let dataTemp = []
            if (i?.children !== undefined && i?.children.length > 0) {
                indexTotal.push({ title: i.name, key: i.id, children: drawTree(dataTemp, i.children) })
            } else {
                indexTotal.push({ title: i.name, key: i.id })
            }
        })
        return indexTotal
    }

    const treeData = [
        {
            title: <Fragment>Danh sách quyền</Fragment>,
            key: -99,
            checkable: false,
            children: drawTree(total, data)
        }
    ]

    const onOpenChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }

    const columns: ColumnsType<UserGroup> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        {
            title: (
                <div onClick={() => onSortBy(`${SortOrder}`, `groupCode`)}>
                    <span>Mã nhóm</span> {SortGroupCode ? <CaretDownOutlined /> : <CaretUpOutlined />}
                </div>
            ),

            dataIndex: 'groupCode',
            key: 'groupCode'
        },
        {
            title: (
                <div onClick={() => onSortBy(`${SortOrder}`, `name`)}>
                    <span>Tên nhóm</span> {SortName ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
            ),
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: (
                <div>
                    <span>Tên đơn vị</span>
                </div>
            ),
            dataIndex: 'donVi',
            key: 'donVi',
            render: (text, row) => {
                return (
                    <div>
                        <span>{text?.ten}</span>
                    </div>
                )
            }
        },
        {
            title: <span>Ghi chú</span>,
            dataIndex: 'note',
            key: 'note'
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '200px',
            render: (value) => {
                const idDV = value?.donVi?.id

                const handleDeleteUserGroup = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            onDeleteOne(value.groupCode)
                        }
                    })
                }
                return (
                    <Fragment>
                        <Tooltip title='Phân quyền lĩnh vực' color='green' placement='top'>
                            {/* <Button type='text' icon={<ShareAltOutlined style={{ color: 'green' }} />} /> */}
                            <Link
                                to={`/${MenuPaths.nhomnguoidung}/${MenuPaths.phanquyennhomnguoidung}/${
                                    value.groupCode
                                }?idDonVi=${idDV ? idDV : ''}`}>
                                <Button type='text' icon={<ShareAltOutlined style={{ color: 'green' }} />} />
                            </Link>
                        </Tooltip>
                        <Tooltip title='Phân quyền menu' color='green' placement='top'>
                            <Button
                                type='text'
                                icon={<CheckCircleOutlined style={{ color: 'green' }} />}
                                onClick={(): void => {
                                    setIsDrowVisible(true)
                                    ongetdataPermission(value.groupCode)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title='Danh sách người dùng trong nhóm ' color='#2db7f5' placement='top'>
                            <Link
                                to={`/${MenuPaths.nhomnguoidung}/${MenuPaths.dsnguoidungtrongnhom}/${value.groupCode}`}>
                                <Button type='text' icon={<UsergroupAddOutlined style={{ color: '#1890ff' }} />} />
                            </Link>
                        </Tooltip>
                        <Tooltip title='Sửa' color='#2db7f5' placement='top'>
                            <Link to={`/${MenuPaths.nhomnguoidung}/${value.groupCode}?edit=true`}>
                                <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                            </Link>
                        </Tooltip>
                        <Tooltip title='Xóa' color='#ff4d4f' placement='top'>
                            <Button
                                type='text'
                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                onClick={handleDeleteUserGroup}
                            />
                        </Tooltip>
                    </Fragment>
                )
            }
        }
    ]
    useEffect(() => {
        SetIsLoading(true)
        !userGroupList && dispatch(getUsersGroup({ searchData }))
        userGroupList && SetIsLoading(false)
    }, [userGroupList])

    const onDeleteOne = (groupCodes: string) => {
        ;(dispatch(deleteUserGroup(groupCodes)) as any)
            .then((res) => {
                Notification({ status: 'success', message: res.data.msg })
            })
            .catch((res) => {
                Notification({ status: 'error', message: res.data.msg })
            })
    }

    // const onSearch = (value: any) => {
    // }
    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)
        SetIsLoading(true)
        dispatch(getUsersGroup({ searchData, pageSize: pageSize, idDonvi: donviId }))
    }
    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(getUsersGroup({ page, pageSize, searchData, sortData }))
    }

    const onSortBy = (sortData, colum) => {
        if (colum === 'groupCode') {
            setSortOrder(!SortOrder)
            setSortGroupCode(!SortGroupCode)
        } else if (colum === 'name') {
            setSortOrder(!SortOrder)
            setSortName(!SortName)
        }
        dispatch(getUsersGroup({ searchData, sortData }))
    }

    const onUpdatePermission = (Arridpermission, groupCode) => {
        Arridpermission = Arridpermission.checked ? Arridpermission.checked : Arridpermission
        axios
            .put(
                `${UPDATEPERMISSION_URL}`,
                {
                    systemPermissions: Arridpermission?.map((item) => {
                        return {
                            id: item
                        }
                    }),
                    groupCode: groupCode
                },
                Authorization()
            )
            .then((res) => {
                dispatch(getPermission())
                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
                res.data.status ? setIsDrowVisible(false) : setIsDrowVisible(true)
            })
            .catch((res) => {
                Notification({ status: 'error', message: res.data.msg })
            })
    }
    const handleDeleteAllUserGroup = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteAllUserGroup(selectedRowKeys)) as any)
                    .then((res) => {
                        setDisabled(true)
                        Notification({ status: 'success', message: res.data.msg })
                    })
                    .catch((res) => {
                        Notification({ status: 'error', message: res.data.msg })
                    })
            }
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectUserDonviMorong({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 300)
    }
    const onChangeDonVi = (idDonvi) => {
        setDonviId(idDonvi)
    }
    const onChangeAllDonVi = () => {
        setDonviId(undefined)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const menu = (
        <Menu style={{ width: '120%', float: 'left', marginTop: '62px', padding: '10px 10px ', left: '-10.3rem' }}>
            <p style={{ fontSize: '17px' }}>Tìm kiếm nâng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form.Item
                label='Đơn vị'
                name='idDonVi'
                style={{ marginTop: '10px', padding: '0px 5px' }}
                className='input-donvi'>
                <Select
                    onSearch={onSearchDonVi}
                    allowClear
                    onChange={(_, value) => {
                        if (value !== undefined) {
                            onChangeDonVi(value['value'])
                        } else {
                            onChangeAllDonVi()
                        }
                    }}
                    placeholder='---Chọn đơn vị---'
                    showSearch
                    style={{ width: 240, textAlign: 'left', padding: '0px 5px' }}
                    optionFilterProp='children'
                    filterOption={(input, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {donviList?.map((item, index) => (
                        <Select.Option key={index} value={`${item.id}`}>
                            {item.ten}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Button
                icon={<SearchOutlined />}
                type='primary'
                style={{ float: 'right' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Tìm kiếm
            </Button>
            {/* <Button
                icon={<SearchOutlined />}
                // type='danger'
                style={{ float: 'right' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Đóng
            </Button> */}
        </Menu>
    )

    return (
        <>
            <Drawer
                title='DANH SÁCH QUYỀN'
                width={400}
                onClose={(): void => {
                    setIsDrowVisible(false)
                }}
                visible={isDrowVisible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: 'right'
                        }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={() => {
                                onUpdatePermission(checkedKeys, groupcodepermission)
                            }}
                            type='primary'>
                            Lưu
                        </Button>
                    </div>
                }>
                <Tree
                    checkable
                    checkStrictly
                    multiple
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                />
            </Drawer>

            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách nhóm người dùng'
                    extra={[
                        <Space>
                            {/* <Form.Item
                                name='idDonVi'
                                style={{ marginRight: '8px', marginTop: '24px' }}
                                className='input-donvi'>
                                <Select
                                    onSearch={onSearchDonVi}
                                    allowClear
                                    onChange={(_, value) => {
                                        if (value !== undefined) {
                                            onChangeDonVi(value['value'])
                                        } else {
                                            onChangeAllDonVi()
                                        }
                                    }}
                                    placeholder='Đơn vị'
                                    showSearch
                                    style={{ width: 190, textAlign: 'left' }}
                                    optionFilterProp='children'
                                    filterOption={(input, option: any) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {donviList?.map((item, index) => (
                                        <Select.Option key={index} value={`${item.id}`}>
                                            {item.ten}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item> */}

                            {/* <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    defaultValue={searchData}
                                    enterButton={
                                        <>
                                            <SearchOutlined /> Tìm kiếm
                                        </>
                                    }
                                    onSearch={onSearch}
                                />
                            </Form> */}
                            <Form layout='inline' style={{ width: 321, textAlign: 'left' }}>
                                <Input.Search
                                    onChange={(event) => {
                                        setdataSearch(event.target.value)
                                    }}
                                    allowClear={true}
                                    defaultValue={searchData}
                                    onSearch={onSearch}
                                    placeholder='Nhập từ khóa cần tìm'
                                    prefix={<SearchOutlined className='site-form-item-icon' />}
                                    suffix={
                                        <Dropdown
                                            open={disibleDrop}
                                            onOpenChange={onOpenChange}
                                            className='search-overlay-dropdown'
                                            overlay={menu}
                                            trigger={['click']}
                                            placement='bottom'
                                            arrow={false}>
                                            <Tooltip title='Tìm kiếm nâng cao'>
                                                <SlidersTwoTone style={{ fontSize: '15px' }} />
                                            </Tooltip>  
                                        </Dropdown>
                                    }
                                />
                            </Form>
                            <Button
                                danger
                                disabled={disabled}
                                type='primary'
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteAllUserGroup}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.nhomnguoidung}/them-moi`}>
                                <Button type='primary' icon={<PlusOutlined />}>
                                    Thêm mới
                                </Button>
                            </Link>
                        </Space>
                    ]}></PageHeader>
            </div>
            <Table
                rowKey='groupCode'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={userGroupList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                loading={isLoading}
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(userGroupList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        defaultCurrent={1}
                        current={currentPage}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        onChange={onPageChange}
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
