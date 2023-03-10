/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Empty, Form, Input, Popconfirm, Row, Select, Spin, Table } from 'antd'
import axios from 'axios'
import { REGEX_CODE_LOWER, SUCCESS } from 'common/constant'
import { CapDonVi } from 'common/interface/CapDonVi'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { nonAccentVietnamese, removeSpecialCharacters } from 'common/utils/string-util'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getLoaiGiayTo } from 'store/actions/danhmuc.actions/loaigiayto.action'
import { getDoituong } from 'store/actions/doituong.action'
import { getDulieu } from 'store/actions/dulieu.action'
import { AppState } from 'store/interface'
import { Notification } from '../../../common/component/notification'
import { CAPDONVIS_LIST_URL, DONVI_LIST_USER_URL, DYNAMIC_URL } from '../../../common/constant/api-constant'
import { errorMessage, MenuPaths, successMessage } from '../../../common/constant/app-constant'
import { Doituong } from '../../../common/interface/Doituong'
import { Donvi } from '../../../common/interface/Donvi'
import { Authorization } from '../../../common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined } from '../../../common/utils/empty-util'

const { Option } = Select
const EditableContext = React.createContext(null)

interface Props {
    resultList?: Doituong[]
    resultDetail?: Doituong
    setDisabled: (disable: boolean) => void
    isReload: boolean
    setIsReload: (isReload: boolean) => void
}

