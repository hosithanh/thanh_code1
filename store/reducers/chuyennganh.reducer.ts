import { FETCH_CHUYENNGANH } from '../actions'
import { AppAction, ChuyennganhState } from '../interface'

const chuyennganhState: ChuyennganhState = {}

export default function chuyennganhReducer(state = chuyennganhState, action: AppAction): ChuyennganhState {
    const { type, payload } = action
    switch (type) {
        case FETCH_CHUYENNGANH:
            return {
                ...state,
                chuyennganhList: payload.data?.result,
                totalRecords: payload.data?.pagination?.total,
                currentPage: payload.data?.pagination?.currentPage,
                pageSize: payload.data?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
