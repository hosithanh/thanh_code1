import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    PHONGBAN_ADD_URL,
    PHONGBAN_DELETEONE_URL,
    PHONGBAN_DELETE_URL,
    PHONGBAN_EDIT_URL,
    PHONGBAN_URL
} from 'common/constant/api-constant'

import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_PHONGBAN } from '.'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    idDonvi?: number
}

export const getPhongban =
    ({ page, pageSize, searchData, sortData, idDonvi }: Props) =>
    (dispatch: any, getState) => {
        return axios
            .get(
                `${PHONGBAN_URL}${!isNullOrUndefined(idDonvi) ? `/${idDonvi}` : ''}?page=${page ? page : 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''}${
                    !isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_PHONGBAN,
                    payload: { ...res.data }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const deleteAllPhongbann = (listId: any) => (dispatch: any, getState) => {
    return axios
        .delete(PHONGBAN_DELETE_URL, {
            ...Authorization(getState().auth.accessToken),
            data: listId
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deletePhongban = (id: number) => (dispatch: any, getState) => {
    return axios
        .delete(PHONGBAN_DELETEONE_URL, {
            ...Authorization(getState().auth.accessToken),
            data: [id]
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addPhongban = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(PHONGBAN_ADD_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const editPhongban = (values: any) => (dispatch: any, getState) => {
    return axios
        .put(PHONGBAN_EDIT_URL, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
