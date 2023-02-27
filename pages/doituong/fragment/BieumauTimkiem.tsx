/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { DoubleLeftOutlined, DoubleRightOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Empty, Form, Input, InputNumber, List, Row, Select, Spin } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/vi'
import { useEffect, useRef, useState } from 'react'
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
    resultDetail?: Doituong
    setResultDetail: (item: Doituong) => void
    setisFetchTruong: boolean
}

export default function BieumauTimkiem({ resultDetail, setResultDetail, setisFetchTruong }: Props): JSX.Element {
    // const history = useHistory()
    const [fieldList, setFieldList] = useState<TruongDuLieu[] | undefined>()
    const searchScreen = JSON.parse(JSON.stringify(resultDetail?.searchScreen ?? ''))
    const screenStr = JSON.parse(isStringEmpty(searchScreen) ? JSON.stringify(searchScreen) : searchScreen)?.screen
    const screenArr = JSON.parse(JSON.stringify(screenStr ?? ''))
    const screenParse = Array.isArray(screenArr)
        ? screenArr
        : JSON.parse(isStringEmpty(searchScreen) ? JSON.stringify(screenArr) : screenArr)
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

    const renderInput = (kieuDuLieu, index) => {
        switch (kieuDuLieu) {
            case 'INT':
                return (
                    <InputNumber
                        value={selected[index].value}
                        min={-2147483648}
                        max={2147483647}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            const value = [...selected]
                            value[index].value = e
                            setSelected(value)
                        }}
                    />
                )
            case 'LONG':
                return (
                    <InputNumber
                        value={selected[index].value}
                        min={-9223372036854775808}
                        max={9223372036854775807}
                        parser={(e: any) => e?.replace(/[^0-9-]+/g, '')}
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            const value = [...selected]
                            value[index].value = e
                            setSelected(value)
                        }}
                    />
                )
            case 'FLOAT':
                return (
                    <InputNumber
                        value={selected[index].value}
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            const value = [...selected]
                            value[index].value = e
                            setSelected(value)
                        }}
                    />
                )
            case 'STATUS':
                return (
                    <Select
                        value={selected[index].value}
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            const value = [...selected]
                            value[index].value = e
                            setSelected(value)
                        }}>
                        <Select.Option value={1}>Có</Select.Option>
                        <Select.Option value={0}>Không</Select.Option>
                    </Select>
                )
            case 'DATETIME':
                return (
                    <DatePicker.RangePicker
                        placeholder={['Từ ngày', 'Đến ngày']}
                        value={[
                            selected[index].value &&
                            selected[index].value[0] &&
                            moment(selected[index].value[0], 'DD/MM/YYYY'),
                            selected[index].value &&
                            selected[index].value[1] &&
                            moment(selected[index].value[1], 'DD/MM/YYYY')
                        ]}
                        format='DD/MM/YYYY'
                        style={{ width: '100%' }}
                        onChange={(_, date) => {
                            const value = [...selected]
                            value[index].value = date
                            setSelected(value)
                        }}
                        locale={locale}
                    />
                )
            default:
                return (
                    <Input
                        value={selected[index].value}
                        onChange={(e) => {
                            const value = [...selected]
                            value[index].value = e.target.value
                            setSelected(value)
                        }}
                    />
                )
        }
    }

    const onFinish = (values) => {
        setIsLoading(true)
        values.ma = resultDetail?.ma
        values.searchScreen = { screen: selected, screenCache: htmlRef.current?.innerHTML }
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
                                                                            defaultValue={
                                                                                isStringEmpty(item.width)
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
                    <Row gutter={16} ref={htmlRef}>
                        {selected?.map((item, index) => (
                            <Col style={{ width: isStringEmpty(item.width) ? '25%' : `${item.width}%` }} key={index}>
                                <div className='title-preview'>{item.moTa}</div>
                                {renderInput(item.kieuDuLieu, index)}
                            </Col>
                        ))}
                    </Row>
                </div>
            </Form>
        </Spin>
    )
}
