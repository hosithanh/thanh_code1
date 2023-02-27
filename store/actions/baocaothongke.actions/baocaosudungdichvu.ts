import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKE_SUDUNGDICHVU } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isArrayEmpty, isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_BAOCAOSUDUNGDICHVU } from '..'
interface Props {
    thang?: number
    nam?: number
}
const yearNow = new Date().getUTCFullYear()
export const getBaoCaoSuDungDichVu =
    ({ thang, nam }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKE_SUDUNGDICHVU}${
                    !isArrayEmpty(thang) && !isNullOrUndefined(nam)
                        ? `?thang=${thang}&nam=${nam}`
                        : '' || (isArrayEmpty(thang) && nam)
                        ? `?nam=${nam}`
                        : '' || (isNullOrUndefined(nam) && thang)
                        ? `?thang=${thang}&nam=${yearNow}`
                        : `?nam=${yearNow}`
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({ type: FETCH_BAOCAOSUDUNGDICHVU, payload: { ...res.data } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
