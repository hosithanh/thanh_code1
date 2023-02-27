import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKE_LOAIKETQUA } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_BAOCAOLOAIKETQUA } from '..'
interface Props {
    page?: number
    pageSize?: number
    isOne?: boolean
    searchData?: string
    tokenIframe?: string
    idDonvi?: number
    tuNgay?: Date
    denNgay?: Date
}
export const getBaoCaoLoaiKetQua =
    ({ page, pageSize, isOne, searchData, idDonvi, tuNgay, denNgay }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKE_LOAIKETQUA}?curPage=${(isOne ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) ? `&searchData=${searchData}` : ''} ${
                    !isNullOrUndefined(idDonvi) ? `&donVi=${idDonvi}` : ''
                }${!isNullOrUndefined(tuNgay) ? `&tuNgay=${tuNgay}` : ''}${
                    !isNullOrUndefined(denNgay) ? `&denNgay=${denNgay}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({ type: FETCH_BAOCAOLOAIKETQUA, payload: { ...res.data, pageSize, searchData, idDonvi } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
