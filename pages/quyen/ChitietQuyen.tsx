/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, InputNumber, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import axios from 'axios'
import { Notification } from 'common/component/notification'
import { REGEX_Expression } from 'common/constant'
import { PERMISSION_URL } from 'common/constant/api-constant'
import { MenuPermission } from 'common/interface/MenuPermission'
import { Authorization } from 'common/utils/cookie-util'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getPermission } from 'store/actions/app.action'
import { errorMessage, listIcon, loaiQuyen, successMessage } from '../../common/constant/app-constant'
import { isNullOrUndefined } from '../../common/utils/empty-util'

interface Props {
    data?: MenuPermission[]
    isDetail?: boolean
    idParent?: number
    idPermission?: number
    setIsDetail: (isAdd: boolean) => void
    setIdPermission: (idPermission?: number) => void
}

export default function ChitietQuyen({
    data,
    isDetail,
    idParent,
    idPermission,
    setIsDetail,
    setIdPermission
}: Props): JSX.Element {
    const [detail, setDetail] = useState<MenuPermission | undefined>()
    const [form] = useForm()
    const dispatch = useDispatch()
    const [isAdd, setIsAdd] = useState(true)

    useEffect(() => {
        idPermission &&
            axios.get(`${PERMISSION_URL}/${idPermission}`, Authorization()).then((res) => {
                setDetail(res.data.result)
            })
    }, [idPermission])

    useEffect(() => {
        form.setFieldsValue(detail ? detail : { type: 1 })
    }, [form, detail, idPermission])
    const onFinish = (values: MenuPermission) => {
        values.idParent = idParent
        values.permission = values.permission?.toUpperCase()
        if (idPermission) {
            values.id = detail?.id
            values.isEnable = detail?.isEnable
            values.idChucNang = detail?.idChucNang
            axios
                .put(PERMISSION_URL, values, Authorization())
                .then((res) => {
                    Notification({ status: 'success', message: res.data?.message ?? successMessage })
                    setIsDetail(false)
                    setIdPermission(undefined)
                    dispatch(getPermission())
                })
                .catch((err) => {
                    Notification({ status: 'error', message: err.data?.msg ?? errorMessage })
                })
        } else if (isDetail) {
            axios
                .post(PERMISSION_URL, values, Authorization())
                .then((res) => {
                    Notification({ status: 'success', message: res.data?.msg ?? successMessage })
                    setIsDetail(false)
                    setIsAdd(false)
                    dispatch(getPermission())
                })
                .catch((err) => {
                    Notification({ status: 'error', message: err.data?.msg ?? errorMessage })
                })
        }
    }

    return (
        <div className='user-detail'>
            <Form onFinish={onFinish} form={form}>
                <div className='group-btn-detail'>
                    <Button
                        icon={<BackwardOutlined />}
                        onClick={(): void => {
                            setIdPermission(undefined)
                            setIsDetail(false)
                        }}>
                        Quay l???i
                    </Button>
                    <Button type='primary' htmlType='submit' className='btn-submit'>
                        <SaveOutlined /> L??u
                    </Button>
                </div>
                <Form.Item
                    name='name'
                    label='T??n quy???n'
                    rules={[{ required: true, message: 'Vui l??ng nh???p t??n quy???n!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='permission'
                    label='Bi???u th???c'
                    rules={[
                        { required: true, message: 'Vui l??ng nh???p bi???u th???c!' },
                        { pattern: REGEX_Expression, message: 'Bi???u th???c kh??ng h???p l???!' }
                    ]}>
                    <Input className='input-quyen' />
                </Form.Item>
                <Form.Item
                    name='type'
                    label='Lo???i quy???n'
                    rules={[{ required: true, message: 'Vui l??ng ch???n lo???i quy???n!' }]}>
                    <Select defaultValue={loaiQuyen.DUONGDAN}>
                        <Select.Option key={loaiQuyen.DUONGDAN} value={loaiQuyen.DUONGDAN}>
                            ???????ng d???n
                        </Select.Option>
                        <Select.Option key={loaiQuyen.THAOTAC} value={loaiQuyen.THAOTAC}>
                            Thao t??c
                        </Select.Option>
                        <Select.Option key={loaiQuyen.CHUCNANG} value={loaiQuyen.CHUCNANG}>
                            Ch???c n??ng
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name='url'
                    label='???????ng d???n'
                    rules={[{ required: true, message: 'Vui l??ng nh????p ???????ng d???n!' }]}>
                    <Input />
                    {/* <TreeSelect showSearch>
                        {data?.map((item) => (
                            <TreeSelect.TreeNode
                                value={item.url as string}
                                title={item.url}
                                key={`${item.url}-${item.id}`}>
                                {!isArrayEmpty(item.children) &&
                                    item.children?.map((p) => (
                                        <TreeSelect.TreeNode
                                            value={p.url as string}
                                            title={p.url}
                                            key={`${p.url}-${p.id}`}
                                        />
                                    ))}
                            </TreeSelect.TreeNode>
                        ))}
                    </TreeSelect> */}
                </Form.Item>
                <Form.Item
                    name='sort'
                    label='S???p x???p'
                    rules={[{ required: true, message: 'Vui l??ng nh???p th??? t??? s???p x???p!' }]}>
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name='icon' label='Icon'>
                    <Select showSearch>
                        {listIcon.map((item, index) => (
                            <Select.Option value={item} key={index}>
                                <i className={`fa fa-${item}`} />
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {(!idPermission || !isNullOrUndefined(detail?.invisible)) && (
                    <Form.Item name='invisible' label='Hi????n thi?? tr??n menu' style={{ marginRight: '60px' }}>
                        <Checkbox
                            defaultChecked={detail ? !!detail?.invisible : true}
                            onChange={(value) => form.setFieldsValue({ invisible: value.target.checked })}></Checkbox>
                    </Form.Item>
                )}
            </Form>
        </div>
    )
}
