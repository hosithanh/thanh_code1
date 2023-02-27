import axios from 'axios'
import { Notification } from 'common/component/notification'
import { NGHENGHIEP_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_NGHENGHIEP } from './../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getNghenghiep =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${NGHENGHIEP_URL}?currentPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData)
                        ? `&searchData=tenNgheNghiep=${searchData}%26maNgheNghiep=${searchData}`
                        : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_NGHENGHIEP,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const addNghenghiep = (values: any) => (dispatch: any) => {
    return axios
        .post(NGHENGHIEP_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NGHENGHIEP
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editNghenghiep = (value?: any) => (dispatch: any) => {
    return axios
        .put(NGHENGHIEP_URL, value, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_NGHENGHIEP })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteNghenghiep = (id: any) => (dispatch: any) => {
    return axios
        .delete(NGHENGHIEP_URL, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_NGHENGHIEP })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllNghenghiep = (listId: any) => (dispatch: any) => {
    return axios
        .delete(NGHENGHIEP_URL, {
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
