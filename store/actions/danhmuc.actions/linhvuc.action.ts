import axios from 'axios'
import { Notification } from 'common/component/notification'
import { LINHVUC_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import { FETCH_LINHVUC } from './../index'

interface Props {
    page?: number
    pageSize?: number
    searchData?: string
    sortData?: string
    isDelete?: boolean
    idDonvi?: number
}

export const getLinhvuc =
    ({ page, pageSize, searchData, sortData, isDelete, idDonvi }: Props) =>
    (dispatch: any) => {
        return axios
            .get(
                `${LINHVUC_URL}?curPage=${(isDelete ? page && page - 1 : page) ?? 1}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(searchData) && !isStringEmpty(searchData) ? `&searchData=${searchData}` : ''
                }${!isNullOrUndefined(idDonvi) ? `&idDonVi=${idDonvi}` : ''}${
                    !isNullOrUndefined(sortData) ? `&sortData=${sortData}` : ''
                }  `,
                Authorization()
            )
            .then((res) => {
                dispatch({
                    type: FETCH_LINHVUC,
                    payload: { ...res.data, searchData, sortData, pageSize }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
