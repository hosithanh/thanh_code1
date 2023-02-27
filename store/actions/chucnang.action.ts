import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    CHUCNANG_CREATE_URL,
    CHUCNANG_DELETEALL_URL,
    CHUCNANG_DELETE_URL,
    CHUCNANG_GROUP_URL,
    CHUCNANG_LIST_URL,
    CHUCNANG_UPDATE_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_CHUCNANG } from './index'

export const getChucnang = () => (dispatch: any,getState) => {
    return axios
        .get(CHUCNANG_LIST_URL,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
export const onSortChucnang = (sortData?: string) => (dispatch: any,getState) => {
    return axios
        .get(`${CHUCNANG_LIST_URL}${sortData}`,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
export const onChangeChucnang = (page: number, pageSize?: number, pathname?: string) => (dispatch: any,getState) => {
    return axios
        .get(`${CHUCNANG_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const onSearchChucnang = (searchData?: string) => (dispatch: any,getState) => {
    return axios
        .get(`${CHUCNANG_LIST_URL}?searchData=${searchData}`,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const getChucnangGroup = () => (dispatch: any,getState) => {
    return axios
        .get(CHUCNANG_GROUP_URL,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const addChucnang = (values: any) => (dispatch: any,getState) => {
    return axios
        .post(CHUCNANG_CREATE_URL, values,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const editChucnang = (id: number, value: any) => (dispatch: any,getState) => {
    const { id, ten, ma, nhomChucNang } = value
    return axios
        .put(`${CHUCNANG_UPDATE_URL}/${id}`, { id, ten, ma, nhomChucNang },  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteChucnang = (id: number) => (dispatch: any,getState) => {
    return axios
        .delete(`${CHUCNANG_DELETE_URL}/${id}`,  Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({ type: FETCH_CHUCNANG, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteAllChucnang = (listId: any) => (dispatch: any,getState) => {
    return axios
        .delete(CHUCNANG_DELETEALL_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_CHUCNANG,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
