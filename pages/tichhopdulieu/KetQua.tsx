/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    ForwardOutlined,
    FundViewOutlined,
    PlusOutlined,
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
    FILES_KYSO,
    PUBLIC_FILE_GETINFO,
    PUBLIC_FILE_VERIFY_SIGNATURE,
    UPLOAD_FILE_SIGN
} from 'common/constant/api-constant'
import { errorMessage, errorSignature, MenuPaths, successMessage } from 'common/constant/app-constant'
import { Doituong } from 'common/interface/Doituong'
import { TruongDuLieu } from 'common/interface/TruongDuLieu'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import vgca_sign_copy from 'js/vgcaplugin'
import moment from 'moment'
import 'moment/locale/vi'
import queryString from 'query-string'
import { default as React, Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/css/dulieu.css'

const EditableContext = React.createContext(null)
interface Props {
    queryData: any
    limit?: number
    offset?: number
}
export default function ChitietDulieu(): JSX.Element {
    const parsed = queryString.parse(window.location.search)
    const loaiTichHop = parsed.loaiTichHop
    const isChiTiet = parsed.isChiTiet
    const tokenIframe = parsed.token
    const idKetQua = parsed.idKetQua
    const isHoanThanh = Boolean(parsed?.isHoanThanh)
    //  const isThanhPhan = Boolean(parsed?.isThanhPhan)
    const maTTHC = parsed.maTTHC
    const maLoaiGiayTo = parsed.maLoaiGiayTo
    const maCoQuanTiepNhan = parsed.maCoQuanTiepNhan
    const [maDoiTuong, setMaDoiTuong] = useState<any>()
    //  const maDoiTuong = (maTTHC?.concat(maLoaiGiayTo as string) as string).replace(/[.-]/gi, '').toLowerCase()
    const [idFileKySo, setIdFileKySo] = useState<any>()
    //
    const [resultDetail, setResultDetail] = useState<Doituong | undefined>()
    const [listRes, setListRes] = useState<any>()
    const [total, setTotal] = useState<number | undefined>()
    const [queryData, setQueryData] = useState<any>([])
    const [dataInput, setDataInput] = useState<any>([])
    const isAdd = !idKetQua && window.location.pathname.split('/').pop() === 'ketqua'
    const [isDetail, setIsDetail] = useState<boolean>(false)
    const [offset, setOffset] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [detail, setDetail] = useState<any>()
    const [truong, setTruong] = useState<TruongDuLieu[] | undefined>()
    const [dataEdit, setDataEdit] = useState<any>()
    const [isSearch, setIsSearch] = useState<boolean>(true)
    const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
    const [resultList, setResultList] = useState<Doituong[] | undefined>()
    const [doiTuongCombobox, setDoiTuongCombobox] = useState<any>([])
    const [dataCombobox, setDataCombobox] = useState<any>([])
    const [dataSource, setDataSource] = useState<any>([])
    const [resList, setResList] = useState<any>([])
    const [comboboxSource, setComboboxSource] = useState<any>([])
    const [count, setCount] = useState<any>([])
    const searchScreen = getScreen('searchScreen')
    const listScreen = getScreen('listScreen')
    const inputScreen = getScreen('inputScreen')
    const detailScreen = getScreen('detailScreen')
    const [form] = Form.useForm()
    const [countSubmit, setCountSubmit] = useState(1)
    const [isExist, setIsExist] = useState(true)
    // Post Message Iframe
    const iFrameRef = useRef(null)
    const [message, setMessage] = useState(String)
    const [urlCallBack, setUrlCallBack] = useState(String)

    useEffect(() => {
        axios
            .get(`${DYNAMIC_URL}/doituong/magiayto/${maLoaiGiayTo}`, Authorization(tokenIframe as string))
            .then((res) => {
                if (res.data.data === null) {
                    setIsExist(false)
                }
                setMaDoiTuong(res.data.data.ma)
                setResultDetail(res.data.data)
            })
    }, [])

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

    const deleteDulieu = (id): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'H???y',
            maskClosable: true,
            onOk: () => {
                const value = { ma: maDoiTuong, id }
                return axios
                    .post(`${DYNAMIC_API_URL}/delete`, value, Authorization(tokenIframe as string))
                    .then(() => {
                        Notification({ status: 'success', message: 'X??a th??nh c??ng' })
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'X??a th???t b???i' })
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
        title: 'Ch???c n??ng',
        key: 'action',
        align: 'center',
        width: '150px',
        render: (value) => {
            const dataEdit = listRes.find((item) => item.id === value.id)
            return (
                <Fragment>
                    <Tooltip title='Chi ti???t' color='#4caf50' placement='top'>
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
                    <Tooltip title='S???a' color='#2db7f5' placement='top'>
                        <Button
                            type='text'
                            icon={
                                <EditOutlined
                                    style={{ color: '#1890ff' }}
                                    onClick={() => {
                                        setDataEdit(dataEdit)
                                        // setFileValue({
                                        //     name: dataEdit.teptin,
                                        //     id: parseInt(dataEdit.signature)
                                        // })
                                    }}
                                />
                            }
                        />
                    </Tooltip>
                    <Tooltip title='X??a' color='#ff4d4f' placement='top'>
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
                        item[ma] === 1 ? (item[ma] = 'Co??') : (item[ma] = 'Kh??ng')
                        return item[ma]
                    }
                }
            })
        })

        prev.push(item)
        return prev
    }, [])
    const getData = ({ queryData, limit, offset }: Props) => {
        return axios
            .post(
                `${DYNAMIC_API_URL}/read`,
                { ma: maDoiTuong, queryData, limit, offset },
                Authorization(tokenIframe as string)
            )
            .then((res) => {
                setTotal(res.data.data?.total)
                setListRes(res.data?.data?.items)
                setDataEdit(res?.data?.data?.items[0])
                // setFileValue({
                //     name: res.data?.data?.items[0]?.teptin,
                //     id: parseInt(res.data?.data?.items[0]?.signature)
                // })
                setDetail(res.data.data?.items[0])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // useEffect(() => {
    //     getData({ queryData, limit, offset: 0 })
    // }, [isSearch])

    useEffect(() => {
        queryData.push(['id', '=', idKetQua])
        maDoiTuong && getData({ queryData, limit, offset: 0 })
    }, [idKetQua, maDoiTuong])
    const gridSelect = resultDetail?.listDoiTuongKemTheo?.filter((item) => item?.loaiHienThi === 2)
    useEffect(() => {
        maDoiTuong &&
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
    }, [resultDetail, maDoiTuong])

    useEffect(() => {
        maDoiTuong &&
            axios.post(`${DYNAMIC_URL}/list`, {}, Authorization(tokenIframe as string)).then((res) => {
                setResultList(res.data.data.items)
            })
    }, [maDoiTuong])

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
    const renderInput = (kieuDuLieu, ma, isRange: boolean) => {
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
                        <Select.Option value={1}>C??</Select.Option>
                        <Select.Option value={0}>Kh??ng</Select.Option>
                    </Select>
                )
            case 'DATETIME':
                return isRange ? (
                    <DatePicker.RangePicker
                        placeholder={['T??? ng??y', '?????n ng??y']}
                        format='DD/MM/YYYY'
                        style={{ width: '100%' }}
                        onChange={(_, date) => onBlur(date, ma, true)}
                        locale={locale}
                    />
                ) : (
                    <DatePicker
                        placeholder='Ch???n ng??y'
                        defaultValue={dataEdit && dataEdit[ma] && moment(dataEdit[ma], 'DD/MM/YYYY')}
                        style={{ width: '100%' }}
                        format='DD/MM/YYYY'
                        locale={locale}
                    />
                )
            default:
                return (
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
    const [dataFileKySo, setDataFileKySo] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVerify, setIsVerify] = useState<boolean>(false)

    const onUploadFile = (e) => {
        const file = e.target.files[0]
        let type = e.target.files[0].type
        if (type === 'application/pdf') {
            const data = new FormData()
            data.append('file', file)
            axios.post(PUBLIC_FILE_VERIFY_SIGNATURE, data).then((res) => {
                if (res.data.errorCode === 0) {
                    setIsVerify(true)
                    setFile(file)
                } else {
                    setFile(undefined)
                    setIsVerify(false)
                    Notification({ status: 'error', message: 'File ch??a ???????c k?? s???, vui l??ng ch???n l???i ' })
                }
            })
        } else {
            Notification({ status: 'error', message: 'File Kh??ng h???p l???, ch???n file v???i ?????nh PDF' })
        }
    }

    const onResetFile = (e) => {
        e.target.value = ''
    }
    // columns table k?? s???
    const columnsFileKySo: any = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (value, _, index) => index + 1
        },
        { title: 'T??n file', dataIndex: 'name', key: 'name' },
        {
            title: 'Ng??y ????nh k??m ',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            align: 'center',
            width: 300,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: 'Thao t??c',
            align: 'center',
            dataIndex: 'name',
            key: 'action',
            width: 300,
            render: (_, record) => {
                const removeFile = (record) => {
                    showConfirm({
                        title: 'B???n c?? ch???c ch???n mu???n x??a?',
                        icon: <ExclamationCircleOutlined />,
                        okText: '?????ng ??',
                        okType: 'primary',
                        cancelText: 'Kh??ng',
                        maskClosable: true,
                        onOk: (): void => {
                            setDataFileKySo(dataFileKySo.filter((file) => file.id !== record.id))
                        }
                    })
                }
                return (
                    <>
                        {!isChiTiet && (
                            <Tooltip title='X??a t???p tin' color='#ff4d4f' placement='top'>
                                <Button
                                    type='text'
                                    icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                    onClick={() => (isAdd ? removeFile(record) : onDeleteFile(record.id))}
                                />
                            </Tooltip>
                        )}
                        <Tooltip title='Xem v?? t???i t???p tin' color='#52c41a' placement='top'>
                            <Button
                                type='text'
                                icon={<FundViewOutlined style={{ color: '#2e810f' }} />}
                                onClick={() => onDisplayFile(record)}
                            />
                        </Tooltip>
                        <Tooltip title='T???i t???p tin' placement='top'>
                            <Button type='text' icon={<DownloadOutlined />} onClick={() => onDownloadFile(record)} />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    // k?? s??? ban c?? y???u
    function uploadkysoBCY() {
        var prms = {}
        prms['FileUploadHandler'] = `https://sohoa-tthc.cantho.gov.vn/api/public/file/uploadkysoBCY?safe=1`
        prms['SessionId'] = ''
        prms['FileName'] = ''
        var json_prms = JSON.stringify(prms)
        vgca_sign_copy(json_prms, SignFileCallBack)
    }
    function SignFileCallBack(rv) {
        var _json = JSON.parse(rv)
        if (_json.Status === 0) {
            let id = _json.FileServer
            axios.get(`${PUBLIC_FILE_GETINFO}/${id}`, Authorization()).then((res) => {
                setFileValue({
                    name: res.data.data.file.name,
                    id: id
                })
            })
            Notification({ status: 'success', message: 'K?? s??? th??nh c??ng!' })
        } else {
            Notification({ status: 'error', message: _json.Message })
        }
    }
    // x??? l?? file
    const onDeleteFile = (id) => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: (): void => {
                axios
                    .delete(`${DELETE_FILES}?madoituong=${maDoiTuong}&doituongid=${isAdd ? idFileKySo : idKetQua}`, {
                        ...Authorization(tokenIframe as string),
                        data: [id]
                    })
                    .then(() => {
                        axios
                            .get(
                                `${FILES_KYSO}/${maDoiTuong}/${isAdd ? idFileKySo : idKetQua}?active=1`,
                                Authorization(tokenIframe as string)
                            )
                            .then((res) => {
                                setDataFileKySo(res.data.data?.map((item) => item.file))
                            })
                    })
            }
        })
    }
    const onDisplayFile = (record) => {
        setIsLoading(true)
        axios({
            url: `${DOWLOAD_FILE}/pdf/${record.id}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${tokenIframe}` }
        }).then((response) => {
            setIsLoading(false)
            const file = new Blob([response.data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(file)
            if (isChiTiet) {
                setFileUrlDetail(fileURL)
            }
            setFileUrl(fileURL)
            setVisible(true)
        })
    }
    const onDownloadFile = (record) => {
        axios({
            // url: `${DOWLOAD_FILE}/pdf/${isDetail ? parseInt(detail.signature) : record.id}`,
            url: `${DOWLOAD_FILE}/pdf/${record.id}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${tokenIframe}` }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', record.name)
            document.body.appendChild(link)
            link.click()
        })
    }

    const onFinish = async (values) => {
        setCountSubmit(countSubmit + 1)
        setMessage(undefined)
        let dataResponse = null
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
        // format date dd/mm/yyyy khi g???i
        if (values !== null && values !== undefined) {
            Object.keys(values).forEach((key) => {
                if (moment.isMoment(values[key])) values[key] = moment(values[key]).format('DD/MM/YYYY')
                inputRenderStatus?.map((status) => {
                    if (key === status.ma && values[key] === undefined) {
                        values[key] = 1
                    }
                })
            })
        }

        if (values === null || values === undefined || isArrayEmpty(dataFileKySo)) {
            Notification({ status: 'error', message: errorSignature })
        } else {
            // set data k?? s???
            if (dataFileKySo) {
                let list = []
                dataFileKySo.reduce((prev, cur) => {
                    list.push(cur.id)
                    return (values['filekysoids'] = list)
                }, [])
            }
            // set data ?????i t?????ng k??m theo
            values.combobox = comboboxSource
            values.gridtable = dataSource
            values.ishoanthanh = isHoanThanh ? 1 : 0
            values.magiayto = maLoaiGiayTo
            if (!isNullOrUndefined(maCoQuanTiepNhan)) {
                values.macoquantiepnhan = maCoQuanTiepNhan
            }
            if (isNullOrUndefined(loaiTichHop)) {
                values.loaitichhop = 'IMPORT_MCDT'
            } else {
                values.loaitichhop = loaiTichHop
            }

            // values.coHieuLuc = 1
            const data = isAdd
                ? { ma: maDoiTuong, magiayto: maLoaiGiayTo, insertData: [values], loaitichhop: loaiTichHop }
                : { id: dataEdit.id, ma: maDoiTuong, ...values }

            await axios
                .post(`${DYNAMIC_API_URL}${isAdd ? '/save' : '/update'}`, data, Authorization(tokenIframe as string))
                .then((res) => {
                    if (res.data.errorCode === SUCCESS) {
                        if (isAdd) {
                            form.resetFields()
                            setFileUrl(undefined)
                            setFileValue(undefined)
                        }
                        Notification({ status: 'success', message: successMessage })
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                        if (loaiTichHop === 'IMPORT_THANHPHANHSMCDT') {
                            dataResponse = res.data
                        } else {
                            dataResponse = { errorCode: 0, message: 'Th??nh c??ng' }
                        }
                    } else {
                        Notification({ status: 'error', message: res.data?.message ?? errorMessage })
                        dataResponse = { errorCode: 99, message: 'L???i' }
                    }
                })
                .catch((err) => {
                    Notification({ status: 'error', message: errorMessage })
                    dataResponse = { errorCode: 99, message: 'L???i' }
                })
            if (urlCallBack) {
                window.parent.postMessage(dataResponse, urlCallBack)
            } else {
                window.parent.postMessage(dataResponse, '*')
            }
        }
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
                    Notification({ status: 'error', message: 'H??? th???ng kh??ng ph???n h???i, vui l??ng truy c???p l???i sau !' })
                })
        }
    }, [file])
    useEffect(() => {
        fileValue && setDataFileKySo([...dataFileKySo, fileValue])
    }, [fileValue])
    useEffect(() => {
        !isAdd &&
            maDoiTuong &&
            axios
                .get(`${FILES_KYSO}/${maDoiTuong}/${idKetQua}?active=1`, Authorization(tokenIframe as string))
                .then((res) => {
                    setDataFileKySo(res.data.data?.map((item) => item.file))
                })
    }, [idKetQua, maDoiTuong])

    useEffect(() => {
        window.addEventListener('message', function (e) {
            if (e.data !== undefined) {
                try {
                    if (e.data !== 'SUBMIT') {
                        let dataJSON = JSON.parse(e.data)
                        setUrlCallBack(dataJSON.urlCallBack)
                        setMessage(dataJSON.action)
                    } else if (e.data === 'SUBMIT') {
                        setMessage(e.data)
                    }
                } catch (error) {
                    console.log('Kh??ng ph???i json data')
                }
            }
        })
        return () => window.removeEventListener('message', null)
    }, [])

    if (message === 'SUBMIT') {
        setCountSubmit(1) // click lan 2
        if (iFrameRef !== null && iFrameRef.current !== undefined && countSubmit === 1) {
            const value = iFrameRef.current?.getFieldsValue()
            onFinish(value)
        }
    }

    return maDoiTuong && resultDetail && isExist ? (
        <div className='dulieu-detail-iframe' style={{ padding: '0 10px', height: '100%', overflow: 'auto' }}>
            <PageHeader title={`${resultDetail?.ten}${isAdd ? ' - Th??m m???i' : ''}`} />
            {(isAdd || dataEdit) && isChiTiet !== '1' ? (
                isArrayEmpty(inputRender) ? (
                    <Fragment>
                        <div style={{ marginBottom: 10 }}>Vui l??ng c???u h??nh bi???u m???u nh???p li???u ????? ?????nh ngh??a form</div>
                        <Link to={`/${MenuPaths.doituong}/nhap-lieu?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                ??i t???i c???u h??nh form
                            </Button>
                        </Link>
                    </Fragment>
                ) : (
                    <div className='dulieu-header'>
                        <Form onFinish={onFinish} form={form} ref={iFrameRef}>
                            {/* <Button type='primary' htmlType='submit' className='btn-submit'>
                                <SaveOutlined /> L??u
                            </Button> */}
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
                                                            className={`title-preview ${
                                                                item.batBuoc === 1 ? 'title-input' : ''
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
                                                                                              'Vui l??ng nh???p d??? li???u v??o tr?????ng n??y!'
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
                                                                                                      `${item.moTa} ph???i t???i ??a ${item?.doDai} k?? t???!`
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
                                                                                                      `${item.moTa} ph???i nh??? nh???t l?? ${validate['min']}!`
                                                                                                  )
                                                                                              )
                                                                                          } else if (
                                                                                              validate &&
                                                                                              value > validate['max']
                                                                                          ) {
                                                                                              return Promise.reject(
                                                                                                  new Error(
                                                                                                      `${item.moTa} ph???i l???n nh???t l?? ${validate['max']}!`
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
                                                            {renderInput(item.kieuDuLieu, item.ma, false)}
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
                                                                                value={a.key.toString()}>
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
                                            title: 'Thao t??c',
                                            dataIndex: 'operation',
                                            align: 'center',
                                            render: (_, record) =>
                                                dataSource.length >= 1 ? (
                                                    <Popconfirm
                                                        title='B???n c?? ch???c ch???n mu???n x??a?'
                                                        okText='?????ng ??'
                                                        cancelText='Kh??ng'
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
                                                        <Select.Option value={1}>C??</Select.Option>
                                                        <Select.Option value={0}>Kh??ng</Select.Option>
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
                                                        placeholder='Ch???n ng??y'
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
                                                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                                                pagination={false}
                                                //scroll={{ y: window.innerHeight - 528 }}
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
                        <Spin size='large' tip='??ang x??? l?? d??? li???u' className='spin_kyso' spinning={isLoading}>
                            <div style={{ marginTop: 15 }}>
                                <div style={{ marginBottom: 20 }}>
                                    {!isArrayEmpty(dataFileKySo) && (
                                        <>
                                            <span style={{ fontWeight: 600 }}>Danh s??ch t???p k?? s??? </span>
                                            <Table
                                                size='small'
                                                rowKey='id'
                                                columns={columnsFileKySo}
                                                dataSource={dataFileKySo}
                                                pagination={false}
                                                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                                                bordered
                                                scroll={{
                                                    y: window.innerHeight - 250
                                                }}
                                                style={{ marginTop: '10px' }}
                                            />
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
                                                    ????ng t???p
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
                                <div style={{ marginBottom: 20, marginTop: 10 }}>
                                    <label className='file-upload'>
                                        <input
                                            type='file'
                                            id='myFile'
                                            name='filename'
                                            onChange={(e) => onUploadFile(e)}
                                            onClick={onResetFile}
                                        />
                                        Ch???n t???p
                                    </label>
                                    {/* <label className='file-upload' onClick={onfileKySo}>
                                    Ch???n t???p v?? k?? s??? Uni
                                </label> */}
                                    <label className='file-upload bancoyeu' onClick={uploadkysoBCY}>
                                        K?? s??? Ban C?? y???u
                                    </label>
                                </div>
                            </div>
                        </Spin>
                    </div>
                )
            ) : isDetail || isChiTiet === '1' ? (
                isArrayEmpty(detailRender) ? (
                    <>
                        <div style={{ marginBottom: 10 }}>Vui l??ng c???u h??nh bi???u m???u chi ti???t ????? ?????nh ngh??a form</div>
                        <Link to={`/${MenuPaths.doituong}/chi-tiet?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                ??i t???i c???u h??nh form
                            </Button>
                        </Link>
                    </>
                ) : (
                    <Fragment>
                        <Spin size='large' tip='??ang x??? l?? d??? li???u' className='spin_kyso' spinning={isLoading}>
                            <div style={{ marginTop: 20 }}>
                                {!isArrayEmpty(dataFileKySo) && (
                                    <>
                                        <span style={{ fontWeight: 600 }}>Danh s??ch t???p k?? s??? </span>
                                        <Table
                                            size='small'
                                            rowKey='id'
                                            columns={columnsFileKySo}
                                            dataSource={dataFileKySo}
                                            pagination={false}
                                            locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                                            bordered
                                            scroll={{
                                                y: window.innerHeight - 250
                                            }}
                                            style={{ marginTop: '10px' }}
                                        />
                                    </>
                                )}
                                {fileUrlDetail && (
                                    <Modal
                                        closable={false}
                                        className='modal-pdf'
                                        visible={visible}
                                        width='70%'
                                        footer={[
                                            <Button danger type='primary' onClick={() => setVisible(false)}>
                                                ????ng t???p
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
                                                        {/* check STATUS c?? or kh??ng */}
                                                        <div style={{ marginTop: 3 }}>
                                                            {item.boSung
                                                                ? item?.boSung.find(
                                                                      (bs) =>
                                                                          parseInt(bs.key) === parseInt(item.noiDung)
                                                                  ).value
                                                                : item.kieuDuLieu === 'STATUS'
                                                                ? item.noiDung === 0
                                                                    ? 'Kh??ng'
                                                                    : 'C??'
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
                                                                    ?.find(
                                                                        (i) => Object.keys(i)[0] === item?.maDoiTuong
                                                                    )
                                                                    [item?.maDoiTuong]?.find(
                                                                        (a) => a?.key === item?.noiDung
                                                                    )?.value}
                                                        </div>
                                                    </Col>
                                                )
                                        })}
                                    </Row>
                                )
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
                                                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
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
                        </Spin>
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
                                            {renderInput(item.kieuDuLieu, item.ma, true)}
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
                                    <SearchOutlined /> T??m ki???m
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
                        locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                        scroll={{
                            y: isShowSearch
                                ? window.innerHeight < 680
                                    ? window.innerHeight - 448
                                    : window.innerHeight - 508
                                : window.innerHeight < 680
                                ? window.innerHeight - 302
                                : window.innerHeight - 329
                        }}
                    />
                    {!isArrayEmpty(checkList?.filter((i) => Object.keys(i).length > 0)) && (
                        <ConfigProvider locale={viVN}>
                            <Pagination
                                total={total}
                                showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} d??? li???u`}
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
        <h2 style={{ color: 'red', padding: '10px 10px' }}>
            M?? lo???i k???t qu??? kh??ng t???n t???i tr??n h??? th???ng s??? ho??. Vui l??ng li??n h??? Trung t??m C??ng ngh??? th??ng tin v?? Truy???n
            th??ng (0292 3762333) ????? c???u h??nh th??m!
        </h2>
    )
}
