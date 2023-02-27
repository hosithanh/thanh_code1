/* eslint-disable array-callback-return */
import { BackwardOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, PageHeader, Radio, Row, Select, Spin } from 'antd'
import 'assets/css/thongkesolieusohoa.css'
import { BaocCaoThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Tiendosohoa'
import 'moment/locale/vi'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getBaoCaoTienDoSoHoa } from 'store/actions/baocaothongke.actions/baocaotiendosohoa'
import { selectUserDonviMorong } from 'store/actions/donvi.action'
import '../../../assets/css/baocaotiendosohoa.css'
import { Donvi } from '../../../common/interface/Donvi'
import { AppState } from '../../../store/interface'

export default function ChiTietTienDoSoHoa() {
    const history = useHistory()
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'them-moi'
    const isEdit = window.location.search === '?edit=true'
    const title = { add: 'Thêm tiến độ số hóa', edit: 'Chỉnh sửa tiến độ số hóa' }
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [LoadingTable, setLoadingTable] = useState<boolean>(true)
    const dispatch = useDispatch<any>()

    const dataList = useSelector<AppState, BaocCaoThongKeTienDoSoHoa[] | undefined>(
        (state) => state.baocaotiendosohoa.tiendosohoaList
    )
    useEffect(() => {
        !dataList && dispatch(getBaoCaoTienDoSoHoa({}))
        dataList && setLoadingTable(false)
    }, [dispatch, dataList])

    const [donviList, setDonviList] = useState<Donvi[] | undefined>()

    const [donviId, setDonviId] = useState<string[] | undefined>()

    const [namValue, setNamValue] = useState<any | undefined>()

    const [disabled, setDisabled] = useState(true)
    const [form] = Form.useForm()

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const childrens = [] as any
    const { Option } = Select
    const now = new Date().getUTCFullYear()
    const years = Array(now - (now - 22))
        .fill('')
        .map((v, idx) => now - idx)
        .sort((a, b) => b - a)
    for (let i = 1; i < 13; i++) {
        childrens.push(
            <Option title={`Tháng ${i}`} value={i} key={i}>
                Tháng {i}
            </Option>
        )
    }
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ; (dispatch(selectUserDonviMorong({ searchData })) as any).then((res) => {
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

    const onFinish = (values) => {
        const { idDonVi, nam, quy } = values

        dispatch(getBaoCaoTienDoSoHoa({ idDonVi, nam, quy }))
    }

    return (
        <div className='user-detail'>
            <PageHeader title={isAdd ? title.add : title.edit} style={{ padding: '0 0 16px 0' }} />
            <Form
                //  onFinish={onFinish}
                form={form}>
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
                <Row gutter={16}>
                    <Col span={12} xs={24} sm={24} xl={12}>
                        <Row>
                            <label htmlFor=''>Năm:</label>
                        </Row>
                        <Form.Item
                            rules={[{ required: true, message: 'Vui lòng chọn năm để thống kê!' }]}
                            name='nam'
                        // style={{ marginRight: '8px' }}
                        >
                            <Select
                                onChange={(_, value) => {
                                    setNamValue(value as any)
                                }}
                                allowClear
                                placeholder='----Chọn năm----'
                                showSearch
                                style={{ width: '100%', textAlign: 'left' }}>
                                {years?.map((item, index) => (
                                    <Select.Option key={index} value={`${item}`}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12} xs={24} sm={24} xl={12}>
                        <Row>
                            <label htmlFor=''>
                                <span style={{ float: 'left' }}>Đơn vị:</span>
                            </label>
                        </Row>
                        <Form.Item name='idDonVi'>
                            <Select
                                onSearch={onSearchDonVi}
                                onChange={(_, value) => {
                                    if (value !== undefined) {
                                        onChangeDonVi(value['value'])
                                    } else {
                                        onChangeAllDonVi()
                                    }
                                }}
                                allowClear
                                placeholder='---Chọn đơn vị---'
                                showSearch
                                optionFilterProp='children'
                                filterOption={(input, option: any) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                    option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ width: '100%', textAlign: 'left' }}>
                                {donviList ? (
                                    donviList?.map((item, index) => (
                                        <Select.Option key={index} value={`${item.id}`}>
                                            {item.ten}
                                        </Select.Option>
                                    ))
                                ) : (
                                    <Select.Option value={''}>
                                        <Spin
                                            tip='Đang tải dữ liệu'
                                            style={{
                                                display: 'block',
                                                justifyContent: 'center',
                                                marginTop: '0.1px'
                                            }}></Spin>
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Col span={6} style={{ textAlign: 'left' }}>
                    Theo quý:{' '}
                </Col>
                <Row>
                    <Col span={11} xs={24} xl={11} lg={24}>
                        <div className='radio--quy'>
                            <Form.Item
                                name='quy'
                                rules={[{ required: true, message: 'Vui lòng chọn quý để thống kê!' }]}>
                                <Radio.Group style={{ padding: '0 10px' }}>
                                    <Radio style={{ padding: '0 8px' }} value={1}>
                                        Quý I
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={2}>
                                        Quý II
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={3}>
                                        Quý III
                                    </Radio>
                                    <Radio style={{ padding: '0 8px' }} value={4}>
                                        Quý IV
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={12} style={{ marginTop: '08px' }} xs={24} xl={12}></Col>
                </Row>
            </Form>
        </div>
    )
}
