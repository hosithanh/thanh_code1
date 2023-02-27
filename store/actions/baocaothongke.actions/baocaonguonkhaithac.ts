import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKE_NGUONKHAITHAC } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined, isStringEmpty } from 'common/utils/empty-util'
import { FETCH_BAOCAONGUONKHAITHAC } from '..'
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
export const getBaoCaoNguonKhaiThac =
    ({ page, pageSize, isOne, searchData, idDonvi, tuNgay, denNgay }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKE_NGUONKHAITHAC}?curPage=${(isOne ? page && page - 1 : page) ?? 1}&pageSize=${
                    pageSize ?? 10
                }${!isNullOrUndefined(searchData) && !isStringEmpty(searchData) ? `&searchData=${searchData}` : ''} ${
                    !isNullOrUndefined(idDonvi) ? `&donVi=${idDonvi}` : ''
                }${!isNullOrUndefined(tuNgay) ? `&tuNgay=${tuNgay}` : ''}${
                    !isNullOrUndefined(denNgay) ? `&denNgay=${denNgay}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({ type: FETCH_BAOCAONGUONKHAITHAC, payload: { ...res.data, pageSize, searchData, idDonvi } })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
