import api from 'api'
import { ACCESS_TOKEN, DON_VI, USER_INFO, USER_NAME } from 'common/constant'
import { LOGIN_URL } from 'common/constant/api-constant'
import { clearCookie, setCookie } from 'common/utils/cookie-util'
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOG_OUT } from '.'

export const login = (values) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        })
        const { data } = await api.post(LOGIN_URL, values)
        if (data.errorCode === 0) {
            setCookie(ACCESS_TOKEN, data.data.jwt, 12 * 60) // set cookie time expried 12*60 (minutes) 
            setCookie(USER_INFO, data.data.userInfo, 12 * 60)
            setCookie(USER_NAME, data.data.userName, 12 * 60)
            setCookie(DON_VI, data.data.donvi, 12 * 60)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data.data
            })

        }
        return data
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error
        })
    }
}

export const log_out = () => async (dispatch) => {
    dispatch({
        type: LOG_OUT
    })
    clearCookie(ACCESS_TOKEN)
    clearCookie(USER_INFO)
    clearCookie(DON_VI)
    clearCookie(USER_NAME)
}
