import { FETCH_DULIEU } from '../actions'
import { AppAction, DulieuState } from '../interface'

const resultState: DulieuState = {}

export default function dulieuReducer(state = resultState, action: AppAction): DulieuState {
    switch (action.type) {
        case FETCH_DULIEU:
            return {
                ...state,
                resultList: action.payload?.data?.items,
                totalRecords: action.payload?.data?.pagination?.total,
                currentPage: action.payload?.data?.pagination?.currentPage,
                pageSize: action.payload?.pageSize ?? 10,
                dataSearch: action.payload?.dataSearch,
                idDonvi: action.payload?.idDonvi
            }

        default:
            break
    }
    return state
}
