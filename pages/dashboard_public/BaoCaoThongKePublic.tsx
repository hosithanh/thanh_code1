/* eslint-disable array-callback-return */
import { Col, Empty, Table } from 'antd'
import axios from 'axios'
import { BAOCAOTHONGKE_PUBLIC } from 'common/constant/api-constant'
import { MenuPaths } from 'common/constant/app-constant'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


function BaoCaoThongKePublic({ date }) {
    const [isLoadingTable, setIsLoadingTable] = useState(true)
    const [dataSourceBaoCao, setDataSourceBaoCao] = useState<any | undefined>()
    const [dataThongKe, setThongKe] = useState<any | undefined>()
    useEffect(() => {
        let arrayDataTemp = []
        if (!isArrayEmpty(dataSourceBaoCao)) {
            dataSourceBaoCao.map((item) => {
                arrayDataTemp.push(item)
                if (item.childrenData?.length > 0) {
                    item.childrenData.map((itemChild) => {
                        arrayDataTemp.push(itemChild)
                    })
                }
            })
        }
        setThongKe(arrayDataTemp)
        dataSourceBaoCao && setIsLoadingTable(false)
    }, [dataSourceBaoCao])
    useEffect(() => {
        axios.get(`${BAOCAOTHONGKE_PUBLIC}${date ? `?from=${date[0]}&to=${date[1]}` : ''}`).then((res) => {
            setDataSourceBaoCao(res.data.data)
        })
    }, [date])
    const columns: any = [
        {
            title: 'STT',
            align: 'center',
            key: 'key',
            width: '55px',
            render: (value, row, index) => {
                return index + 1
            }
        },
        {
            title: 'Cơ quan/đơn vị ',
            dataIndex: 'tenDonVi',
            width: '26%',
            key: 'tenDonVi',
            render: (value, row, index) => {
                return (
                    <>
                        <Link
                            to={{
                                pathname: `/${MenuPaths.thongkesohoadonvi}/${row.id}`,
                                state: {
                                    tenDonvi: row.tenDonVi,
                                    date
                                }
                            }}>
                            {row.parrentId === 0 ? row.tenDonVi : '---- ' + row.tenDonVi}
                        </Link>
                    </>
                )
            }
        },
        {
            title: 'Số lượng số hóa',
            dataIndex: 'tong',
            align: 'center',
            key: 'tong'
            // width: '55px',
        },

        {
            title: 'Liên thông',
            dataIndex: 'lienThong',
            align: 'center',
            key: 'lienThong'
        },
        {
            title: 'Nhập liệu',
            dataIndex: 'nhapLieu',
            align: 'center',
            key: 'nhapLieu'
        },
        {
            title: 'Chuyên ngành',
            dataIndex: 'chuyenNganh',
            align: 'center',
            key: 'chuyenNganh'
        },
        {
            title: 'Import',
            dataIndex: 'importAmount',
            align: 'center',
            key: 'importAmount'
        }
    ]
    return (
        <Col span={24} xl={16}>
            <Table
                size='small'
                columns={columns}
                pagination={false}
                loading={isLoadingTable}
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                bordered
                dataSource={dataThongKe}
                scroll={{ y: 500 }}
            />
        </Col>
    )
}

export default BaoCaoThongKePublic
