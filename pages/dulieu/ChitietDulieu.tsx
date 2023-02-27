/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import {
    BackwardOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
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
    Tooltip,
    Upload
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import viVN from 'antd/lib/locale/vi_VN'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { ACCESS_TOKEN, SUCCESS, USER_NAME } from 'common/constant'
import {
    DELETE_FILES,
    DOWLOAD_FILE,
    DYNAMIC_API_URL,
    DYNAMIC_URL,
    FILES_KYSO,
    GETINFO_FILE,
    UPLOAD_FILE_SIGN,
    USER_PERMISSION_LOAIKETQUA
} from 'common/constant/api-constant'
import { errorMessage, errorSignature, MenuPaths, successMessage } from 'common/constant/app-constant'
import { Doituong } from 'common/interface/Doituong'
import { TruongDuLieu } from 'common/interface/TruongDuLieu'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import vgca_sign_copy from 'js/vgcaplugin'
import moment from 'moment'
import 'moment/locale/vi'
import queryString from 'query-string'
import { default as React, Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { deleteMultiData, getDulieu } from 'store/actions/dulieu.action'
import '../../assets/css/dulieu.css'
// import { getCertificatesInfoFromPDF } from '@ninja-labs/verify-pdf'
import getCertificatesInfoFromPDF from '@ninja-labs/verify-pdf'
const EditableContext = React.createContext(null)
const dateFormat = 'DD/MM/YYYY'
const today = new Date()
const year_sohoa = today.getFullYear()
const month_Sohoa = (today.getMonth() + 1).toString().padStart(2, '0')
const date_Sohoa = today.getDate().toString().padStart(2, '0')

export default function ChitietDulieu(): JSX.Element {
    // let truong9318=['']

    const [validateInput, setValidateInput] = useState(false)

    const [loadingSave, setLoadingSave] = useState(false)
    const history = useHistory()
    const parsed = queryString.parse(window.location.search)

    // const maDoiTuong = window.location.search.split('=')[1]
    const maDoiTuong = parsed.maDoiTuong
    const magiayto = parsed.maGiayTo
    const [idFileKySo, setIdFileKySo] = useState<any>()
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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [loadingtable, setLoadingtable] = useState(true)
    const [isAction, setIsAction] = useState(true)
    const [isChangePage, setIsChangePage] = useState(false)
    const [disableAdd, setDisableAdd] = useState(true)
    const [isLoadingChonTep, setisLoadingChonTep] = useState(false)
    const [isLoadingSave, setisLoadingSave] = useState(false)
    const [isLoadingKySo, setisLoadingKySo] = useState(false)
    const dispatch = useDispatch()
    // user permission
    const [userPermission, setUserPermission] = useState<any>()
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

    // Delete multi
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [isLoadDelete, setIsLoadDelete] = useState(false)

    const searchScreen = getScreen('searchScreen')
    const listScreen = getScreen('listScreen')
    const inputScreen = getScreen('inputScreen')
    const detailScreen = getScreen('detailScreen')
    const [form] = Form.useForm()
    const [sohoa_current, setSohoa_current] = useState([
        ['ngaytao', '>=', `01/01/${year_sohoa}`],
        ['ngaytao', '<=', date_Sohoa + '/' + month_Sohoa + '/' + year_sohoa]
    ])

    // check valid 9318
    let validCccdcmndhc = false
    let validThongTinCaNhan = false
    let validMaDoanhNghiep = false
    let validMaDinhDanhCoQuan = false
    let validTrichYeuNoiDungGiayTo = false
    let validThoiGianHethieuLuc = false
    let validGhiChu = false
    let validTenGiayTo = false

    const deleteDulieu = (id): void => {
        showConfirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Hủy',
            maskClosable: true,
            onOk: () => {
                setIsAction(false)
                setLoadingtable(true)
                const value = { ma: maDoiTuong, id: [id] }
                return axios
                    .post(`${DYNAMIC_API_URL}/delete`, value, Authorization())
                    .then((res) => {
                        Notification({
                            status: res.data.errorCode === 0 ? 'success' : 'error',
                            message: res.data.message
                        })
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                        setTimeout(() => setLoadingtable(false), 1000)
                        // setIsAction(true)
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: 'Xóa thất bại' })
                    })
            }
        })
    }

    useEffect(() => {
        maDoiTuong &&
            axios.get(`${DYNAMIC_URL}/doituong/${maDoiTuong}`, Authorization()).then((res) => {
                setResultDetail(res.data.data)
            })
    }, [])
    // permission user kết quả
    useEffect(() => {
        axios
            .get(`${USER_PERMISSION_LOAIKETQUA}/${maDoiTuong}/${getCookie(USER_NAME)}`, Authorization())
            .then((res) => {
                setUserPermission(res.data.data)
                res.data.data?.quyenDuLieu?.isCreate === 1 ||
                res.data.data?.quyenQuanTri === true ||
                res.data.data?.quyenRoot === true
                    ? setDisableAdd(false)
                    : setDisableAdd(true)
            })
    }, [])
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            if (
                selectedRowKeys.length > 0 &&
                (userPermission?.quyenRoot === true ||
                    userPermission?.quyenQuanTri === true ||
                    userPermission?.quyenDuLieu?.isDeleteAll === 1 ||
                    (userPermission?.quyenDuLieu?.isDeleteCreatedBy === 1 && dataEdit.nguoitao === usernameLogin))
            ) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }
        }
    }
    const searchRender = searchScreen?.filter((item) => truong?.some((tr) => tr.ma === item.ma))

    const columnRender: any = []
    listScreen?.map((item) => {
        return truong?.map((tr) => {
            if (tr.ma === item.ma) columnRender.push({ title: item.moTa, key: item.ma, dataIndex: item.ma })
        })
    })
    const usernameLogin = getCookie(USER_NAME)

    columnRender?.push({
        title: 'Thao tác',
        key: 'action',
        align: 'center',
        width: '130px',
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
                                        setIdFileKySo(curr.id)
                                    }}
                                />
                            }
                        />
                    </Tooltip>

                    {(userPermission?.quyenRoot === true ||
                        userPermission?.quyenQuanTri === true ||
                        userPermission?.quyenDuLieu?.isUpdateAll === 1 ||
                        (userPermission?.quyenDuLieu?.isUpdateCreatedBy === 1 &&
                            dataEdit.nguoitao === usernameLogin)) && (
                        <Tooltip title='Sửa' color='#2db7f5' placement='top'>
                            <Button
                                type='text'
                                icon={
                                    <EditOutlined
                                        style={{ color: '#1890ff' }}
                                        onClick={() => {
                                            setDataEdit(dataEdit)
                                            setIdFileKySo(dataEdit.id)
                                        }}
                                    />
                                }
                            />
                        </Tooltip>
                    )}
                    {(userPermission?.quyenRoot === true ||
                        userPermission?.quyenQuanTri === true ||
                        userPermission?.quyenDuLieu?.isDeleteAll === 1 ||
                        (userPermission?.quyenDuLieu?.isDeleteCreatedBy === 1 &&
                            dataEdit.nguoitao === usernameLogin)) && (
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
                    )}
                </Fragment>
            )
        }
    })
    columnRender?.unshift({
        title: 'STT',
        key: 'stt',
        align: 'center',
        width: '50px',
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
        isAction && checkList && setLoadingtable(false)
        if (isChangePage) {
            setTimeout(() => {
                setLoadingtable(false)
                setIsChangePage(false)
            }, 200)
        }
    }, [checkList])

    interface Props {
        queryData: any
        limit?: number
        offset?: number
    }
    const getData = ({ queryData, limit, offset }: Props) => {
        return axios
            .post(`${DYNAMIC_API_URL}/read`, { ma: maDoiTuong, queryData, limit, offset }, Authorization())
            .then((res) => {
                setTotal(res.data.data?.total)
                setListRes(res.data.data?.items)
                if (res.data.data.item === undefined) {
                    setLoadingtable(false)
                }
            })
    }

    useEffect(() => {
        getData({
            queryData: !isArrayEmpty(dataInput) ? [...sohoa_current, ...dataInput] : [...sohoa_current],
            limit,
            offset: 0
        })
    }, [isSearch, sohoa_current])

    const gridSelect = resultDetail?.listDoiTuongKemTheo?.filter((item) => item?.loaiHienThi === 2)
    useEffect(() => {
        axios
            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${maDoiTuong}`, Authorization())
            .then((res) => {
                setTruong(res.data.data.items)
            })
            .then(() => {
                let newRes = [...resList]
                if (!isArrayEmpty(gridSelect)) {
                    gridSelect?.map((item) => {
                        axios
                            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${item.maDoituongDikem}`, Authorization())
                            .then((res) => {
                                newRes = [...newRes, { [item['maDoituongDikem']]: res.data.data.items }]
                                return setResList(newRes)
                            })
                    })
                }
            })
    }, [resultDetail])

    useEffect(() => {
        axios.post(`${DYNAMIC_URL}/list`, {}, Authorization()).then((res) => {
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
                axios.post(`${DYNAMIC_API_URL}/combobox`, Object.values(item)[0], Authorization()).then((res) => {
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
    const addDoiTuong = () => {
        setDataInput([])
        setDataFileKySo([])
        setIdFileKySo(undefined)
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
                        // onKeyDown={onKeyDown}
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
    // ký số
    const ref = useRef<any>()
    const [file, setFile] = useState<any>()
    const [fileUrl, setFileUrl] = useState<any>()
    const [fileUrlDetail, setFileUrlDetail] = useState<any>()
    const [fileValue, setFileValue] = useState<any>()
    const [visible, setVisible] = useState(false)
    const [dataFileKySo, setDataFileKySo] = useState<any>([])
    const [isVerify, setIsVerify] = useState<boolean>(false)
    // upload file
    // const onUploadFile = (e) => {
    //     let type = e.target.files[0].type
    //     if (type === 'application/pdf') {
    //         setFile(e.target.files[0])
    //     } else {
    //         Notification({ status: 'error', message: 'File Không hợp lệ, chọn file với định PDF' })
    //     }
    // }

    // const onUploadFile = (e) => {
    //     setisLoadingChonTep(true)
    //     setisLoadingSave(true)
    //     const file = e
    //     let type = e.type
    //     if (type === 'application/pdf') {
    //         const data = new FormData()
    //         data.append('file', file)
    //         axios.post(PUBLIC_FILE_VERIFY_SIGNATURE, data).then((res) => {
    //             if (res.data.errorCode === 0) {
    //                 setIsVerify(true)
    //                 setFile(file)
    //             } else {
    //                 setFile(undefined)
    //                 setIsVerify(false)
    //                 Notification({ status: 'error', message: 'File chưa được ký số, vui lòng chọn lại ' })
    //             }
    //             setisLoadingChonTep(false)
    //             setisLoadingSave(false)
    //         })
    //     } else {
    //         Notification({ status: 'error', message: 'File Không hợp lệ, chọn file với định PDF' })
    //         setisLoadingChonTep(false)
    //         setisLoadingSave(false)
    //     }
    //     return false
    // }
    const onUploadFile = (e) => {
        setisLoadingChonTep(true)
        setisLoadingSave(true)
        const file = e
        let type = e.type
        if (type === 'application/pdf') {
            let reader = new FileReader()
            reader.onloadend = function (e) {
                try {
                    const certs = getCertificatesInfoFromPDF(reader.result)
                    if (certs) {
                        setIsVerify(true)
                        setFile(file)
                        setisLoadingChonTep(false)
                        setisLoadingSave(false)
                    } else {
                        setFile(undefined)
                        setIsVerify(false)
                        Notification({ status: 'error', message: 'File chưa được ký số, vui lòng chọn lại ' })
                        setisLoadingChonTep(false)
                        setisLoadingSave(false)
                    }
                } catch (error) {
                    Notification({ status: 'error', message: 'File chưa được ký số, vui lòng chọn lại ' })
                    console.log(error)
                    setisLoadingChonTep(false)
                    setisLoadingSave(false)
                }
            }
            reader.readAsArrayBuffer(file)
        } else {
            Notification({ status: 'error', message: 'File Không hợp lệ, chọn file với định PDF' })
            setisLoadingChonTep(false)
            setisLoadingSave(false)
        }
    }

    // columns table ký số
    const columnsFileKySo: any = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (value, _, index) => index + 1
        },
        { title: 'Tên file', dataIndex: 'name', key: 'name' },
        {
            title: 'Ngày đính kèm ',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            align: 'center',
            width: 300,
            render: (value) => moment(value).format('DD/MM/YYYY')
        },
        {
            title: 'Thao tác',
            align: 'center',
            dataIndex: 'name',
            key: 'action',
            width: 300,
            render: (_, record) => {
                const removeFile = (record) => {
                    showConfirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Đồng ý',
                        okType: 'primary',
                        cancelText: 'Không',
                        maskClosable: true,
                        onOk: (): void => {
                            setDataFileKySo(dataFileKySo.filter((file) => file.id !== record.id))
                        }
                    })
                }
                return (
                    <>
                        {!isDetail && (
                            <Tooltip title='Xóa tệp tin' color='#ff4d4f' placement='top'>
                                <Button
                                    type='text'
                                    icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                                    onClick={() => (isAdd ? removeFile(record) : onDeleteFile(record.id))}
                                />
                            </Tooltip>
                        )}
                        <Tooltip title='Xem và tải tệp tin' color='#52c41a' placement='top'>
                            <Button
                                type='text'
                                icon={<FundViewOutlined style={{ color: '#2e810f' }} />}
                                onClick={() => onDisplayFile(record)}
                            />
                        </Tooltip>
                        <Tooltip title='Tải tệp tin' placement='top'>
                            <Button type='text' icon={<DownloadOutlined />} onClick={() => onDownloadFile(record)} />
                        </Tooltip>
                    </>
                )
            }
        }
    ]
    // ký số ban cơ yếu
    function uploadkysoBCY() {
        setisLoadingKySo(true)
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
            axios.get(`${GETINFO_FILE}/${id}`, Authorization()).then((res) => {
                setFileValue({
                    name: res.data.data.file.name,
                    id: id
                })
            })
            Notification({ status: 'success', message: 'Ký số thành công!' })
        } else {
            Notification({ status: 'error', message: _json.Message })
        }
        setisLoadingKySo(false)
    }
    // xử lý file
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
                    .delete(`${DELETE_FILES}?madoituong=${maDoiTuong}&doituongid=${idFileKySo}`, {
                        ...Authorization(),
                        data: [id]
                    })
                    .then(() => {
                        axios.get(`${FILES_KYSO}/${maDoiTuong}/${idFileKySo}?active=1`, Authorization()).then((res) => {
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
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((response) => {
            setIsLoading(false)
            const file = new Blob([response.data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(file)
            if (isDetail) {
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
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', record.name)
            document.body.appendChild(link)
            link.click()
        })
    }

    useEffect(() => {
        if (file) {
            if (isVerify) {
                const data = new FormData()
                data.append('file', file)
                axios
                    .post(UPLOAD_FILE_SIGN, data, Authorization())
                    .then((res) => {
                        setFileValue(res.data.data.file)
                    })
                    .catch((err) => {
                        Notification({
                            status: 'error',
                            message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !'
                        })
                    })
            } else {
                Notification({ status: 'error', message: 'File chưa được ký số, vui lòng chọn lại ' })
            }
        }
    }, [file, isVerify])
    useEffect(() => {
        fileValue && setDataFileKySo([...dataFileKySo, fileValue])
    }, [fileValue])
    useEffect(() => {
        !isAdd &&
            idFileKySo &&
            axios.get(`${FILES_KYSO}/${maDoiTuong}/${idFileKySo}?active=1`, Authorization()).then((res) => {
                setDataFileKySo(res.data.data?.map((item) => item.file))
            })
    }, [idFileKySo])

    const onFinish = (values) => {
        setIsAction(false)
        setLoadingtable(true)
        setisLoadingSave(true)
        if (isArrayEmpty(dataFileKySo)) {
            Notification({ status: 'error', message: errorSignature })
            setLoadingSave(false)
        } else {
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
            if (dataFileKySo) {
                let list = []
                dataFileKySo.reduce((prev, cur) => {
                    list.push(cur.id)
                    return (values['filekysoids'] = list)
                }, [])
            }
            // set data đối tượng kèm theo
            values.combobox = comboboxSource
            values.gridtable = dataSource
            values.ishoanthanh = 1 // check lại nếu ko đủ theo 9318

            const data = isAdd
                ? { ma: maDoiTuong, magiayto: magiayto, insertData: [values], loaitichhop: 'IMPORT_WEB' }
                : { id: dataEdit.id, ma: maDoiTuong, magiayto: magiayto, ...values }
            axios
                .post(`${DYNAMIC_API_URL}${isAdd ? '/save' : '/update'}`, data, Authorization())
                .then((res) => {
                    setLoadingtable(true)
                    setisLoadingSave(true)
                    dispatch(getDulieu({}))
                    if (res.data.errorCode === SUCCESS) {
                        if (isAdd) {
                            history.push(`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${maDoiTuong}&maGiayTo=${magiayto}`)
                            setDataFileKySo([])
                        } else {
                            setDataEdit(undefined)
                        }
                        form.resetFields()
                        setFileUrl(undefined)
                        setFileValue(undefined)
                        setFile(undefined)
                        Notification({ status: 'success', message: successMessage })
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                        setTimeout(() => setLoadingtable(false), 500)
                        setisLoadingSave(false)
                    } else {
                        Notification({ status: 'error', message: res.data?.message ?? errorMessage })
                        setisLoadingSave(false)
                    }
                })
                .catch(() => Notification({ status: 'error', message: errorMessage }))
        }

        // }
    }

    const deleteAll = (): void => {
        showConfirm({
            title: 'Bạn có chắc chắn xóa những dữ liệu này?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Không',
            maskClosable: true,
            onOk: (): void => {
                setIsLoadDelete(true)
                const value = { ma: maDoiTuong, id: selectedRowKeys }
                return (dispatch(deleteMultiData(value)) as any)
                    .then((res) => {
                        setTimeout(() => getData({ queryData, limit, offset: (offset - 1) * limit }), 1000)
                        setTimeout(() => setLoadingtable(false), 1000)
                        setDisabled(true)
                        setIsLoadDelete(false)
                        Notification({ status: 'success', message: res.data.message })
                    })
                    .catch(() => {
                        setIsLoadDelete(false)
                        Notification({ status: 'error', message: errorMessage })
                    })
            }
        })
    }

    return resultDetail ? (
        <div className='dulieu-detail'>
            <PageHeader
                title={`${resultDetail?.ten}`}
                style={{ padding: '0 0 16px 0' }}
                className={`${(isDetail || isAdd || dataEdit) && 'detail-title-dulieu'}`}
                extra={
                    <Fragment>
                        {!isAdd && !isDetail && !dataEdit && (
                            <>
                                <label>Ngày số hóa</label>
                                <DatePicker.RangePicker
                                    placeholder={['Số hóa từ ngày', 'đến ngày']}
                                    defaultValue={[
                                        moment(`01/01/${year_sohoa}`, dateFormat),
                                        moment(`${date_Sohoa}/${month_Sohoa}/${year_sohoa}`, dateFormat)
                                    ]}
                                    format={dateFormat}
                                    onChange={(_, queryData) => {
                                        let arr1 = ['ngaytao', '>=']
                                        let arr2 = ['ngaytao', '<=']
                                        if (queryData) {
                                            arr1.push(queryData[0])
                                            arr2.push(queryData[1])
                                            setSohoa_current([arr1, arr2])
                                            // setDataInput([...dataInput, arr1, arr2])
                                            // getData({ queryData: [arr1, arr2], limit: 10, offset: 0 })
                                        }
                                    }}
                                    locale={locale}
                                />
                            </>
                        )}

                        <Button
                            icon={<BackwardOutlined />}
                            onClick={(): void => {
                                isDetail ? setIsDetail(false) : dataEdit ? setDataEdit(undefined) : history.goBack()
                                // setDataFileKySo([])
                            }}>
                            Quay lại
                        </Button>
                        <Button
                            type='primary'
                            danger
                            icon={<DeleteOutlined />}
                            disabled={disabled}
                            loading={isLoadDelete}
                            onClick={deleteAll}>
                            Xóa
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
                                <Link to={`/${MenuPaths.dulieu}/themmoi?maDoiTuong=${maDoiTuong}&maGiayTo=${magiayto}`}>
                                    <Button
                                        type='primary'
                                        disabled={disableAdd}
                                        icon={<PlusOutlined />}
                                        onClick={addDoiTuong}>
                                        Thêm mới
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Fragment>
                }
            />
            {console.log('isLoadingSave', isLoadingSave)}
            {isAdd || dataEdit ? (
                isArrayEmpty(inputRender) ? (
                    <Fragment>
                        <div style={{ marginBottom: 10 }}>Vui lòng cấu hình biểu mẫu nhập liệu để định nghĩa form!</div>
                        <Link to={`/${MenuPaths.doituong}/nhap-lieu?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                Đi tới cấu hình form
                            </Button>
                        </Link>
                    </Fragment>
                ) : (
                    <div className='dulieu-header'>
                        <Form onFinish={onFinish} form={form}>
                            <Button type='primary' htmlType='submit' loading={isLoadingSave} className='btn-submit'>
                                <SaveOutlined /> Lưu
                            </Button>
                            {inputRender.map((v, i) => {
                                const renderComponent = (): JSX.Element => (
                                    <Row gutter={24}>
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
                                                            } 
                                                            ${item.ma === 'trichyeunoidunggiayto' ? 'title-input' : ''}
                                                            ${item.ma === 'thoigianhethieuluc' ? 'title-input' : ''}
                                                            ${item.ma === 'cccdcmndhc' ? 'title-input' : ''}   
                                                            ${item.ma === 'madoanhnghiep' ? 'title-input' : ''}   
                                                            ${item.ma === 'madinhdanhcoquan' ? 'title-input' : ''}`}>
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
                                                                                  const keyNameForm = truong?.find(
                                                                                      (item) => item.ma === rule.field
                                                                                  )?.ma

                                                                                  if (keyNameForm === 'cccdcmndhc') {
                                                                                      validCccdcmndhc =
                                                                                          isNullOrUndefined(value)
                                                                                              ? true
                                                                                              : false
                                                                                  }

                                                                                  if (keyNameForm === 'cccdcmndhc') {
                                                                                      if (value?.length === 9) {
                                                                                          validThongTinCaNhan = true
                                                                                      }
                                                                                      if (value?.length === 12) {
                                                                                          validThongTinCaNhan = false
                                                                                      }
                                                                                      if (value?.length < 9) {
                                                                                          validThongTinCaNhan = false
                                                                                      }
                                                                                  }

                                                                                  if (validThongTinCaNhan) {
                                                                                      if (
                                                                                          keyNameForm === 'ngaysinh' &&
                                                                                          isNullOrUndefined(value)
                                                                                      ) {
                                                                                          return Promise.reject(
                                                                                              new Error(
                                                                                                  'Vui lòng nhập dữ liệu vào trường này!'
                                                                                              )
                                                                                          )
                                                                                      }
                                                                                      if (
                                                                                          keyNameForm ===
                                                                                              'tencongdan' &&
                                                                                          isNullOrUndefined(value)
                                                                                      ) {
                                                                                          return Promise.reject(
                                                                                              new Error(
                                                                                                  'Vui lòng nhập dữ liệu vào trường này!'
                                                                                              )
                                                                                          )
                                                                                      }

                                                                                      if (
                                                                                          keyNameForm ===
                                                                                              'ngaycapcccdcmndhc' &&
                                                                                          isNullOrUndefined(value)
                                                                                      ) {
                                                                                          return Promise.reject(
                                                                                              new Error(
                                                                                                  'Vui lòng nhập dữ liệu vào trường này!'
                                                                                              )
                                                                                          )
                                                                                      }
                                                                                      if (
                                                                                          keyNameForm ===
                                                                                              'noicapcccdcmndhc' &&
                                                                                          isNullOrUndefined(value)
                                                                                      ) {
                                                                                          return Promise.reject(
                                                                                              new Error(
                                                                                                  'Vui lòng nhập dữ liệu vào trường này!'
                                                                                              )
                                                                                          )
                                                                                      }
                                                                                      if (keyNameForm === 'ngaysinh') {
                                                                                          validGhiChu =
                                                                                              isNullOrUndefined(value)
                                                                                                  ? true
                                                                                                  : false
                                                                                      }

                                                                                      if (
                                                                                          keyNameForm === 'tencongdan'
                                                                                      ) {
                                                                                          validGhiChu =
                                                                                              isNullOrUndefined(value)
                                                                                                  ? true
                                                                                                  : false
                                                                                      }

                                                                                      if (
                                                                                          keyNameForm ===
                                                                                          'ngaycapcccdcmndhc'
                                                                                      ) {
                                                                                          validGhiChu =
                                                                                              isNullOrUndefined(value)
                                                                                                  ? true
                                                                                                  : false
                                                                                      }

                                                                                      if (
                                                                                          keyNameForm ===
                                                                                          'noicapcccdcmndhc'
                                                                                      ) {
                                                                                          validGhiChu =
                                                                                              isNullOrUndefined(value)
                                                                                                  ? true
                                                                                                  : false
                                                                                      }
                                                                                  }

                                                                                  if (
                                                                                      keyNameForm ===
                                                                                      'trichyeunoidunggiayto'
                                                                                  ) {
                                                                                      validTrichYeuNoiDungGiayTo =
                                                                                          isNullOrUndefined(value)
                                                                                              ? true
                                                                                              : false
                                                                                  }

                                                                                  if (
                                                                                      keyNameForm ===
                                                                                      'thoigianhethieuluc'
                                                                                  ) {
                                                                                      validThoiGianHethieuLuc =
                                                                                          isNullOrUndefined(value)
                                                                                              ? true
                                                                                              : false
                                                                                  }

                                                                                  if (keyNameForm === 'madoanhnghiep') {
                                                                                      validMaDoanhNghiep =
                                                                                          isNullOrUndefined(value)
                                                                                              ? true
                                                                                              : false
                                                                                  }
                                                                                  if (
                                                                                      keyNameForm === 'madinhdanhcoquan'
                                                                                  ) {
                                                                                      validMaDinhDanhCoQuan =
                                                                                          isNullOrUndefined(value)
                                                                                              ? true
                                                                                              : false
                                                                                  }

                                                                                  if (
                                                                                      keyNameForm ===
                                                                                          'lydokhongnhapdulieu' &&
                                                                                      isNullOrUndefined(value)
                                                                                  ) {
                                                                                      if (
                                                                                          validCccdcmndhc ||
                                                                                          validGhiChu ||
                                                                                          validTrichYeuNoiDungGiayTo ||
                                                                                          validThoiGianHethieuLuc ||
                                                                                          validMaDoanhNghiep ||
                                                                                          validMaDinhDanhCoQuan ||
                                                                                          validTenGiayTo
                                                                                      ) {
                                                                                          return Promise.reject(
                                                                                              new Error(
                                                                                                  'Vui lòng nêu lý do không nhập đầy đủ thông tin theo Công văn 9318!'
                                                                                              )
                                                                                          )
                                                                                      }
                                                                                  }

                                                                                  //    thanhcheck endđ

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
                                                                                                      `${item.moTa} phải lớn nhất là ${validate['max']}!`
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
                                                        <div className='title-preview  '>{item.moTa}</div>
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
                                            // with: '100px',
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
                                            <div className={`title-preview `}>
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
                                                className='table_preview_data table_fieldset_dulieu'
                                                scroll={{
                                                    y: window.innerHeight - 333
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

                        <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_kyso' spinning={isLoading}>
                            <div style={{ marginTop: 15 }}>
                                <div style={{ marginBottom: 20 }}>
                                    {!isArrayEmpty(dataFileKySo) && (
                                        <>
                                            <span style={{ fontWeight: 600 }}>Danh sách tệp ký số </span>
                                            <Table
                                                size='small'
                                                rowKey='id'
                                                columns={columnsFileKySo}
                                                dataSource={dataFileKySo}
                                                pagination={false}
                                                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                                bordered
                                                scroll={{
                                                    y: window.innerHeight - 333
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
                                                <Button
                                                    danger
                                                    type='primary'
                                                    onClick={() => setVisible(false)}
                                                    style={{ margin: '10px 10px 10px 0px' }}>
                                                    Đóng tệp
                                                </Button>
                                            ]}
                                            centered>
                                            <iframe
                                                src={fileUrl}
                                                style={{ width: '100%', height: '75vh' }}
                                                title='view-pdf'
                                                ref={ref}
                                            />
                                        </Modal>
                                    )}
                                </div>
                                <div>
                                    {/* <label className='file-upload'> 
                                     <input
                                            type='file'
                                            id='myFile'
                                            name='filename'
                                            onChange={(e) => onUploadFile(e)}
                                            // onClick={onResetFile}
                                        />
                                        Chọn tệp */}
                                    <Upload showUploadList={false} beforeUpload={(e) => onUploadFile(e)}>
                                        <Button
                                            loading={isLoadingChonTep}
                                            size='small'
                                            style={{ background: '#58b52b', color: '#fff', marginRight: '5px' }}>
                                            Chọn tệp
                                        </Button>
                                    </Upload>
                                    {/* </label> */}

                                    <Button
                                        loading={isLoadingKySo}
                                        onClick={uploadkysoBCY}
                                        size='small'
                                        style={{ background: 'orange', color: '#fff' }}>
                                        Ký số Ban Cơ yếu
                                    </Button>
                                </div>
                            </div>
                        </Spin>
                    </div>
                )
            ) : isDetail ? (
                isArrayEmpty(detailRender) ? (
                    <>
                        <div style={{ marginBottom: 10 }}>Vui lòng cấu hình biểu mẫu chi tiết để định nghĩa form!</div>
                        <Link to={`/${MenuPaths.doituong}/chi-tiet?maDoiTuong=${maDoiTuong}`}>
                            <Button type='primary' icon={<ForwardOutlined />}>
                                Đi tới cấu hình form
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_kyso' spinning={isLoading}>
                            <div style={{ marginTop: 15 }}>
                                <div style={{ marginTop: 20 }}>
                                    {!isArrayEmpty(dataFileKySo) && (
                                        <>
                                            <span style={{ fontWeight: 600 }}>Danh sách tệp ký số </span>
                                            <Table
                                                rowKey='id'
                                                size='small'
                                                columns={columnsFileKySo}
                                                dataSource={dataFileKySo}
                                                pagination={false}
                                                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                                bordered
                                                scroll={{
                                                    y: window.innerHeight - 333
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
                                                <Button
                                                    danger
                                                    type='primary'
                                                    onClick={() => {
                                                        setVisible(false)
                                                    }}>
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
                            </div>
                        </Spin>
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
                                                    <div className='title-preview  ' style={{ color: '#1890ff' }}>
                                                        {item.moTa}
                                                    </div>
                                                    {/* check STATUS có or không */}
                                                    <div style={{ marginTop: 3 }}>
                                                        {item.boSung
                                                            ? item.boSung.find(
                                                                  (bs) => parseInt(bs.key) === parseInt(item.noiDung)
                                                              )?.value
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
                                                    <div className='title-preview  ' style={{ color: '#1890ff' }}>
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
                    </>
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
                                            <div className='title-preview '>{item.moTa}</div>
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

                    {listScreen.length > 0 ? (
                        <Table
                            size='small'
                            rowKey='id'
                            rowSelection={{ ...rowSelection }}
                            columns={columnRender}
                            dataSource={checkList?.filter((i) => Object.keys(i).length > 0)}
                            pagination={false}
                            bordered
                            loading={!isChangePage ? loadingtable : isChangePage}
                            locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                            scroll={{
                                y: window.innerHeight - 250
                            }}
                        />
                    ) : (
                        <>
                            <div style={{ marginBottom: 10, color: 'red' }}>
                                Vui lòng cấu hình biểu mẫu danh sách để hiển thị danh sách dữ liệu!
                            </div>
                        </>
                    )}

                    {!isArrayEmpty(checkList?.filter((i) => Object.keys(i).length > 0)) && (
                        <ConfigProvider locale={viVN}>
                            <Pagination
                                total={total}
                                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dữ liệu`}
                                style={{ textAlign: 'end', paddingTop: '20px' }}
                                onChange={(offset, limit) => {
                                    setOffset(offset)
                                    setLimit(limit as number)
                                    getData({
                                        queryData: !isArrayEmpty(dataInput)
                                            ? [...sohoa_current, ...dataInput]
                                            : [...sohoa_current],
                                        limit,
                                        offset: (offset - 1) * limit!
                                    })
                                    setIsChangePage(true)
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
