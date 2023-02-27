import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DANTOC_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_DANTOC } from './../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getDantoc =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${DANTOC_URL}?currentPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) ? `&searchData=tenDanToc=${searchData}%26maDanToc=${searchData}` : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_DANTOC,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const addDantoc = (values: any) => (dispatch: any) => {
    return axios
        .post(DANTOC_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_DANTOC
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editDantoc = (value?: any) => (dispatch: any) => {
    return axios
        .put(DANTOC_URL, value, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_DANTOC })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteDantoc = (id: any) => (dispatch: any) => {
    return axios
        .delete(DANTOC_URL, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_DANTOC })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllDantoc = (listId: any) => (dispatch: any) => {
    return axios
        .delete(DANTOC_URL, {
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
