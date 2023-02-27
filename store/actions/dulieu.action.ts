import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DYNAMIC_API_URL, DYNAMIC_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_DULIEU } from '.'

interface Props {
    page?: number
    pageSize?: number
    isOne?: boolean
    dataSearch?: string
    tokenIframe?: string
    idDonvi?: number
    capDonVis?: number
    maLinhVuc?: any
}

export const getDulieu =
    ({ page, pageSize, isOne, dataSearch, idDonvi, capDonVis, maLinhVuc }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${DYNAMIC_URL}/doituong/all?curPage=${(isOne ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(dataSearch) ? `&searchData=${dataSearch}` : ''}${
                    !isNullOrUndefined(idDonvi) ? `&donVi=${idDonvi}` : ''
                }${!isNullOrUndefined(capDonVis) ? `&capDonVis=${capDonVis}` : ''}${
                    !isNullOrUndefined(maLinhVuc) ? `&maLinhVuc=${maLinhVuc}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({ type: FETCH_DULIEU, payload: { ...res.data, pageSize, dataSearch, idDonvi } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const getDulieuToken =
    ({ page, pageSize, isOne, dataSearch, tokenIframe }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${DYNAMIC_URL}/doituong/all?curPage=${(isOne ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(dataSearch) ? `&searchData=${dataSearch}` : ''}`,
                Authorization(tokenIframe)
            )
            .then((res) => {
                dispatch({ type: FETCH_DULIEU, payload: { ...res.data, pageSize, dataSearch } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
export const deleteMultiData = (listId: any) => (dispatch: any, getState) => {
    return axios
        .post(`${DYNAMIC_API_URL}/delete`, listId, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_DULIEU,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
