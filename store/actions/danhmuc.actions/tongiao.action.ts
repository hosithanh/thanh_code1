import axios from 'axios'
import { Notification } from 'common/component/notification'
import { TONGIAO_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_TONGIAO } from './../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getTongiao =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${TONGIAO_URL}?currentPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData)
                        ? `&searchData=tenTonGiao=${searchData}%26maTonGiao=${searchData}`
                        : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_TONGIAO,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const addTongiao = (values: any) => (dispatch: any) => {
    return axios
        .post(TONGIAO_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_TONGIAO
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editTongiao = (value?: any) => (dispatch: any) => {
    return axios
        .put(TONGIAO_URL, value, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_TONGIAO })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteTongiao = (id: any) => (dispatch: any) => {
    return axios
        .delete(TONGIAO_URL, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_TONGIAO })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllTongiao = (listId: any) => (dispatch: any) => {
    return axios
        .delete(TONGIAO_URL, {
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
