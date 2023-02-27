import { FETCH_COQUANQUANLY } from '../actions'
import { AppAction, CoquanquanlyState } from '../interface'

const coquanquanlyState: CoquanquanlyState = {}

export default function coquanquanlyReducer(state = coquanquanlyState, action: AppAction): CoquanquanlyState {
    const { type, payload } = action
    switch (type) {
        case FETCH_COQUANQUANLY:
            return {
                ...state,
                coquanquanlyList: payload?.data,
                // totalRecords: payload.data?.pagination?.total,
                // currentPage: payload.data?.pagination?.currentPage,
                // pageSize: payload.data?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break
    }
    return state
}
