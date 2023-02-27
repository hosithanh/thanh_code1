import axios from 'axios'
import { Notification } from 'common/component/notification'
import {
    ADD_TIENDOSOHOA,
    BAOCAOCAPNHATTIENDOSOHOA,
    DELETE_ALL_TIENDOSOHOA,
    EDIT_TIENDOSOHOA
} from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
import { isNullOrUndefined } from 'common/utils/empty-util'
import { FETCH_CAPNHATTIENDOSOHOA } from '..'
interface Props {
    quy?: number
    idDonVi?: number
    nam?: number
    darasoat?: number
    moibosung?: number
    curPage?: number
    pageSize?: number
}

export const getCapNhatTienDoSoHoa =
    ({ idDonVi, nam, quy, darasoat, moibosung, curPage, pageSize }: Props) =>
    (dispatch, getState) => {
        return axios
            .get(
                `${BAOCAOCAPNHATTIENDOSOHOA}?curPage=${curPage ? curPage : '1'}&pageSize=${pageSize ?? 10}${
                    !isNullOrUndefined(idDonVi) ? `&id_DonVi=${idDonVi}` : ''
                }${!isNullOrUndefined(quy) ? `&quy=${quy}` : ''}${!isNullOrUndefined(nam) ? `&nam=${nam}` : ''}${
                    !isNullOrUndefined(darasoat) ? `&darasoat=${darasoat}` : ''
                }${!isNullOrUndefined(moibosung) ? `&moibosung=${moibosung}` : ''}`,
                Authorization(getState().auth.accessToken)
            )
            .then((res) => {
                dispatch({
                    type: FETCH_CAPNHATTIENDOSOHOA,
                    payload: { ...res.data }
                })
                return res
            })
            .catch((err) => {
                Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
            })
    }

export const deleteOneTiendo = (id: number) => (dispatch: any, getState) => {
    return axios
        .delete(DELETE_ALL_TIENDOSOHOA, {
            ...Authorization(),
            data: [id]
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const deleteALLTiendo = (idList: any) => (dispatch: any, getState) => {
    return axios
        .delete(DELETE_ALL_TIENDOSOHOA, {
            ...Authorization(),
            data: idList
        })
        .then((res) => {
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}

export const addCapNhatTienDo = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(ADD_TIENDOSOHOA, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CAPNHATTIENDOSOHOA,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
export const editCapNhatTienDo = (values: any) => (dispatch: any, getState) => {
    return axios
        .post(EDIT_TIENDOSOHOA, values, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({
                type: FETCH_CAPNHATTIENDOSOHOA,
                payload: res.data
            })
            return res
        })
        .catch((err) => {
            Notification({ status: 'error', message: 'Hệ thống không phản hồi, vui lòng truy cập lại sau !' })
        })
}
