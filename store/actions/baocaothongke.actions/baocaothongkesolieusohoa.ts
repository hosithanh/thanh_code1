import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKE_SOLIEUSOHOA } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_BAOCAOTHONGKESOLIEUSOHOA } from '..'
interface Props {
    idDonvi?: number
    from?: Date
    to?: Date
}

export const getBaoCaoThongKeSoLieuSoHoa =
    ({ idDonvi, from, to }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKE_SOLIEUSOHOA}?1=1${!isNullOrUndefined(idDonvi) ? `&donvi=${idDonvi}` : ''}${
                    !isNullOrUndefined(from) ? `&from=${from}` : ''
                }${!isNullOrUndefined(to) ? `&to=${to}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_BAOCAOTHONGKESOLIEUSOHOA,
                    payload: { ...res.data, idDonvi }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
