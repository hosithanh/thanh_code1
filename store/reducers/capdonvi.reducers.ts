import { FETCH_CAPDONVI } from '../actions'
import { AppAction, CapDonViState } from '../interface'

const capdonviState: CapDonViState = {}

export default function capdonviReducer(state = capdonviState, action: AppAction): CapDonViState {
    const { type, payload } = action
    switch (type) {
        case FETCH_CAPDONVI:
            return {
                ...state,
                capdonviList: payload?.result,
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


