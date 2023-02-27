import axios from 'axios'
import { Notification } from 'common/component/notification'
import { TRINHDOVANHOA_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_TRINHDOVANHOA } from './../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
}

export const getTrinhdovanhoa =
    ({ page, pageSize, searchData, sortData, isDelete }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${TRINHDOVANHOA_URL}?currentPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${
                    !isNullOrUndefined(searchData)
                        ? `&searchData=tenTrinhDoVanHoa=${searchData}%26maTrinhDoVanHoa=${searchData}`
                        : ''
                }${!isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_TRINHDOVANHOA,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const addTrinhdovanhoa = (values: any) => (dispatch: any) => {
    return axios
        .post(TRINHDOVANHOA_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_TRINHDOVANHOA
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editTrinhdovanhoa = (value?: any) => (dispatch: any) => {
    return axios
        .put(TRINHDOVANHOA_URL, value, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_TRINHDOVANHOA })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteTrinhdovanhoa = (id: any) => (dispatch: any) => {
    return axios
        .delete(TRINHDOVANHOA_URL, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            dispatch({ type: FETCH_TRINHDOVANHOA })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllTrinhdovanhoa = (listId: any) => (dispatch: any) => {
    return axios
        .delete(TRINHDOVANHOA_URL, {
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
