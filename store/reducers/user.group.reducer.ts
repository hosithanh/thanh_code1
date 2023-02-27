import { FETCH_USER_GROUP } from '../actions'
import { AppAction, UserGroupState } from '../interface'

const userGroupState: UserGroupState = {}

export default function userGroupReducer(state = userGroupState, action: AppAction): UserGroupState {
    const { type, payload } = action

    switch (type) {
        case FETCH_USER_GROUP:
            return {
                ...state,
                result: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.current,
                pageSize: payload?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
