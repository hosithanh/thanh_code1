import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    KHOTRUONGDULIEU_CREATE_URL,
    KHOTRUONGDULIEU_DELETEALL_URL,
    KHOTRUONGDULIEU_DELETE_URL,
    KHOTRUONGDULIEU_LIST_URL,
    KHOTRUONGDULIEU_UPDATE_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_KHOTRUONGDULIEU } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}
export const getKhotruongdulieu =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any,getState) => {
        return axios
            .get(
                `${KHOTRUONGDULIEU_LIST_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''}${
                    !isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''
                }`,
                  Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_KHOTRUONGDULIEU,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
            })
    }

export const onSortKhotruongdulieu = (sortData?: any) => (dispatch: any,getState) => {
    return axios
        .get(`${KHOTRUONGDULIEU_LIST_URL}${sortData}`,   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const onChangeKhotruongdulieu = (page: number, pageSize?: number, pathname?: string) => (dispatch: any,getState) => {
    return axios
        .get(`${KHOTRUONGDULIEU_LIST_URL}?curPage=${page}&pageSize=${pageSize}&${pathname}`,   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const onSearchKhotruongdulieu = (searchData?: string) => (dispatch: any,getState) => {
    return axios
        .get(`${KHOTRUONGDULIEU_LIST_URL}?searchData=${searchData}`,   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const addKhotruongdulieu = (values: any) => (dispatch: any,getState) => {
    return axios
        .post(KHOTRUONGDULIEU_CREATE_URL, values,   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const editKhotruongdulieu = (id?: number, value?: any) => (dispatch: any,getState) => {
    const { id, moTa, ma } = value
    return axios
        .put(`${KHOTRUONGDULIEU_UPDATE_URL}/${id}`, { id, moTa, ma },   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteKhotruongdulieu = (id: number) => (dispatch: any,getState) => {
    return axios
        .delete(`${KHOTRUONGDULIEU_DELETE_URL}/${id}`,   Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({ type: FETCH_KHOTRUONGDULIEU, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}

export const deleteAllKhotruongdulieu = (listId: any) => (dispatch: any,getState) => {
    return axios
        .delete(KHOTRUONGDULIEU_DELETEALL_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_KHOTRUONGDULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" });
        })
}
