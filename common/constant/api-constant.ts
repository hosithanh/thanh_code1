const host = window.location.hostname
let BASE_CUSTOM_URL = process.env.REACT_APP_API_URL
if (!host.includes('localhost')) {
    BASE_CUSTOM_URL = window.location.protocol + '//' + window.location.hostname + '/api'
}
if (!host.includes('192.168.2.224')) {
    BASE_CUSTOM_URL = 'http://192.168.2.224:8081/api'
}

if (host.includes('192.168.17.134')) {
    BASE_CUSTOM_URL = 'http://192.168.17.134:8080/api'
}
export const BASE_URL = BASE_CUSTOM_URL
export const IFRAME_URL_MCDT = process.env.REACT_APP_IFRAME_MCDT_URL

export const LOGIN_URL = BASE_URL + '/auth/login'

export const USER_INFO = BASE_URL + '/auth/info'
export const USER_URL = BASE_URL + '/user'
export const USER_LIST_URL = BASE_URL + '/user/'
export const USER_CREATE_URL = BASE_URL + '/user/add/nguoidung'
export const USER_UPDATE_URL = BASE_URL + '/user/current'
export const USER_DELETE_URL = BASE_URL + '/user/del'
export const USER_DELETE_ALL_URL = BASE_URL + '/user/dels'

export const USER_CHANGE_PASSWORD_URL = BASE_URL + '/auth/adminchangepass'
export const USER_CHANGE_PASSWORD_USER_URL = BASE_URL + '/auth/userchangepass'

export const USER_GROUP_LIST_URL = BASE_URL + '/group'
export const USER_GROUP_URL = BASE_URL + '/group'
export const USER_GROUP_DELETE_URL = BASE_URL + '/group'
export const USER_GROUP_CREATE_URL = BASE_URL + '/group'
export const USER_GROUP_UPDATE_URL = BASE_URL + '/group'
export const USER_IN_GROUP_LIST_URL = BASE_URL + '/user/bygroup'
export const ADD_USER_BYGROUP_URL = BASE_URL + '/group/user'
export const USERINGROUP_DELETEALL_URL = BASE_URL + '/group/user'

export const DYNAMIC_URL = BASE_URL + '/dynamic/admin'
export const DYNAMIC_URL_LIST = BASE_URL + '/dynamic/admin/doituong/all'
export const DYNAMIC_API_URL = BASE_URL + '/dynamic'

export const MENU_URL = BASE_URL + '/menu'
export const MENU_PARENT_URL_SELECT = BASE_URL + '/menu/dsall'
export const MENU_DELETE_URL = BASE_URL + '/menu/xoa'
export const MENU_LIST_URL = BASE_URL + '/menu/danhsach'
export const MENU_CREATE_URL = BASE_URL + '/menu/them-moi'
export const MENU_UPDATE_URL = BASE_URL + '/menu/cap-nhat'
export const MENU_DELETES_URL = BASE_URL + '/menu/xoa-nhieu'
// -----------------------begin taild----------------------

export const CHUCNANG_LIST_URL_SELECT = BASE_URL + '/chucnang/alls' 
export const CHUCNANG_LIST_URL = BASE_URL + '/chucnang/all'
export const CHUCNANG_URL = BASE_URL + '/chucnang'
export const CHUCNANG_GROUP_URL = BASE_URL + '/nhomchucnang/list'
export const CHUCNANG_CREATE_URL = BASE_URL + '/chucnang/add'
export const CHUCNANG_DELETE_URL = BASE_URL + '/chucnang/del'
export const CHUCNANG_DELETEALL_URL = BASE_URL + '/chucnang/dels'
export const CHUCNANG_UPDATE_URL = BASE_URL + '/chucnang/update'

