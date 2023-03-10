/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { CloseOutlined, SearchOutlined, SlidersTwoTone } from '@ant-design/icons'
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
import { ACCESS_TOKEN } from 'common/constant'
import {
    CAPDONVIS_LIST_URL,
    DONVI_LISTALL_URL,
    DONVI_LIST_USER_URL,
    DOWNLOAD_FILE_KQAPI
} from 'common/constant/api-constant'
import { CapDonVi } from 'common/interface/CapDonVi'
import { Linhvuc } from 'common/interface/Danhmuc.interfaces/Linhvuc'
import { Authorization, getCookie } from 'common/utils/cookie-util'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getLinhvuc } from 'store/actions/danhmuc.actions/linhvuc.action'
import { selectDoituongDonviMorong, selectUserDonvi } from 'store/actions/donvi.action'
import { getDulieu } from 'store/actions/dulieu.action'
import { MenuPaths } from '../../common/constant/app-constant'
import { Doituong } from '../../common/interface/Doituong'
import { Donvi } from '../../common/interface/Donvi'
import { isArrayEmpty } from '../../common/utils/empty-util'
import { AppState } from '../../store/interface'

export default function DanhsachDulieu(): JSX.Element {
    const listLinhVuc = useSelector<AppState, Linhvuc[] | undefined>((state) => state.linhvuc?.listLinhVuc)
    const resultList = useSelector<AppState, Doituong[] | undefined>((state) => state.dulieu.resultList)
    const totalRecords = useSelector<AppState, number | undefined>((state) => state.dulieu.totalRecords)
    const currentPage = useSelector<AppState, number | undefined>((state) => state.dulieu.currentPage)
    const pageSize = useSelector<AppState, number | undefined>((state) => state.dulieu.pageSize)
    // const dataSearch = useSelector<AppState, string | undefined>((state) => state.dulieu.dataSearch)
    const [donviList, setDonviList] = useState<Donvi[] | undefined>()
    const idDonvi = useSelector<AppState, number | undefined>((state) => state.dulieu.idDonvi)
    const dispatch = useDispatch()
    const [searchDonvi, setSearchDonvi] = useState<number | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [donviListAll, setDonviListAll] = useState<Donvi[] | undefined>()
    const [capDonViList, setCapDonViList] = useState<CapDonVi[] | undefined>()
    const [dataSearch, setdataSearch] = useState<string | undefined>('')
    const [disibleDrop, setdisibleDrop] = useState(false)
    const [malinhvuc, setMalinhvuc] = useState()
    const [idDonViLinhVuc, setidDonViLinhVuc] = useState()

    useEffect(() => {
        dispatch(getLinhvuc({ page: 1, pageSize: 500, idDonvi: idDonViLinhVuc }))
    }, [idDonViLinhVuc])
    useEffect(() => {
        axios.get(`${CAPDONVIS_LIST_URL}`, Authorization()).then((res) => {
            setCapDonViList(res?.data?.result)
        })
    }, [])

    useEffect(() => {
        dispatch(getDulieu({ dataSearch: dataSearch, idDonvi: searchDonvi, maLinhVuc: malinhvuc, pageSize: pageSize }))
    }, [malinhvuc])
    const columns: ColumnsType<Doituong> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: '60px',
            render: (value, _, index) => pageSize && currentPage && Math.ceil(currentPage - 1) * pageSize + index + 1
        },

        {
            title: 'M?? lo???i k???t qu??? g???p/T??n lo???i k???t qu???',
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
            title: 'M?? lo???i k???t qu??? / T??n th??? t???c',
            dataIndex: 'thutucloaiketqua',
            key: 'thutucloaiketqua',
            align: 'left',
            render: (text, record) => {
                return !isArrayEmpty(record.doiTuongGopLoaiKetQuaDTOs) ? (
                    record.doiTuongGopLoaiKetQuaDTOs.map((item) => (
                        <Link to={`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${record.ma}&maGiayTo=${item.maGiayTo}`}>
                            <div className='doiTuongGopLoaiKetQuaDTOs'>
                                - <span style={{ color: '#52c41a' }}>{item.maGiayTo}</span> - {item.tenTTHC} .
                            </div>
                        </Link>
                    ))
                ) : record.isSub !== 1 ? (
                    <div style={{ color: 'red' }}>( Vui l??ng c???u h??nh danh s??ch lo???i k???t qu??? )</div>
                ) : (
                    <Link to={`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${record.ma}`}>
                        <div className='doiTuongGopLoaiKetQuaDTOs'>
                            - <span style={{ color: '#52c41a' }}> Lo???i danh s??ch b???ng ph??? </span>
                        </div>
                    </Link>
                )
            }
        },
        { title: 'S??? KQ', dataIndex: 'count', align: 'center', key: 'phienBan', width: 70 },
        {
            title: '????n v??? / c???p ????n v???',
            // dataIndex: 'donViId',
            key: 'donViIds',
            width: '170px',
            render: (value) => {
                let tenDonVi = []
                value.donViIds &&
                    value.donViIds?.map((id) => {
                        tenDonVi.push(donviListAll?.find((item) => item.id === id)?.ten)
                    })

                value.capDonViIds &&
                    value.capDonViIds?.map((id) => {
                        tenDonVi.push(donviListAll?.find((item) => item.id === id)?.ten)
                    })
                return tenDonVi.join(', ')
            }
        }
        // {
        //     title: 'Thao t??c',
        //     key: 'action',
        //     align: 'center',
        //     width: '100px',
        //     render: (value) => (
        //         <>
        //             <Tooltip title='Danh s??ch k???t qu???' placement='top'>
        //                 <Link to={`/${MenuPaths.dulieu}/chitiet?maDoiTuong=${value.ma}`}>
        //                     <Button type='text' icon={<UnorderedListOutlined />} />
        //                 </Link>
        //             </Tooltip>
        //             {/* <Tooltip title='T??i li???u h?????ng d???n t??ch h???p' placement='top'>
        //                 <Button type='text' icon={<DownloadOutlined />} onClick={() => fileKQAPI(value.ma)} />
        //             </Tooltip> */}
        //         </>
        //     )
        // }
    ]
    useEffect(() => {
        axios.get(`${DONVI_LIST_USER_URL}?donvimorong=0`, Authorization()).then((res) => {
            setDonviList(res.data.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`${DONVI_LISTALL_URL}`, Authorization()).then((res) => {
            setDonviListAll(res.data.data)
        })
    }, [])

    useEffect(() => {
        !resultList && dispatch(getDulieu({ dataSearch, idDonvi }))
        setIsLoading(false)
    }, [])

    useEffect(() => {
        resultList ? setIsLoading(false) : setIsLoading(true)
    }, [resultList])

    const onPageChange = (page, pageSize) => {
        setIsLoading(true)
        dispatch(getDulieu({ page, pageSize, dataSearch, idDonvi }))
    }

    const downloadFile = (url, ma, name) => {
        axios({
            url: `${url}/${ma}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}` }
        }).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
        })
    }

    const fileKQAPI = (ma): void => {
        downloadFile(DOWNLOAD_FILE_KQAPI, ma, `LoaiKetQuaAPI_${ma}.docx`)
    }
    const onChangeSearch = (idDonvi) => {
        setidDonViLinhVuc(idDonvi)
        setIsLoading(true)
        selectDoituongDonviMorong(idDonvi)
        setSearchDonvi(idDonvi)
        if (idDonvi !== '') {
            dispatch(getDulieu({ pageSize, dataSearch, idDonvi: idDonvi }))
        }
    }

    const onFinish = (values) => {
        const { dataSearch, idDonVi } = values
        dispatch(getDulieu({ dataSearch, idDonvi: idDonVi, pageSize: pageSize }))
    }
    const onChangeInput = (e) => {
        if (!e.target.value) {
            dispatch(getDulieu({ idDonvi: searchDonvi }))
        }
    }
    const typingTimeoutRef = useRef<any>()
    const onSearchDonVi = (searchData) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            ; (dispatch(selectUserDonvi({ searchData })) as any).then((res) => {
                setDonviList(res.data.data)
            })
        }, 400)
    }

    const onVisibleChange = (disibleDrop) => {
        setdisibleDrop(disibleDrop)
    }
    const close = () => {
        setdisibleDrop(!disibleDrop)
    }
    const onSearch = (searchData?: string) => {
        setdataSearch(searchData)
        setIsLoading(true)
        dispatch(getDulieu({ dataSearch: searchData, idDonvi: searchDonvi, pageSize: pageSize, maLinhVuc: malinhvuc }))
    }

    const onChangeLinhVuc = (maLinhVuc) => {
        setMalinhvuc(maLinhVuc)
    }

    const menu = (
        <Menu style={{ width: '100%', float: 'left', marginTop: '62px', padding: '10px 02px ', left: '-1rem' }}>
            <p style={{ fontSize: '17px' }}>T??m ki???m n??ng cao</p>{' '}
            <span
                style={{ display: 'block', float: 'right', fontSize: 'initial', marginTop: '-40px' }}
                onClick={() => {
                    close()
                }}>
                <CloseOutlined />
            </span>
            <Form layout='inline'>
                <Form.Item name='idDonVi'>
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
                        style={{ width: 200, textAlign: 'left', marginRight: '-8px', marginLeft: '10px' }}>
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
                                    }}></Spin>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name='idLinhVuc'>
                    <Select
                        allowClear
                        placeholder='L??nh V???c'
                        showSearch
                        onChange={onChangeLinhVuc}
                        optionFilterProp='children'
                        filterOption={(input, option: any) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{
                            width: 190,
                            textAlign: 'left',
                            marginRight: '-135px',
                            marginLeft: '10px',
                            float: 'left'
                        }}>
                        {listLinhVuc ? (
                            listLinhVuc?.map((item, index) => (
                                <Select.Option key={index} value={`${item?.maLinhVuc}`}>
                                    {item.tenLinhVuc}
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
                                    }}></Spin>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Button
                    icon={<SearchOutlined />}
                    type='primary'
                    style={{ float: 'right', marginLeft: '10px', marginTop: '40px' }}
                    onClick={() => {
                        onSearch(dataSearch)
                    }}>
                    T??m ki???m
                </Button>
            </Form>
        </Menu>
    )

    return (
        <Fragment>
            <PageHeader
                ghost={false}
                title='Danh s??ch lo???i k???t qu???'
                style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                extra={[
                    <Space>
                        <Form layout='inline' style={{ width: 435, textAlign: 'left' }}>
                            <Input.Search
                                onChange={(event) => {
                                    setdataSearch(event.target.value)
                                }}
                                allowClear={true}
                                enterButton={false}
                                // defaultValue={searchData}
                                onSearch={onSearch}
                                placeholder='Nh???p t??? kh??a c???n t??m'
                                prefix={<SearchOutlined className='site-form-item-icon' />}
                                suffix={
                                    <Dropdown
                                        visible={disibleDrop}
                                        onVisibleChange={onVisibleChange}
                                        className='search-overlay-dropdown'
                                        overlay={menu}
                                        trigger={['click']}
                                        placement='bottom'
                                        arrow={false}>
                                        <Tooltip title='T??m ki???m n??ng cao' placement='topRight'>
                                            <SlidersTwoTone style={{ fontSize: '15px' }} />
                                        </Tooltip>
                                    </Dropdown>
                                }
                            />
                        </Form>
                    </Space>
                ]}
            />
            <Table
                rowKey='id'
                columns={columns}
                size='small'
                dataSource={resultList}
                pagination={false}
                bordered
                locale={{ emptyText: <Empty description='Kh??ng c?? d??? li???u' /> }}
                scroll={{
                    y: window.innerHeight - 250
                }}
                loading={isLoading}
            />
            {!isArrayEmpty(resultList) && (
                <ConfigProvider locale={viVN}>
                    <Pagination
                        total={totalRecords}
                        showTotal={(total, range) =>
                            `${currentPage! * pageSize! - pageSize! + 1}-${range[1]} c???a ${total} do??ng`
                        }
                        style={{ textAlign: 'end', paddingTop: '20px' }}
                        onChange={onPageChange}
                        current={currentPage}
                        defaultCurrent={1}
                        defaultPageSize={pageSize}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30', '50', '100']}
                    />
                </ConfigProvider>
            )}
        </Fragment>
    )
}