export default function ThongtinDoituong({
    setDisabled,
    resultList,
    resultDetail,
    isReload,
    setIsReload
}: Props): JSX.Element {
    const history = useHistory()
    const [form] = Form.useForm()
    const [detail, setDetail] = useState<Doituong | undefined>(resultDetail)
    const [count, setCount] = useState<number>(0)
    // const [doiTuong, setDoiTuong] = useState<Doituong[] | undefined>()
    // const [danhSachDoiTuong, setDanhSachDoiTuong] = useState<Doituong[] | undefined>()
    const [dataSource, setDatasource] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [listMaDoiTuong, setListMaDoiTuong] = useState<string[]>([])
    const [listTruong, setListTruong] = useState<any>([])
    const pathname = window.location.pathname.split('/').pop()
    const isAdd = pathname === 'them-moi'
    if (resultList && resultList[0]?.id !== 0) resultList?.unshift({ id: 0, ten: 'Kh??ng ch???n' })
    const currentPage = useSelector<AppState, number | undefined>((state) => state.results.currentPage)
    const listDoiTuong = useSelector<AppState, Doituong[] | undefined>((state) => state.results.resultList)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.results.pageSize)
    const dataSearch = useSelector<AppState, string | undefined>((state) => state.results.dataSearch)
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const dispatch = useDispatch<any>()
    const loaigiaytoList = useSelector<AppState, Loaigiayto[] | undefined>((state) => state.loaigiayto?.loaigiaytoList)
    const searchData = useSelector<AppState, string | undefined>((state) => state.loaigiayto?.searchData)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModal, setIsModal] = useState<boolean>(false)
    const [loaiGiayTo, setLoaiGiayTo] = useState<Loaigiayto | undefined>()
    const [checkIscanhan, setCheckIscanhan] = useState<boolean>(false)
    const [checkIsgiamho, setCheckIsgiamho] = useState<boolean>(false)
    const [capDonViList, setCapDonViList] = useState<CapDonVi[] | undefined>()
    const [idCapDonvi, setIdCapDonvi] = useState<[] | undefined>()

    useEffect(() => {
        axios.get(`${CAPDONVIS_LIST_URL}`, Authorization()).then((res) => {
            setCapDonViList(res?.data?.result)
        })
    }, [])

    const showModal = () => {
        setIsModalVisible(true)
        setIsModal(true)
    }
    const handleOk = () => {
        setIsModalVisible(false)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
        setIsModal(false)
    }

    useEffect(() => {
        !loaigiaytoList && dispatch(getLoaiGiayTo({ searchData }))
    }, [loaigiaytoList])
    useEffect(() => {
        if (loaiGiayTo) {
            form.setFieldsValue({
                ma: detail
                    ? detail.ma
                    : loaiGiayTo.matthc.concat(loaiGiayTo.maGiayTo).replace(/[.-]/gi, '').toLowerCase(),
                ten: loaiGiayTo.tenGiayTo,
                maGiayTo: loaiGiayTo.maGiayTo,
                matthc: loaiGiayTo.matthc,
                tentthc: loaiGiayTo.tenTTHC
            })
        }
    }, [loaiGiayTo])

    useEffect(() => {
        form.setFieldsValue(resultDetail)
        setDetail(resultDetail)
    }, [form, resultDetail])

    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])

    // useEffect(() => {
    //     axios.get(`${DYNAMIC_URL}/doituong/all?curPage=1&pageSize=1000000`, Authorization()).then((res) => {
    //         setDoiTuong(res.data.data.items)
    //     })
    // }, [])

    useEffect(() => {
        setDatasource(detail?.listDoiTuongKemTheo ?? [])
        setCheckIscanhan(!!detail?.isCaNhan)
    }, [detail])

    if (dataSource?.some((d) => !d?.key)) {
        dataSource?.map((item, index) => {
            item.key = index
            return item
        })
    }

    // let sourceFilter = doiTuong?.filter(
    //     (item) => !dataSource?.some((s) => s?.maDoituongDikem === item.ma) && item.ma !== detail?.ma
    // )

    const handleAdd = () => {
        const newData = { key: count, loaiHienThi: 1, maDoituongDikem: undefined }
        setCount(count + 1)
        setDatasource([...dataSource, newData])
    }
    const handleSave = (row) => {
        const newData = [...dataSource]
        const index = newData.findIndex((item) => row.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
        setDatasource(newData)
    }
    const handleDelete = (key) => {
        const newData = [...dataSource]
        setDatasource(newData.filter((item) => item.key !== key))
    }

    const mapColumn: any = [
        { title: 'M?? h???? th????ng', key: 'maDoituongDikem', dataIndex: 'maDoituongDikem', editable: 1 },
        { title: 'Lo???i hi???n th???', key: 'loaiHienThi', dataIndex: 'loaiHienThi', editable: 2 },
        { title: 'Gi?? tr??? hi???n th???', key: 'mapHienThi', dataIndex: 'mapHienThi', editable: 3 },
        { title: 'Gi?? tr??? l??u', key: 'mapValue', dataIndex: 'mapValue', editable: 4 },
        {
            title: 'Thao t??c',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title='B???n c?? ch???c ch???n mu???n x??a ?????i t?????ng n??y?'
                        okText='?????ng ??'
                        cancelText='Kh??ng'
                        onConfirm={() => handleDelete(record.key)}>
                        <Button type='text' icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
                    </Popconfirm>
                ) : null
        }
    ]
    const gridColumn: any = [
        { title: 'M?? h???? th????ng', key: 'maDoituongDikem', dataIndex: 'maDoituongDikem', editable: 1 },
        { title: 'Lo???i hi???n th???', key: 'loaiHienThi', dataIndex: 'loaiHienThi', editable: 2 },
        {
            title: 'Thao t??c',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title='B???n c?? ch???c ch???n mu???n x??a ?????i t?????ng n??y?'
                        okText='?????ng ??'
                        cancelText='Kh??ng'
                        onConfirm={() => handleDelete(record.key)}>
                        <Button type='text' icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} />
                    </Popconfirm>
                ) : null
        }
    ]

    const isMapColumn = dataSource?.some((item) => item.loaiHienThi === 1)
    const columns = isMapColumn ? mapColumn : gridColumn
    const setColumns = columns.map((col) => {
        if (!col.editable) return col
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        }
    })

    useEffect(() => {
        const listMa = dataSource.reduce((prev, curr) => {
            if (curr.loaiHienThi === 1) {
                prev = [...prev, curr.maDoituongDikem]
                return prev
            } else return prev
        }, [])
        setListMaDoiTuong(listMa)
    }, [dataSource])

    const listMaTruong = listTruong?.reduce((prev, curr) => {
        prev = [...prev, Object.keys(curr)[0]]
        return prev
    }, [])

    useEffect(() => {
        if (!isArrayEmpty(listMaDoiTuong) && JSON.stringify(listMaTruong) !== JSON.stringify(listMaDoiTuong)) {
            let newListTruong: any = []
            listMaDoiTuong.map((item) => {
                axios.get(`${DYNAMIC_URL}/listruong?maDoiTuong=${item}`, Authorization()).then((res) => {
                    newListTruong = [...newListTruong, { [item]: res.data.data.items }]
                    setListTruong(newListTruong)
                })
            })
        }
    }, [listMaDoiTuong])

    const EditableRow = ({ ...props }) => {
        const [formRow] = Form.useForm()
        return (
            <Form form={formRow} component={false}>
                <EditableContext.Provider value={formRow as any}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        )
    }

    const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
        const formCell = useContext<any>(EditableContext)
        const typingRef = useRef<any>()
        const [doiTuongCell, setDoiTuongCell] = useState<Doituong[] | undefined>()
        const onSearchDoituong = (dataSearch) => {
            if (typingRef.current) {
                clearTimeout(typingRef.current)
            }
            typingRef.current = setTimeout(() => {
                axios.get(`${DYNAMIC_URL}/doituong/all?searchData=${dataSearch}`, Authorization()).then((res) => {
                    setDoiTuongCell(res.data.data.items)
                })
            }, 300)
        }
        let listdoituongFilter = doiTuongCell?.filter(
            (item) => !dataSource?.some((s) => s?.maDoituongDikem === item.ma) && item.ma !== detail?.ma
        )
        const save = async () => {
            try {
                const values = await formCell.validateFields()
                if (!values?.loaiHienThi) values.loaiHienThi = record?.loaiHienThi
                if (!values?.maDoituongDikem) values.maDoituongDikem = record?.maDoituongDikem
                if (!values?.mapHienThi) values.mapHienThi = record?.mapHienThi
                if (!values?.mapValue) values.mapValue = record?.mapValue
                handleSave({ ...record, ...values })
            } catch (errInfo) {
                console.log('Save failed:', errInfo)
            }
        }
        const selectSource = listTruong?.find((item) => Object.keys(item)[0] === record?.maDoituongDikem)
        let childNode = children

        if (editable === 1) {
            childNode = (
                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                    <Select
                        onSearch={onSearchDoituong}
                        optionFilterProp='children'
                        placeholder='Vui l??ng t??m ?????i t?????ng k??m theo'
                        showSearch
                        onChange={save}
                        defaultValue={record?.maDoituongDikem ?? (listdoituongFilter && listdoituongFilter[0]?.ma)}>
                        {listdoituongFilter?.map((item, index) => (
                            <Option key={index} value={item.ma as string}>
                                {item.ten}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        }

        if (editable === 2) {
            childNode = (
                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                    <Select onChange={save} defaultValue={record?.loaiHienThi ?? 1}>
                        {[{ box: 1 }, { grid: 2 }].map((item, index) => (
                            <Option key={index} value={Object.values(item)[0]}>
                                {Object.values(item)[0] === 1 ? 'Hi???n th??? d???ng combobox' : 'Hi???n th??? d???ng grid table'}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        }

        if (editable === 3) {
            childNode =
                record.loaiHienThi === 1 ? (
                    <Form.Item style={{ margin: 0 }} name={dataIndex}>
                        <Select
                            onChange={save}
                            defaultValue={record?.mapHienThi}
                            placeholder='Vui l??ng ch???n gi?? tr??? hi???n th???'>
                            {selectSource &&
                                selectSource[record.maDoituongDikem]?.map((item, index) => (
                                    <Option key={index} value={item.ma}>
                                        {item.ma}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                ) : null
        }

        if (editable === 4) {
            const mapValue = selectSource && selectSource[record.maDoituongDikem]
            const newSource = [...(mapValue ?? [])]
            if (newSource && newSource[0]?.ma !== 'id') newSource.unshift({ ma: 'id' })
            childNode =
                record.loaiHienThi === 1 ? (
                    <Form.Item style={{ margin: 0 }} name={dataIndex}>
                        <Select onChange={save} defaultValue={record?.mapValue}>
                            {/* {newSource?.map((item, index) => (
                                <Select.Option key={index} value={item.ma}>
                                    {item.ma}
                                </Select.Option>
                            ))} */}
                            <Select.Option value={newSource[0].ma}>{newSource[0].ma}</Select.Option>
                        </Select>
                    </Form.Item>
                ) : null
        }

        return <td {...restProps}>{childNode}</td>
    }

    const onFinish = (values: Doituong) => {
        if (!isArrayEmpty(dataSource) && dataSource?.some((item) => !item?.maDoituongDikem)) {
            Notification({ status: 'warning', message: 'Vui l??ng ch???n m?? ?????i t?????ng k??m theo!' })
        } else if (
            !isArrayEmpty(dataSource) &&
            dataSource?.some((item) => item?.loaiHienThi === 1 && (!item?.mapHienThi || !item?.mapValue))
        ) {
            Notification({ status: 'warning', message: 'Vui l??ng ch???n gi?? tr??? cho ?????i t?????ng k??m theo lo???i combobox!' })
        } else {
            setIsLoading(true)
            values.listDoiTuongKemTheo = dataSource
            values.detailScreen = detail?.detailScreen
            values.inputScreen = detail?.inputScreen
            values.listScreen = detail?.listScreen
            values.searchScreen = detail?.searchScreen
            if (!isAdd) {
                values.ma = detail.ma
            }
            values.donViId = values.donVis[0]
            axios
                .post(`${DYNAMIC_URL}${isAdd ? '/save' : '/update'}`, values, Authorization())
                .then((res) => {
                    if (res.data?.errorCode === SUCCESS) {
                        setIsLoading(false)
                        setDetail(res.data.data)
                        setDisabled(false)
                        setIsReload(!isReload)
                        history.push(`/${MenuPaths.doituong}/thong-tin?maDoiTuong=${res.data.data.ma}`)
                        Notification({ status: 'success', message: successMessage })
                        if (listDoiTuong) dispatch(getDoituong({ page: currentPage, pageSize, dataSearch }))
                        dispatch(getDulieu({}))
                    } else {
                        setIsLoading(false)
                        Notification({ status: 'warning', message: res.data?.message })
                    }
                })
                .catch(() => {
                    Notification({ status: 'error', message: errorMessage })
                })
            // }
        }
    }
    useEffect(() => {
        if (!!detail?.isGiamHo) {
            setCheckIsgiamho(true)
        } else {
            setCheckIsgiamho(false)
        }
    }, [detail])

    const onChangeMahethong = (e) => {
        if (isAdd) {
            var mahethong = removeSpecialCharacters(nonAccentVietnamese(e.target.value).split(' ').join(''))
            form.setFieldsValue({ ma: mahethong })
        }
    }
    // function handleChangeCapDonVi(value) {
    //     setIdCapDonvi(value)
    // }
    return (
        <>
            <Spin size='large' tip='??ang x??? l?? d??? li???u' className='spin_bieumau' spinning={isLoading}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    className='custom-form'
                    initialValues={isAdd ? { elasticStatus: 1, isSub: 0, isThongKe: 0 } : undefined}>
                    <div className='group-btn-detail'>
                        {/* <Button icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                            Quay l???i
                        </Button> */}
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined />
                            L??u
                        </Button>
                    </div>
                    <Form.Item
                        name='donVis'
                        label='????n vi??'
                        rules={[{ required: true, message: 'Vui l??ng ch???n ????n v???!' }]}>
                        <Select mode='multiple' showSearch placeholder='Cho??n ????n vi??' optionFilterProp='children'>
                            {donviList?.map((item, index) => (
                                <Option key={index} value={item.id as number}>
                                    {item.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='capDonVis' label='C???p ????n v???'>
                        <Select
                            mode='multiple'
                            allowClear
                            style={{ width: '100%' }}
                            placeholder='Cho??n c???p ????n vi??'

                        // onChange={handleChangeCapDonVi}
                        >
                            {capDonViList?.map((item, index) => (
                                <Option key={index} value={item.id as number}>
                                    {item.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='ten'
                        label='T??n lo???i k???t qu???'
                        rules={[{ required: true, message: 'Vui l??ng nh???p t??n lo???i k???t qu???!' }]}>
                        <Input onKeyUp={(e) => onChangeMahethong(e)} />
                    </Form.Item>
                    <Form.Item
                        name='ma'
                        label='M?? h??? th???ng'
                        rules={[
                            { required: true, message: 'Vui l??ng nh???p m?? h??? th???ng!' },
                            {
                                pattern: REGEX_CODE_LOWER,
                                message:
                                    'M?? h??? th???ng kh??ng ???????c vi???t hoa, kh??ng ???????c c?? k?? t??? ?????c bi???t, kh??ng c?? kho???ng c??ch!'
                            },
                            {
                                max: 57,
                                message: 'M?? h??? th???ng kh??ng ???????c qu?? 57 k?? t???!'
                            }
                        ]}>
                        <Input disabled={!isAdd} />
                    </Form.Item>
                    <Row gutter={24}>
                        <Col span={8}>
                            {(isAdd || !isNullOrUndefined(detail?.kichHoat)) && (
                                <Form.Item name='kichHoat' label='Tr???ng th??i'>
                                    <Checkbox
                                        defaultChecked={detail ? !!detail?.kichHoat : true}
                                        onChange={(value) =>
                                            form.setFieldsValue({ kichHoat: Number(value.target.checked) })
                                        }>
                                        K??ch ho???t
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>

                        <Col span={8}>
                            {(isAdd || !isNullOrUndefined(detail?.elasticStatus)) && (
                                <Form.Item name='elasticStatus' label='T??ch h???p m??y t??m ki???m'>
                                    <Checkbox
                                        defaultChecked={detail ? !!detail?.elasticStatus : true}
                                        onChange={(value) =>
                                            form.setFieldsValue({ elasticStatus: Number(value.target.checked) })
                                        }>
                                        K??ch ho???t
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>
                        <Col span={4}>
                            {(isAdd || !isNullOrUndefined(detail?.isSub)) && (
                                <Form.Item name='isSub'>
                                    <Checkbox
                                        defaultChecked={detail ? !!detail?.isSub : false}
                                        onChange={(value) =>
                                            form.setFieldsValue({ isSub: Number(value.target.checked) })
                                        }>
                                        Lo???i b???ng ph???
                                    </Checkbox>
                                </Form.Item>
                            )}

                        </Col>
                        <Col span={4}>
                            {(isAdd || !isNullOrUndefined(detail?.isThongKe)) && (
                                <Form.Item name='isThongKe'>
                                    <Checkbox
                                        defaultChecked={detail ? !!detail?.isThongKe : false}
                                        onChange={(value) =>
                                            form.setFieldsValue({ isThongKe: Number(value.target.checked) })
                                        }>
                                        Kh??ng th???ng k??
                                    </Checkbox>
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24} style={{ display: 'flex' }}>
                            <Form.Item name='isCaNhan' label='?????i t?????ng th???c hi???n' style={{ marginRight: '60px' }}>
                                <Checkbox
                                    onChange={(value) => {
                                        form.setFieldsValue({
                                            isCaNhan: Number(value.target.checked),
                                            isGiamHo: Number(false)
                                        })
                                        setCheckIscanhan(value.target.checked)
                                        if (value.target.checked === false) {
                                            setCheckIsgiamho(false)
                                        }
                                    }}
                                    defaultChecked={!!detail?.isCaNhan}
                                    checked={checkIscanhan}>
                                    C?? nh??n
                                </Checkbox>
                            </Form.Item>
                            <Form.Item name='isGiamHo' style={{ marginRight: '60px' }}>
                                <Checkbox
                                    onChange={(value) => {
                                        form.setFieldsValue({
                                            isGiamHo: Number(value.target.checked),
                                            isCaNhan: Number(true)
                                        })
                                        setCheckIsgiamho(value.target.checked)
                                        value.target.checked && setCheckIscanhan(value.target.checked)
                                    }}
                                    defaultChecked={!!detail?.isGiamHo}
                                    checked={checkIsgiamho}>
                                    La?? ng??????i gia??m h????
                                </Checkbox>
                            </Form.Item>
                            <Form.Item name='isToChuc' style={{ marginRight: '60px' }}>
                                <Checkbox
                                    onChange={(value) =>
                                        form.setFieldsValue({ isToChuc: Number(value.target.checked) })
                                    }
                                    defaultChecked={!!detail?.isToChuc}>
                                    T??? ch???c
                                </Checkbox>
                            </Form.Item>
                            <Form.Item name='isDoanhNghiep' style={{ marginRight: '60px' }}>
                                <Checkbox
                                    onChange={(value) =>
                                        form.setFieldsValue({ isDoanhNghiep: Number(value.target.checked) })
                                    }
                                    defaultChecked={!!detail?.isDoanhNghiep}>
                                    Doanh Nghi???p
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name='listDoiTuongKemTheo' label='?????i t?????ng k??m theo'>
                        <Table
                            size='small'
                            columns={setColumns}
                            components={{ body: { cell: EditableCell, row: EditableRow } }}
                            locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                            pagination={false}
                            bordered
                            dataSource={dataSource}
                            className='table-doituongkemtheo'
                            tableLayout='fixed'
                        />
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                size='small'
                                icon={<PlusOutlined />}
                                type='primary'
                                style={{ marginTop: 10 }}
                                onClick={handleAdd}>
                                Th??m
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
}
