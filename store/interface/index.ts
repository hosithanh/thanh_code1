import { BaoCaoLoaiKetQua } from 'common/interface/Baocaothongke.interfaces/Baocaoloaiketqua'
import { BaoCaoThongKeSoLieuSoHoa } from 'common/interface/Baocaothongke.interfaces/BaoCaoSoLieuSoHoa'
import { Chuyennganh } from 'common/interface/Chuyennganh'
import { Dantoc } from 'common/interface/Danhmuc.interfaces/Dantoc'
import { GopLoaigiayto } from 'common/interface/Danhmuc.interfaces/GopLoaigiayto'
import { Linhvuc } from 'common/interface/Danhmuc.interfaces/Linhvuc'
import { Loaigiayto } from 'common/interface/Danhmuc.interfaces/Loaigiayto'
import { Nghenghiep } from 'common/interface/Danhmuc.interfaces/Nghenghiep'
import { BaocCaoThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Tiendosohoa'
import { Tongiao } from 'common/interface/Danhmuc.interfaces/Tongiao'
import { Trinhdovanhoa } from 'common/interface/Danhmuc.interfaces/Trinhdovanhoa'
import { Danhsachcoquanquanly } from 'common/interface/Danhsachcoquanquanly'
import { File } from 'common/interface/Files'
import { MenuPermission } from 'common/interface/MenuPermission'
import { Action } from 'redux'
import { CapDonVi } from '../../common/interface/CapDonVi'
import { Chucnang } from '../../common/interface/Chucnang'
import { ChucnangGroup } from '../../common/interface/ChucnangGroup'
import { Coquanquanly } from '../../common/interface/Coquanquanly'
import { Doituong } from '../../common/interface/Doituong'
import { Donvi } from '../../common/interface/Donvi'
import { Khotruongdulieu } from '../../common/interface/Khotruongdulieu'
import { Menu } from '../../common/interface/Menu'
import { Nhomchucnang } from '../../common/interface/Nhomchucnang'
import { User } from '../../common/interface/User'
import { UserGroup } from '../../common/interface/UserGroup'
import { UserInGroup } from '../../common/interface/UserInGroup'
import { BaoCaoChiTietKQSoHoaMau1 } from './../../common/interface/Baocaothongke.interfaces/Baocaochitietketquasohoamau1'
import { BaoCaoNguonCungCap } from './../../common/interface/Baocaothongke.interfaces/Baocaonguoncungcap'
import { BaoCaoNguonKhaiThac } from './../../common/interface/Baocaothongke.interfaces/Baocaonguonkhaithac'
import { BaoCaoSuDungDichVu } from './../../common/interface/Baocaothongke.interfaces/Baocaosudungdichvu'
import { Config } from './../../common/interface/Config'
import { TruongDuLieu } from './../../common/interface/TruongDuLieu'
import { CapNhatThongKeTienDoSoHoa } from 'common/interface/Baocaothongke.interfaces/Capnhattiendosohoa'
import { Phongban } from 'common/interface/Phongban'

export interface AppAction extends Action {
    [x: string]: any
    payload?: any
}

export interface PermissionState {
    menuPermission?: MenuPermission[]
}

export interface LoginState {
    donvi?: string
    userInfo?: any
    accessToken?: any
    error?: string
    loading?: boolean
    userName?: string
}

export interface UserState {
    userList?: User[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    idDonVi?: number
}

export interface UserGroupState {
    result?: UserGroup[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface UserInGroupState {
    result?: UserInGroup[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
}

export interface MenuState {
    menuList?: Menu[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
}

export interface ResultState {
    resultList?: Doituong[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    dataSearch?: string
    idDonvi?: number
    resultDetail?: Doituong
}

export interface DulieuState {
    resultList?: Doituong[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    dataSearch?: string
    resultDetail?: Doituong
    idDonvi?: number
}

// tai begin
export interface ChucnangState {
    chucnangList?: Chucnang[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
}
export interface NhomchucnangState {
    nhomchucnangList?: Nhomchucnang[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
}

export interface ChucnangGroupState {
    chucnangGroupList?: ChucnangGroup[]
    currentPage?: number
    totalRecords?: number
}
export interface DonviState {
    donviList?: Donvi[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface ChuyennganhState {
    chuyennganhList?: Chuyennganh[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface ConfigState {
    configList?: Config[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface KhotruongdulieuState {
    khotruongdulieuList?: Khotruongdulieu[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

//tai end

// mungpn
export interface DantocState {
    dantocList?: Dantoc[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface LinhvucState {
    listLinhVuc?: Linhvuc[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface TongiaoState {
    tongiaoList?: Tongiao[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface NghenghiepState {
    nghenghiepList?: Nghenghiep[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface TrinhdovanhoaState {
    trinhdovanhoaList?: Trinhdovanhoa[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface LoaigiaytoState {
    loaigiaytoList?: Loaigiayto[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface GopLoaigiaytoState {
    goploaigiaytoList?: GopLoaigiayto[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}

export interface DanhsachtruongState {
    danhsachtruongList?: TruongDuLieu[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface GetFiles {
    page?: number
    pageSize?: number
    from?: string
    dataSearch?: string
    sortData?: string
    to?: string
}
export interface FileState {
    files?: File[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    dataSearch?: string
    resultDetail?: File
}
export interface CapDonViState {
    capdonviList?: CapDonVi[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    searchData?: string
    error?: any
    sortData?: string
}
export interface BaoCaoLoaiKetQuaState {
    baocaoloaiketquaList?: BaoCaoLoaiKetQua[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    searchData?: string
    idDonvi?: number
}
export interface BaoCaoSuDungDichVuState {
    baocaosudungdichvuList?: BaoCaoSuDungDichVu[]
}
export interface BaoCaoNguonCungCapState {
    baocaonguoncungcapList?: BaoCaoNguonCungCap[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    searchData?: string
    idDonvi?: number
}
export interface BaoCaoNguonKhaiThacState {
    baocaonguonkhaithacList?: BaoCaoNguonKhaiThac[]
    currentPage?: number
    pageSize?: number
    totalRecords?: number
    searchData?: string
    idDonvi?: number
}
export interface BaoCaoChiTietKetQuaSoHoaMau1State {
    baocaochitietketquasohoamau1List?: BaoCaoChiTietKQSoHoaMau1[]
}

export interface BaoCaoThongKeSoLieuSoHoaState {
    baocaothongkesolieusohoaList?: BaoCaoThongKeSoLieuSoHoa[]
}

export interface DanhsachcoquanquanlyState {
    danhsachcoquanquanlyList?: Danhsachcoquanquanly[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface CoquanquanlyState {
    coquanquanlyList?: Coquanquanly[]
    currentPage?: number
    totalRecords?: number
    pageSize?: number
    searchData?: string
    sortData?: string
}
export interface BaocaoiendosohoaState {
    tiendosohoaList?: BaocCaoThongKeTienDoSoHoa[]
    currentPage?: number
    pageSize?: number
    total?: number
}
export interface CapnhattiendosohoaState {
    capnhattiendosohoaList?: CapNhatThongKeTienDoSoHoa[]
    currentPage?: number
    pageSize?: number
    total?: number
}
export interface phongbanState {
    phongbanList?: Phongban[]
    currentPage?: number
    pageSize?: number
    total?: number
}

export interface AppState {
    menu: MenuState
    auth: LoginState
    user: UserState
    userGroup: UserGroupState
    results: ResultState
    chucnang: ChucnangState
    chucnangGroup: ChucnangGroupState
    donvi: DonviState
    chuyennganh: ChuyennganhState
    resultFile: ResultState
    nhomchucnang: NhomchucnangState
    dulieu: DulieuState
    khotruongdulieu: KhotruongdulieuState
    files: FileState
    permission: PermissionState
    userinGroup: UserInGroupState
    dantoc: DantocState
    tongiao: TongiaoState
    nghenghiep: NghenghiepState
    trinhdovanhoa: TrinhdovanhoaState
    capdonvi: CapDonViState
    loaigiayto: LoaigiaytoState
    goploaigiayto: GopLoaigiaytoState
    config: ConfigState
    danhsachtruong: DanhsachtruongState
    baocaoloaiketqua: BaoCaoLoaiKetQuaState
    baocaonguoncungcap: BaoCaoNguonCungCapState
    baocaonguonkhaithac: BaoCaoNguonKhaiThacState
    baocaosudungdichvu: BaoCaoSuDungDichVuState
    baocaochitietketquasohoamau1: BaoCaoChiTietKetQuaSoHoaMau1State
    baocaothongkesolieusohoa: BaoCaoThongKeSoLieuSoHoaState
    danhsachcoquanquanly: DanhsachcoquanquanlyState
    coquanquanly: CoquanquanlyState
    linhvuc: LinhvucState
    baocaotiendosohoa: BaocaoiendosohoaState
    capnhattiendosohoa: CapnhattiendosohoaState
    phongban: phongbanState
}
