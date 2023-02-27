import { FETCH_CHUCNANG_GROUP } from '../actions'
import { AppAction, ChucnangGroupState } from '../interface'

const chucnangGroupState: ChucnangGroupState = {}

export default function chucnangGroupReducer(state = chucnangGroupState, action: AppAction): ChucnangGroupState {
    switch (action.type) {
        case FETCH_CHUCNANG_GROUP:
            return {
                ...state,
                chucnangGroupList: action.payload.data,
                totalRecords: action.payload.data.pagination.total,
                currentPage: action.payload.data.pagination.currentPage
            }
        default:
            break
    }
    return state
}
