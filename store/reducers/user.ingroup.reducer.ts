import { FETCH_USER_IN_GROUP } from 'store/actions'
import { AppAction, UserInGroupState } from '../interface'

const userinGroupState: UserInGroupState = {}

export default function userinGroupReducer(state = userinGroupState, action: AppAction): UserInGroupState {
    const { type, payload } = action

    switch (type) {
        case FETCH_USER_IN_GROUP:
            return {
                ...state,
                result: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pagination?.pageSize
            }
        default:
            break
    }
    return state
}
