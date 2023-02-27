import { BackwardOutlined, ClearOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, PageHeader, Row, Select } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { addMenu, editMenu } from 'store/actions/menu.action'
import '../../assets/css/menu.css'
import { Notification } from '../../common/component/notification'
import { CHUCNANG_LIST_URL, MENU_PARENT_URL_SELECT, MENU_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Chucnang } from '../../common/interface/Chucnang'
import { Menu } from '../../common/interface/Menu'
import { Authorization } from '../../common/utils/cookie-util'

export default function UserDetail(): JSX.Element {
    const dispatch = useDispatch()
    const history = useHistory()
    const [chucnangMenu, setChucNang] = useState<Chucnang[] | undefined>()
    const [menuCha, setMenuCha] = useState<Menu[] | undefined>()
    const [menuDetail, setMenuDetail] = useState<Menu | undefined>()

    if (menuDetail?.menuParent?.id) {
        menuCha?.unshift({ id: 0, ten: 'Không chọn' })
    }
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const isDetail = !isAdd && !isEdit
    const title = { add: 'Thêm Menu mới', detail: 'Thông tin Menu', edit: 'Chỉnh sửa Menu' }
    const [form] = Form.useForm()

    useEffect(() => {
        !isDetail &&
            axios.get(MENU_PARENT_URL_SELECT, Authorization()).then((res) => {
                setMenuCha(res.data.data)
            })
    }, [isDetail])

    useEffect(() => {
        !isDetail &&
            axios.get(CHUCNANG_LIST_URL, Authorization()).then((res) => {
                setChucNang(res.data.data.items)
            })
    }, [isDetail])

    useEffect(() => {
        axios.get(`${MENU_URL}/${pathname}`, Authorization()).then((res) => {
            setMenuDetail(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (menuDetail) {
            const chucnang = menuDetail.chucnang?.id
            const menuParent = menuDetail.menuParent?.id
            const { id, ten, thuTu, icon, url, script } = menuDetail
            form.setFieldsValue({ id, ten, thuTu, icon, url, script, menuParent, chucnang })
        }
    }, [menuDetail])

    const onFinish = (values: Menu) => {
        const chucnang = chucnangMenu?.find((item) => item.id === values.chucnang)
        values.chucnang = chucnang
        const menuParent = menuCha?.find((item) => item.id === values.menuParent)
        values.menuParent = menuParent
        {
            isEdit
                ? (dispatch(editMenu(menuDetail?.id as number, values)) as any)
                      .then((res) => {
                          history.push(`/${MenuPaths.menu}`)
                          Notification({
                              status: res.data.errorCode > 0 ? 'error' : 'success',
                              message: res.data.message
                          })
                      })
                      .catch(() => {
                          Notification({ status: 'error', message: errorMessage })
                      })
                : (dispatch(addMenu(values)) as any)
                      .then((res) => {
                          history.push(`/${MenuPaths.menu}`)
                          Notification({
                              status: res.data.errorCode > 0 ? 'error' : 'success',
                              message: res.data.message
                          })
                      })
                      .catch(() => {
                          Notification({ status: 'error', message: errorMessage })
                      })
        }
    }
    return (
        <div className='menu-detail'>
            <PageHeader
                onBack={(): void => history.goBack()}
                title={isAdd ? title.add : isEdit ? title.edit : title.detail}
                style={{ padding: '0 0 16px 0' }}
            />
            <Form
                form={form}
                onFinish={onFinish}
                className='custom-form'
                layout='vertical'
                initialValues={{ thuTu: 0 }}>
                {isDetail ? (
                    <div className='group-btn-detail'>
                        <Button icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                            Quay lại
                        </Button>
                        <Button danger type='primary' icon={<ClearOutlined />}>
                            Xóa
                        </Button>
                        <Button
                            type='primary'
                            icon={<SaveOutlined />}
                            onClick={(): void => history.replace('?edit=true')}>
                            Sửa
                        </Button>
                    </div>
                ) : (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()} icon={<CloseCircleOutlined />}>
                            Hủy
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit' icon={<SaveOutlined />}>
                            Lưu
                        </Button>
                    </div>
                )}
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name='id' hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='ten'
                            label='Tên menu:'
                            hasFeedback
                            rules={[{ required: !isDetail, message: 'Vui lòng nhập tên menu!' }]}>
                            {isDetail ? <span>{menuDetail?.ten}</span> : <Input />}
                        </Form.Item>
                        <Form.Item name='menuParent' label='Menu cha:'>
                            {isDetail ? (
                                <Link to={`/${MenuPaths.menu}/${menuDetail?.menuParent?.id}`}>
                                    {menuDetail?.menuParent?.ten}
                                </Link>
                            ) : (
                                <Select allowClear>
                                    {menuCha?.map((item, index) => (
                                        <Select.Option key={index} value={item.id}>
                                            {item.ten}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            name='icon'
                            label='Biểu tượng:'
                            hasFeedback
                            rules={[{ required: !isDetail, message: 'Vui lòng nhập biểu tượng!' }]}>
                            {isDetail ? <span>{menuDetail?.icon}</span> : <Input />}
                        </Form.Item>
                        <Form.Item
                            name='url'
                            label='Địa chỉ liên kết(URL):'
                            hasFeedback
                            rules={[{ required: !isDetail, message: 'Vui lòng nhập địa chỉ liên kết!' }]}>
                            {isDetail ? <span>{menuDetail?.url}</span> : <Input />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='script'
                            label='Kịch bản:'
                            hasFeedback
                            rules={[{ required: !isDetail, message: 'Vui lòng nhập kịch bản!' }]}>
                            {isDetail ? <span>{menuDetail?.script}</span> : <Input />}
                        </Form.Item>
                        <Form.Item
                            name='thuTu'
                            label='Thứ tự Menu:'
                            hasFeedback
                            rules={[{ required: !isDetail, message: 'Vui lòng nhập thứ tự menu!' }]}>
                            {isDetail ? <span>{menuDetail?.thuTu}</span> : <InputNumber min={0} />}
                        </Form.Item>
                        <Form.Item
                            name='chucnang'
                            label='Chức năng của Menu:'
                            rules={[{ required: !isDetail, message: 'Vui lòng chọn chức năng Menu!' }]}>
                            {isDetail ? (
                                <Link to={`/${MenuPaths.chucnang}/${menuDetail?.chucnang?.id}`}>
                                    {menuDetail?.chucnang?.ten}
                                </Link>
                            ) : (
                                <Select>
                                    {chucnangMenu?.map((item, index) => (
                                        <Select.Option key={index} value={item.id}>
                                            {item.ten}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
