import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOG_OUT } from 'store/actions'
import { ACCESS_TOKEN, DON_VI, USER_INFO, USER_NAME } from '../../common/constant'
import { getCookie } from '../../common/utils/cookie-util'
import { AppAction, LoginState } from '../interface'

const loginState: LoginState = {
    userInfo: getCookie(USER_INFO) ? getCookie(USER_INFO) : null,
    donvi: getCookie(DON_VI) ? getCookie(DON_VI) : null,
    accessToken: getCookie(ACCESS_TOKEN) ? getCookie(ACCESS_TOKEN) : null,
    loading: false,
    userName: getCookie(USER_NAME) ? getCookie(USER_NAME) : null,
}

export default function loginReducer(state = loginState, action: AppAction): LoginState {
    const { type, payload } = action
    switch (type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                userInfo: payload?.userInfo,
                userName: payload?.userName,
                donvi: payload?.donvi,
                accessToken: payload?.jwt,
                loading: false
            }
        case LOGIN_FAIL:
            return {
                ...state,
                userInfo: null,
                donvi: null,
                error: payload
            }
        case LOG_OUT:
            return {
                ...state,
                userInfo: null,
                donvi: null,
                accessToken: null
            }
        default:
            return state
    }
}
