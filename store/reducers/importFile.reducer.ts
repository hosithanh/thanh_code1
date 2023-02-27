import { FETCH_RESULTS_FILE } from '../actions'
import { AppAction, ResultState } from '../interface'

const resultState: ResultState = {}

export default function importFileReducer(state = resultState, action: AppAction): ResultState {
    const { type, payload } = action
    switch (type) {
        case FETCH_RESULTS_FILE:
            return {
                ...state,
                resultList: payload?.data?.items,
                totalRecords: payload?.data?.pagination?.total,
                currentPage: payload?.data?.pagination?.currentPage,
                pageSize: payload?.pageSize ?? 10,
                dataSearch: payload?.dataSearch
            }
        default:
            break
    }
    return state
}
