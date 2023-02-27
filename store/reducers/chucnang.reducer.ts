import { FETCH_CHUCNANG } from '../actions'
import { AppAction, ChucnangState } from '../interface'

const chucnangState: ChucnangState = {}

export default function chucnangReducer(state = chucnangState, action: AppAction): ChucnangState {
    switch (action.type) {
        case FETCH_CHUCNANG:
            return {
                ...state,
                chucnangList: action.payload.data?.items,
                totalRecords: action.payload?.data?.pagination?.total,
                currentPage: action.payload?.data?.pagination?.currentPage,
                pageSize: action.payload.data?.pagination?.pageSize
            }
        default:
            break
    }
    return state
}
