import axios from 'axios'
import { PERMISSION_URL } from 'common/constant/api-constant'
import { Authorization } from 'common/utils/cookie-util'
// import { Authorization } from 'common/utils/cookie-util'
import { FECTH_PERMISSION_FAIL, FECTH_PERMISSION_SUCCESS } from '.'

// export const getPermission = () => (dispatch) => {
//     return axios
//         .get(`${PERMISSION_URL}/user`, Authorization)
//         .then((res) => {
//             dispatch({ type: FECTH_PERMISSION_SUCCESS, payload: res.data.result })
//             return res
//         })
//         .catch((err) => {
//             dispatch({ type: FECTH_PERMISSION_FAIL, payload: err })
//             return err
//         })
// }

export const getPermission = () => (dispatch,getState) => {
    return axios
        .get(`${PERMISSION_URL}/user`, Authorization(getState().auth.accessToken))
        .then((res) => {
            dispatch({ type: FECTH_PERMISSION_SUCCESS, payload: res.data.result })
            return res
        })
        .catch((err) => {
            dispatch({ type: FECTH_PERMISSION_FAIL, payload: err })
            return err
        })
}