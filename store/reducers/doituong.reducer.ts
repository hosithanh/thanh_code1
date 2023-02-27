import { FETCH_RESULTS } from '../actions'
import { AppAction, ResultState } from '../interface'

const resultState: ResultState = {}

export default function doituongReducer(state = resultState, action: AppAction): ResultState {
    switch (action.type) {
        case FETCH_RESULTS:
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
