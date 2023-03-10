import {
    CaretDownOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FormOutlined,
    LinkOutlined,
    PlusOutlined,
    SettingOutlined
} from '@ant-design/icons'
import { Button, Col, Empty, PageHeader, Row, Space, Table, Tooltip, Tree } from 'antd'
import { DataNode } from 'antd/lib/tree'
import axios from 'axios'
import showConfirm from 'common/component/confirm'
import { Notification } from 'common/component/notification'
import { PERMISSION_URL } from 'common/constant/api-constant'
import { errorMessage, successMessage } from 'common/constant/app-constant'
import { MenuPermission } from 'common/interface/MenuPermission'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getPermission } from 'store/actions/app.action'
import '../../assets/css/quyen.css'
import ChitietQuyen from './ChitietQuyen'

export default function DanhsachQuyen(): JSX.Element {
    const [data, setData] = useState<MenuPermission[] | undefined>()
    const [dataTable, setDataTable] = useState<MenuPermission[] | undefined>()
    const [idParent, setIdParent] = useState<number>(0)
    const [idPermission, setIdPermission] = useState<number | undefined>()
    const [isDetail, setIsDetail] = useState<boolean>(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disable, setDisable] = useState<boolean>(true)
    const [isLoading, SetIsLoading] = useState<boolean>(true)
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${PERMISSION_URL}?isTree=true`, Authorization()).then((res) => {
            setData(res.data.result)
        })
    }, [isDetail])

    useEffect(() => {
        axios.get(`${PERMISSION_URL}?idParent=${idParent}`, Authorization()).then((res) => {
            setDataTable(res.data.result)
            SetIsLoading(false)
        })
    }, [idParent, isDetail])

    useEffect(() => {
        isArrayEmpty(selectedRowKeys) ? setDisable(true) : setDisable(false)
    }, [selectedRowKeys])

    const onDeleteQuyen = (data): void => {
        showConfirm({
            title: 'B???n c?? ch???c ch???n mu???n x??a?',
            icon: <ExclamationCircleOutlined />,
            okText: '?????ng ??',
            okType: 'primary',
            cancelText: 'Kh??ng',
            maskClosable: true,
            onOk: () =>
                axios
                    .delete(PERMISSION_URL, { ...Authorization(), data })
                    .then((res) => {
                        Notification({ status: 'success', message: res.data?.msg ?? successMessage })
                        axios
                            .all([
                                axios.get(`${PERMISSION_URL}?idParent=${idParent}`, Authorization()),
                                axios.get(`${PERMISSION_URL}?isTree=true`, Authorization())
                            ])
                            .then((res) => {
                                setDataTable(res[0].data.result)
                                setData(res[1].data.result)
                                dispatch(getPermission())
                            })
                    })
                    .catch(() => {
                        Notification({ status: 'error', message: errorMessage })
                    })
        })
    }

    const columns: any = [
        { title: 'STT', key: 'stt', align: 'center', width: '70px', render: (value, _, index) => index + 1 },
        { title: 'T??n quy???n', key: 'name', dataIndex: 'name' },
        { title: 'Bi???u th???c', key: 'permission', dataIndex: 'permission' },
        { title: 'S???p x???p', align: 'center', key: ' sort', dataIndex: 'sort', width: '90px' },
        {
            title: 'Thao t??c',
            key: 'action',
            align: 'center',
            width: '110px',
            render: (value) => (
                <Fragment>
                    <Tooltip title='Ch???nh s???a' color='#1890ff' placement='top'>
                        <Button
                            type='text'
                            icon={<EditOutlined style={{ color: '#1890ff' }} />}
                            onClick={(): void => {
                                setIsDetail(true)
                                setIdPermission(value.id)
                            }}></Button>
                    </Tooltip>
                    <Tooltip title='X??a' color='#ff4d4f' placement='top'>
                        <Button
                            type='text'
                            icon={
                                <DeleteOutlined
                                    style={{ color: '#ff4d4f' }}
                                    onClick={(): void => onDeleteQuyen([value.id])}
                                />
                            }></Button>
                    </Tooltip>
                </Fragment>
            )
        }
    ]

    const typeIcon = { 1: <LinkOutlined />, 2: <FormOutlined />, 3: <SettingOutlined /> }
    const drawTree = (indexTotal, indexData) => {
        indexData?.map((i: any) => {
            let dataTemp = []
            if (!isArrayEmpty(i?.children)) {
                indexTotal.push({
                    title: i.name,
                    key: i.id,
                    idParent: i.idParent ?? 0,
                    icon: typeIcon[i.type as number],
                    children: drawTree(dataTemp, i.children)
                })
            } else {
                indexTotal.push({
                    title: i.name,
                    key: i.id,
                    idParent: i.idParent ?? 0,
                    icon: typeIcon[i.type as number]
                })
            }
            return indexTotal
        })
        return indexTotal
    }
    const treeMenu = [{ key: 0, idParent: 0, title: 'Danh s??ch quy???n', children: drawTree([], data) }]

    // interface Props {
    //     dragNode: EventDataNode
    //     dragNodesKeys: Key[]
    //     dropPosition: number
    //     dropToGap: boolean
    // }
    // const onDrop = (info: NodeDragEventParams<HTMLDivElement> & Props) => {
    //     const data = {
    //         id: info.dragNode.key,
    //         idParent: info.node.dragOver ? info.node.key : (info.node as any).idParent
    //     }
    //     axios.put(`${PERMISSION_URL}/updateParent`, data, Authorization()).then((res) => {
    //         Notification({ status: 'success', message: res.data?.msg ?? successMessage })
    //         dispatch(getPermission())
    //         axios.get(`${PERMISSION_URL}?isTree=true`, Authorization()).then((res) => {
    //             setData(res.data.result)
    //         })
    //     })
    // }

    return (
        <div className='permission-wrapper'>
            <PageHeader
                ghost={false}
                title='Quy???n'
                style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                extra={
                    !isDetail && [
                        <Space>
                            <Button
                                danger
                                disabled={disable}
                                type='primary'
                                icon={<DeleteOutlined />}
                                onClick={(): void => onDeleteQuyen(selectedRowKeys)}>
                                X??a
                            </Button>
                            <Button type='primary' icon={<PlusOutlined />} onClick={(): void => setIsDetail(true)}>
                                Th??m m???i
                            </Button>
                        </Space>
                    ]
                }
            />
            <Row>
                <Col span={7}>
                    <Tree
                        defaultSelectedKeys={[0]}
                        blockNode
                        draggable
                        // onDrop={onDrop}
                        showIcon
                        showLine={{ showLeafIcon: false }}
                        switcherIcon={<CaretDownOutlined />}
                        treeData={treeMenu as DataNode[]}
                        defaultExpandAll
                        onSelect={(id) => setIdParent(id[0] as number)}
                    />
                </Col>
                <Col span={17}>
                    {isDetail ? (
                        <ChitietQuyen
                            data={data}
                            idParent={idParent}
                            isDetail={isDetail}
                            idPermission={idPermission}
                            setIsDetail={setIsDetail}
                            setIdPermission={setIdPermission}
                        />
                    ) : (
                        <Table
                            size='small'
                            rowKey='id'
                            pagination={false}
                            bordered
                            columns={columns}
                            dataSource={dataTable}
                            loading={isLoading}
                            rowSelection={{
                                onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys as number[])
                            }}
                            locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                            scroll={{
                                y: window.innerHeight - 250
                            }}
                        />
                    )}
                </Col>
            </Row>
        </div>
    )
}
