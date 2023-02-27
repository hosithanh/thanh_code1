import { combineReducers } from 'redux'
import { LOG_OUT } from '../actions'
import permissionReducer from './app.reducer'
import loginReducer from './auth.reducer'
import baocaochitietketquasohoamau1Reducer from './baocaothongke.reducers/baocaochitietketquasohoamau1'
import baocaoloaiketquaReducer from './baocaothongke.reducers/baocaoloaiketqua'
import baocaonguoncungcapReducer from './baocaothongke.reducers/baocaonguoncungcap'
import baocaonguonkhaithacReducer from './baocaothongke.reducers/baocaonguonkhaithac'
import baocaosudungdichvuReducer from './baocaothongke.reducers/baocaosudungdichvu'
import baocaothongkesolieusohoaReducer from './baocaothongke.reducers/baocaothongkesolieusohoa'
import baocaotiendosohoaReducer from './baocaothongke.reducers/baocasotiendosohoa.reducer'
import capnhattiendosohoaReducer from './baocaothongke.reducers/capnhattiendosohoa'
import capdonviReducer from './capdonvi.reducers'
import chucnangGroupReducer from './chucnang.group.reducer'
import chucnangReducer from './chucnang.reducer'
import chuyennganhReducer from './chuyennganh.reducer'
import configReducer from './config.reducer'
import coquanquanlyReducer from './coquanquanly.reducer'
import dantocReducer from './danhmuc.reducers/dantoc.reducer'
import goploaiGiayToReducer from './danhmuc.reducers/goploaigiayto.reducer'
import linhuvReducer from './danhmuc.reducers/linhvuc.reducer'
import loaigiaytoReducer from './danhmuc.reducers/loaigiayto.reducer'
import nghenghiepReducer from './danhmuc.reducers/nghenghiep.reducer'
import tongiaoReducer from './danhmuc.reducers/tongiao.reducer'
import trinhdovanhoaReducer from './danhmuc.reducers/trinhdovanhoa.reducer'
import danhsachcoquanquanlyReducer from './danhsachcoquanquanly.reducer'
import danhsachtruongReducer from './danhsachtruong.reducer'
import doituongReducer from './doituong.reducer'
import donviReducer from './donvi.reducer'
import dulieuReducer from './dulieu.reducer'
import fileReducer from './file.reducer'
import importFileReducer from './importFile.reducer'
import khotruongdulieuReducer from './khotruongdulieu.reducer'
import menuReducer from './menu.reducer'
import nhomchucnangReducer from './nhomchucnang.reducer'
import phongbanReducer from './phongban.reducer'
import userGroupReducer from './user.group.reducer'
import userinGroupReducer from './user.ingroup.reducer'
import userReducer from './user.reducer'

const appReducer = combineReducers({
    auth: loginReducer,
    user: userReducer,
    userGroup: userGroupReducer,
    results: doituongReducer,
    menu: menuReducer,
    chucnang: chucnangReducer,
    chucnangGroup: chucnangGroupReducer,
    donvi: donviReducer,
    resultFile: importFileReducer,
    dulieu: dulieuReducer,
    nhomchucnang: nhomchucnangReducer,
    khotruongdulieu: khotruongdulieuReducer,
    files: fileReducer,
    permission: permissionReducer,
    userinGroup: userinGroupReducer,
    dantoc: dantocReducer,
    tongiao: tongiaoReducer,
    nghenghiep: nghenghiepReducer,
    trinhdovanhoa: trinhdovanhoaReducer,
    capdonvi: capdonviReducer,
    loaigiayto: loaigiaytoReducer,
    phongban: phongbanReducer,

    config: configReducer,
    danhsachtruong: danhsachtruongReducer,
    baocaoloaiketqua: baocaoloaiketquaReducer,
    baocaonguoncungcap: baocaonguoncungcapReducer,
    baocaonguonkhaithac: baocaonguonkhaithacReducer,
    baocaosudungdichvu: baocaosudungdichvuReducer,
    baocaochitietketquasohoamau1: baocaochitietketquasohoamau1Reducer,
    baocaothongkesolieusohoa: baocaothongkesolieusohoaReducer,
    danhsachcoquanquanly: danhsachcoquanquanlyReducer,
    coquanquanly: coquanquanlyReducer,
    goploaigiayto: goploaiGiayToReducer,
    linhvuc: linhuvReducer,
    chuyennganh: chuyennganhReducer,
    baocaotiendosohoa: baocaotiendosohoaReducer,
    capnhattiendosohoa: capnhattiendosohoaReducer
})

const rootReducer = (state, action) => {
    if (action.type === LOG_OUT) {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}
export default rootReducer
