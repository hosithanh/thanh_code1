import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    GOP_LOAIKETQUA_ADD_URL,
    GOP_LOAIKETQUA_DELETE_URL,
    GOP_LOAIKETQUA_LIST_URL
} from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import { FETCH_GOPLOAIGIAYTO } from '../index'

interface PropGopLoaiGiayTos {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    maDoiTuong?: any
    tenTTHC?: string
    tenGiayTo?: string
}

export const getDanhsachGopLoaiGiayTo =
    ({ page, pageSize, searchData, sortData, maDoiTuong }: PropGopLoaiGiayTos) =>
    (dispatch: any) => {
        return axios
            .get(
                `${GOP_LOAIKETQUA_LIST_URL}?curPage=${page ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) && !isStringEmpty(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}${
                    !isNullOrUndefined(maDoiTuong) ? `&maDoiTuong=${maDoiTuong}` : ''
                }`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_GOPLOAIGIAYTO,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const addGopLoaigiayto = (maDoiTuong, data: any) => (dispatch: any) => {
    return axios
        .post(`${GOP_LOAIKETQUA_ADD_URL}/${maDoiTuong}`, data, Authorization())
        .then((res) => {
            dispatch(getDanhsachGopLoaiGiayTo({ maDoiTuong }))
            dispatch({
                type: FETCH_GOPLOAIGIAYTO
            })

            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

// export const deleteLoaiGiayTo = (id: any) => (dispatch: any) => {
//     return axios
//         .delete(LOAIGIAYTO_URL, {
//             ...Authorization(),
//             data: [id]
//         })
//         .then((res) => {
//             dispatch({ type: FETCH_LOAIGIAYTO })
//             return res
//         })
//         .catch((err) => {
//             Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
//         })
// }
// export const deleteAllLoaiGiayTo = (listId: any) => (dispatch: any) => {
//     return axios
//         .delete(LOAIGIAYTO_URL, {
//             ...Authorization(),
//             data: listId
//         })
//         .then((res) => {
//             return res
//         })
//         .catch((err) => {
//             Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
//         })
// }

export const deleteGopLoaiGiayTo = (maDoiTuong: any, listId: any) => (dispatch: any) => {
    return axios
        .delete(`${GOP_LOAIKETQUA_DELETE_URL}/${maDoiTuong}`, {
            ...Authorization(),
            data: listId
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
