/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackwardOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Modal, PageHeader, Spin } from 'antd'
import axios from 'axios'
import { MenuPaths } from 'common/constant/app-constant'
import DanhsachGopLoaigiayto from 'pages/danhmuc/loaigiayto/DanhsachGopLoaigiayto'
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../../assets/css/doituong.css'
import { DYNAMIC_URL } from '../../common/constant/api-constant'
import { Doituong } from '../../common/interface/Doituong'
import { Authorization } from '../../common/utils/cookie-util'
import { isStringEmpty } from '../../common/utils/empty-util'
import BieumauChitiet from './fragment/BieumauChitiet'
import BieumauDanhsach from './fragment/BieumauDanhsach'
import BieumauNhaplieu from './fragment/BieumauNhaplieu'
import BieumauTimkiem from './fragment/BieumauTimkiem'
import DanhsachTruong from './fragment/DanhsachTruong'
import PhanQuyenNguoiDung from './fragment/PhanQuyenNguoiDung'
import ThongtinDoituong from './fragment/ThongtinDoituong'

export default function ChitietDoituong(): JSX.Element {
    const history = useHistory()
    const maDoiTuong = window.location.search.split('=').pop()
    const [disable, setDisable] = useState<boolean>(isStringEmpty(maDoiTuong))
    const [resultDetail, setResultDetail] = useState<Doituong | undefined>()
    const [resultList, setResultList] = useState<Doituong[] | undefined>()
    const [isReload, setIsReload] = useState<boolean>(false)
    const tabName = window.location.pathname.split('/').pop()
    const [isModalAdd, setIsModalAdd] = useState<boolean>(false)
    const [isModalVisible, setIsModalAddVisible] = useState(false)
    const [isFetchTruong, setIsFetchTruong] = useState(false)
    const [isModalVisibleDSTruong, setIsModalVisibleDSTruong] = useState(false)
    const [idDonviGop, setIdDonviGop] = useState<number | undefined>()
    const [idDoiTuongGop, setIdDoiTuongGop] = useState<number | undefined>()

    const showModal = () => {
        setIsModalAddVisible(true)
        setIsModalAdd(true)
        setIsFetchTruong(false)
    }

    const handleOk = () => {
        setIsModalAddVisible(false)
    }
    const handleCancel = () => {
        setIsModalAddVisible(false)
        setIsModalAdd(false)
        setIsFetchTruong(false)
    }

    const showModalDSTruong = () => {
        setIsModalVisibleDSTruong(true)
    }
    const handleOkDSTruong = () => {
        setIsModalVisibleDSTruong(false)
    }
    const handleCancelkDSTruong = () => {
        setIsModalVisibleDSTruong(false)
        setIsFetchTruong(!isFetchTruong)
        setIsReload(!isReload)
    }

    useEffect(() => {
        maDoiTuong &&
            axios.get(`${DYNAMIC_URL}/doituong/${maDoiTuong}`, Authorization()).then((res) => {
                setResultDetail(res.data.data)
                setIdDoiTuongGop(res.data.data?.id)
                setIdDonviGop(res.data.data?.donViId)
            })
    }, [isReload, maDoiTuong])

    useEffect(() => {
        axios.post(`${DYNAMIC_URL}/list`, {}, Authorization()).then((res) => {
            setResultList(res.data.data?.items)
        })
    }, [])
    const renderTabs = (): JSX.Element => {
        switch (true) {
            case tabName === 'gop-doi-tuong':
                return (
                    <DanhsachGopLoaigiayto
                        maDoiTuong={maDoiTuong}
                        idDonviGop={idDonviGop}
                        idDoiTuongGop={idDoiTuongGop}
                        isgoptab={true}
                    />
                )
            case tabName === 'phan-quyen':
                // return <PhanquyenDoituong />
                return <PhanQuyenNguoiDung maDoiTuong={maDoiTuong} />
            case tabName === 'nhap-lieu':
                return (
                    <BieumauNhaplieu
                        resultDetail={resultDetail}
                        resultList={resultList}
                        setResultDetail={setResultDetail}
                        setisFetchTruong={isFetchTruong}
                    />
                )
            case tabName === 'danh-sach':
                return (
                    <BieumauDanhsach
                        resultDetail={resultDetail}
                        setResultDetail={setResultDetail}
                        setisFetchTruong={isFetchTruong}
                    />
                )
            case tabName === 'tim-kiem':
                return (
                    <BieumauTimkiem
                        resultDetail={resultDetail}
                        setResultDetail={setResultDetail}
                        setisFetchTruong={isFetchTruong}
                    />
                )
            case tabName === 'chi-tiet':
                return (
                    <BieumauChitiet
                        resultDetail={resultDetail}
                        resultList={resultList}
                        setResultDetail={setResultDetail}
                        setisFetchTruong={isFetchTruong}
                    />
                )
            default:
                return (
                    <ThongtinDoituong
                        resultList={resultList}
                        resultDetail={resultDetail}
                        setDisabled={(disabled): void => setDisable(disabled)}
                        isReload={isReload}
                        setIsReload={(isReload): void => setIsReload(isReload)}
                    />
                )
        }
    }

    const activeTab = (name: string) => (tabName === name ? 'tab-active' : '')

    return (
        <div className='result-detail' id='result-detail'>
            <PageHeader
                title={`Lo???i k???t qu??? - ${maDoiTuong ? maDoiTuong : 'Th??m m???i'}`}
                style={{ padding: '0 0 16px 0' }}
                extra={[
                    <>
                        <Link to={`/${MenuPaths.doituong}`}>
                            <Button icon={<BackwardOutlined />}>Quay l???i</Button>
                        </Link>
                        <Button icon={<UnorderedListOutlined />} type='primary' onClick={showModalDSTruong}>
                            Tr??????ng d??? li???u
                        </Button>
                        <Modal
                            width='90%'
                            centered
                            style={{ height: 'calc(100vh -100px)', top: '10px' }}
                            bodyStyle={{ overflowY: 'scroll' }}
                            visible={isModalVisibleDSTruong}
                            onOk={handleOkDSTruong}
                            onCancel={handleCancelkDSTruong}
                            closable={false}
                            footer={[
                                <Button danger type='primary' onClick={handleCancelkDSTruong}>
                                    ????ng
                                </Button>
                            ]}>
                            <DanhsachTruong isModalAdd={true} maDT='' />
                        </Modal>
                    </>
                    // !disable && (
                    //     <>
                    //         <Button icon={<PlusOutlined />} type='primary' onClick={showModal}>
                    //             Th??m tr?????ng
                    //         </Button>
                    //         <Modal
                    //             width='90%'
                    //             centered
                    //             style={{ height: 'calc(100vh - 70px)' }}
                    //             bodyStyle={{ overflowY: 'scroll' }}
                    //             visible={isModalVisible}
                    //             onOk={handleOk}
                    //             onCancel={handleCancel}
                    //             closable={false}
                    //             footer={[
                    //                 <Button danger type='primary' onClick={handleCancel}>
                    //                     ????ng
                    //                 </Button>
                    //             ]}>
                    //             <ChitietTruong
                    //                 isModalAdd={isModalAdd}
                    //                 setIsModalAddVisible={setIsModalAddVisible}
                    //                 setIsFetchTruong={setIsFetchTruong}
                    //                 maDT={maDoiTuong}
                    //             />
                    //         </Modal>
                    //     </>
                    // )
                ]}
            />

            <div className='list-tabs'>
                <Button
                    className={`tab-item ${activeTab('thong-tin') || activeTab('them-moi')}`}
                    onClick={() =>
                        maDoiTuong
                            ? history.push(`/${MenuPaths.doituong}/thong-tin?maDoiTuong=${maDoiTuong}`)
                            : undefined
                    }>
                    Th??ng tin
                </Button>
                <Button
                    className={`tab-item ${activeTab('gop-doi-tuong')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/gop-doi-tuong?maDoiTuong=${maDoiTuong}`)}>
                    Lo???i k???t qu??? g???p
                </Button>
                <Button
                    className={`tab-item ${activeTab('phan-quyen')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/phan-quyen?maDoiTuong=${maDoiTuong}`)}>
                    Ph??n quy???n
                </Button>
                <Button
                    className={`tab-item ${activeTab('nhap-lieu')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/nhap-lieu?maDoiTuong=${maDoiTuong}`)}>
                    Bi???u m???u nh???p li???u
                </Button>
                <Button
                    className={`tab-item ${activeTab('danh-sach')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/danh-sach?maDoiTuong=${maDoiTuong}`)}>
                    Bi???u m???u danh s??ch
                </Button>
                <Button
                    className={`tab-item ${activeTab('tim-kiem')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/tim-kiem?maDoiTuong=${maDoiTuong}`)}>
                    Bi???u m???u t??m ki???m
                </Button>
                <Button
                    className={`tab-item ${activeTab('chi-tiet')}`}
                    disabled={disable}
                    onClick={() => history.push(`/${MenuPaths.doituong}/chi-tiet?maDoiTuong=${maDoiTuong}`)}>
                    Bi???u m???u chi ti???t
                </Button>
            </div>
            {maDoiTuong ? (
                resultDetail ? (
                    renderTabs()
                ) : (
                    <Spin size='large' className='loading-layout' tip='??ang t???i d??? li???u' />
                )
            ) : (
                <ThongtinDoituong
                    resultList={resultList}
                    resultDetail={resultDetail}
                    setDisabled={(disabled): void => setDisable(disabled)}
                    isReload={isReload}
                    setIsReload={(isReload): void => setIsReload(isReload)}
                />
            )}
        </div>
    )
}
