/* eslint-disable react-hooks/exhaustive-deps */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, PageHeader } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Notification } from '../../common/component/notification'
import { CONFIG_URL } from '../../common/constant/api-constant'
import { errorMessage, MenuPaths } from '../../common/constant/app-constant'
import { Config } from '../../common/interface/Config'
import { Authorization } from '../../common/utils/cookie-util'
import { addConfig, editConfig } from '../../store/actions/config.action'
export default function ChitietConfig(): JSX.Element {
    const history = useHistory()
    const [configDetail, setconfigDetail] = useState<Config | undefined>()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'add'
    const isEdit = window.location.search === '?edit=true'
    const title = {
        add: 'Thêm config ',
        detail: 'Thông tin config ',
        edit: 'Chỉnh sửa config '
    }

    const [form] = Form.useForm()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${CONFIG_URL}/${pathname}`, Authorization()).then((res) => {
            setconfigDetail(res.data.result)
        })
    }, [])

    useEffect(() => {
        if (configDetail) {
            const { id, key, value, description } = configDetail
            form.setFieldsValue({ id, key, value, description })
        }
    }, [form, configDetail])

    const onFinish = (values: any) => {
        const { id, key, value, description } = values

        const data = {
            id: id,
            key: key,
            value: value,
            description: description
        }
        isEdit
            ? (dispatch(editConfig(data)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.config}`)
                    Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            : (dispatch(addConfig(data)) as any)
                .then((res) => {
                    history.push(`/${MenuPaths.config}`)
                    Notification({ status: res.data.status ? 'success' : 'error', message: res.data.msg })
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
    }

    return (
        <div className='user-detail'>
            <PageHeader
                title={isAdd ? title.add : isEdit ? title.edit : title.detail}
                style={{ padding: '0 0 16px 0' }}
            />
            <Form onFinish={onFinish} className='custom-form' form={form}>
                {isEdit ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                ) : isAdd ? (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            {' '}
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                ) : (
                    <div className='group-btn-detail'>
                        <Button onClick={(): void => history.goBack()}>
                            {' '}
                            <BackwardOutlined />
                            Quay lại
                        </Button>
                    </div>
                )}

                <Form.Item name='id' hidden>
                    <Input />
                </Form.Item>

                <Form.Item name='key' label='Mã ' rules={[{ required: true, message: 'Vui lòng nhập mã !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='description'
                    label='Mô tả '
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả !' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name='value'
                    label='Giá trị'
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị !' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
    )
}
