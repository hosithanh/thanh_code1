import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    NHOMCHUCNANG_CREATE_URL,
    NHOMCHUCNANG_DELETEALL_URL,
    NHOMCHUCNANG_DELETE_URL,
    NHOMCHUCNANG_LIST_URL,
    NHOMCHUCNANG_UPDATE_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_NHOMCHUCNANG } from './index'

export const getNhomchucnang = () => (dispatch: any) => {
    return axios
        .get(NHOMCHUCNANG_LIST_URL, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
export const addNhomchucnang = (values: any) => (dispatch: any) => {
    return axios
        .post(NHOMCHUCNANG_CREATE_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
export const onSortNhomchucnang = (sortData?: string) => (dispatch: any) => {
    return axios
        .get(`${NHOMCHUCNANG_LIST_URL}${sortData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
export const onChangeNhomchucnang = (page: number, pageSize?: number, pathname?: string) => (dispatch: any) => {
    return axios
        .get(`${NHOMCHUCNANG_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const onSearchNhomchucnang = (searchData?: string) => (dispatch: any) => {
    return axios
        .get(`${NHOMCHUCNANG_LIST_URL}?searchData=${searchData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const editNhomchucnang = (id: number, value: any) => (dispatch: any) => {
    const { id, ten, ma } = value
    return axios
        .put(`${NHOMCHUCNANG_UPDATE_URL}/${id}`, { id, ten, ma }, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteNhomchucnang = (id: number) => (dispatch: any) => {
    return axios
        .delete(`${NHOMCHUCNANG_DELETE_URL}/${id}`, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_NHOMCHUCNANG, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteAllNhomchucnang = (listId: any) => (dispatch: any) => {
    return axios
        .delete(NHOMCHUCNANG_DELETEALL_URL, {
            ...Authorization(),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_NHOMCHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
