import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    CONFIG_CREATE_URL,
    CONFIG_DELETE_URL,
    CONFIG_LIST_URL,
    CONFIG_UPDATE_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_CONFIG } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getConfig =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${CONFIG_LIST_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_CONFIG,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const onSortConfig = (sortData?: string) => (dispatch: any, getState) => {
    return axios
        .get(`${CONFIG_LIST_URL}${sortData}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onChangeConfig = (page: number, pageSize?: number, pathname?: string) => (dispatch: any, getState) => {
    return axios
        .get(
            `${CONFIG_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`,
            Authorization(getState().auth.accessToken)
        )
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onSearchConfig = (searchData?: string) => (dispatch: any, getState) => {
    return axios
        .get(`${CONFIG_LIST_URL}?searchData=${searchData}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addConfig = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(CONFIG_CREATE_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editConfig = (value?: any) => (dispatch: any, getState) => {
    return axios
        .put(`${CONFIG_UPDATE_URL}`, value, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteConfig = (id: any) => (dispatch: any, getState) => {
    return axios
        .delete(`${CONFIG_DELETE_URL}`, {
            ...Authorization(getState().auth.accessToken),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_CONFIG, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteAllConfig = (listId: any) => (dispatch: any, getState) => {
    return axios
        .delete(CONFIG_DELETE_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_CONFIG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
