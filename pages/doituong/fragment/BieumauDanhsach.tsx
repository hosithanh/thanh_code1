/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { DoubleLeftOutlined, DoubleRightOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Form, Input, InputNumber, List, Row, Spin, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Notification } from '../../../common/component/notification'
import { DYNAMIC_URL } from '../../../common/constant/api-constant'
import { errorMessage, successMessage } from '../../../common/constant/app-constant'
import { Doituong } from '../../../common/interface/Doituong'
import { TruongDuLieu } from '../../../common/interface/TruongDuLieu'
import { Authorization } from '../../../common/utils/cookie-util'
import { isArrayEmpty, isObjectEmpty, isStringEmpty } from '../../../common/utils/empty-util'
import { getItemStyle, getListStyle, move, reorder } from './BieumauNhaplieu'

interface Props {
    resultDetail?: Doituong
    setResultDetail: (item: Doituong) => void
    setisFetchTruong: boolean
}

export default function BieumauDanhsach({ resultDetail, setResultDetail, setisFetchTruong }: Props): JSX.Element {
    // const history = useHistory()
    const [fieldList, setFieldList] = useState<TruongDuLieu[] | undefined>()
    const listScreen = JSON.parse(JSON.stringify(resultDetail?.listScreen ?? ''))
    const screenStr = JSON.parse(isStringEmpty(listScreen) ? JSON.stringify(listScreen) : listScreen)?.screen
    const screenArr = JSON.parse(JSON.stringify(screenStr ?? ''))
    const screenParse = Array.isArray(screenArr)
        ? screenArr
        : JSON.parse(isStringEmpty(listScreen) ? JSON.stringify(screenArr) : screenArr)
    const screenList = isStringEmpty(screenParse) ? [] : screenParse
    const htmlRef = useRef<HTMLDivElement>(null)
    const inputStructure = screenList?.reduce((prev: any, curr) => {
        fieldList?.some((item) => {
            if (curr.ma === item.ma) {
                curr.moTa = item.moTa
                curr.kieuDuLieu = item.kieuDuLieu
                return prev.push(curr)
            } else return null
        })
        return prev
    }, [])
    const itemList = fieldList?.map((item, index) => {
        return {
            index: `item-${index}`,
            ma: item.ma,
            moTa: item.moTa,
            width: '',
            nowrap: '',
            kieuDuLieu: item.kieuDuLieu
        }
    })
    const seletedList = inputStructure?.map((item, index) => {
        item.index = `selected-${index}`
        return item
    })
    const fieldRender = itemList?.filter((item) => !seletedList?.some((i) => i.ma === item.ma))
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [items, setItems] = useState<any>(fieldRender)
    const [selected, setSelected] = useState<any>(seletedList)
    const id2List = { droppable: 'items', droppable2: 'selected' }
    const renderColumns = selected?.map((item, index) => {
        return {
            title: item.moTa,
            key: index,
            dataIndex: item.ma,
            width: isStringEmpty(item.width) ? 'unset' : `${item.width}%`,
            editable: true
        }
    })
    const mergeColumn = renderColumns?.map((col, index) => {
        if (!col.editable) return col
        return { ...col, onCell: (record) => ({ record, editable: col.editable, dataIndex: col.dataIndex, index }) }
    })
    const EditableCell = ({ editable, children, dataIndex, index, ...restProps }) => {
        let childNode = children
        if (editable) {
            childNode = (
                <Input.TextArea
                    spellCheck={false}
                    autoSize={true}
                    defaultValue={selected[index]?.value ?? selected[index]?.moTa}
                    onBlur={(e) => {
                        const value = [...selected]
                        value[index].value = e.target.value
                        setSelected(value)
                    }}
                    style={{
                        border: 'none',
                        padding: 0,
                        outline: 'none',
                        boxShadow: 'none',
                        background: 'transparent'
                    }}
                />
            )
        }
        return <td {...restProps}>{childNode}</td>
    }
    if (!isArrayEmpty(mergeColumn)) {
        mergeColumn?.unshift({ title: 'STT', key: 'stt', dataIndex: 'stt', render: () => 1 })
        mergeColumn?.push({ title: 'Thao tác', key: 'actions', dataIndex: 'actions' })
    }
    let dataObject = {}
    selected?.map((item) => (dataObject[item.ma] = item.value ?? item.moTa))
    useEffect(() => {
        axios
            .get(`${DYNAMIC_URL}/listruong?maDoiTuong=${window.location.search.split('=')[1]}`, Authorization())
            .then((res) => {
                setFieldList(res.data.data.items)
            })
    }, [setisFetchTruong])

    useEffect(() => {
        setItems(fieldRender)
        setSelected(seletedList)
    }, [fieldList])

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
        values.listScreen = { screen: selected, screenCache: htmlRef.current?.innerHTML }
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
        <Spin size='large' tip='Đang xử lý dữ liệu' className='spin_bieumau' spinning={isLoading}>
            {/* {isLoading && (
                <div className='loading-contain'>
                    <Spin size='large' className='loading-doituong' />
                </div>
            )} */}
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
                        <Col span={12} className='col-left'>
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
                                                                <div className='des-item'>
                                                                    {item.moTa} - {item.ma}
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
                        <Col span={12}>
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
                                                    <span>TRƯỜNG DỮ LIỆU</span>
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
                                                                <div className='des-item'>{item.moTa}</div>
                                                                <div className='option-list'>
                                                                    <div
                                                                        className='width-item'
                                                                        style={{ marginRight: 0 }}>
                                                                        <span>Rộng</span>
                                                                        <InputNumber
                                                                            min={1}
                                                                            max={100}
                                                                            style={{ width: 70 }}
                                                                            defaultValue={item.width}
                                                                            onChange={(e) => {
                                                                                const width = [...selected]
                                                                                width[index].width = e?.toString() ?? ''
                                                                                setSelected(width)
                                                                            }}
                                                                        />
                                                                        <span>%</span>
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
                    <div className='preview' style={{ marginBottom: 20 }}>
                        XEM TRƯỚC
                    </div>
                    <div ref={htmlRef}>
                        {!isObjectEmpty(dataObject) && (
                            <Table
                                components={{ body: { cell: EditableCell } }}
                                columns={mergeColumn}
                                dataSource={isObjectEmpty(dataObject) ? undefined : [dataObject]}
                                className='table-list-result'
                                pagination={false}
                            // scroll={{ y: window.innerHeight - 282 }}
                            />
                        )}
                    </div>
                </div>
            </Form>
        </Spin>
    )
}
