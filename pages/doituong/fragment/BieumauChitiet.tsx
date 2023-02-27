/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { DoubleLeftOutlined, DoubleRightOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Form, Input, InputNumber, List, Row, Spin, Table } from 'antd'
import axios from 'axios'
import { Fragment, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Notification } from '../../../common/component/notification'
import { DYNAMIC_URL } from '../../../common/constant/api-constant'
import { errorMessage, successMessage } from '../../../common/constant/app-constant'
import { Doituong } from '../../../common/interface/Doituong'
import { TruongDuLieu } from '../../../common/interface/TruongDuLieu'
import { Authorization } from '../../../common/utils/cookie-util'
import { isArrayEmpty, isStringEmpty } from '../../../common/utils/empty-util'
import { getItemStyle, getListStyle, move, reorder } from './BieumauNhaplieu'

interface Props {
    resultList?: Doituong[]
    resultDetail?: Doituong
    setResultDetail: (item: Doituong) => void
    setisFetchTruong: boolean
}

export default function BieumauChitiet({
    resultDetail,
    resultList,
    setResultDetail,
    setisFetchTruong
}: Props): JSX.Element {
    // const history = useHistory()
    const [listTruongChinh, setListTruongChinh] = useState<TruongDuLieu[] | undefined>() // list trường dư liệu đối tượng chính
    const detailScreen = JSON.parse(JSON.stringify(resultDetail?.detailScreen ?? ''))
    const screenStr = JSON.parse(isStringEmpty(detailScreen) ? JSON.stringify(detailScreen) : detailScreen)
    const screenObj = screenStr?.screen
    const screenArr = JSON.parse(JSON.stringify(screenObj ?? ''))
    const screenParse = Array.isArray(screenArr)
        ? screenArr
        : JSON.parse(isStringEmpty(detailScreen) ? JSON.stringify(screenArr) : screenArr)
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
    const [items, setItems] = useState<any>(fieldRender)
    const [selected, setSelected] = useState<any>(seletedList)
    const [resListKemTheo, setResListKemTheo] = useState<any>([])
    const [isFetch, setIsFetch] = useState<boolean>(false)
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

    const getList = (id) => {
        if (id2List[id] === 'items') return items
        else if (id2List[id] === 'selected') return selected
    }

    const onDragEnd = (result) => {
        const { source, destination } = result
        if (!destination) {
            return
        }
        if (source.droppableId === destination.droppableId) {
            const items: any = reorder(getList(source.droppableId), source.index, destination.index)
            if (source.droppableId === 'droppable') setItems(items)
            if (source.droppableId === 'droppable2') setSelected(items)
        } else {
            const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination)
            setItems(result['droppable'])
            setSelected(result['droppable2'])
        }
    }

    const onFinish = (values: Doituong) => {
        setIsLoading(true)
        values.ma = resultDetail?.ma
        values.detailScreen = { screen: selected, screenCache: htmlRef.current?.innerHTML }
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
                if (curr.ma === item.ma && curr.maDoiTuong === item.maDoiTuong) {
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

    let detailRender: any = []
    selected?.map((item) => {
        if (item?.type === 'main') {
            return listTruongChinh?.map((t) => {
                if (item.ma === t.ma) {
                    item.doDai = t?.doDai
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
    const itemsConvert = (dataItems, dataIndex, dataKey) => {
        dataItems.map((item, index) => {
            item.index = dataKey + '-' + item.maDoiTuong + '-' + (dataIndex + index)
        })
        return dataItems
    }
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

    return (
        <Spin size='large' tip='Đang xử lý dữ liệu' spinning={isLoading}>
            <Form className='custom-form' onFinish={onFinish}>
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
                                                                    className={`des-item des-item-input ${item?.batBuoc === 1 ? 'require-icon' : ''
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
                                                                    className={`des-item des-item-input ${item?.batBuoc === 1 ? 'require-icon' : ''
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
                                                                                width[index].width = e?.toString() ?? ''
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
                                                                                            indexArr = [...indexArr, b]
                                                                                        }
                                                                                    })
                                                                                    indexArr.map((c) => {
                                                                                        value[c].group = e.target.value
                                                                                    })
                                                                                } else {
                                                                                    value[index].group = e.target.value
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
                <div className='preview-content'>
                    <div className='preview'>XEM TRƯỚC</div>
                    <div ref={htmlRef}>
                        {detailRender?.map((v, i) => {
                            const renderComponent = (): JSX.Element => (
                                <Row gutter={16}>
                                    {(Object.values(v)[0] as any)?.input?.map((item, index) => {
                                        return (
                                            <Col
                                                style={{
                                                    width: isStringEmpty(item.width) ? '25%' : `${item.width}%`
                                                }}
                                                key={index}>
                                                <div className='title-preview' style={{ color: '#1890ff' }}>
                                                    {item.moTa}
                                                </div>
                                                <div>{item.moTa}</div>
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
                                    return fieldItem?.map((m) => {
                                        return {
                                            title: m.moTa,
                                            key: m.ma,
                                            dataIndex: m.ma,
                                            ellipsis: false,
                                            width: isStringEmpty(m.width) ? 'unset' : `${m.width}%`
                                        }
                                    })
                                }
                                return (
                                    <Fragment key={n}>
                                        <div className={`title-preview`} style={{ color: '#1890ff' }}>
                                            {resultList?.find((a) => a.ma === m)?.ten}
                                        </div>
                                        <Table
                                            style={{ marginTop: 10 }}
                                            bordered
                                            columns={setColumns(m) as any}
                                            pagination={false}
                                            className='table-list-result'
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
                    </div>
                </div>
            </Form>
        </Spin>
    )
}
