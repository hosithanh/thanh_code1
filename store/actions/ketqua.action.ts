import axios from 'axios'
import { Notification } from 'common/component/notification'
import { DYNAMIC_URL } from 'common/constant/api-constant'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_RESULTS_FILE } from '.'
import { Authorization } from '../../common/utils/cookie-util'

interface Props {
    page?: number
    pageSize?: number
    isOne?: boolean
    // isSearch?: boolean
    dataSearch?: string
    idDonvi?: number
    capDonVis?: number
}

export const getResults =
    ({ page, pageSize, dataSearch, isOne, idDonvi, capDonVis }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${DYNAMIC_URL}/doituong/all?curPage=${(isOne ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(dataSearch) ? `&searchData=${dataSearch}` : ''} ${
                    !isNullOrUndefined(idDonvi) ? `&donVi=${idDonvi}` : ''
                }${!isNullOrUndefined(capDonVis) ? `&capDonVis=${capDonVis}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({ type: FETCH_RESULTS_FILE, payload: { ...res.data, pageSize, dataSearch, idDonvi } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const getResultID = (madoituong) => (dispatch: any, getState) => {
    return axios
        .get(`${DYNAMIC_URL}/doituong/${madoituong}`, Authorization(getState().auth.accessToken))
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
