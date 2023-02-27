/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    BankOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    LockOutlined,
    PlusOutlined,
    SaveOutlined,
    SearchOutlined,
    SlidersTwoTone
} from '@ant-design/icons'
import {
    Button,
    Card,
    ConfigProvider,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    Modal,
    PageHeader,
    Pagination,
    Select,
    Space,
    Switch,
    Table,
    Tooltip
} from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { errorMessage, MenuPaths } from 'common/constant/app-constant'
import { User } from 'common/interface/User'
import { UserGroup } from 'common/interface/UserGroup'
import { getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import { activeUser, changePassword, deleteAllUser, deleteUser, getUserInfo, getUsers } from 'store/actions/user.action'
import { AppState } from 'store/interface'
import '../../assets/css/nguoidung.css'
import { DONVI_LIST_USER_URL, PHONGBAN_IDDONVI } from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
export default function DanhsachNguoidung(): JSX.Element {
    const dispatch = useDispatch<any>()
    const userList = useSelector<AppState, User[] | undefined>((state) => state.user.userList)

    const totalRecords = useSelector<AppState, number | undefined>((state) => state.user.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.user.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.user.pageSize)
    const searchData = useSelector<AppState, string | undefined>((state) => state.user.searchData)
    const idDonVi = useSelector<AppState, number | undefined>((state) => state.user.idDonVi)
    const [form] = Form.useForm()
    const [userGroup, setUserGroup] = useState<UserGroup[] | undefined>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const username = getCookie('username')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [userEdit, setUserEdit] = useState<string | undefined>()
    const [userInfo, setUserInfo] = useState<User | undefined>()
    const [searchDonvi, setSearchDonvi] = useState<number | undefined>()
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    // const [checked, setChecked] = useState<boolean>(false)
    // const [isUpdateEnable, setIsUpdateEnable] = useState<boolean>(false)
    const [dataPhongban, setDataPhongban] = useState<any | undefined>()
    const [idPhongban, setIdPhongban] = useState<any | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)
    const [changePass, setChangePass] = useState(false)
    const [role, setRole] = useState([])
    const [phongBanSearch, setphongBanSearch] = useState<any>()
    useEffect(() => {
        ;(dispatch(getUserInfo()) as any).then((res) => {
            setUserInfo(res.data.data)
            setRole(res.data.data.role)
            SetIsLoading(false)
        })
    }, [])

    useEffect(() => {
        role &&
            role.map((item) => {
                if (item == 'ROLE_CHANGE_PASS' || item == 'ROLE_ADMIN') {
                    setChangePass(true)
                }
            })
    }, [role])

    const showModal = (username) => {
        setUserEdit(username)
        setIsModalVisible(true)
    }
    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onChangeEnble = (value, name) => {
        showConfirm({
            title: 'Bạn có chắc chắn thay đổi trạng thái kích hoạt?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Có',
            okType: 'primary',
            cancelText: 'Hủy',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(activeUser(name, value)) as any)
                    .then((res) => {
                        Notification({
                            status: res.data.errorCode > 0 ? 'error' : 'success',
                            message: res.data.msg
                        })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    const columns: ColumnsType<User> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (value, _, index) => currentPage && pageSize && Math.ceil(currentPage - 1) * pageSize + index + 1
        },
        { title: 'Tên đăng nhập', dataIndex: 'name', key: 'name' },
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Phòng ban',
            dataIndex: 'tenphongban',
            key: 'tenphongban',
            render: (_, value) => {
                return value?.tenphongban ? value.tenphongban : '(Chưa cấu hình)'
            }
        },
        {
            title: 'Đơn vị',
            dataIndex: 'donVi',
            key: 'donVi',
            render: (value) => value?.ten
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Kích hoạt',
            dataIndex: 'isEnable',
            key: 'isEnable',
            align: 'center',
            width: 100,
            render: (value, record) => {
                return (
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={value}
                        onChange={(e) => onChangeEnble(e, record.name)}
                        disabled={record.fullName === username ? true : false}
                    />
                )
            }
        },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: '200px',
            render: (record) => {
                const handleDeleteUser = (): void => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            onDeleteOne(record.id)
                        }
                    })
                }

                return (
                    <>
                        {record.fullName !== username && (
                            <>
                                {/* <Tooltip title='Phân quyền lĩnh vực' color='#2db7f5' placement='top'>
                                    <Link to={`/${MenuPaths.nguoidung}/${MenuPaths.dsnguoidunglinhvuc}/${record.name}`}>
                                        <Button type='text' icon={<SolutionOutlined style={{ color: '#3b8715' }} />} />
                                    </Link>
                                </Tooltip> */}
                                <Tooltip title='Cơ quan quản lý' color='#2db7f5' placement='top'>
                                    <Link to={`/${MenuPaths.nguoidung}/${MenuPaths.danhsachcoquanquanly}/${record.id}`}>
                                        <Button type='text' icon={<BankOutlined style={{ color: '#1890ff' }} />} />
                                    </Link>
                                </Tooltip>
                                {changePass ? (
                                    <Tooltip title='Đổi mật khẩu' color='#ff4d4f' placement='top'>
                                        <Button
                                            type='text'
                                            // icon={<KeyOutlined />}
                                            icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
                                            onClick={() => {
                                                showModal(record.name)
                                            }}
                                        />
                                    </Tooltip>
                                ) : (
                                    ''
                                )}
                                <Link to={`/${MenuPaths.nguoidung}/${record.name}?edit=true`}>
                                    <Tooltip title='Sửa' color='#2db7f5' placement='top'>
                                        <Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} />
                                    </Tooltip>
                                </Link>
                                <Tooltip title='Xóa' color='#ff4d4f' placement='right'>
                                    <Button
                                        type='text'
                                        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                        onClick={handleDeleteUser}
                                    />
                                </Tooltip>
                            </>
                        )}
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => {
        SetIsLoading(true)
        dispatch(getUsers({ page, pageSize, searchData, idDonVi, idPhongban: idPhongban }))
    }
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        },
        getCheckboxProps: (record) => ({
            disabled: record.fullName === username
        })
    }
    const onDeleteOne = (id: number) => {
        dispatch(deleteUser(id))
            .then((res) => {
                dispatch(
                    getUsers({
                        page: currentPage,
                        pageSize,
                        isDelete:
                            userList?.length === 1 ||
                            (userList?.length === selectedRowKeys?.length &&
                                Math.ceil(totalRecords! / pageSize!) === currentPage),
                        searchData: searchData,
                        idDonVi,
                        idPhongban: idPhongban
                    })
                )

                Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
            })
            .catch(() => {
                Notification({ status: 'error', message: 'Xóa người dùng thất bại' })
            })
    }
    const handleDeleteAllUser = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa những mục này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                ;(dispatch(deleteAllUser(selectedRowKeys)) as any)
                    .then((res) => {
                        dispatch(
                            getUsers({
                                page: currentPage,
                                pageSize,
                                isDelete:
                                    userList?.length === 1 ||
                                    (userList?.length === selectedRowKeys?.length &&
                                        Math.ceil(totalRecords! / pageSize!) === currentPage),
                                searchData,
                                idDonVi,
                                idPhongban: idPhongban
                            })
                        )
                        setSelectedRowKeys([])
                        Notification({ status: 'success', message: res.data.msg })
                        setDisabled(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'xóa tất cả người dùng thất bại' })
                    })
            }
        })
    }
    const onFinish = (values) => {
        SetIsLoading(true)
        const { searchData, idDonVi } = values
        dispatch(getUsers({ searchData, idDonVi: idDonVi, pageSize: pageSize, idPhongban: idPhongban }))
    }
    const onChangePassword = (values) => {
        handleCancel()
        form.resetFields()
        const { password, confirm } = values
        dispatch(
            changePassword({
                newPassword: password,
                repeatPassword: confirm,
                userEdit: userEdit
            })
        )
    }

    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setUserGroup(res.data.data)
        })
    }, [])
    useEffect(() => {
        SetIsLoading(true)
        !userList && dispatch(getUsers({ searchData, idPhongban: idPhongban }))
        userList && SetIsLoading(false)
    }, [userList])

    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectUserDonviMorong({ searchData })) as any).then((res) => {
                setUserGroup(res.data?.data)
            })
        }, 300)
    }

    // const onSearchphongban = (dataPhongBans: any) => {
    //     if (typingTimeoutRef.current) {
    //         clearTimeout(typingTimeoutRef.current)
    //     }
    //     typingTimeoutRef.current = setTimeout(() => {
    //         setphongBanSearch(dataPhongBans)
    //     }, 300)
    // }

    useEffect(() => {
        if (searchDonvi !== undefined) {
            axios.get(`${PHONGBAN_IDDONVI}/${searchDonvi}`, Authorization()).then((res) => {
                setDataPhongban(res.data?.result)
            })
        }
    }, [searchDonvi])

    const onChangeInput = (e) => {
        if (!e.target.value) {
            dispatch(getUsers({ idDonVi: searchDonvi, idPhongban: idPhongban }))
        }
    }
    const onChangeSearch = (idDonvi) => {
        SetIsLoading(true)
        setSearchDonvi(idDonvi)
        if (idDonvi !== '') {
            dispatch(getUsers({ searchData, idDonVi: idDonvi, idPhongban: idPhongban }))
        }
    }

    const OnchangePhongban = (idPhongban) => {
        setIdPhongban(idPhongban)
        dispatch(getUsers({ searchData, idDonVi: idDonVi, pageSize: pageSize, idPhongban: idPhongban }))
    }

    const onOpenChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)
        SetIsLoading(true)
        dispatch(getUsers({ searchData, idDonVi: searchDonvi, idPhongban: idPhongban }))
    }
    const menu = (
        <Menu style={{ width: '97%', float: 'left', marginTop: '62px', padding: '10px 10px ', left: '-11.7rem' }}>
            <p style={{ fontSize: '17px' }}>Tìm kiếm nâng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form layout='inline' onFinish={onFinish}>
                {/* <Form.Item name='searchData' style={{ marginRight: '8px' }}>
                                    <Input
                                        style={{ borderRadius: '3px', width: 180 }}
                                        allowClear
                                        placeholder='Nhập từ khóa cần tìm'
                                        onChange={onChangeInput}
                                    />
                                </Form.Item> */}
                <Form.Item name='idDonVi' style={{ marginRight: '8px' }} className='input-donvi'>
                    <Select
                        onChange={onChangeSearch}
                        allowClear
                        onSearch={onSearchDonVi}
                        placeholder='Đơn vị'
                        showSearch
                        style={{ width: 190, textAlign: 'left' }}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {userGroup?.map((item, index) => (
                            <Select.Option key={index} value={`${item.id}`}>
                                {item.ten}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='phongBanId'>
                    <Select
                        onChange={(e) => OnchangePhongban(e)}
                        showSearch
                        allowClear
                        // onSearch={onSearchphongban}
                        placeholder='Phòng ban'
                        style={{ width: 190, textAlign: 'left' }}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {dataPhongban?.map((item, index) => (
                            <Select.Option key={index} value={item?.id}>
                                {item.tenphongban}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* <Button
                                    // style={{padding:''}}
                                    type='primary'
                                    htmlType='submit'
                                    className='btn-submit btn-submit-nguoidung'
                                    icon={<SearchOutlined />}>
                                    Tìm
                                </Button> */}
            </Form>
            <Button
                icon={<SearchOutlined />}
                type='primary'
                style={{ float: 'right', marginTop: '10px' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Tìm kiếm
            </Button>
        </Menu>
    )

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    className='site-page-header'
                    ghost={false}
                    title='Danh sách người dùng '
                    style={{ padding: '16px 0', fontSize: '12px' }}
                    extra={[
                        <Space>
                            <Form layout='inline' style={{ width: 425, textAlign: 'left' }}>
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
                                className='btn-delete-nguoidung'
                                danger
                                type='primary'
                                icon={<DeleteOutlined />}
                                onClick={handleDeleteAllUser}
                                disabled={disabled}>
                                Xóa
                            </Button>
                            <Link to={`/${MenuPaths.nguoidung}/them-moi`}>
                                <Button type='primary' icon={<PlusOutlined />} className='btn-themmmoi-nguoidung'>
                                    Thêm
                                </Button>
                            </Link>
                        </Space>
                    ]}
                />
            </div>
            <Table
                rowKey='id'
                size='small'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={userList}
                pagination={false}
                loading={isLoading}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
            {!isArrayEmpty(userList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        defaultPageSize={pageSize}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} của ${total} dòng`
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}

            <Modal
                width='30%'
                centered
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                footer={[]}>
                <Card title='Đổi mật khẩu' bordered={false} style={{ width: '100%' }}>
                    <Form layout='vertical' onFinish={onChangePassword} form={form}>
                        <Form.Item
                            name='password'
                            label='Nhập mật khẩu mới'
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập mật khẩu mới!'
                                },
                                {
                                    min: 6,
                                    message: 'Vui lòng nhập 6 kí tự trở lên !'
                                }
                            ]}
                            hasFeedback>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name='confirm'
                            label='Xác nhận mật khẩu'
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy xác nhận password!'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp nhau!'))
                                    }
                                })
                            ]}>
                            <Input.Password />
                        </Form.Item>
                        <Button danger type='primary' onClick={handleCancel} style={{ float: 'right' }}>
                            Đóng
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='btn-submit'
                            style={{ float: 'right', marginRight: '10px' }}>
                            <SaveOutlined /> Lưu
                        </Button>
                        &nbsp;
                    </Form>
                </Card>
            </Modal>
        </>
    )
}