export const NHOMCHUCNANG_LIST_URL = BASE_URL + '/nhomchucnang/all'
export const NHOMCHUCNANG_CREATE_URL = BASE_URL + '/nhomchucnang/add'
export const NHOMCHUCNANG_UPDATE_URL = BASE_URL + '/nhomchucnang/update'
export const NHOMCHUCNANG_URL = BASE_URL + '/nhomchucnang'
export const NHOMCHUCNANG_DELETE_URL = BASE_URL + '/nhomchucnang'
export const NHOMCHUCNANG_DELETEALL_URL = BASE_URL + '/nhomchucnang/del/ids'

export const DONVI_LIST_URL = BASE_URL + '/danhmuc/donvi'
export const DONVI_LIST_USER_URL = BASE_URL + '/user/donvi'
export const DONVI_DELETE_URL = BASE_URL + '/danhmuc/xoa'
export const DONVI_DELETEALL_URL = BASE_URL + '/danhmuc/xoa-nhieu'
export const DONVI_CREATE_URL = BASE_URL + '/danhmuc/them-moi'
export const DONVI_UPDATE_URL = BASE_URL + '/danhmuc/cap-nhat'
export const DONVI_URL = BASE_URL + '/danhmuc'
export const DONVI_LISTALL_URL = BASE_URL + '/danhmuc/donvi/all'
export const CAPDONVIS_LIST_URL = BASE_URL + '/danhmuc/capdonvi'

export const CHUYENNGANH_LIST_URL = BASE_URL + '/dynamic/admin/app-chuyen-nganh'
export const CHUYENNGANH_DELETEALL_URL = BASE_URL + '/dynamic/admin/app-chuyen-nganh'
export const CHUYENNGANH_DELETE_URL = BASE_URL + '/dynamic/admin/app-chuyen-nganh'
export const CHUYENNGANH_ADD_URL = BASE_URL + '/dynamic/admin/app-chuyen-nganh'
export const CHUYENNGANH_EDIT_URL = BASE_URL + '/dynamic/admin/app-chuyen-nganh'

// config
export const CONFIG_LIST_URL = BASE_URL + '/systemconfig'
export const CONFIG_DELETE_URL = BASE_URL + '/systemconfig'
export const CONFIG_CREATE_URL = BASE_URL + '/systemconfig'
export const CONFIG_UPDATE_URL = BASE_URL + '/systemconfig'
export const CONFIG_URL = BASE_URL + '/systemconfig'

export const KHOTRUONGDULIEU_LIST_URL = BASE_URL + '/danhmuc/truongmau/list'
export const KHOTRUONGDULIEU_DELETE_URL = BASE_URL + '/danhmuc/truongmau/delete'
export const KHOTRUONGDULIEU_DELETEALL_URL = BASE_URL + '/danhmuc/truongmau/deletes'
export const KHOTRUONGDULIEU_CREATE_URL = BASE_URL + '/danhmuc/truongmau/add'
export const KHOTRUONGDULIEU_UPDATE_URL = BASE_URL + '/danhmuc/truongmau/update'
export const KHOTRUONGDULIEU_URL = BASE_URL + '/danhmuc/truongmau'

// cap don vi
export const CAPDONVI_LIST_URL = BASE_URL + '/danhmuc/capdonvi'
export const CAPDONVI_CREATE_URL = BASE_URL + '/danhmuc/capdonvi'
export const CAPDONVI_UPDATE_URL = BASE_URL + '/danhmuc/capdonvi'
export const CAPDONVI_DELETEALL_URL = BASE_URL + '/danhmuc/capdonvi'

//--------------------end taild---------------------------

// mungpn
export const LINHVUC_URL = BASE_URL + '/motcua/danhmuclinhvuc'
export const DANTOC_URL = BASE_URL + '/dantoc'
export const TONGIAO_URL = BASE_URL + '/tongiao'
export const LOAIGIAYTO_URL = BASE_URL + '/loaigiayto'
export const NGHENGHIEP_URL = BASE_URL + '/nghenghiep/'
export const TRINHDOVANHOA_URL = BASE_URL + '/trinhdovanhoa'
export const DOWNLOAD_FILE_KQAPI = BASE_URL + '/file/download/infoApi'

