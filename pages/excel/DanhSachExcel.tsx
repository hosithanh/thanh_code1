/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { CloseOutlined, FileAddFilled, SearchOutlined, SlidersTwoTone } from '@ant-design/icons'
import {
    Button,
    ConfigProvider,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    PageHeader,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tooltip
} from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { ColumnsType } from 'antd/lib/table'
import axios from 'axios'
import { CAPDONVIS_LIST_URL, DONVI_LISTALL_URL, DONVI_LIST_USER_URL } from 'common/constant/api-constant'
import { MenuPaths } from 'common/constant/app-constant'
import { Doituong } from 'common/interface/Doituong'
import { Donvi } from 'common/interface/Donvi'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty } from 'common/utils/empty-util'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectDoituongDonviMorong, selectUserDonvi } from 'store/actions/donvi.action'
import { getResults } from 'store/actions/ketqua.action'
import { AppState } from 'store/interface'

export default function DanhSachExcel(): JSX.Element {
    const dispatch = useDispatch()
    const resultList = useSelector<AppState, Doituong[] | undefined>((state) => state.resultFile.resultList)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.resultFile.currentPage)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.resultFile.totalRecords)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.resultFile.pageSize)
    const [isloadingTable, setIsloadingTable] = useState<boolean>(true)
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const [searchDonvi, setSearchDonvi] = useState<number | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)

  useEffect(() => {
      resultList && setIsloadingTable(false)
  }, [resultList])
  useEffect(() => {
      axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
          setDonviList(res.data.data)
      })
  }, [])

    const columns: ColumnsType<Doituong> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '70px',
            render: (value, _, index) => currentPage && Math.ceil(currentPage - 1) * 10 + index + 1
        },
        {
            title: 'Mã loại kết quả/Tên loại kết quả',
            dataIndex: 'maGiayTo',
            key: 'maGiayTo',
            width: '290px',
            render: (text, row) => {
                return (
                    <div>
                        {' '}
                        <span style={{ color: 'red' }}>{row.ma}</span>
                        <br></br> {row.ten}
                    </div>
                )
            }
        },
        {
            title: 'Thủ tục',
            dataIndex: 'thutucloaiketqua',
            key: 'thutucloaiketqua',
            align: 'left',
            render: (text, record) => {
                return !isArrayEmpty(record.doiTuongGopLoaiKetQuaDTOs) ? (
                    record.doiTuongGopLoaiKetQuaDTOs.map((item) => (
                        <div className='doiTuongGopLoaiKetQuaDTOs'>
                            - <span style={{ color: '#52c41a' }}>{item.maGiayTo}</span> - {item.tenTTHC} .
                        </div>
                    ))
                ) : (
                    <div style={{ color: 'red' }}>( Vui lòng cấu hình danh sách loại kết quả )</div>
                )
            }
        },
        { title: 'Số KQ', dataIndex: 'count', align: 'center', key: 'phienBan', width: 70 },

        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: '70px',
            render: (value) => {
                return (
                    <>
                        <Link to={`/${MenuPaths.importExcel}/${value.ma}`}>
                            <Tooltip title='Import dữ liệu kết quả số hóa' placement='left'>
                                <Button type='text' icon={<FileAddFilled />} />
                            </Tooltip>
                        </Link>
                    </>
                )
            }
        }
    ]
    const onPageChange = (page, pageSize) => {
        setIsloadingTable(true)
        dispatch(getResults({ page, pageSize, dataSearch, idDonvi: searchDonvi }))
    }

    useEffect(() => {
        !resultList && dispatch(getResults({ dataSearch }))
    },[])
    useEffect(() => {
        resultList && setIsloadingTable(false)
    }, [resultList])
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])

    const onChangeSearch = (idDonvi) => {
        // setdonVi(idDonvi)
        setIsloadingTable(true)
        selectDoituongDonviMorong(idDonvi)
        setSearchDonvi(idDonvi)

        if (idDonvi !== '') {
            dispatch(getResults({ pageSize, dataSearch, idDonvi: idDonvi }))
        }
    }

    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ;(dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 400)
    }

    const onSearch = (searchData?: string) => {
        setIsloadingTable(true)
        setdataSearch(searchData)
        dispatch(getResults({ dataSearch, idDonvi: searchDonvi, pageSize: pageSize }))
    }

    const onOpenChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const menu = (
        <Menu style={{ width: '150%', float: 'left', marginTop: '62px', padding: '10px 10px ', left: '-10rem' }}>
            <p style={{ fontSize: '17px' }}>Tìm kiếm nâng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form.Item name='idDonVi' label='Đơn vị'>
                <Select
                    allowClear
                    placeholder='Đơn vị'
                    showSearch
                    onChange={onChangeSearch}
                    onSearch={onSearchDonVi}
                    optionFilterProp='children'
                    filterOption={(input, option: any) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: 220, textAlign: 'left', marginRight: '-8px', marginLeft: '10px' }}>
                    {donviList ? (
                        donviList?.map((item, index) => (
                            <Select.Option key={index} value={`${item.id}`}>
                                {item.ten}
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option value={''}>
                            <Spin
                                tip='Đang tải dữ liệu'
                                style={{
                                    display: 'block',
                                    justifyContent: 'center',
                                    marginTop: '0.1px'
                                }}
                            />
                        </Select.Option>
                    )}
                </Select>
            </Form.Item>
            <Button
                icon={<SearchOutlined />}
                type='primary'
                style={{ float: 'right' }}
                onClick={() => {
                    onSearch(dataSearch)
                }}>
                Tìm kiếm
            </Button>
        </Menu>
    )

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh sách loại kết quả'
                    style={{ padding: '16px 0' }}
                    extra={[
                        <Space>
                            <Form layout='inline' style={{ width: 440, textAlign: 'left' }}>
                                <Input.Search
                                    onChange={(event) => {
                                        setdataSearch(event.target.value)
                                    }}
                                    allowClear={true}
                                    // defaultValue={searchData}
                                    onSearch={onSearch}
                                    placeholder='Nhập từ khóa cần tìm'
                                    prefix={<SearchOutlined className='site-form-item-icon' />}
                                    suffix={
                                        <Dropdown
                                            visible={disibleDrop}
                                            onOpenChange={onOpenChange}
                                            className='search-overlay-dropdown'
                                            overlay={menu}
                                            trigger={['click']}
                                            placement='bottom'
                                            arrow={false}>
                                            <Tooltip title='Tìm kiếm nâng cao'>
                                                <SlidersTwoTone style={{ fontSize: '15px' }} />
                                            </Tooltip>
                                        </Dropdown>
                                    }
                                />
                            </Form>
                        </Space>
                    ]}
                />
            </div>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={resultList}
                pagination={false}
                loading={isloadingTable}
                bordered
                locale={{ emptyText: <Empty description='Không có dữ liệu' /> }}
                scroll={{
                    y: window.innerHeight - 333
                }}
            />
            {!isArrayEmpty(resultList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        // locale={viVN}
                        total={totalRecords}
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        defaultCurrent={1}
                        current={currentPage}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} dòng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
