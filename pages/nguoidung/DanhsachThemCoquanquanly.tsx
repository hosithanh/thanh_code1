/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { BackwardOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Empty, Form, Input, PageHeader, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addCoQuanQuanLy } from 'store/actions/user.action'
import { COQUANQUANLY_DANHSACH_URL, DONVI_LIST_URL } from '../../common/constant/api-constant'
import { MenuPaths } from '../../common/constant/app-constant'
import { Coquanquanly } from '../../common/interface/Coquanquanly'
import { Authorization } from '../../common/utils/cookie-util'
export default function DanhsachThemCoquanquanly(): JSX.Element {
    const [coquanquanlyList, setCoquanquanlyList] = useState<Coquanquanly[] | undefined>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | undefined>()
    const [disabled, setDisabled] = useState(true)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const pathname2 = window.location.pathname.split('/').pop()
    const columns: ColumnsType<Coquanquanly> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => index + 1

        },
        {
            title: (
                <div>
                    <span>Tên đơn vị</span>
                </div>
            ),
            dataIndex: 'ten',
            key: 'ten'
        }
    ]

    useEffect(() => {
        axios.get(`${COQUANQUANLY_DANHSACH_URL}/${pathname2}`, { ...Authorization() }).then((res) => {
            if (res.data.data.items !== undefined) {
                axios.get(`${DONVI_LIST_URL}?pageSize=500&accountId=${pathname2}`, Authorization()).then((res) => {
                    setCoquanquanlyList(res.data.data.items)
                })
            } else {
                axios.get(`${DONVI_LIST_URL}/all`, Authorization()).then((res) => {
                    setCoquanquanlyList(res.data.data)
                })
            }
        })
    }, [])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
            selectedRowKeys.length > 0 ? setDisabled(false) : setDisabled(true)
        }
    }
    const onSearch = (searchData?: string) => {
        axios
            .get(
                `${DONVI_LIST_URL}?pageSize=500&accountId=${pathname2}${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }`,
                Authorization()
            )
            .then((res) => {
                if (res.data.data.items) {
                    setCoquanquanlyList(res.data.data.items)
                } else {
                    let tempItems = []
                    res.data.data?.map((items) => {
                        if (coquanquanlyList.some((Item) => items.id === Item.id)) {
                            tempItems = [...tempItems, items]
                        }
                    })
                    setCoquanquanlyList(tempItems)
                }
            })
    }

    const addcoquanquanly = (): void => {
        ; (dispatch(addCoQuanQuanLy(selectedRowKeys, pathname2)) as any).then(() => {
            history.push(`/${MenuPaths.nguoidung}/${MenuPaths.danhsachcoquanquanly}/${pathname2}`)
        })
    }
    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách thêm cơ quan quản lý'
                    extra={[
                        <Space>
                            <Form layout='inline'>
                                <Input.Search
                                    allowClear
                                    placeholder='Nhập từ khóa cần tìm'
                                    enterButton={
                                        <>
                                            <SearchOutlined /> Tìm kiếm
                                        </>
                                    }
                                    onSearch={onSearch}
                                />
                            </Form>
                            <Button onClick={(): void => history.goBack()}>
                                <BackwardOutlined />
                                Quay lại
                            </Button>

                            <Button
                                type='primary'
                                icon={<SaveOutlined />}
                                disabled={disabled}
                                onClick={addcoquanquanly}>
                                Chọn
                            </Button>
                        </Space>
                    ]}
                />
            </div>
            <Table
                loading={load}
                size='small'
                rowKey='id'
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={coquanquanlyList}
                pagination={false}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                scroll={{
                    y: window.innerHeight - 250
                }}
            />
        </>
    )
}
