import { FETCH_DONVI } from '../actions'
import { AppAction, DonviState } from '../interface'

const donviState: DonviState = {}

export default function donviReducer(state = donviState, action: AppAction): DonviState {
    const { type, payload } = action
    switch (type) {
        case FETCH_DONVI:
            return {
                ...state,
                donviList: payload.data?.items,
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
