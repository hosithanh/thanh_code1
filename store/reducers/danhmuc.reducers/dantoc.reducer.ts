import { AppAction, DantocState } from 'store/interface'
import { FETCH_DANTOC } from './../../actions/index'

const dantocState: DantocState = {}

export default function dantocReducer(state = dantocState, action: AppAction): DantocState {
    const { type, payload } = action

    switch (type) {
        case FETCH_DANTOC:
            return {
                ...state,
                dantocList: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
