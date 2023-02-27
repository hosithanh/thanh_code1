/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import {
    BackwardOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    ForwardOutlined,
    FundViewOutlined,
    PlusOutlined,
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    PageHeader,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Spin,
    Table,
    Tooltip
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import viVN from 'antd/lib/locale/vi_VN'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { SUCCESS } from 'common/constant'
import {
    DELETE_FILES,
    DOWLOAD_FILE,
    DYNAMIC_API_URL,
    DYNAMIC_URL,
    UPLOAD_FILE_SIGN
} from 'common/constant/api-constant'
import { errorMessage, MenuPaths, successMessage } from 'common/constant/app-constant'
import { Doituong } from 'common/interface/Doituong'
import { TruongDuLieu } from 'common/interface/TruongDuLieu'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import moment from 'moment'
import 'moment/locale/vi'
import queryString from 'query-string'
import { default as React, Fragment, useEffect, useState } from 'react'
import FileBase64 from 'react-file-base64'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import '../../assets/css/dulieu.css'

const EditableContext = React.createContext(null)

export default function ChitietDulieu(): JSX.Element {
    const history = useHistory()
    // query-string
    const parsed = queryString.parse(window.location.search)
    const tokenIframe = parsed.token
    const maTTHC = parsed.maTTHC
    const maLoaiGiayTo = parsed.maLoaiGiayTo

    const maDoiTuong = (maTTHC?.concat(maLoaiGiayTo as string) as string).replace(/[.-]/gi, '').toLowerCase()
    const idKetQua = parsed.idKetQua
    //
    const [resultDetail, setResultDetail] = useState<Doituong | undefined>()
    const [listRes, setListRes] = useState<any>()
    const [total, setTotal] = useState<number | undefined>()
    const [queryData, setQueryData] = useState<any>([])
    const [dataInput, setDataInput] = useState<any>([])
    const isAdd = window.location.pathname.split('/').pop() === 'themmoi'
    const [isDetail, setIsDetail] = useState<boolean>(false)
    const [offset, setOffset] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [detail, setDetail] = useState<any>()
    const [truong, setTruong] = useState<TruongDuLieu[] | undefined>()
    const [dataEdit, setDataEdit] = useState<any>()
    //
    const [isSearch, setIsSearch] = useState<boolean>(true)
    const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
    const [resultList, setResultList] = useState<Doituong[] | undefined>()
    const [doiTuongCombobox, setDoiTuongCombobox] = useState<any>([])
    const [dataCombobox, setDataCombobox] = useState<any>([])
    const [dataSource, setDataSource] = useState<any>([])
    const [resList, setResList] = useState<any>([])
    const [comboboxSource, setComboboxSource] = useState<any>([])
    const [count, setCount] = useState<any>([])
    function getScreen(type) {
        const screen = JSON.parse(JSON.stringify((resultDetail && resultDetail[type]) ?? ''))
        const screenStr = JSON.parse(isStringEmpty(screen) ? JSON.stringify(screen) : screen)?.screen
        const screenArr = JSON.parse(JSON.stringify(screenStr ?? ''))
        const screenParse = Array.isArray(screenArr)
            ? screenArr
            : JSON.parse(isStringEmpty(screen) ? JSON.stringify(screenArr) : screenArr)
        const screenList = isStringEmpty(screenParse) ? [] : screenParse
        return screenList
    }
    const searchScreen = getScreen('searchScreen')
    const listScreen = getScreen('listScreen')
    const inputScreen = getScreen('inputScreen')
    const detailScreen = getScreen('detailScreen')
    const [form] = Form.useForm()
    const deleteDulieu = (id): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Hủy',
            maskClosable: true,
            onOk: () => {
                const value = { ma: maDoiTuong, id }
                return axios
                    .post(`${DYNAMIC_API_URL}/delete`, value, Authorization(tokenIframe as string))
                    .then(() => {
                        Notification({ status: 'success', message: 'Xóa thành công' })
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'Xóa thất bại' })
                    })
            }
        })
    }
    const searchRender = searchScreen?.filter((item) => truong?.some((tr) => tr.ma === item.ma))
    const columnRender: any = []
    listScreen?.map((item) => {
        return truong?.map((tr) => {
            if (tr.ma === item.ma) columnRender.push({ title: item.moTa, key: item.ma, dataIndex: item.ma })
        })
    })
    columnRender?.push({
        title: 'Thao tác',
        key: 'action',
        align: 'center',
        width: '150px',
        fixed: 'right',
        render: (value) => {
            const dataEdit = listRes.find((item) => item.id === value.id)
            return (
                <Fragment>
                    <Tooltip title='Chi tiết' color='#4caf50' placement='top'>
                        <Button
                            type='text'
                            icon={
                                <EyeOutlined
                                    style={{ color: '#4caf50' }}
                                    onClick={() => {
                                        const curr = listRes?.find((item) => item.id === value.id)
                                        setDetail(curr)
                                        setIsDetail(true)
                                        setDataInput([])
                                    }}
                                />
                            }
                        />
                    </Tooltip>
                    <Tooltip title='Sửa' color='#2db7f5' placement='top'>
                        <Button
                            type='text'
                            icon={
                                <EditOutlined
                                    style={{ color: '#1890ff' }}
                                    onClick={() => {
                                        setDataEdit(dataEdit)
                                        setFileValue({
                                            name: dataEdit.teptin,
                                            id: parseInt(dataEdit.signature)
                                        })
                                    }}
                                />
                            }
                        />
                    </Tooltip>
                    <Tooltip title='Xóa' color='#ff4d4f' placement='top'>
                        <Button
                            type='text'
                            icon={
                                <DeleteOutlined
                                    style={{ color: '#ff4d4f' }}
                                    onClick={(): void => deleteDulieu(value.id)}
                                />
                            }></Button>
                    </Tooltip>
                </Fragment>
            )
        }
    })
    columnRender?.unshift({
        title: 'STT',
        key: 'stt',
        align: 'center',
        width: '70px',
        fixed: 'left',
        render: (value, _, index) => (offset - 1) * limit + index + 1
    })

    const listMa = listScreen?.map((item) => item.ma)
    const checkList = listRes?.reduce((prev, curr) => {
        let item = {}
        truong?.map((tr) => {
            return listMa?.map((ma) => {
                if (tr.ma === ma) {
                    item['id'] = curr.id
                    if (tr.isDanhSach === 1) {
                        let boSung = JSON.parse(tr.boSung)
                        return (item[ma] = boSung.find((bs) => parseInt(bs.key) === parseInt(curr[ma]))?.value)
                    } else {
                        return (item[ma] = curr[ma])
                    }
                }
            })
        })
        //taild and minhlv fix status
        truong?.map((tr) => {
            return listMa?.map((ma) => {
                if (tr.ma === ma) {
                    item['id'] = curr.id
                    if (tr.kieuDuLieu === 'STATUS') {
                        item[ma] === 1 ? (item[ma] = 'Có') : (item[ma] = 'Không')
                        return item[ma]
                    }
                }
            })
        })

        prev.push(item)
        return prev
    }, [])

    useEffect(() => {
        axios.get(`${DYNAMIC_URL}/doituong/${maDoiTuong}`, Authorization(tokenIframe as string)).then((res) => {
            // setMaDoTuong(res.data.data[0]?.ma)
            setResultDetail(res.data.data)
        })
    }, [])

    interface Props {
        queryData: any
        limit?: number
        offset?: number
    }
    const getData = ({ queryData, limit, offset }: Props) => {
        return axios
            .post(
                `${DYNAMIC_API_URL}/read`,
                { ma: maDoiTuong, queryData, limit, offset },
                Authorization(tokenIframe as string)
            )
            .then((res) => {
                setTotal(res.data.data?.total)
                setListRes(res.data.data?.items)
            })
    }

    useEffect(() => {
        queryData.push(['id', '=', idKetQua])
        getData({ queryData, limit, offset: 0 })
    }, [idKetQua])

    const gridSelect = resultDetail?.listDoiTuongKemTheo?.filter((item) => item?.loaiHienThi === 2)
    useEffect(() => {
        axios
            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${maDoiTuong}`, Authorization(tokenIframe as string))
            .then((res) => {
                setTruong(res.data.data.items)
            })
            .then(() => {
                let newRes = [...resList]
                if (!isArrayEmpty(gridSelect)) {
                    gridSelect?.map((item) => {
                        axios
                            .get(
                                `${DYNAMIC_URL}/listruong?maDoiTuong=${item.maDoituongDikem}`,
                                Authorization(tokenIframe as string)
                            )
                            .then((res) => {
                                newRes = [...newRes, { [item['maDoituongDikem']]: res.data.data.items }]
                                return setResList(newRes)
                            })
                    })
                }
            })
    }, [resultDetail])

    useEffect(() => {
        axios.post(`${DYNAMIC_URL}/list`, {}, Authorization(tokenIframe as string)).then((res) => {
            setResultList(res.data?.data?.items)
        })
    }, [])

    useEffect(() => {
        resultDetail?.listDoiTuongKemTheo?.reduce((prev, curr) => {
            if (curr.loaiHienThi === 1) {
                prev = [
                    ...prev,
                    {
                        [curr['maDoituongDikem']]: {
                            madoituong: curr?.maDoituongDikem,
                            key: curr?.mapValue,
                            value: curr?.mapHienThi
                        }
                    }
                ]
            }
            setDoiTuongCombobox(prev)
            return prev
        }, [])
    }, [resultDetail])

    useEffect(() => {
        if (!isArrayEmpty(doiTuongCombobox)) {
            let newRes = [...dataCombobox]
            doiTuongCombobox.map((item) => {
                axios
                    .post(`${DYNAMIC_API_URL}/combobox`, Object.values(item)[0], Authorization(tokenIframe as string))
                    .then((res) => {
                        newRes = [...newRes, { [Object.keys(item)[0]]: res.data.data }]
                        return setDataCombobox(newRes)
                    })
            })
        }
    }, [doiTuongCombobox])

    useEffect(() => {
        if (dataEdit) {
            setComboboxSource(dataEdit?.combobox ?? [])
            if (isArrayEmpty(dataEdit?.gridtable)) {
                const listGrid = resultDetail?.listDoiTuongKemTheo?.filter((i) => i.loaiHienThi === 2)
                const newDataSource = listGrid?.map((a) => {
                    return { [a.maDoituongDikem]: [{ key: 0 }] }
                })
                setDataSource(newDataSource)
                const newCount = listGrid?.map((a) => {
                    return { [a.maDoituongDikem]: 0 }
                })
                setCount(newCount)
            } else {
                const newDataSource = dataEdit?.gridtable?.map((item) => {
                    const key = Object.keys(item)[0]
                    item[key]?.map((a, index) => {
                        a.key = index
                        return a
                    })
                    return item
                })
                setDataSource(newDataSource)
                const newCount = dataEdit?.gridtable?.map((i) => {
                    const newKey = Object.keys(i)[0]
                    return { [newKey]: (Object.values(i)[0] as any).length }
                })
                setCount(newCount)
            }
        } else {
            const listGrid = resultDetail?.listDoiTuongKemTheo?.filter((i) => i.loaiHienThi === 2)
            const newDataSource = listGrid?.map((a) => {
                return { [a.maDoituongDikem]: [{ key: 0 }] }
            })
            const newCount = listGrid?.map((a) => {
                return { [a.maDoituongDikem]: 0 }
            })
            setComboboxSource([])
            setDataSource(newDataSource)
            setCount(newCount)
        }
    }, [dataEdit, resultDetail])

    const onBlur = (e?: any, ma?: string, isDate?: boolean, isNumber?: boolean) => {
        if (isDate) {
            const dateItem: any = []
            dateItem.push([ma, '>=', e[0]])
            dateItem.push([ma, '<=', e[1]])
            const index = dataInput.findIndex((item) => item[0] === ma)
            if (index !== -1) {
                const data = [...dataInput]
                data[index] = [ma, '>=', e[0]]
                data[index + 1] = [ma, '<=', e[1]]
                setDataInput(data)
            } else {
                setDataInput([...dataInput, ...dateItem])
            }
        } else {
            const index = dataInput.findIndex((item) => item[0] === ma)
            const value = [
                ma,
                `${isNumber ? '=' : 'like'}`,
                isNumber ? (isNaN(Number(e?.target?.value ?? e)) ? '' : e?.target?.value ?? e) : e?.target?.value ?? e
            ]
            if (index !== -1) {
                const data = [...dataInput]
                data[index] = value
                setDataInput(data)
            } else {
                setDataInput([...dataInput, value])
            }
        }
    }

    const onchangeMaskDatetime = (e) => {
        let value = e.target.value
        if (value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
        }
    }
    const renderInput = (kieuDuLieu, ma, isRange: boolean, isTextArea: number) => {
        switch (kieuDuLieu) {
            case 'INT':
                let options: any = []
                if (inputRenderBoSung !== undefined || inputRenderBoSung !== null) {
                    if (inputRenderBoSung?.find((item) => item.ma === ma)?.boSung.length > 0) {
                        options = JSON.parse(inputRenderBoSung?.find((item) => item.ma === ma)?.boSung)
                    }
                }
                return options !== null && options.length > 0 ? (
                    <Select style={{ width: '100%' }} defaultValue={dataEdit && dataEdit[ma]}>
                        {options?.map((item) => {
                            return <Select.Option value={item.key}>{item.value}</Select.Option>
                        })}
                    </Select>
                ) : (
                    <InputNumber
                        onBlur={(e) => !isAdd && onBlur(e, ma, false, true)}
                        min={-2147483648}
                        max={2147483647}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        defaultValue={dataEdit && dataEdit[ma]}
                        style={{ width: '100%' }}
                    />
                )
            case 'LONG':
                return (
                    <InputNumber
                        onBlur={(e) => !isAdd && onBlur(e, ma, false, true)}
                        min={-9223372036854775808}
                        max={9223372036854775807}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        defaultValue={dataEdit && dataEdit[ma]}
                        style={{ width: '100%' }}
                    />
                )
            case 'FLOAT':
                return (
                    <InputNumber
                        onBlur={(e) => !isAdd && onBlur(e, ma, false, true)}
                        defaultValue={dataEdit && dataEdit[ma]}
                        style={{ width: '100%' }}
                    />
                )
            case 'STATUS':
                return (
                    <Select
                        style={{ width: '100%' }}
                        onChange={(e): void => onBlur(e, ma, false, true)}
                        allowClear
                        defaultValue={dataEdit ? (dataEdit[ma] === 1 ? 1 : 0) : 1}>
                        <Select.Option value={1}>Có</Select.Option>
                        <Select.Option value={0}>Không</Select.Option>
                    </Select>
                )
            case 'DATETIME':
                return isRange ? (
                    <DatePicker.RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        format='DD/MM/YYYY'
                        style={{ width: '100%' }}
                        onChange={(_, date) => onBlur(date, ma, true)}
                        locale={locale}
                    />
                ) : (
                    <DatePicker
                        placeholder='Chọn ngày'
                        defaultValue={dataEdit && dataEdit[ma] && moment(dataEdit[ma], 'DD/MM/YYYY')}
                        style={{ width: '100%' }}
                        format='DD/MM/YYYY'
                        locale={locale}
                        onKeyDown={(e) => onchangeMaskDatetime(e)}
                    />
                )
            default:
                return isTextArea === 1 ? (
                    <Input.TextArea
                        name={ma}
                        defaultValue={dataEdit && dataEdit[ma]}
                        onBlur={(e) => !isAdd && onBlur(e, ma)}
                        rows={5}
                    />
                ) : (
                    <Input
                        name={ma}
                        defaultValue={dataEdit && dataEdit[ma]}
                        allowClear
                        onBlur={(e) => !isAdd && onBlur(e, ma)}
                    />
                )
        }
    }

    let inputRender: any = []
    let inputRenderBoSung: any = []
    let inputRenderStatus: any = []
    inputScreen?.map((item) => {
        if (item?.type === 'main') {
            return truong?.map((t) => {
                if (item.ma === t.ma) {
                    if (t.isDanhSach === 1) {
                        inputRenderBoSung.push(t)
                    }
                    if (t.kieuDuLieu === 'STATUS') {
                        inputRenderStatus.push(t)
                    }
                    item.doDai = t?.doDai
                    item.isTextArea = t?.isTextArea
                    if (inputRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                        const indexGroup = inputRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                        if (Object.keys(inputRender[indexGroup][item?.group])?.some((m) => m === 'input')) {
                            inputRender[indexGroup][item?.group]?.input?.push(item)
                        } else {
                            inputRender[indexGroup][item?.group].input = [item]
                        }
                    } else {
                        inputRender.push({ [item['group']]: { input: [item] } })
                    }
                }
            })
        } else if (item?.type === 'combobox') {
            return resultDetail?.listDoiTuongKemTheo?.map((l) => {
                if (l.loaiHienThi === 1 && item?.maDoiTuong === l?.maDoituongDikem) {
                    if (inputRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                        const indexGroup = inputRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                        if (Object.keys(inputRender[indexGroup][item?.group])?.some((m) => m === 'input')) {
                            inputRender[indexGroup][item?.group]?.input?.push(item)
                        } else {
                            inputRender[indexGroup][item?.group].input = [item]
                        }
                    } else {
                        inputRender.push({ [item['group']]: { input: [item] } })
                    }
                }
            })
        } else if (item?.type === 'grid') {
            if (inputRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                const indexGroup = inputRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                if (Object.keys(inputRender[indexGroup][item?.group])?.some((m) => m === 'grid')) {
                    if (
                        inputRender[indexGroup][item?.group]?.grid?.some((m) => Object.keys(m)[0] === item?.maDoiTuong)
                    ) {
                        const indexDoiTuong = inputRender[indexGroup][item?.group]?.grid?.findIndex(
                            (m) => Object.keys(m)[0] === item?.maDoiTuong
                        )
                        inputRender[indexGroup][item?.group]?.grid[indexDoiTuong][item?.maDoiTuong]?.push(item)
                    } else {
                        inputRender[indexGroup][item?.group]?.grid?.push({ [item?.maDoiTuong]: [item] })
                    }
                } else {
                    inputRender[indexGroup][item?.group].grid = [{ [item?.maDoiTuong]: [item] }]
                }
            } else {
                inputRender.push({ [item['group']]: { grid: [{ [item['maDoiTuong']]: [item] }] } })
            }
        }
        return inputRender
    })

    let detailRender: any = []
    detailScreen?.map((item) => {
        if (item?.type === 'main') {
            return truong?.map((t) => {
                if (item.ma === t.ma) {
                    item.doDai = t?.doDai
                    item.noiDung = detail && detail[item?.ma]
                    if (t.isDanhSach === 1) {
                        item.boSung = JSON.parse(t.boSung)
                    }
                    if (detailRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                        const indexGroup = detailRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                        if (Object.keys(detailRender[indexGroup][item?.group])?.some((m) => m === 'input')) {
                            detailRender[indexGroup][item?.group]?.input?.push(item)
                        } else {
                            detailRender[indexGroup][item?.group].input = [item]
                        }
                    } else {
                        detailRender.push({ [item['group']]: { input: [item] } })
                    }
                }
            })
        } else if (item?.type === 'combobox') {
            return resultDetail?.listDoiTuongKemTheo?.map((l) => {
                if (l.loaiHienThi === 1 && item?.maDoiTuong === l?.maDoituongDikem) {
                    item.noiDung =
                        detail?.combobox?.find((i) => Object.keys(i)[0] === item?.maDoiTuong) &&
                        detail?.combobox?.find((i) => Object.keys(i)[0] === item?.maDoiTuong)[item?.maDoiTuong]
                    if (detailRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                        const indexGroup = detailRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                        if (Object.keys(detailRender[indexGroup][item?.group])?.some((m) => m === 'input')) {
                            detailRender[indexGroup][item?.group]?.input?.push(item)
                        } else {
                            detailRender[indexGroup][item?.group].input = [item]
                        }
                    } else {
                        detailRender.push({ [item['group']]: { input: [item] } })
                    }
                }
            })
        } else if (item?.type === 'grid') {
            if (detailRender?.some((i) => Object.keys(i)[0] === item?.group)) {
                const indexGroup = detailRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
                if (Object.keys(detailRender[indexGroup][item?.group])?.some((m) => m === 'grid')) {
                    if (
                        detailRender[indexGroup][item?.group]?.grid?.some((m) => Object.keys(m)[0] === item?.maDoiTuong)
                    ) {
                        const indexDoiTuong = detailRender[indexGroup][item?.group]?.grid?.findIndex(
                            (m) => Object.keys(m)[0] === item?.maDoiTuong
                        )
                        detailRender[indexGroup][item?.group]?.grid[indexDoiTuong][item?.maDoiTuong]?.push(item)
                    } else {
                        detailRender[indexGroup][item?.group]?.grid?.push({ [item?.maDoiTuong]: [item] })
                    }
                } else {
                    detailRender[indexGroup][item?.group].grid = [{ [item?.maDoiTuong]: [item] }]
                }
            } else {
                detailRender.push({ [item['group']]: { grid: [{ [item['maDoiTuong']]: [item] }] } })
            }
        }
        return detailRender
    })
    const [file, setFile] = useState<any>()
    const [fileUrl, setFileUrl] = useState<any>()
    const [fileUrlDetail, setFileUrlDetail] = useState<any>()
    const [fileValue, setFileValue] = useState<any>()
    const [visible, setVisible] = useState(false)
    const onFinish = (values) => {
        //set lại dữ liệu khi change form
        if (!isAdd) {
            Object.keys(dataEdit).map(function (key) {
                Object.keys(values).map(function (k) {
                    if (key === k) {
                        if (values[k] === undefined) {
                            values[k] = dataEdit[key]
                        }
                    }
                    if (moment.isMoment(values[key])) values[key] = moment(values[key]).format('DD/MM/YYYY')
                })
            })
        }
        // format date dd/mm/yyyy khi gửi
        Object.keys(values).forEach((key) => {
            if (moment.isMoment(values[key])) values[key] = moment(values[key]).format('DD/MM/YYYY')
            inputRenderStatus?.map((status) => {
                if (key === status.ma && values[key] === undefined) {
                    values[key] = 1
                }
            })
        })
        // set data ký số
        if (fileValue) {
            values['teptin'] = fileValue.name
            values['signature'] = fileValue.id
        }
        // set data đối tượng kèm theo
        values.combobox = comboboxSource
        values.gridtable = dataSource
        // values.coHieuLuc = 1
        const data = isAdd ? { ma: maDoiTuong, insertData: [values] } : { id: dataEdit.id, ma: maDoiTuong, ...values }

        axios
            .post(`${DYNAMIC_API_URL}${isAdd ? '/save' : '/update'}`, data, Authorization(tokenIframe as string))
            .then((res) => {
                if (res.data.errorCode === SUCCESS) {
                    isAdd
                        ? history.push(`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${maDoiTuong}`)
                        : setDataEdit(undefined)
                    form.resetFields()
                    setFileUrl(undefined)
                    setFileValue(undefined)
                    Notification({ status: 'success', message: successMessage })
                    setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                } else {
                    Notification({ status: 'error', message: res.data?.message ?? errorMessage })
                }
            })
            .catch(() => Notification({ status: 'error', message: errorMessage }))
    }
    const onUploadFile = (file) => {
        if (file.type === 'application/pdf') {
            setFile(file.file)
        } else {
            Notification({ status: 'error', message: 'File Không hợp lệ, chọn file với định PDF' })
        }
    }
    const onfileKySo = () => {
        axios({
            url: 'https://uniplugin.unitech.vn:9876',
            method: 'POST',
            responseType: 'json',
            data: {
                method: 'saoy',
                uploadHandleUrl: `${process.env.REACT_APP_API_URL}/public/file/uploadkyso?safe=1`,
                auth: {
                    Authorization: tokenIframe
                }
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    setFileValue(res.data.data.data.file)
                }
            })
            .catch(() => {
                Notification({
                    status: 'error',
                    message: 'Vui lòng khởi động phần mềm ký số trước khi thực hiện chức năng!'
                })
            })
    }
    const onDeleteFile = (id) => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                axios
                    .delete(DELETE_FILES, {
                        ...Authorization(tokenIframe as string),
                        data: [id]
                    })
                    .then(() => {
                        setFileValue({
                            name: '',
                            id: 0
                        })
                    })
            }
        })
    }

    const onDisplayFile = () => {
        axios({
            url: `${DOWLOAD_FILE}/${isDetail ? parseInt(detail.signature) : fileValue.id}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${tokenIframe as string}` }
        }).then((response) => {
            const file = new Blob([response.data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(file)
            if (isDetail) {
                setFileUrlDetail(fileURL)
            }
            setFileUrl(fileURL)
            setVisible(true)
        })
    }
    useEffect(() => {
        if (file) {
            const data = new FormData()
            data.append('file', file)
            axios
                .post(UPLOAD_FILE_SIGN, data, Authorization(tokenIframe as string))
                .then((res) => {
                    setFileValue(res.data.data.file)
                })
                .catch((err) => {
                    Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
                })
        }
    }, [file])

    return resultDetail ? (
        <div className='dulieu-detail'>
            <PageHeader
                title={`${resultDetail?.ten}${isAdd ? ' - Thêm mới' : ''}`}
                style={{ padding: '0 0 16px 0' }}
                extra={
                    <Fragment>
                        <Button
                            icon={<BackwardOutlined />}
                            onClick={(): void =>
                                isDetail ? setIsDetail(false) : dataEdit ? setDataEdit(undefined) : history.goBack()
                            }>
                            Quay lại
                        </Button>
                        {!isAdd && !isDetail && !dataEdit && (
                            <>
                                <Button
                                    icon={isShowSearch ? <CloseOutlined /> : <SearchOutlined />}
                                    type={isShowSearch ? 'default' : 'primary'}
                                    onClick={(): void => {
                                        setIsShowSearch(isShowSearch ? false : true)
                                    }}>
                                    {isShowSearch ? 'Đóng tìm kiếm' : 'Tìm kiếm'}
                                </Button>
                                <Link to={`/${MenuPaths.dulieu}/themmoi?maDoiTuong=${maDoiTuong}`}>
                                    <Button type='primary' icon={<PlusOutlined />} onClick={() => setDataInput([])}>
                                        Thêm mới
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Fragment>
                }
            />
            {isAdd || dataEdit ? (
                isArrayEmpty(inputRender) ? (
                    <Fragment>
                        <div style={{ marginBottom: 10 }}>Vui lòng cấu hình biểu mẫu nhập liệu để định nghĩa form</div>
                        <Link to={`/${MenuPaths.doituong}/nhap-lieu?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                Đi tới cấu hình form
                            </Button>
                        </Link>
                    </Fragment>
                ) : (
                    <div className='dulieu-header'>
                        <Form onFinish={onFinish} form={form}>
                            <Button type='primary' htmlType='submit' className='btn-submit'>
                                <SaveOutlined /> Lưu
                            </Button>
                            {inputRender.map((v, i) => {
                                const renderComponent = (): JSX.Element => (
                                    <Row gutter={16}>
                                        {(Object.values(v)[0] as any)?.input?.map((item, index) => {
                                            if (item?.type === 'main') {
                                                return (
                                                    <Col
                                                        style={{
                                                            width: isStringEmpty(item.width) ? '25%' : `${item.width}%`
                                                        }}
                                                        key={index}>
                                                        <div
                                                            className={`title-preview ${item.batBuoc === 1 ? 'title-input' : ''
                                                                }`}>
                                                            {item.moTa}
                                                        </div>
                                                        <Form.Item
                                                            key={index}
                                                            name={item.ma}
                                                            rules={
                                                                isAdd || !dataEdit[item.ma]
                                                                    ? [
                                                                        {
                                                                            validator: (rule: any, value) => {
                                                                                const isBatBuoc = truong?.find(
                                                                                    (item) => item.ma === rule.field
                                                                                )?.batBuoc
                                                                                if (
                                                                                    isBatBuoc &&
                                                                                    isNullOrUndefined(value)
                                                                                ) {
                                                                                    return Promise.reject(
                                                                                        new Error(
                                                                                            'Vui lòng nhập dữ liệu vào trường này!'
                                                                                        )
                                                                                    )
                                                                                } else {
                                                                                    const field = truong?.find(
                                                                                        (item) =>
                                                                                            item.ma === rule.field
                                                                                    )
                                                                                    if (
                                                                                        field?.kieuDuLieu ===
                                                                                        'STRING' &&
                                                                                        value
                                                                                    ) {
                                                                                        if (
                                                                                            value.length >
                                                                                            field?.doDai!
                                                                                        ) {
                                                                                            return Promise.reject(
                                                                                                new Error(
                                                                                                    `${item.moTa} phải tối đa ${item?.doDai} ký tự!`
                                                                                                )
                                                                                            )
                                                                                        } else
                                                                                            return Promise.resolve()
                                                                                    } else if (
                                                                                        value &&
                                                                                        (field?.kieuDuLieu ===
                                                                                            'INT' ||
                                                                                            field?.kieuDuLieu ===
                                                                                            'LONG' ||
                                                                                            field?.kieuDuLieu ===
                                                                                            'FLOAT')
                                                                                    ) {
                                                                                        const validate = JSON.parse(
                                                                                            field?.validate!
                                                                                        )
                                                                                        if (
                                                                                            validate &&
                                                                                            value < validate['min']
                                                                                        ) {
                                                                                            return Promise.reject(
                                                                                                new Error(
                                                                                                    `${item.moTa} phải nhỏ nhất là ${validate['min']}!`
                                                                                                )
                                                                                            )
                                                                                        } else if (
                                                                                            validate &&
                                                                                            value > validate['max']
                                                                                        ) {
                                                                                            return Promise.reject(
                                                                                                new Error(
                                                                                                    `${item.moTa} phải lỡn nhất là ${validate['max']}!`
                                                                                                )
                                                                                            )
                                                                                        } else
                                                                                            return Promise.resolve()
                                                                                    } else return Promise.resolve()
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                    : undefined
                                                            }>
                                                            {renderInput(
                                                                item.kieuDuLieu,
                                                                item.ma,
                                                                false,
                                                                item.isTextArea
                                                            )}
                                                        </Form.Item>
                                                    </Col>
                                                )
                                            } else
                                                return (
                                                    <Col
                                                        style={{
                                                            width: isStringEmpty(item.width) ? '25%' : `${item.width}%`
                                                        }}
                                                        key={index}>
                                                        <div className='title-preview'>{item.moTa}</div>
                                                        <Form.Item key={index}>
                                                            <Select
                                                                showSearch
                                                                style={{ width: '100%' }}
                                                                value={
                                                                    comboboxSource?.find(
                                                                        (i) => Object.keys(i)[0] === item.maDoiTuong
                                                                    ) &&
                                                                    comboboxSource?.find(
                                                                        (i) => Object.keys(i)[0] === item.maDoiTuong
                                                                    )[item.maDoiTuong]
                                                                }
                                                                onChange={(_, option: any) => {
                                                                    if (
                                                                        comboboxSource?.some(
                                                                            (i) =>
                                                                                Object.keys(i)[0] === item?.maDoiTuong
                                                                        )
                                                                    ) {
                                                                        const indexRow = comboboxSource?.findIndex(
                                                                            (i) =>
                                                                                Object.keys(i)[0] === item?.maDoiTuong
                                                                        )
                                                                        const newData = [...comboboxSource]
                                                                        newData[indexRow] = {
                                                                            [item?.maDoiTuong]: option?.value
                                                                        }
                                                                        setComboboxSource(newData)
                                                                    } else {
                                                                        setComboboxSource([
                                                                            ...comboboxSource,
                                                                            {
                                                                                [item?.maDoiTuong]: option?.value
                                                                            }
                                                                        ])
                                                                    }
                                                                }}
                                                                filterOption={(input, option: any) =>
                                                                    option.props.children
                                                                        .toLowerCase()
                                                                        .indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                filterSort={(optionA: any, optionB: any) =>
                                                                    optionA.children
                                                                        .toLowerCase()
                                                                        .localeCompare(optionB.children.toLowerCase())
                                                                }>
                                                                {dataCombobox?.find(
                                                                    (d) => Object.keys(d)[0] === item?.maDoiTuong
                                                                ) &&
                                                                    dataCombobox
                                                                        ?.find(
                                                                            (d) =>
                                                                                Object.keys(d)[0] === item?.maDoiTuong
                                                                        )
                                                                    [item?.maDoiTuong]?.map((a, b) => (
                                                                        <Select.Option
                                                                            key={b}
                                                                            value={a.key?.toString()}>
                                                                            {a.value}
                                                                        </Select.Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                )
                                        })}
                                    </Row>
                                )
                                const renderTable = (m, n): JSX.Element => {
                                    const handleSave = (row) => {
                                        const newData = [...dataSource]
                                        const indexRow = newData?.findIndex((item) => Object.keys(item)[0] === m)
                                        const indexItem =
                                            newData[indexRow] &&
                                            newData[indexRow][m]?.findIndex((item) => row.key === item.key)
                                        const item = newData[indexRow] && newData[indexRow][m][indexItem]
                                        newData[indexRow][m][indexItem] = { ...item, ...row }
                                        setDataSource(newData)
                                    }
                                    const handleDelete = (key) => {
                                        const newData = [...dataSource]
                                        const indexRow = newData?.findIndex((i) => Object.keys(i)[0] === m)
                                        newData[indexRow][m] = newData[indexRow][m]?.filter((i) => i.key !== key)
                                        setDataSource(newData)
                                    }
                                    const setColumns = (field: string) => {
                                        const fieldItem = (Object.values(v)[0] as any)?.grid?.find(
                                            (t) => Object.keys(t)[0] === field
                                        )[field]
                                        const fieldRender = fieldItem?.map((m) => {
                                            return {
                                                title: m.moTa,
                                                key: m.ma,
                                                dataIndex: m.ma,
                                                width: isStringEmpty(m.width) ? 'unset' : `${m.width}%`,
                                                onCell: (record) => ({
                                                    record,
                                                    editable: m.kieuDuLieu,
                                                    dataIndex: m.ma,
                                                    title: m.moTa,
                                                    handleSave
                                                })
                                            }
                                        })
                                        fieldRender?.push({
                                            title: 'Thao tác',
                                            dataIndex: 'operation',
                                            align: 'center',
                                            render: (_, record) =>
                                                dataSource.length >= 1 ? (
                                                    <Popconfirm
                                                        title='Bạn có chắc chắn muốn xóa?'
                                                        okText='Đồng ý'
                                                        cancelText='Không'
                                                        onConfirm={() => handleDelete(record.key)}>
                                                        <Button
                                                            type='text'
                                                            icon={
                                                                <DeleteOutlined style={{ color: '#ff4d4f' }} />
                                                            }></Button>
                                                    </Popconfirm>
                                                ) : null
                                        })
                                        return fieldRender
                                    }
                                    const handleAdd = () => {
                                        if (dataSource?.some((i) => Object.keys(i)[0] === m)) {
                                            const index = dataSource?.findIndex((i) => Object.keys(i)[0] === m)
                                            const newData = [...dataSource]
                                            const valueCount =
                                                count?.find((i) => Object.keys(i)[0] === m) &&
                                                count?.find((i) => Object.keys(i)[0] === m)[m]
                                            const newCount = [...count]
                                            const indexCount = count?.findIndex((i) => Object.keys(i)[0] === m)
                                            newCount[indexCount][m] = valueCount + 1
                                            setCount(newCount)
                                            newData[index][m] = [...newData[index][m], { key: valueCount + 1 }]
                                            setDataSource(newData)
                                        } else {
                                            setCount([...count, { [m]: 0 }])
                                            setDataSource([...dataSource, { [m]: [{ key: 0 }] }])
                                        }
                                    }
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
                                    const EditableCell = ({
                                        editable,
                                        children,
                                        dataIndex,
                                        record,
                                        handleSave,
                                        ...restProps
                                    }) => {
                                        const save = (value, dataIndex) => {
                                            const newData = [...dataSource]
                                            const indexRow = newData?.findIndex((item) => Object.keys(item)[0] === m)
                                            const indexItem =
                                                newData[indexRow] &&
                                                newData[indexRow][m]?.findIndex((item) => item.key === record.key)
                                            if (newData[indexRow][m][indexItem]) {
                                                newData[indexRow][m][indexItem][dataIndex] = value
                                            }
                                            setDataSource(newData)
                                        }
                                        let childNode = children
                                        if (editable === 'STRING') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <Input
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onBlur={(e) => save(e.target.value, dataIndex)}
                                                        defaultValue={record && record[dataIndex]}
                                                    />
                                                </Form.Item>
                                            )
                                        }
                                        if (editable === 'STATUS') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <Select
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onChange={(value) => save(value, dataIndex)}
                                                        defaultValue={record && record[dataIndex]}>
                                                        <Select.Option value={1}>Có</Select.Option>
                                                        <Select.Option value={0}>Không</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            )
                                        }
                                        if (editable === 'INT') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <InputNumber
                                                        min={-2147483648}
                                                        max={2147483647}
                                                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onBlur={(e) => save(e.target.value, dataIndex)}
                                                        defaultValue={record && record[dataIndex]}
                                                    />
                                                </Form.Item>
                                            )
                                        }
                                        if (editable === 'LONG') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <InputNumber
                                                        min={-9223372036854775808}
                                                        max={9223372036854775807}
                                                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onBlur={(e) => save(e.target.value, dataIndex)}
                                                        defaultValue={record && record[dataIndex]}
                                                    />
                                                </Form.Item>
                                            )
                                        }
                                        if (editable === 'FLOAT') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <InputNumber
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onBlur={(e) => save(e.target.value, dataIndex)}
                                                        defaultValue={record && record[dataIndex]}
                                                    />
                                                </Form.Item>
                                            )
                                        }
                                        if (editable === 'DATETIME') {
                                            childNode = (
                                                <Form.Item style={{ margin: 0 }} name={dataIndex}>
                                                    <DatePicker
                                                        placeholder='Chọn ngày'
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        format='DD/MM/YYYY'
                                                        onChange={(_, dateString) => save(dateString, dataIndex)}
                                                        defaultValue={
                                                            record[dataIndex] && moment(record[dataIndex], 'DD/MM/YYYY')
                                                        }
                                                        locale={locale}
                                                    />
                                                </Form.Item>
                                            )
                                        }
                                        return <td {...restProps}>{childNode}</td>
                                    }
                                    return (
                                        <Fragment key={n}>
                                            <div className={`title-preview`}>
                                                {resultList?.find((a) => a.ma === m)?.ten}
                                            </div>
                                            <Table
                                                size='small'
                                                style={{ marginTop: 10 }}
                                                bordered
                                                components={{ body: { cell: EditableCell, row: EditableRow } }}
                                                columns={setColumns(m) as any}
                                                dataSource={
                                                    dataSource?.find((i) => Object.keys(i)[0] === m) &&
                                                    dataSource?.find((i) => Object.keys(i)[0] === m)[m]
                                                }
                                                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                                pagination={false}
                                                scroll={{
                                                    y: window.innerHeight - 250
                                                }}
                                            />
                                            <div style={{ textAlign: 'right' }}>
                                                <Button
                                                    size='small'
                                                    icon={<PlusOutlined />}
                                                    type='primary'
                                                    style={{ marginTop: 10 }}
                                                    onClick={handleAdd}>
                                                    Thêm
                                                </Button>
                                            </div>
                                        </Fragment>
                                    )
                                }
                                if (isStringEmpty(Object.keys(v)[0])) {
                                    return (
                                        <div style={{ marginTop: 15 }}>
                                            {renderComponent()}
                                            {(Object.values(v)[0] as any)?.grid?.map((m, n) =>
                                                renderTable(Object.keys(m)[0], n)
                                            )}
                                        </div>
                                    )
                                }
                                return (
                                    <fieldset key={i}>
                                        <legend>{Object.keys(v)[0]}</legend>
                                        {renderComponent()}
                                        {(Object.values(v)[0] as any)?.grid?.map((m, n) =>
                                            renderTable(Object.keys(m)[0], n)
                                        )}
                                    </fieldset>
                                )
                            })}
                        </Form>
                        <div style={{ marginTop: 15 }}>
                            <div style={{ marginBottom: 20 }}>
                                <span>Tên tệp ký số </span>
                                {fileValue && fileValue?.id !== 0 && fileValue?.name !== null && (
                                    <>
                                        <span style={{ color: '#009cd7', fontWeight: 'bold' }}>{fileValue?.name}</span>
                                        <Tooltip title='Xóa tệp tin' color='#ff4d4f' placement='top'>
                                            <Button
                                                type='text'
                                                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                                onClick={() => onDeleteFile(fileValue.id)}
                                            />
                                        </Tooltip>
                                        <Tooltip title='xem và tải tệp tin' color='#52c41a' placement='top'>
                                            <Button
                                                type='text'
                                                icon={<FundViewOutlined style={{ color: '#2e810f' }} />}
                                                onClick={onDisplayFile}
                                            />
                                        </Tooltip>
                                    </>
                                )}
                                {fileUrl && (
                                    <Modal
                                        closable={false}
                                        className='modal-pdf'
                                        visible={visible}
                                        width='70%'
                                        footer={[
                                            <Button danger type='primary' onClick={() => setVisible(false)}>
                                                Đóng tệp
                                            </Button>
                                        ]}
                                        centered>
                                        <iframe
                                            src={fileUrl}
                                            style={{ width: '100%', height: '70vh' }}
                                            title='view-pdf'
                                        />
                                    </Modal>
                                )}
                            </div>
                            <div>
                                <label className='file-upload'>
                                    <FileBase64 onDone={(file) => onUploadFile(file)} />
                                    Chọn tệp
                                </label>
                                <label className='file-upload' onClick={onfileKySo}>
                                    Chọn tệp và ký số
                                </label>
                            </div>
                        </div>
                    </div>
                )
            ) : isDetail ? (
                isArrayEmpty(detailRender) ? (
                    <>
                        <div style={{ marginBottom: 10 }}>Vui lòng cấu hình biểu mẫu chi tiết để định nghĩa form</div>
                        <Link to={`/${MenuPaths.doituong}/chi-tiet?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                Đi tới cấu hình form
                            </Button>
                        </Link>
                    </>
                ) : (
                    <Fragment>
                        {detail.teptin && (
                            <div style={{ marginTop: 20 }}>
                                <span style={{ color: 'rgb(24, 144, 255)' }}>
                                    Tên tệp ký số :
                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}> {detail.teptin}</span>
                                </span>
                                <Tooltip title='Xem và tải tệp tin' color='#52c41a' placement='top'>
                                    <Button
                                        type='text'
                                        icon={<FundViewOutlined style={{ color: '#2e810f' }} />}
                                        onClick={onDisplayFile}
                                    />
                                </Tooltip>
                                {fileUrlDetail && (
                                    <Modal
                                        closable={false}
                                        className='modal-pdf'
                                        visible={visible}
                                        width='70%'
                                        footer={[
                                            <Button danger type='primary' onClick={() => setVisible(false)}>
                                                Đóng tệp
                                            </Button>
                                        ]}
                                        centered>
                                        <iframe
                                            src={fileUrlDetail}
                                            style={{ width: '100%', height: '70vh' }}
                                            title='view-pdf'
                                        />
                                    </Modal>
                                )}
                            </div>
                        )}
                        {/*  xem chi tiết đối tượng */}
                        {detailRender?.map((v, i) => {
                            const renderComponent = (): JSX.Element => (
                                <Row gutter={16}>
                                    {(Object.values(v)[0] as any)?.input?.map((item, index) => {
                                        if (item?.type === 'main') {
                                            return (
                                                <Col
                                                    style={{
                                                        width: isStringEmpty(item.width) ? '25%' : `${item.width}%`,
                                                        marginBottom: 10
                                                    }}
                                                    key={index}>
                                                    <div className='title-preview' style={{ color: '#1890ff' }}>
                                                        {item.moTa}
                                                    </div>
                                                    {/* check STATUS có or không */}
                                                    <div style={{ marginTop: 3 }}>
                                                        {item.boSung
                                                            ? item?.boSung.find(
                                                                (bs) => parseInt(bs.key) === parseInt(item.noiDung)
                                                            ).value
                                                            : item.kieuDuLieu === 'STATUS'
                                                                ? item.noiDung === 0
                                                                    ? 'Không'
                                                                    : 'Có'
                                                                : item.noiDung}
                                                    </div>
                                                </Col>
                                            )
                                        } else
                                            return (
                                                <Col
                                                    style={{
                                                        width: isStringEmpty(item.width) ? '25%' : `${item.width}%`,
                                                        marginBottom: 10
                                                    }}
                                                    key={index}>
                                                    <div className='title-preview' style={{ color: '#1890ff' }}>
                                                        {item.moTa}
                                                    </div>
                                                    <div style={{ marginTop: 3 }}>
                                                        {dataCombobox?.find(
                                                            (i) => Object.keys(i)[0] === item?.maDoiTuong
                                                        ) &&
                                                            dataCombobox
                                                                ?.find((i) => Object.keys(i)[0] === item?.maDoiTuong)
                                                            [item?.maDoiTuong]?.find(
                                                                (a) =>
                                                                    a?.key?.toString() === item?.noiDung?.toString()
                                                            )?.value}
                                                    </div>
                                                </Col>
                                            )
                                    })}
                                </Row>
                            )
                            // Table
                            const renderTable = (m, n): JSX.Element => {
                                const setColumns = (field: string) => {
                                    const fieldItem = (Object.values(v)[0] as any)?.grid?.find(
                                        (t) => Object.keys(t)[0] === field
                                    )[field]
                                    const fieldRender = fieldItem?.map((m) => {
                                        return {
                                            title: m.moTa,
                                            key: m.ma,
                                            dataIndex: m.ma,
                                            width: isStringEmpty(m.width) ? 'unset' : `${m.width}%`
                                        }
                                    })
                                    return fieldRender
                                }
                                return (
                                    <Fragment key={n}>
                                        <div className={`title-preview`} style={{ color: '#1890ff' }}>
                                            {resultList?.find((a) => a.ma === m)?.ten}
                                        </div>
                                        <Table
                                            size='small'
                                            style={{ marginTop: 10 }}
                                            bordered
                                            columns={setColumns(m) as any}
                                            dataSource={
                                                detail?.gridtable?.find((i) => Object.keys(i)[0] === m) &&
                                                detail?.gridtable?.find((i) => Object.keys(i)[0] === m)[m]
                                            }
                                            locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                            pagination={false}
                                            scroll={{
                                                y: window.innerHeight - 250
                                            }}
                                        />
                                    </Fragment>
                                )
                            }
                            if (isStringEmpty(Object.keys(v)[0])) {
                                return (
                                    <div style={{ marginTop: 15 }}>
                                        {renderComponent()}
                                        {(Object.values(v)[0] as any)?.grid?.map((m, n) =>
                                            renderTable(Object.keys(m)[0], n)
                                        )}
                                    </div>
                                )
                            }
                            return (
                                <fieldset key={i}>
                                    <legend>{Object.keys(v)[0]}</legend>
                                    {renderComponent()}
                                    {(Object.values(v)[0] as any)?.grid?.map((m, n) =>
                                        renderTable(Object.keys(m)[0], n)
                                    )}
                                </fieldset>
                            )
                        })}
                    </Fragment>
                )
            ) : (
                <Fragment>
                    {!isArrayEmpty(searchRender) && isShowSearch && (
                        <div className='search-data' style={{ marginBottom: '16px' }}>
                            <div className='box-search'>
                                <Row gutter={16}>
                                    {searchRender?.map((item, index) => (
                                        <Col
                                            style={{
                                                width: isStringEmpty(item.width) ? '25%' : `${item.width}%`,
                                                marginBottom: 5
                                            }}
                                            key={index}>
                                            <div className='title-preview'>{item.moTa}</div>
                                            {renderInput(item.kieuDuLieu, item.ma, true, item.isTextArea)}
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            <div className='search-row' style={{ textAlign: 'end', marginTop: 16 }}>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        setOffset(1)
                                        setQueryData(dataInput)
                                        setIsSearch(!isSearch)
                                    }}>
                                    <SearchOutlined /> Tìm kiếm
                                </Button>
                            </div>
                        </div>
                    )}
                    <Table
                        size='small'
                        columns={columnRender}
                        dataSource={checkList?.filter((i) => Object.keys(i).length > 0)}
                        pagination={false}
                        bordered
                        locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                        scroll={{
                            y: window.innerHeight - 250
                        }}
                    />
                    {!isArrayEmpty(checkList?.filter((i) => Object.keys(i).length > 0)) && (
                        <ConfigProvider locale={viVN}>
                            <Pagination
                                total={total}
                                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dữ liệu`}
                                style={{ textAlign: 'end', paddingTop: '20px' }}
                                onChange={(offset, limit) => {
                                    setOffset(offset)
                                    setLimit(limit as number)
                                    getData({ queryData, limit, offset: (offset - 1) * limit! })
                                }}
                                defaultPageSize={limit}
                                current={offset}
                                showSizeChanger
                                pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                            />
                        </ConfigProvider>
                    )}
                </Fragment>
            )}
        </div>
    ) : (
        <Spin size='large' className='loading-layout' tip='Đang tải dữ liệu' />
    )
}
