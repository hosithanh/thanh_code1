import { FETCH_USER } from '../actions'
import { AppAction, UserState } from '../interface'

const userState: UserState = {}

export default function userReducer(state = userState, action: AppAction): UserState {
    const { type, payload } = action
    switch (type) {
        case FETCH_USER:
            return {
                ...state,
                userList: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pagination?.pageSize,
                searchData: payload?.searchData,
                idDonVi: payload?.idDonVi
            }
        default:
            break
    }
    return state
}
