import { FETCH_TONGIAO } from './../../actions/index';
import { AppAction, TongiaoState } from 'store/interface'

const tongiaoState: TongiaoState ={}

export default function tongiaoReducer(state = tongiaoState, action: AppAction): TongiaoState {
    const { type, payload } = action

    switch (type) {
        case FETCH_TONGIAO:
            return {
                ...state,
                tongiaoList: payload?.result,
                totalRecords: payload?.pagination?.total,
                currentPage: payload?.pagination?.currentPage,
                pageSize: payload?.pagination?.pageSize,
                searchData: payload?.searchData,
                sortData: payload?.sortData
            }
        default:
            break;
    }
    return state
}