export const THONGKE_URL = BASE_URL + '/thongke'
export const LUOTSUDUNG_URL = BASE_URL + '/thongke/luotsudung'
export const LUOTSUDUNG_URL_PUBLIC = BASE_URL + '/public/thongke/luotsudung'
export const BAOCAOTHONGKE_PUBLIC = BASE_URL + '/public/baocaothongke/solieusohoa'
export const BAOCAOTHONGKEDONVI_PUBLIC = BASE_URL + '/public/baocaothongke/chitietsohoadonvi'

export const DOWNLOAD_FILE_EXCEL = BASE_URL + '/file/download/xlsx'
export const DOWNLOAD_FILE_CSV = BASE_URL + '/file/download/csv'
//export const UPLOAD_FILE = BASE_URL + '/file/import'
export const UPLOAD_FILE_SIGN = BASE_URL + '/file/upload'
export const DOWLOAD_FILE = BASE_URL + '/file/download'
export const GETINFO_FILE = BASE_URL + '/file/getinfo'
export const FILES = BASE_URL + '/file/search'
export const DELETE_FILES = BASE_URL + '/file/del/files'
export const FILES_KYSO = BASE_URL + '/file/filekyso'

//permission
export const PERMISSION_URL = BASE_URL + '/permission'
export const DATAPERMISSION_URL = BASE_URL + '/group'
export const UPDATEPERMISSION_URL = BASE_URL + '/group/permission'

export const DOWNLOAD_FILE_EXCEL_BAOCAONGUONCUNGCAP = BASE_URL + '/file/baocaothongke'
export const DOWNLOAD_FILE_EXCEL_BAOCAONGUONKHAITHAC = BASE_URL + '/file/baocaothongke'
export const DOWNLOAD_FILE_EXCEL_BAOCAOSUDUNGDICHVU = BASE_URL + '/file/baocaothongke/tinhhinhsudung'
export const DOWNLOAD_FILE_EXCEL_BAOCAOCHITIETKETQUASOHOAMAU1 =
    BASE_URL + '/file/baocaothongke/baocaochitietketquasohoa'
export const DOWNLOAD_FILE_EXCEL_BAOCAOCHITIETKETQUASOHOAMAU2 =
    BASE_URL + '/file/baocaothongke/baocaochitietketquasohoamau2'
export const DOWNLOAD_FILE_EXCEL_BAOCAOLOAIKETQUA = BASE_URL + '/baocaothongke/export'
export const DOWNLOAD_FILE_EXCEL_BAOCAOSOLIEUSOHOA = BASE_URL + '/baocaothongke/solieusohoa/download'
export const DOWNLOAD_FILE_EXCEL_BAOCAOTIENDOSOHOA = BASE_URL + '/file/baocaothongke/baocaotiendosohoa'

export const BAOCAOTHONGKE_SUDUNGDICHVU = BASE_URL + '/thongke/tinhhinhsudung'
export const BAOCAOTHONGKE_NGUONCUNGCAP = BASE_URL + '/baocao/cungcap'
export const BAOCAOTHONGKE_NGUONKHAITHAC = BASE_URL + '/baocao/khaithac'
export const BAOCAOTHONGKE_CHITIETKETQUASOHOAMAU1 = BASE_URL + '/thongke/baocaochitietketquasohoa'
export const BAOCAOTHONGKE_LOAIKETQUA = BASE_URL + '/baocaothongke'
export const BAOCAOTHONGKE_SOLIEUSOHOA = BASE_URL + '/baocaothongke/solieusohoa'
export const BAOCAOTHONGKETIENDOSOHOA = BASE_URL + '/baocaotiendo/thongKeBaoCaoTienDo'
export const BAOCAOCAPNHATTIENDOSOHOA = BASE_URL + '/baocaotiendo/findAllBaoCaoTienDo'
export const DELETETIENDOSOHOA = BASE_URL + '/baocaotiendo/deleteBaoCaoTienDo'
export const DELETE_ALL_TIENDOSOHOA = BASE_URL + '/baocaotiendo/xoa-nhieu'
export const ADD_TIENDOSOHOA = BASE_URL + '/baocaotiendo/saveBaoCaoTienDo'
export const EDIT_TIENDOSOHOA = BASE_URL + '/baocaotiendo/updateBaoCaoTienDo'
export const GET_IDTIENDOSOHOA = BASE_URL + '/baocaotiendo'

