import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    CHUYENNGANH_ADD_URL,
    CHUYENNGANH_DELETEALL_URL,
    CHUYENNGANH_DELETE_URL,
    CHUYENNGANH_LIST_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_CHUYENNGANH } from './index'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getChuyennganh =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${CHUYENNGANH_LIST_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''}${
                    !isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_CHUYENNGANH,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const deleteChuyennganh = (id: number) => (dispatch: any, getState) => {
    return axios
        .delete(`${CHUYENNGANH_DELETE_URL}`, {
            ...Authorization(getState().auth.accessToken),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_CHUYENNGANH, payload: res.data })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteAllChuyennganh = (listId: any) => (dispatch: any, getState) => {
    return axios
        .delete(CHUYENNGANH_DELETEALL_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            dispatch({
                type: FETCH_CHUYENNGANH,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addChuyennganh = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(CHUYENNGANH_ADD_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUYENNGANH,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const editChuyennganh = (values: any) => (dispatch: any, getState) => {
    return axios
        .put(CHUYENNGANH_ADD_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CHUYENNGANH,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
