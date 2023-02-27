import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    CHUCNANG_LIST_URL_SELECT,
    MENU_CREATE_URL,
    MENU_DELETES_URL,
    MENU_DELETE_URL,
    MENU_LIST_URL,
    MENU_PARENT_URL_SELECT,
    MENU_UPDATE_URL,
    MENU_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_MENU } from './index'

export const getMenuById = (id: string) => (dispatch: any) => {
    return axios
        .get(`${MENU_URL}/${id}`, Authorization())
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const getListMenu = () => (dispatch: any) => {
    return axios
        .get(MENU_LIST_URL, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onMenuPageChange = (page: number, pageSize?: number, pathname?: string) => (dispatch: any) => {
    return axios
        .get(`${MENU_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onSearchMenu = (searchData?: string) => (dispatch: any) => {
    return axios
        .get(`${MENU_LIST_URL}?searchData=${searchData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onSortMenu = (sortData?: string) => (dispatch: any) => {
    return axios
        .get(`${MENU_LIST_URL}${sortData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const getListChucNang = () => (dispatch: any) => {
    return axios
        .get(CHUCNANG_LIST_URL_SELECT, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const getListParentMenu = () => (dispatch: any) => {
    return axios
        .get(MENU_PARENT_URL_SELECT, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_MENU, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addMenu = (values: any) => (dispatch: any) => {
    return axios
        .post(MENU_CREATE_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editMenu = (id: number, value: any) => (dispatch: any) => {
    const { id, ten, thuTu, icon, url, script, menuParent, chucnang } = value
    return axios
        .put(`${MENU_UPDATE_URL}/${id}`, { id, ten, thuTu, icon, url, script, menuParent, chucnang }, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteMenu = (id: number) => (dispatch: any) => {
    return axios
        .delete(`${MENU_DELETE_URL}/${id}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deletesMenu = (listId: any) => (dispatch: any) => {
    return axios
        .delete(MENU_DELETES_URL, { ...Authorization(), data: listId })
        .then((res) => {
            dispatch({
                type: FETCH_MENU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
