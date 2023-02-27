import axios from "axios"
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { CAPDONVI_CREATE_URL, CAPDONVI_DELETEALL_URL, CAPDONVI_LIST_URL, CAPDONVI_UPDATE_URL } from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_CAPDONVI } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getCapdonvi =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any,getState) => {
        return axios
            .get(
                `${CAPDONVI_LIST_URL}?page=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ""
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ""}`,
                Authorization(getState().auth.accessToken)
            )
            .then(res => {
                dispatch({
                    type: FETCH_CAPDONVI,
                    payload: {
                        ...res.data,
                        searchData,
                        sortData,
                        pageSize
                    }
                })
                return res
            })
            .catch(err => {
                Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
            })
    }

export const addCapdonvi = (values: any) => (dispatch: any,getState ) => {
    return axios
        .post(CAPDONVI_CREATE_URL, values, Authorization(getState().auth.accessToken))
        .then(res => {
            dispatch({
                type: FETCH_CAPDONVI,
                payload: res.data
            })
            return res
        })
        .catch(err => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
        })
}

export const editCapdonvi = (value?: any) => (dispatch: any,getState) => {
    return axios
        .put(`${CAPDONVI_UPDATE_URL}`, value, Authorization(getState().auth.accessToken))
        .then(res => {
            dispatch({
                type: FETCH_CAPDONVI,
                payload: res.data
            })
            return res
        })
        .catch(err => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
        })
}

export const deleteCapdonvi = (id: any) => (dispatch: any,getState) => {
    return axios
        .delete(`${CAPDONVI_DELETEALL_URL}`, {
            ...Authorization(getState().auth.accessToken),
            data: [id]
        })
        .then(res => {
            dispatch({ type: FETCH_CAPDONVI, payload: res.data })
            return res
        })
        .catch(err => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
        })
}

export const deleteAllCapdonvi = (listId: any) => (dispatch: any,getState) => {
    return axios
        .delete(CAPDONVI_DELETEALL_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then(res => {
            dispatch({
                type: FETCH_CAPDONVI,
                payload: res.data
            })
            return res
        })
        .catch(err => {
            Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
        })
}
interface Props {
    pageDonVi?: number
    pageSizeDonVi?: number
    searchData?: string
}

export const selectDonvi =
    ({ pageDonVi, pageSizeDonVi, searchData }: Props) =>
    (dispatch: any,getState) => {
        return axios
            .get(
                `${CAPDONVI_LIST_URL}?curPage=${pageDonVi ?? 1}&pageSize=${pageSizeDonVi ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ""
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then(res => {
                dispatch({
                    type: FETCH_CAPDONVI,
                    payload: res.data
                })
                return res
            })
            .catch(err => {
                Notification({ status: "error", message: "Hệ thống không phản hồi, vui lòng truy cập lại sau !" })
            })
    }
