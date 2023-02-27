import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    // DONVI_CREATE_URL,
    // DONVI_DELETEALL_URL,
    // DONVI_DELETE_URL,
    DYNAMIC_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_DANHSACHTRUONG } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
    maDoiTuong?: string
}

export const getDanhsachtruong =
    ({ page, pageSize, searchData, sortData, isDelete, maDoiTuong }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${DYNAMIC_URL}/listruong?maDoiTuong=${maDoiTuong}&curPage=${
                    (isDelete ? page && page - 1 : page) ?? 1
                }&pageSize=${pageSize ?? 10}${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''}${
                    !isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_DANHSACHTRUONG,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const addDanhsachtruong = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(`${DYNAMIC_URL}/savetruong`, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHTRUONG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editDanhsachtruong = (id?: number, value?: any) => (dispatch: any, getState) => {
    return axios
        .put(`${DYNAMIC_URL}/update/truong/${id}`, value, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHTRUONG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteDanhsachtruong = (id: number) => (dispatch: any, getState) => {
    return axios
        .delete(`${DYNAMIC_URL}/del/truong/${id}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({ type: FETCH_DANHSACHTRUONG, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllDanhsachtruong = (selectedRowKeys: any) => (dispatch: any) => {
    return axios
        .delete(`${DYNAMIC_URL}/dels/truong`, { ...Authorization(), data: selectedRowKeys })
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHTRUONG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const unbinding = (values: any) => (dispatch, getState) => {
    return axios
        .put(`${DYNAMIC_URL}/update/listtruong`, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHTRUONG,
                payload: res.data.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
