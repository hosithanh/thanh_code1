/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Empty, Form, Input, InputNumber, List, Row, Select, Spin, Table } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import axios from 'axios'
import 'moment/locale/vi'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Notification } from '../../../common/component/notification'
import { DYNAMIC_API_URL, DYNAMIC_URL } from '../../../common/constant/api-constant'
import { errorMessage, successMessage } from '../../../common/constant/app-constant'
import { Doituong } from '../../../common/interface/Doituong'
import { TruongDuLieu } from '../../../common/interface/TruongDuLieu'
import { Authorization } from '../../../common/utils/cookie-util'
import { isArrayEmpty, isStringEmpty } from '../../../common/utils/empty-util'

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone: any = Array.from(destination)
    const [removed]: any = sourceClone.splice(droppableSource.index, 1)
    if (destClone?.some((i) => i?.type === 'grid' && i?.maDoiTuong === removed?.maDoiTuong)) {
        removed.group = destClone?.find((d) => d?.type === 'grid' && d?.maDoiTuong === removed?.maDoiTuong)?.group
    }
    destClone.splice(droppableDestination.index, 0, removed)
    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone
    return result
}

export const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle
})

export const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'white'
})

interface Props {
    resultList?: Doituong[]
    resultDetail?: Doituong
    setResultDetail: (item: Doituong) => void
    setisFetchTruong: boolean
}
export default function BieumauNhaplieu({
    resultDetail,
    resultList,
    setResultDetail,
    setisFetchTruong
}: Props): JSX.Element {
    // const history = useHistory()
    const [listTruongChinh, setListTruongChinh] = useState<TruongDuLieu[] | undefined>() // list trường dư liệu đối tượng chính
    const inputScreen = JSON.parse(JSON.stringify(resultDetail?.inputScreen ?? ''))
    const screenStr = JSON.parse(isStringEmpty(inputScreen) ? JSON.stringify(inputScreen) : inputScreen)
    const screenObj = screenStr?.screen
    const screenArr = JSON.parse(JSON.stringify(screenObj ?? ''))
    const screenParse = Array.isArray(screenArr)
        ? screenArr
        : JSON.parse(isStringEmpty(inputScreen) ? JSON.stringify(screenArr) : screenArr)
    const screenList = isStringEmpty(screenParse) ? [] : screenParse
    const htmlRef = useRef<HTMLDivElement>(null)
    const inputStructure = screenList?.reduce((prev: any, curr) => {
        listTruongChinh?.some((item) => {
            if (curr.ma === item.ma) {
                curr.moTa = item.moTa
                curr.kieuDuLieu = item.kieuDuLieu
                return prev.push(curr)
            } else return null
        })
        return prev
    }, [])
    const itemList = listTruongChinh?.map((item, index) => {
        return {
            index: `item-${item.maDoiTuong}-${index}`,
            ma: item.ma,
            moTa: item.moTa,
            group: '',
            width: '',
            nowrap: '',
            batBuoc: item.batBuoc,
            kieuDuLieu: item.kieuDuLieu,
            maDoiTuong: item.maDoiTuong,
            type: 'main'
        }
    })
    let seletedList = inputStructure?.map((item, index) => {
        item.index = `selected-${item.maDoiTuong}-${index}`
        return item
    })

    if (isArrayEmpty(seletedList)) {
        seletedList = screenList
    }

    const fieldRender =
        itemList?.filter((item) => !seletedList?.some((i) => i.ma === item.ma && i.maDoiTuong === item.maDoiTuong)) ??
        []
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [items, setItems] = useState<any>(fieldRender) // trường dữ liệu
    const [selected, setSelected] = useState<any>(seletedList) // bố trí vị trí
    const [resListKemTheo, setResListKemTheo] = useState<any>([])
    const [isFetch, setIsFetch] = useState<boolean>(false)
    const [doiTuongCombobox, setDoiTuongCombobox] = useState<any>([])
    const [dataCombobox, setDataCombobox] = useState<any>([])
    const id2List = { droppable: 'items', droppable2: 'selected' }
    const maDoiTuong = window.location.search.split('=')[1]
    const gridSelect = resultDetail?.listDoiTuongKemTheo?.filter((item) => item?.loaiHienThi === 2)
    useEffect(() => {
        if (isFetch) {
            let newSelected = [...selected]
            screenList
                ?.filter((item) => item.type === 'combobox')
                ?.map((item) => {
                    if (
                        resultDetail?.listDoiTuongKemTheo?.some(
                            (i) => i.maDoituongDikem === item.maDoiTuong && i.loaiHienThi === 1
                        )
                    ) {
                        item.moTa = resultDetail?.listDoiTuongKemTheo?.find(
                            (i) => i.maDoituongDikem === item.maDoiTuong
                        )?.tenDoituongDikem
                        newSelected = [...newSelected, item]
                        setSelected(newSelected)
                    }
                })
            const combobox = resultDetail?.listDoiTuongKemTheo?.reduce((prev, curr) => {
                if (
                    curr?.loaiHienThi === 1 &&
                    !screenList?.some((s) => s.type === 'combobox' && s.maDoiTuong === curr?.maDoituongDikem)
                )
                    prev = [...prev, { ma: curr.maDoituongDikem, moTa: curr.tenDoituongDikem }]
                return prev
            }, [])
            const comboboxList = combobox?.map((item, index) => {
                return {
                    index: `item-combobox-${item.ma}-${index}`,
                    moTa: item.moTa,
                    group: '',
                    width: '',
                    maDoiTuong: item.ma,
                    type: 'combobox'
                }
            })
            setItems([...items, ...(comboboxList ?? [])])
        }
    }, [isFetch, setisFetchTruong])

    useEffect(() => {
        // xử lý thêm trường dữ liệu remove element duplicate - dungnv
        let tempItems = items

        fieldRender?.map((item) => {
            if (!items?.some((items) => items.ma === item.ma && items.maDoiTuong === item.maDoiTuong)) {
                tempItems = [...tempItems, item]
            }
        }) 
        setItems(tempItems)
        let tempSelected = selected
        seletedList?.map((item) => {
            if (
                !selected?.some(
                    (itemSelected) => itemSelected.ma === item.ma && itemSelected.maDoiTuong === item.maDoiTuong
                )
            ) {
                tempSelected = [...tempSelected, item]
            }
        })
        setSelected(tempSelected)
    }, [listTruongChinh])

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
    }, [])
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

    const getList = (id) => {
        if (id2List[id] === 'items') return items
        else if (id2List[id] === 'selected') return selected
    }
    // Drag and Drop
    const onDragEnd = (result) => {
        const { source, destination } = result
        if (!destination) {
            return
        }
        if (source.droppableId === destination.droppableId) {
            const dataOrder: any = reorder(getList(source.droppableId), source.index, destination.index)

            if (source.droppableId === 'droppable') setItems(dataOrder)
            if (source.droppableId === 'droppable2') setSelected(dataOrder)
        } else {
            const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination)
            setItems(result['droppable'])
            setSelected(result['droppable2'])
        }
    }

    const itemsConvert = (dataItems, dataIndex, dataKey) => {
        dataItems.map((item, index) => {
            item.index = dataKey + '-' + item.maDoiTuong + '-' + (dataIndex + index)
        })
        return dataItems
    }
    // reset dữ liệu
    const TruongDuLieu = () => {
        if (isArrayEmpty(selected)) {
            Notification({ status: 'warning', message: 'Không có trường dữ liệu đã được bố trí' })
        } else {
            setItems([...items, ...itemsConvert(selected, items.length, 'item')])
            setSelected([])
        }
    }

    const BoTriDuLieu = () => {
        if (isArrayEmpty(items)) {
            Notification({ status: 'warning', message: 'Không có trường dữ liệu' })
        } else {
            setSelected([...selected, ...itemsConvert(items, selected.length, 'selected')])
            setItems([])
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
                    <Select style={{ width: '100%' }}>
                        {options?.map((item) => {
                            return <Select.Option value={item.key}>{item.value}</Select.Option>
                        })}
                    </Select>
                ) : (
                    <InputNumber
                        min={-2147483648}
                        max={2147483647}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        style={{ width: '100%' }}
                    />
                )
            case 'LONG':
                return (
                    <InputNumber
                        min={-9223372036854775808}
                        max={9223372036854775807}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        style={{ width: '100%' }}
                    />
                )
            case 'FLOAT':
                return <InputNumber style={{ width: '100%' }} />
            case 'STATUS':
                return (
                    <Select style={{ width: '100%' }}>
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
                        locale={locale}
                    />
                ) : (
                    <DatePicker placeholder='Chọn ngày' style={{ width: '100%' }} format='DD/MM/YYYY' locale={locale} />
                )
            default:
                return isTextArea === 1 ? <Input.TextArea name={ma} rows={5} /> : <Input name={ma} />
        }
    }

    const onFinish = (values) => {
        // if (items.some((item) => item?.batBuoc === 1)) {
        // Notification({ status: 'warning', message: 'Những trường bắt buộc nhập vui lòng chọn để nhập liệu!' })
        // } else {
        setIsLoading(true)
        values.ma = resultDetail?.ma
        values.inputScreen = { screen: selected, screenCache: htmlRef.current?.innerHTML, script: values.script }
        values.detailScreen = { screen: selected, screenCache: htmlRef.current?.innerHTML, script: values.script }
        delete values.script
        axios
            .post(`${DYNAMIC_URL}/save/drawscreen`, values, Authorization())
            .then((res) => {
                setIsLoading(false)
                setResultDetail(res.data.data)
                Notification({ status: 'success', message: successMessage })
            })
            .catch(() => {
                setIsLoading(false)
                Notification({ status: 'error', message: errorMessage })
            })
        // }
    }

    let selectedRender: any = []
    selected?.map((item) => {
        if (selectedRender?.some((i) => Object.keys(i)[0] === item?.group)) {
            const index = selectedRender?.findIndex((s) => Object.keys(s)[0] === item?.group)
            if (Object.keys(selectedRender[index][item?.group]).some((s) => s === item.maDoiTuong)) {
                selectedRender[index][item?.group][item['maDoiTuong']]?.push(item)
            } else {
                selectedRender[index][item?.group][item['maDoiTuong']] = [item]
            }
        } else {
            selectedRender.push({ [item['group']]: { [item['maDoiTuong']]: [item] } })
        }
    })

    const getItemListKemTheo = (listFieldKemTheo) => {
        const inputStructure = screenList?.reduce((prev: any, curr) => {
            listFieldKemTheo?.some((item) => {
                if (curr.ma === item.ma) {
                    curr.moTa = item.moTa
                    curr.kieuDuLieu = item.kieuDuLieu
                    return prev.push(curr)
                } else return null
            })
            return prev
        }, [])
        let itemListFinal: any = []
        listFieldKemTheo?.map((item, index) => {
            let checkExistItems = items?.some((i) => i?.ma === item.ma && i?.maDoiTuong === item.maDoiTuong)
            let checkExistSelected = selected?.some((i) => i?.ma === item.ma && i?.maDoiTuong === item.maDoiTuong)
            if (!checkExistItems && !checkExistSelected) {
                let object = {
                    index: `item-${item.maDoiTuong}-${index}`,
                    ma: item.ma,
                    moTa: item.moTa,
                    group: '',
                    width: '',
                    nowrap: '',
                    batBuoc: item.batBuoc,
                    kieuDuLieu: item.kieuDuLieu,
                    maDoiTuong: item.maDoiTuong,
                    type: 'grid'
                }
                itemListFinal = [...itemListFinal, object]
            }
        })
        let selectedListFinal: any = []
        inputStructure?.map((item, index) => {
            let checkExistSelected = selected?.some((i) => i?.ma === item.ma && i?.maDoiTuong === item.maDoiTuong)
            let checkExistItems = items?.some((i) => i?.ma === item.ma && i?.maDoiTuong === item.maDoiTuong)
            if (!checkExistSelected && !checkExistItems) {
                item.index = `selected-${item.maDoiTuong}-${index}`
                selectedListFinal = [...selectedListFinal, item]
            }
        })
        // const fieldRender = itemList?.filter((item) => !selectedListFinal?.some((i) => i?.ma === item.ma && i?.maDoiTuong === item.maDoiTuong)) ?? []
        return { selectedListFinal, itemListFinal }
    }

    useEffect(() => {
        axios
            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${maDoiTuong}`, Authorization())
            .then((res) => {
                setItems([])
                setSelected([])
                setListTruongChinh(res.data.data.items)
                setIsFetch(true)
            })
            .then(() => {
                let newRes = [...resListKemTheo]
                if (!isArrayEmpty(gridSelect)) {
                    gridSelect?.map((item) => {
                        axios
                            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${item.maDoituongDikem}`, Authorization())
                            .then((res) => {
                                newRes = [...newRes, { [item['maDoituongDikem']]: res.data.data.items }]
                                return setResListKemTheo(newRes)
                            })
                    })
                }
            })
    }, [setisFetchTruong])

    useEffect(() => {
        if (!isArrayEmpty(resListKemTheo)) {
            resListKemTheo.map((item) => {
                let itemListFinal = getItemListKemTheo(Object.values(item)[0]).itemListFinal
                let selectedListFinal = getItemListKemTheo(Object.values(item)[0]).selectedListFinal
                setSelected([...selected, ...selectedListFinal])
                setItems([...items, ...itemListFinal])
            })
        }
    }, [resListKemTheo])
    let inputRender: any = []
    let inputRenderBoSung: any = []
    let inputRenderStatus: any = []
    selected?.map((item) => {
        if (item?.type === 'main') {
            return listTruongChinh?.map((t) => {
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

    return (
        <>
            <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_bieumaunhaplieu' spinning={isLoading}>
                <Form className='custom-form form-input' onFinish={onFinish}>
                    <div className='group-btn-detail'>
                        {/* <Button icon={<BackwardOutlined />} onClick={(): void => history.goBack()}>
                            Quay lại
                        </Button> */}
                        <Button type='primary' htmlType='submit' className='btn-submit'>
                            <SaveOutlined /> Lưu
                        </Button>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Row gutter={16}>
                            <Col span={8} className='col-left'>
                                <Droppable droppableId='droppable'>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                            <List
                                                header={
                                                    <div
                                                        style={{
                                                            fontWeight: 500,
                                                            display: 'flex',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <span>TRƯỜNG DỮ LIỆU</span>
                                                        <Button
                                                            size='small'
                                                            type='primary'
                                                            onClick={BoTriDuLieu}
                                                            style={{ background: '#48ae16', border: 'none' }}>
                                                            Bố trí vị trí
                                                            <DoubleRightOutlined />
                                                        </Button>
                                                    </div>
                                                }
                                                bordered
                                                dataSource={items}
                                                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                                renderItem={(item: any, index) => (
                                                    <Draggable key={item.index} draggableId={item.index} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}>
                                                                <List.Item className={`item-list draggble`} key={index}>
                                                                    <div
                                                                        className={`des-item des-item-input ${
                                                                            item?.batBuoc === 1 ? 'require-icon' : ''
                                                                        }`}>
                                                                        {item.type === 'main' ? 'LKQ_' : 'KT_'}
                                                                        {item.moTa}
                                                                    </div>
                                                                </List.Item>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )}
                                            />
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                            <Col span={16}>
                                <Droppable droppableId='droppable2'>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                            <List
                                                header={
                                                    <div
                                                        style={{
                                                            fontWeight: 500,
                                                            display: 'flex',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                        <span>BỐ TRÍ VỊ TRÍ</span>
                                                        <Button
                                                            size='small'
                                                            type='primary'
                                                            icon={<DoubleLeftOutlined />}
                                                            onClick={TruongDuLieu}
                                                            style={{ background: '#48ae16', border: 'none' }}>
                                                            Trường dữ liệu
                                                        </Button>
                                                    </div>
                                                }
                                                bordered
                                                dataSource={selected}
                                                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                                                renderItem={(item: any, index) => (
                                                    <Draggable key={item.index} draggableId={item.index} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}>
                                                                <List.Item className='item-list' key={index}>
                                                                    <div
                                                                        className={`des-item des-item-input ${
                                                                            item?.batBuoc === 1 ? 'require-icon' : ''
                                                                        }`}>
                                                                        {item.type === 'main' ? 'LKQ_' : 'KT_'}
                                                                        {item.moTa}
                                                                    </div>
                                                                    <div className='option-list'>
                                                                        <div
                                                                            className='width-item'
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center'
                                                                            }}>
                                                                            <span>Rộng</span>
                                                                            <InputNumber
                                                                                min={1}
                                                                                max={100}
                                                                                style={{ width: 70 }}
                                                                                defaultValue={
                                                                                    isStringEmpty(item.width) &&
                                                                                    item?.type !== 'grid'
                                                                                        ? '25'
                                                                                        : item.width
                                                                                }
                                                                                onChange={(e) => {
                                                                                    const width = [...selected]
                                                                                    width[index].width =
                                                                                        e?.toString() ?? ''
                                                                                    setSelected(width)
                                                                                }}
                                                                            />
                                                                            <span>%</span>
                                                                        </div>
                                                                        <div
                                                                            className='down-line'
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center'
                                                                            }}>
                                                                            <span
                                                                                style={{
                                                                                    whiteSpace: 'nowrap',
                                                                                    marginRight: 5
                                                                                }}>
                                                                                Nhóm
                                                                            </span>
                                                                            <Input
                                                                                value={item?.group}
                                                                                onChange={(e) => {
                                                                                    const value = [...selected]
                                                                                    if (item?.type === 'grid') {
                                                                                        let indexArr: number[] = []
                                                                                        value?.map((a, b) => {
                                                                                            if (
                                                                                                a?.type === 'grid' &&
                                                                                                a?.maDoiTuong ===
                                                                                                    item.maDoiTuong
                                                                                            ) {
                                                                                                indexArr = [
                                                                                                    ...indexArr,
                                                                                                    b
                                                                                                ]
                                                                                            }
                                                                                        })
                                                                                        indexArr.map((c) => {
                                                                                            value[c].group =
                                                                                                e.target.value
                                                                                        })
                                                                                    } else {
                                                                                        value[index].group =
                                                                                            e.target.value
                                                                                    }
                                                                                    setSelected(value)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </List.Item>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )}
                                            />
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                        </Row>
                    </DragDropContext>
                    {/* xem trước  */}
                    <div className='preview-content'>
                        <div className='preview'>XEM TRƯỚC</div>
                        <div ref={htmlRef}>
                            {inputRender?.map((v, i) => {
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
                                                        <Form.Item key={index} name={item.ma}>
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
                                                            <Select style={{ width: '100%' }}>
                                                                {dataCombobox?.find(
                                                                    (d) => Object.keys(d)[0] === item?.maDoiTuong
                                                                ) &&
                                                                    dataCombobox
                                                                        ?.find(
                                                                            (d) =>
                                                                                Object.keys(d)[0] === item?.maDoiTuong
                                                                        )
                                                                        [item?.maDoiTuong]?.map((a, b) => (
                                                                            <Select.Option key={b} value={a.key}>
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
                                    const renderField = (kieuDuLieu) => {
                                        switch (kieuDuLieu) {
                                            case 'INT':
                                                return (
                                                    <InputNumber
                                                        min={-2147483648}
                                                        max={2147483647}
                                                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                                                        style={{ width: '100%' }}
                                                    />
                                                )
                                            case 'LONG':
                                                return (
                                                    <InputNumber
                                                        min={-9223372036854775808}
                                                        max={9223372036854775807}
                                                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                                                        style={{ width: '100%' }}
                                                    />
                                                )
                                            case 'FLOAT':
                                                return <InputNumber style={{ width: '100%' }} />
                                            case 'STATUS':
                                                return (
                                                    <Select style={{ width: '100%' }}>
                                                        <Select.Option value={1}>Có</Select.Option>
                                                        <Select.Option value={0}>Không</Select.Option>
                                                    </Select>
                                                )
                                            case 'DATETIME':
                                                return (
                                                    <DatePicker
                                                        placeholder='Chọn ngày'
                                                        style={{ width: '100%' }}
                                                        format='DD/MM/YYYY'
                                                    />
                                                )
                                            default:
                                                return <Input />
                                        }
                                    }
                                    const setColumns = (field: string) => {
                                        const fieldItem = (Object.values(v)[0] as any)?.grid?.find(
                                            (t) => Object.keys(t)[0] === field
                                        )[field]
                                        return fieldItem?.map((m) => {
                                            return {
                                                title: m.moTa,
                                                key: m.ma,
                                                dataIndex: m.ma,
                                                width: isStringEmpty(m.width) ? 'unset' : `${m.width}%`,
                                                render: () => renderField(m.kieuDuLieu)
                                            }
                                        })
                                    }
                                    return (
                                        <Fragment key={n}>
                                            <div className={`title-preview`}>
                                                {resultList?.find((a) => a.ma === m)?.ten}
                                            </div>
                                            <Table
                                                style={{ marginTop: 10 }}
                                                bordered
                                                columns={setColumns(m) as any}
                                                dataSource={[{}]}
                                                pagination={false}
                                            />
                                            <div style={{ textAlign: 'right' }}>
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    type='primary'
                                                    style={{ marginTop: 10 }}>
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
                        </div>
                    </div>
                    <Form.Item name='script' label='Kịch bản bổ sung'>
                        <Input.TextArea
                            rows={10}
                            defaultValue={screenStr?.script}
                            style={{ marginLeft: '0px', width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
}
// isStringEmpty(item.width) && item?.type !== 'grid' ? '25' : item.width
