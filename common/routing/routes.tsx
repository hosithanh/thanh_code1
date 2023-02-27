import { MenuPaths } from 'common/constant/app-constant'
import BaoCaoChiTietKetQuaSoHoaMau1 from 'pages/baocaothongke/BaoCaoChiTietKetQuaSoHoaMau1'
import BaoCaoThongKeLoaiKetQua from 'pages/baocaothongke/BaoCaoLoaiKetQua'
import BaoCaoThongKeNguonCungCap from 'pages/baocaothongke/BaoCaoNguonCungCap'
import BaoCaoThongKeNguonKhaiThac from 'pages/baocaothongke/BaoCaoNguonKhaiThac'
import BaoCaoSoLieuSoHoa from 'pages/baocaothongke/BaoCaoSoLieuSoHoa'
import BaoCaoThongKeSuDungDichVu from 'pages/baocaothongke/BaoCaoSuDungDichVu'
import BaoCaoTienDoSoHoa from 'pages/baocaothongke/baocaotiendosohoa/BaoCaoTienDoSoHoa'
import ChiTietTienDoSoHoa from 'pages/baocaothongke/baocaotiendosohoa/ChiTietTienDoSoHoa'
import BaoCaoChiTietKetQuaSoHoaMau2 from 'pages/baocaothongke/Binhthuan/BaoCaoChiTietKetQuaSoHoaMau2'
// import BaoCaoKetQuaThucHienSoHoaMau3 from '../../pages/baocaothongke/BaoCaoKetQuaThucHienSoHoaMau3'
import ChiTietCapDonVi from 'pages/capdonvi/ChitietCapdonvi'
import DanhsachCapdonvi from 'pages/capdonvi/DanhSachCapDonVi'
import ChitietChuyennganh from 'pages/chuyennganh/Chitietchuyenganh'
import DanhsachChuyennganh from 'pages/chuyennganh/Danhsachchuyennganh'
import Chitietconfig from 'pages/config/Chitietconfig'
import Danhsachconfig from 'pages/config/Danhsachconfig'
import ChitietDantoc from 'pages/danhmuc/dantoc/ChitietDantoc'
import DanhsachDantoc from 'pages/danhmuc/dantoc/DanhsachDantoc'
import DanhSachLinhVuc from 'pages/danhmuc/linhvuc/DanhSachLinhVuc'
import ChiTietLoaigiayto from 'pages/danhmuc/loaigiayto/ChitietLoaigiayto'
import DanhsachLoaigiayto from 'pages/danhmuc/loaigiayto/DanhsachLoaigiayto'
import ChitietNghenghiep from 'pages/danhmuc/nghenghiep/ChitietNghenghiep'
import DanhsachNghenghiep from 'pages/danhmuc/nghenghiep/DanhsachNghenghiep'
import ChitietTongiao from 'pages/danhmuc/tongiao/ChitietTongiao'
import DanhsachTongiao from 'pages/danhmuc/tongiao/DanhsachTongiao'
import ChitietTrinhdovanhoa from 'pages/danhmuc/trinhdovanhoa/ChitietTrinhdovanhoa'
import DanhsachTrinhdovanhoa from 'pages/danhmuc/trinhdovanhoa/DanhsachTrinhdovanhoa'
import DanhSachFile from 'pages/danhsachfile'
import ThongKeSoHoa from 'pages/dashboard_public/ThongKeSoHoa'
import ChitietDoituong from 'pages/doituong/ChitietDoituong'
import DanhsachDoituong from 'pages/doituong/DanhsachDoituong'
import ChitietTruong from 'pages/doituong/fragment/ChitietTruong'
import DanhsachTruong from 'pages/doituong/fragment/DanhsachTruong'
import Dongbodulieu from 'pages/dongbodulieu/dongbodulieu'
import ChitietDonvi from 'pages/donvi/ChitietDonvi'
import DanhsachDonvi from 'pages/donvi/DanhsachDonvi'
import ChitietDulieu from 'pages/dulieu/ChitietDulieu'
import DanhsachDulieu from 'pages/dulieu/DanhsachDulieu'
import DanhSachExcel from 'pages/excel/DanhSachExcel'
import ImportExcel from 'pages/excel/ImportExcel'
import ChitietKhoTruongDuLieu from 'pages/khotruongdulieu/ChitietKhotruongdulieu'
import DanhSachKhoTruongDuLieu from 'pages/khotruongdulieu/Danhsachkhotruongdulieu'
import ChitietNguoidung from 'pages/nguoidung/ChitietNguoidung'
import DanhsachCoquanquanly from 'pages/nguoidung/DanhsachCoquanquanly'
import DanhsachNguoidung from 'pages/nguoidung/DanhsachNguoidung'
import DanhsachThemCoquanquanly from 'pages/nguoidung/DanhsachThemCoquanquanly'
import DanhSachTheoLinhVuc from 'pages/nguoidung/DanhSachTheoLinhVuc'
import ThongTinNguoiDung from 'pages/nguoidung/ThongTinNguoiDung'
import ChiTietNhomNguoiDung from 'pages/nhomnguoidung/ChiTietNhomNguoiDung'
import DanhSachNguoiDungTrongNhom from 'pages/nhomnguoidung/DanhSachNguoiDungTrongNhom'
import DanhSachNhomNguoiDung from 'pages/nhomnguoidung/DanhSachNhomNguoiDung'
import PhanQuyenNhomNguoiDung from 'pages/nhomnguoidung/PhanQuyenNhomNguoiDung'
import ThemDanhSachNguoiDungTrongNhom from 'pages/nhomnguoidung/ThemDanhSachNguoiDungTrongNhom'
import Chitietphongban from 'pages/phongban/Chitietphongban'
import Danhsachphongban from 'pages/phongban/Danhsachphongban'
import DanhsachQuyen from 'pages/quyen/DanhsachQuyen'
import Trangchu from 'pages/trangchu/Trangchu'
import Trogiup from 'pages/trogiup/Trogiup'

