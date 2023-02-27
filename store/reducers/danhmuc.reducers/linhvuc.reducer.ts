import { AppAction, LinhvucState } from 'store/interface'
import { FETCH_LINHVUC } from './../../actions/index'

const linhvucState: LinhvucState = {}

export default function linhuvReducer(state = linhvucState, action: AppAction): LinhvucState {
    const { type, payload } = action
    switch (type) {
        case FETCH_LINHVUC:
            return {
                ...state,
                listLinhVuc: payload?.data.result,
                totalRecords: payload?.data.pagination?.total,
                currentPage: payload?.data.pagination.currentPage,
                pageSize: payload?.data.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
