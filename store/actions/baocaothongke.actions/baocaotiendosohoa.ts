import axios from 'axios'
import { Notification } from 'common/component/notification'
import { BAOCAOTHONGKETIENDOSOHOA } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_BAOCAOTIENDOSOHOA } from '..'
interface Props {
    quy?: number
    idDonVi?: number
    nam?: number
    ngayKetThuc?: any
}

export const getBaoCaoTienDoSoHoa =
    ({ idDonVi, nam, quy, ngayKetThuc }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOTHONGKETIENDOSOHOA}?1=1${!isNullOrUndefined(idDonVi) ? `&id_DonVi=${idDonVi}` : ''}${
                    !isNullOrUndefined(quy) ? `&quy=${quy}` : ''
                }${!isNullOrUndefined(ngayKetThuc) ? `&denNgay=${ngayKetThuc}` : ''}${
                    !isNullOrUndefined(nam) ? `&nam=${nam}` : ''
                }`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_BAOCAOTIENDOSOHOA,
                    payload: { ...res.data }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }
