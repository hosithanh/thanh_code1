import axios from 'axios'
import { Notification } from 'common/component/notification'
import { isNullOrUndefined } from 'common/utils/empty-util'
import {
    COQUANQUANLY_ADDDANHSACH_URL,
    COQUANQUANLY_DANHSACH_URL,
    COQUANQUANLY_DELETEALL_URL,
    USER_CHANGE_PASSWORD_URL,
    USER_CHANGE_PASSWORD_USER_URL,
    USER_INFO,
    USER_LIST_URL
} from '../../common/constant/api-constant'
import { Authorization } from '../../common/utils/cookie-util'
import { FETCH_DANHSACHCOQUANQUANLY, FETCH_USER } from './index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    idDonVi?: number
    isDelete?: boolean
    idPhongban: number
}

export const getUsers =
    ({ page, pageSize, searchData, idDonVi, isDelete, idPhongban }: Props) =>
        (dispatch: any) => {
            return axios
                .get(
                    `${USER_LIST_URL}?currentPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${!isNullOrUndefined(idDonVi) ? `&idDonVi=${idDonVi}` : ''
                    }${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''} ${!isNullOrUndefined(idPhongban) ? `&phongBanId=${idPhongban}` : ''
                    }`,
                    Authorization()
                )
                .then((res) => {
                    dispatch({
                        type: FETCH_USER,
                        payload: { ...res.data, searchData, pageSize, idDonVi }
                    })

                    return res
                })
                .catch((err) => {
                    Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
                })
        }

export const addUsers = (values: any) => (dispatch: any) => {
    return axios
        .post(USER_LIST_URL, values, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_USER })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const editUser = (values: any) => (dispatch: any) => {
    return axios
        .put(USER_LIST_URL, values, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_USER })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const changePassword = (values: any) => {
    const data = {
        newPassword: values.newPassword,
        repeatPassword: values.repeatPassword
    }
    return axios
        .put(`${USER_CHANGE_PASSWORD_URL}?username=${values.userEdit}`, data, Authorization())
        .then((res) => {
            Notification({ status: res.data.errorCode === 0 ? 'success' : 'error', message: res.data.message })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const changePasswordUser = (values: any) => {
    const data = {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
        repeatPassword: values.repeatPassword
    }
    return axios
        .put(USER_CHANGE_PASSWORD_USER_URL, data, Authorization())
        .then((res) => {
            Notification({ status: res.data.errorCode === 0 ? 'success' : 'error', message: res.data.message })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteUser = (listId: any) => (dispatch: any) => {
    return axios
        .delete(USER_LIST_URL, {
            ...Authorization(),
            data: [listId]
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAllUser = (listId: any) => (dispatch: any) => {
    return axios
        .delete(USER_LIST_URL, {
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
export const activeUser = (name: string, checked: boolean) => (dispatch: any) => {
    return axios
        .put(`${USER_LIST_URL}active/${name}`, checked, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const searchUser = (searchData: string) => (dispatch: any) => {
    return axios
        .get(`${USER_LIST_URL}?searchData=${searchData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const getUserInfo = () => (dispatch: any) => {
    return axios
        .get(USER_INFO, Authorization())
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

interface Qualycoquans {
    pathname?: any
    page?: number
    pageSize?: number
    isDelete?: boolean
}
export const getAllCoQuanQuanLy =
    ({ pathname, page, pageSize, isDelete }: Qualycoquans) =>
        (dispatch: any) => {
            return axios
                .get(
                    `${COQUANQUANLY_DANHSACH_URL}/${pathname}?curPage=${(isDelete ? page && page - 1 : page) ?? 1
                    }&pageSize=${pageSize ?? 10}`,
                    { ...Authorization() }
                )
                .then((res) => {
                    dispatch({
                        type: FETCH_DANHSACHCOQUANQUANLY,
                        payload: res.data
                    })
                    return res
                })
                .catch((err) => {
                    Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
                })
        }
export const onchangepageCoQuanQuanLy = (idUser, page: number, pageSize?: number) => (dispatch: any) => {
    return axios
        .get(`${COQUANQUANLY_DANHSACH_URL}/${idUser}?currentPage=${page}&pageSize=${pageSize}`, { ...Authorization() })
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHCOQUANQUANLY,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addCoQuanQuanLy = (values: any, idUser: any) => (dispatch: any) => {
    return axios
        .post(
            COQUANQUANLY_ADDDANHSACH_URL,
            {
                accountId: idUser,
                listDonVi: values
            },
            Authorization()
        )
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHCOQUANQUANLY,
                payload: res
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteCoQuanQuanLy = (idDonvi: any, idUser: any) => (dispatch: any) => {
    return axios
        .delete(`${COQUANQUANLY_DELETEALL_URL}/${idUser}`, {
            ...Authorization(),
            data: idDonvi
        })
        .then((res) => {
            dispatch({
                type: FETCH_DANHSACHCOQUANQUANLY,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