// dongbodulieu
export const DONGBODULIEU_URL = BASE_URL + '/dynamic/admin/sync'
export const DONGBODULIEU_COLUMN_URL = BASE_URL + '/dynamic/admin/sync-column-table'
export const DONGBODULIEU_COLUMN_9318_URL = BASE_URL + '/dynamic/admin/sync-column-table-9318'
export const DONGBODULIEU_ISHOANTHANH_URL = BASE_URL + '/dynamic/admin/sync-ishoanthanh'

// coquanquanly
export const COQUANQUANLY_DANHSACH_URL = BASE_URL + '/user/account'
export const COQUANQUANLY_ADDDANHSACH_URL = BASE_URL + '/user/account'
export const COQUANQUANLY_DELETEALL_URL = BASE_URL + '/user/account'
// permission user loai ket qua
export const USER_PERMISSION_LOAIKETQUA = BASE_URL + '/quyen-nguoidung'
// get lĩnh vực - người dùng
export const LINHVUC_USER = BASE_URL + '/linhvuc-nguoidung'
// phòng ban theo iddonVi
export const PHONGBAN_IDDONVI = BASE_URL + '/danhmuc/phongban'
// public api
export const PUBLIC_FILE_GETINFO = BASE_URL + '/public/file/getinfo'
export const PUBLIC_FILE_VERIFY_SIGNATURE = BASE_URL + '/public/file/verifyPDFSignature'
//gop loai ket qua
export const GOP_LOAIKETQUA_LIST_URL = BASE_URL + '/dynamic/admin/goploaiketqua'
export const GOP_LOAIKETQUA_DELETE_URL = BASE_URL + '/dynamic/admin/goploaiketqua'
export const GOP_LOAIKETQUA_ADD_URL = BASE_URL + '/dynamic/admin/goploaiketqua'
// thống kê số hóa
export const THONG_KE_SO_HOA = BASE_URL + '/public/baocaothongke/tongsolieusohoa'
/// Phân quyền nhóm người dùng theo lĩnh vực
export const NHOMNGUOIDUNG_LINHVUC_URL = BASE_URL + '/quyenlinhvuc-nhomnguoidung'
export const NHOMNGUOIDUNG_LINHVUC_ADD_URL = BASE_URL + '/quyenlinhvuc-nhomnguoidung'
export const NHOMNGUOIDUNG_LINHVUC_UPDATE_URL = BASE_URL + '/quyenlinhvuc-nhomnguoidung'
export const NHOMNGUOIDUNG_LINHVUC_DELETE_URL = BASE_URL + '/quyenlinhvuc-nhomnguoidung'
//phongban
export const PHONGBAN_URL = BASE_URL + '/danhmuc/phongban'
export const PHONGBAN_DELETE_URL = BASE_URL + '/danhmuc/phongban'
export const PHONGBAN_DELETEONE_URL = BASE_URL + '/danhmuc/phongban'
export const PHONGBAN_ADD_URL = BASE_URL + '/danhmuc/phongban'
export const PHONGBAN_EDIT_URL = BASE_URL + '/danhmuc/phongban'
export const PHONGBAN_ID_URL = BASE_URL + '/danhmuc/phongban'
// bao tri
export const BAO_TRI_HE_THONG_URL = BASE_URL + '/public/baotrihethong'