export const routes = [
    { path: '/', component: Trangchu },
    { path: `/${MenuPaths.nguoidung}`, component: DanhsachNguoidung },
    {
        path: `/${MenuPaths.thongtinnguoidung}`,
        component: ThongTinNguoiDung
    },
    { path: `/${MenuPaths.nguoidung}/:id`, component: ChitietNguoidung },
    {
        path: `/${MenuPaths.nhomnguoidung}/${MenuPaths.dsnguoidungtrongnhom}/:id`,
        component: DanhSachNguoiDungTrongNhom
    },
    {
        path: `/${MenuPaths.nhomnguoidung}/${MenuPaths.themdsnguoidungtrongnhom}/:id`,
        component: ThemDanhSachNguoiDungTrongNhom
    },
    { path: `/${MenuPaths.nhomnguoidung}`, component: DanhSachNhomNguoiDung },
    { path: `/${MenuPaths.nhomnguoidung}/:id`, component: ChiTietNhomNguoiDung },
    { path: `/${MenuPaths.doituong}/${MenuPaths.doituongTruong}`, component: DanhsachTruong },
    { path: `/${MenuPaths.doituong}/${MenuPaths.doituongTruong}/:id`, component: ChitietTruong },
    { path: `/${MenuPaths.doituong}`, component: DanhsachDoituong },
    { path: `/${MenuPaths.doituong}/:id`, component: ChitietDoituong },
    { path: `/${MenuPaths.donvi}`, component: DanhsachDonvi },
    { path: `/${MenuPaths.donvi}/:id`, component: ChitietDonvi },
    { path: `/${MenuPaths.khotruongdulieu}`, component: DanhSachKhoTruongDuLieu },
    { path: `/${MenuPaths.khotruongdulieu}/:id`, component: ChitietKhoTruongDuLieu },
    { path: `/${MenuPaths.dulieu}`, component: DanhsachDulieu },
    { path: `/${MenuPaths.dulieu}/:id`, component: ChitietDulieu },
    { path: `/${MenuPaths.importExcel}`, component: DanhSachExcel },
    { path: `/${MenuPaths.importExcel}/:id`, component: ImportExcel },
    { path: `/${MenuPaths.danhsachfile}`, component: DanhSachFile },
    { path: `/${MenuPaths.quyen}`, component: DanhsachQuyen },
    { path: `/${MenuPaths.quanlychuyennganh}`, component: DanhsachChuyennganh },
    { path: `/${MenuPaths.quanlychuyennganh}/:id`, component: ChitietChuyennganh },
    { path: `/${MenuPaths.dantoc}`, component: DanhsachDantoc },
    { path: `/${MenuPaths.dantoc}/:id`, component: ChitietDantoc },
    { path: `/${MenuPaths.tongiao}`, component: DanhsachTongiao },
    { path: `/${MenuPaths.tongiao}/:id`, component: ChitietTongiao },
    { path: `/${MenuPaths.nghenghiep}`, component: DanhsachNghenghiep },
    { path: `/${MenuPaths.nghenghiep}/:id`, component: ChitietNghenghiep },
    { path: `/${MenuPaths.trinhdovanhoa}`, component: DanhsachTrinhdovanhoa },
    { path: `/${MenuPaths.trinhdovanhoa}/:id`, component: ChitietTrinhdovanhoa },
    { path: `/${MenuPaths.capdonvi}`, component: DanhsachCapdonvi },
    { path: `/${MenuPaths.capdonvi}/:id`, component: ChiTietCapDonVi },
    { path: `/${MenuPaths.loaigiayto}`, component: DanhsachLoaigiayto },
    { path: `/${MenuPaths.loaigiayto}/:id`, component: ChiTietLoaigiayto },
    { path: `/${MenuPaths.phongban}`, component: Danhsachphongban },
    { path: `/${MenuPaths.phongban}/:id`, component: Chitietphongban },
    { path: `/${MenuPaths.config}`, component: Danhsachconfig },
    { path: `/${MenuPaths.config}/:id`, component: Chitietconfig },
    { path: `/${MenuPaths.baocaoloaiketqua}`, component: BaoCaoThongKeLoaiKetQua },
    { path: `/${MenuPaths.baocaonguoncungcap}`, component: BaoCaoThongKeNguonCungCap },
    { path: `/${MenuPaths.baocaonguonkhaithac}`, component: BaoCaoThongKeNguonKhaiThac },
    { path: `/${MenuPaths.baocaosudungdichvu}`, component: BaoCaoThongKeSuDungDichVu },
    { path: `/${MenuPaths.trogiup}`, component: Trogiup },
    { path: `/${MenuPaths.dongbodulieu}`, component: Dongbodulieu },
    { path: `/${MenuPaths.baocaochitietketquasohoamau1}`, component: BaoCaoChiTietKetQuaSoHoaMau1 },
    { path: `/${MenuPaths.baocaochitietketquasohoamau2}`, component: BaoCaoChiTietKetQuaSoHoaMau2 },
    { path: `/${MenuPaths.baocaothongkesolieusohoa}`, component: BaoCaoSoLieuSoHoa },
    { path: `/${MenuPaths.baocaotiendosohoa}`, component: BaoCaoTienDoSoHoa },
    { path: `/${MenuPaths.baocaotiendosohoa}/:id`, component: ChiTietTienDoSoHoa },

    // { path: `/${MenuPaths.BaoCaoKetQuaThucHienSoHoaMau3}`, component: BaoCaoKetQuaThucHienSoHoaMau3 },

    {
        path: `/${MenuPaths.nguoidung}/${MenuPaths.danhsachcoquanquanly}/:id`,
        component: DanhsachCoquanquanly
    },
    {
        path: `/${MenuPaths.nguoidung}/${MenuPaths.danhsachthemcoquanquanly}/:id`,
        component: DanhsachThemCoquanquanly
    },
    {
        path: `/${MenuPaths.nguoidung}/${MenuPaths.dsnguoidunglinhvuc}/:id`,
        component: DanhSachTheoLinhVuc
    },
    { path: `/${MenuPaths.danhsachlinhvuc}`, component: DanhSachLinhVuc },
    { path: `/${MenuPaths.nhomnguoidung}/${MenuPaths.phanquyennhomnguoidung}/:id`, component: PhanQuyenNhomNguoiDung },
    { path: `/${MenuPaths.thongkesohoa}`, component: ThongKeSoHoa }
    // { path: `/${MenuPaths.thongkesohoadonvi}/:id`, component: DonViPublic }
]
