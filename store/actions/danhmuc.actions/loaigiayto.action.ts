import axios from 'axios'
import { Notification } from 'common/component/notification'
import { LOAIGIAYTO_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import { FETCH_LOAIGIAYTO } from '../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
    idDonVi?: number
    maLinhVuc?: string
}
// interface PropGopLoaiGiayTos {
//     page?: number
//     pageSize?: number
//     searchData?: string
//     sortData?: string
//     maDoiTuong?: any
// }

export const getLoaiGiayTo =
    ({ page, pageSize, searchData, sortData, isDelete, idDonVi, maLinhVuc }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${LOAIGIAYTO_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) && !isStringEmpty(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}${
                    !isNullOrUndefined(idDonVi) ? `&idDonVi=${idDonVi}` : ''
                }${!isNullOrUndefined(maLinhVuc) ? `&maLinhVuc=${maLinhVuc}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_LOAIGIAYTO,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const addLoaigiayto = (values: any) => (dispatch: any) => {
    return axios
        .post(LOAIGIAYTO_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_LOAIGIAYTO
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editLoaigiayto = (value?: any) => (dispatch: any) => {
    return axios
        .put(LOAIGIAYTO_URL, value, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_LOAIGIAYTO })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteLoaiGiayTo = (id: any) => (dispatch: any) => {
    return axios
        .delete(LOAIGIAYTO_URL, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_LOAIGIAYTO })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllLoaiGiayTo = (listId: any) => (dispatch: any) => {
    return axios
        .delete(LOAIGIAYTO_URL, {
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
