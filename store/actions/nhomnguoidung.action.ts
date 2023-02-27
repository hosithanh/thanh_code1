import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    ADD_USER_BYGROUP_URL,
    USERINGROUP_DELETEALL_URL,
    USER_GROUP_CREATE_URL,
    USER_GROUP_DELETE_URL,
    USER_GROUP_LIST_URL,
    USER_GROUP_UPDATE_URL,
    USER_GROUP_URL,
    USER_IN_GROUP_LIST_URL
} from 'common/constant/api-constant'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_USER_GROUP, FETCH_USER_IN_GROUP } from '.'
import { Authorization } from '../../common/utils/cookie-util'
interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
    idDonvi?: any
}
export const getUsersGroup =
    ({ page, pageSize, searchData, sortData, isDelete, idDonvi }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${USER_GROUP_LIST_URL}?page=${(isDelete ? page && page - 1 : page) ?? 1}&itemPerPage=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) ? `&nameSearch=${searchData}` : ''}${
                    !isNullOrUndefined(sortData) ? `&isNameSort=${sortData}` : ''
                }${!isNullOrUndefined(idDonvi) ? `&idDonVi=${idDonvi}` : ''}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_USER_GROUP,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const getUsersGroupID = (groupCode: string) => (dispatch: any) => {
    return axios
        .get(`${USER_GROUP_URL}/${groupCode}`, Authorization())
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addUserGroup = (values: any) => (dispatch: any) => {
    return axios
        .post(USER_GROUP_CREATE_URL, values, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteUserGroup = (groupCodes: string) => (dispatch: any) => {
    return axios
        .delete(`${USER_GROUP_DELETE_URL}`, {
            ...Authorization(),
            data: [groupCodes]
        })
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const editUserGroup = (values: any) => (dispatch: any) => {
    return axios
        .put(`${USER_GROUP_UPDATE_URL}`, values, Authorization())
        .then((res) => {
            dispatch({ type: FETCH_USER_GROUP })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const deleteAllUserGroup = (listgroupCodes: any) => (dispatch: any) => {
    return axios
        .delete(USER_GROUP_DELETE_URL, {
            ...Authorization(),
            data: listgroupCodes
        })
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const activeUserGroup = (id: number, checked: boolean) => (dispatch: any) => {
    return axios
        .put(`${USER_GROUP_URL}/active/${id}`, checked, Authorization())
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const changePageGroup = (page: number) => (dispatch: any) => {
    return axios
        .get(`${USER_GROUP_LIST_URL}?curPage=${page}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const onSortNhomnguoidung = (sortData?: string) => (dispatch: any) => {
    return axios
        .get(`${USER_GROUP_LIST_URL}${sortData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onChangeNhomnguoidung = (page: number, pageSize?: number, pathname?: string) => (dispatch: any) => {
    return axios
        .get(`${USER_GROUP_LIST_URL}?page=${page}&itemPerPage=${pageSize}&${pathname}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onSearchNhomnguoidung = (searchData?: string) => (dispatch: any) => {
    return axios
        .get(`${USER_GROUP_LIST_URL}?nameSearch=${searchData}`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
///////////////////// them nguoi dung vao trong nhom
export const onSortInNhomnguoidung = (groupCode, sortData?: string) => (dispatch: any) => {
    return axios
        .get(`${USER_IN_GROUP_LIST_URL}${sortData}`, { ...Authorization(), params: { groupCode } })
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const getUsersAllGroup = (groupCode) => (dispatch: any) => {
    return axios
        .get(USER_IN_GROUP_LIST_URL, { ...Authorization(), params: { groupCode } })
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const getUsersAllNoInGroup = (groupCode) => (dispatch: any) => {
    return axios
        .get(USER_IN_GROUP_LIST_URL, { ...Authorization(), params: { groupCode, notIn: true } })
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const addUserbygroup = (values: any, groupCode: any) => (dispatch: any) => {
    return axios
        .post(
            ADD_USER_BYGROUP_URL,
            {
                systemUsers: values,
                groupCode: groupCode
            },
            Authorization()
        )
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteAlluseringroup = (values: any, groupCode: any) => (dispatch: any) => {
    return axios
        .delete(USERINGROUP_DELETEALL_URL, {
            ...Authorization(),
            data: { systemUsers: values, groupCode }
        })
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteoneuseringroup = (values: any, groupCode: any) => (dispatch: any) => {
    return axios
        .delete(USERINGROUP_DELETEALL_URL, {
            ...Authorization(),
            data: { systemUsers: [{ id: values }], groupCode }
        })
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const onChangepageuseringroup = (page: number, pageSize?: number, groupCode?: string) => (dispatch: any) => {
    return axios
        .get(
            `${USER_IN_GROUP_LIST_URL}?currentPage=${page}&pageSize=${pageSize}&groupCode=${groupCode}`,
            Authorization()
        )
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const onChangedanhsachnguoidungtrongnhom =
    (page: number, pageSize?: number, groupCode?: string, searchData?: any) => (dispatch: any) => {
        return axios
            .get(
                `${USER_IN_GROUP_LIST_URL}?currentPage=${page}${
                    !isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''
                }&groupCode=${groupCode}&notIn=true&pageSize=${pageSize}`,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_USER_IN_GROUP,
                    payload: res.data
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const onSearchUseringroup = (searchData?: string, groupCode?: any) => (dispatch: any) => {
    return axios
        .get(`${USER_IN_GROUP_LIST_URL}?searchData=${searchData}&groupCode=${groupCode}&notIn=false`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const onSearchUsernoingroup = (searchData?: string, groupCode?: any) => (dispatch: any) => {
    return axios
        .get(`${USER_IN_GROUP_LIST_URL}?searchData=${searchData}&groupCode=${groupCode}&notIn=true`, Authorization())
        .then((res) => {
            dispatch({
                type: FETCH_USER_IN_GROUP,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
