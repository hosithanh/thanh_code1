import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    DONVI_CREATE_URL,
    DONVI_DELETEALL_URL,
    DONVI_DELETE_URL,
    DONVI_LIST_URL,
    DONVI_LIST_USER_URL,
    DONVI_UPDATE_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_COQUANQUANLY, FETCH_DONVI } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getDonvi =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${DONVI_LIST_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_DONVI,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const onSortDonvi = (sortData?: string) => (dispatch: any, getState) => {
    return axios
        .get(`${DONVI_LIST_URL}${sortData}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onChangeDonvi = (page: number, pageSize?: number, pathname?: string) => (dispatch: any, getState) => {
    return axios
        .get(
            `${DONVI_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`,
            Authorization(getState().auth.accessToken)
        )
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onSearchDonvi = (searchData?: string) => (dispatch: any, getState) => {
    return axios
        .get(`${DONVI_LIST_URL}?searchData=${searchData}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addDonvi = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(DONVI_CREATE_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editDonvi = (id?: number, value?: any) => (dispatch: any, getState) => {
    return axios
        .put(`${DONVI_UPDATE_URL}/${id}`, value, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteDonvi = (id: number) => (dispatch: any, getState) => {
    return axios
        .delete(`${DONVI_DELETE_URL}/${id}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({ type: FETCH_DONVI, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteAllDonvi = (listId: any) => (dispatch: any, getState) => {
    return axios
        .delete(DONVI_DELETEALL_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
interface Props {
    pageDonVi?: number
    pageSizeDonVi?: number
    searchData?: string
    idUser?: string
}

export const selectDonvi =
    ({ pageDonVi, pageSizeDonVi, searchData }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${DONVI_LIST_URL}?curPage=${pageDonVi ?? 1}&pageSize=${pageSizeDonVi ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_DONVI,
                    payload: res.data
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const selectUserDonvi =
    ({ searchData }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${DONVI_LIST_USER_URL}${!isNullOrUndefined(searchData) ? `?searchData=${searchData}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_DONVI,
                    payload: res.data
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const selectUserDonviMorong =
    // (searchData) =>


        ({ searchData }: Props) =>
        (dispatch: any, getState) => {
            return axios
                .get(
                    `${DONVI_LIST_USER_URL}?donvimorong=0${
                        !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                    }`,
                    Authorization(getState().auth.accessToken)
                )
                .then((res) => {
                    dispatch({
                        type: FETCH_DONVI,
                        payload: res.data
                    })
                    return res
                })
                .catch((err) => {
                    Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
                })
        }
export const selectDoituongDonviMorong = (searchData) => (dispatch: any, getState) => {
    return axios
        .get(
            `${DONVI_LIST_USER_URL}?donvimorong=0${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''}`,
            Authorization(getState().auth.accessToken)
        )
        .then((res) => {
            dispatch({
                type: FETCH_DONVI,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

// coquanquanly
export const getDonviCoquanquanly =
    ({ idUser, searchData, sortData }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${DONVI_LIST_URL}/?accountId=${idUser}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_COQUANQUANLY,
                    payload: { ...res.data, searchData, sortData }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
