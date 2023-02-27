import { FETCH_PHONGBAN } from '../actions'
import { AppAction, phongbanState } from '../interface'

const data: phongbanState = {}

export default function phongbanReducer(state = data, action: AppAction): phongbanState {
    switch (action.type) {
        case FETCH_PHONGBAN:
            return {
                ...state,
                phongbanList: action.payload?.result,
                total: action.payload?.pagination.total,
                pageSize: action.payload?.pagination.pageSize,
                currentPage: action.payload?.pagination.currentPage
            }

        default:
            break
    }
    return state
}
