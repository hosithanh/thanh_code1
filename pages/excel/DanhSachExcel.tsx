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
            title: 'M?? lo???i k???t qu???/T??n lo???i k???t qu???',
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
            title: 'Th??? t???c',
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
                    <div style={{ color: 'red' }}>( Vui l??ng c???u h??nh danh s??ch lo???i k???t qu??? )</div>
                )
            }
        },
        { title: 'S??? KQ', dataIndex: 'count', align: 'center', key: 'phienBan', width: 70 },

        {
            title: 'Thao ta??c',
            key: 'action',
            align: 'center',
            width: '70px',
            render: (value) => {
                return (
                    <>
                        <Link to={`/${MenuPaths.importExcel}/${value.ma}`}>
                            <Tooltip title='Import d??? li???u k???t qu??? s??? h??a' placement='left'>
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
            <p style={{ fontSize: '17px' }}>T??m ki???m n??ng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form.Item name='idDonVi' label='????n vi??'>
                <Select
                    allowClear
                    placeholder='????n v???'
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
                                tip='??ang t???i d??? li???u'
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
                T??m ki???m
            </Button>
        </Menu>
    )

    return (
        <>
            <div className='group-action'>
                <PageHeader
                    ghost={false}
                    title='Danh s??ch lo???i k???t qu???'
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
                                    placeholder='Nh???p t??? kh??a c???n t??m'
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
                                            <Tooltip title='T??m ki???m n??ng cao'>
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
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
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
                        showTotal={(total, range) => `${range[0]}-${range[1]} c???a ${total} do??ng`}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </>
    )
}
