import { FETCH_NHOMCHUCNANG } from '../actions'
import { AppAction, NhomchucnangState } from '../interface'

const nhomchucnangState: NhomchucnangState = {}

export default function nhomchucnangReducer(state = nhomchucnangState, action: AppAction): NhomchucnangState {
    switch (action.type) {
        case FETCH_NHOMCHUCNANG:
            return {
                ...state,
                nhomchucnangList: action.payload.data?.items,
                totalRecords: action.payload?.data?.pagination?.total,
                currentPage: action.payload?.data?.pagination?.currentPage,
                pageSize: action.payload.data?.pagination?.pageSize
            }
        default:
            break
    }
    return state
}
