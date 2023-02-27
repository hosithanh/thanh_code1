import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKE_CHITIETKETQUASOHOAMAU1 } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import { FETCH_BAOCAOCHITIETKETQUASOHOAMAU1 } from '..'
interface Props {
    page?: number
    pageSize?: number
    isOne?: boolean
    madoituong?: string
    idDonvi?: number
    from?: any
    to?: any
}

export const getBaoCaoChiTietKetQuaSoHoaMau1 =
    ({ page, pageSize, isOne, madoituong, idDonvi, from, to }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKE_CHITIETKETQUASOHOAMAU1}?1=1${
                    !isNullOrUndefined(madoituong) ? `&madoituong=${madoituong}` : ''
                }${!isNullOrUndefined(idDonvi) ? `&donvi=${idDonvi}` : ''}${
                    !isStringEmpty(from) && !isNullOrUndefined(from) ? `&from=${from}` : ''
                }${!isStringEmpty(to) && !isNullOrUndefined(to) ? `&to=${to}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_BAOCAOCHITIETKETQUASOHOAMAU1,
                    payload: { ...res.data, pageSize, madoituong, idDonvi }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
