import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DYNAMIC_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_RESULTS } from '.'

interface Props {
    page?: number
    pageSize?: number
    isOne?: boolean
    dataSearch?: string
    idDonvi?: number
    capDonVis?: any
    maLinhVuc?: string
}

export const getDoituong =
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
                dispatch({ type: FETCH_RESULTS, payload: { ...res.data, pageSize, dataSearch, idDonvi } })
                return res
            })
            .catch((error) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const deleteDoituong = (id: any) => (dispatch, getState) => {
    return (
        typeof id === 'object'
            ? axios.delete(`${DYNAMIC_URL}/dels/doituong`, { ...Authorization(), data: id })
            : axios.delete(`${DYNAMIC_URL}/del/doituong/${id}`, Authorization(getState().auth.accessToken))
    )
        .then((res) => res)
        .catch((error) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
